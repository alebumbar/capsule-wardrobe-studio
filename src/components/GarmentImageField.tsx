import { useState } from "react";
import { removeImageBackground } from "../services/removeImageBackground";
import { FormField } from "./FormField";

const MAX_IMAGE_SIZE_BYTES = 750_000;

type GarmentImageFieldProps = {
    value: string;
    onChange: (imageUrl: string) => void;
};

function readBlobAsDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
                return;
            }

            reject(new Error("The image has an invalid format."));
        };

        reader.onerror = () => {
            reject(new Error("The image could not be read."));
        };

        reader.readAsDataURL(blob);
    });
}

export function GarmentImageField({
    value,
    onChange,
}: GarmentImageFieldProps) {
    const [selectedImageFile, setSelectedImageFile] =
        useState<File | null>(null);
    const [imageError, setImageError] = useState("");
    const [backgroundRemovalError, setBackgroundRemovalError] =
        useState("");
    const [isRemovingBackground, setIsRemovingBackground] =
        useState(false);
    const [
        backgroundRemovalProgress,
        setBackgroundRemovalProgress,
    ] = useState(0);

    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        setImageError("");
        setBackgroundRemovalError("");

        if (!file) {
            return;
        }

        const supportedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!supportedTypes.includes(file.type)) {
            setImageError("Choose a JPEG, PNG, or WebP image.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            setImageError("Choose an image smaller than 750 KB.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                onChange(reader.result);
                setSelectedImageFile(file);
            }
        };

        reader.onerror = () => {
            setImageError(
                "The image could not be read. Try another file.",
            );
        };

        reader.readAsDataURL(file);
    }

    async function handleRemoveBackground() {
        if (!selectedImageFile) {
            return;
        }

        setIsRemovingBackground(true);
        setBackgroundRemovalProgress(0);
        setBackgroundRemovalError("");

        try {
            const processedImage = await removeImageBackground(
                selectedImageFile,
                setBackgroundRemovalProgress,
            );

            onChange(await readBlobAsDataUrl(processedImage));
        } catch {
            setBackgroundRemovalError(
                "We could not remove the background. Please try again.",
            );
        } finally {
            setIsRemovingBackground(false);
            setBackgroundRemovalProgress(0);
        }
    }

    function handleRemovePhoto() {
        onChange("");
        setSelectedImageFile(null);
        setImageError("");
        setBackgroundRemovalError("");
    }

    return (
        <FormField
            id="garment-image"
            label="Garment photo"
            hint="JPEG, PNG, or WebP. Maximum 750 KB."
        >
            {value && (
                <div className="image-preview">
                    <img
                        src={value}
                        alt="Selected garment preview"
                    />

                    {selectedImageFile && (
                        <button
                            className="garment-card__action"
                            type="button"
                            disabled={isRemovingBackground}
                            onClick={handleRemoveBackground}
                        >
                            {isRemovingBackground
                                ? backgroundRemovalProgress > 0
                                    ? `Preparing model… ${backgroundRemovalProgress}%`
                                    : "Starting background removal…"
                                : "Remove background"}
                        </button>
                    )}

                    <button
                        className="garment-card__action"
                        type="button"
                        onClick={handleRemovePhoto}
                    >
                        Remove photo
                    </button>
                </div>
            )}

            <input
                id="garment-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                aria-describedby={
                    imageError
                        ? "garment-image-hint garment-image-error"
                        : "garment-image-hint"
                }
            />

            {imageError && (
                <p
                    id="garment-image-error"
                    className="form-field__error"
                    role="alert"
                >
                    {imageError}
                </p>
            )}

            {backgroundRemovalError && (
                <p className="form-field__error" role="alert">
                    {backgroundRemovalError}
                </p>
            )}
        </FormField>
    );
}