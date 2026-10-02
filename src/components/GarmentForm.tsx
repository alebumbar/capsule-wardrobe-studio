import { useState } from "react";
import {
    garmentCategories,
    garmentSeasons,
    type GarmentCategory,
    type GarmentSeason,
    type Garment
} from "../types/garment";
import { FormField } from "./FormField";

const MAX_IMAGE_SIZE_BYTES = 750_000;

type GarmentFormProps = {
    initialGarment?: Garment;
    onCancel: () => void;
    onSubmit: (garment: Garment) => void;
};

export function GarmentForm({
    initialGarment,
    onCancel,
    onSubmit,
}: GarmentFormProps) {

    const [name, setName] = useState(
        initialGarment?.name ?? "",
    );

    const [category, setCategory] = useState<GarmentCategory | "">(
        initialGarment?.category ?? "",
    );
    const [primaryColour, setPrimaryColour] = useState(
        initialGarment?.primaryColour ?? "",
    );
    const [season, setSeason] = useState<GarmentSeason | "">(
        initialGarment?.season ?? "",
    );
    const [imageUrl, setImageUrl] = useState(initialGarment?.imageUrl ?? "");
    const [imageError, setImageError] = useState("");

    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        setImageError("");

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
                setImageUrl(reader.result);
            }
        };

        reader.onerror = () => {
            setImageError(
                "The image could not be read. Try another file.",
            );
        };

        reader.readAsDataURL(file);

    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedColour = primaryColour.trim();

        if (!trimmedName || !trimmedColour || !category || !season) {
            return;
        }
        const garment: Garment = {
            id: initialGarment?.id ?? crypto.randomUUID(),
            name: trimmedName,
            category,
            primaryColour: trimmedColour,
            season,
            imageUrl: imageUrl || undefined,
            createdAt: initialGarment?.createdAt ?? new Date().toISOString(),
        };
        onSubmit(garment);

    }

    return (
        <form className="garment-form" onSubmit={handleSubmit}>
            <div>
                <FormField
                    id="garment-image"
                    label="Garment photo"
                    hint="JPEG, PNG, or WebP. Maximum 750 KB."
                >
                    {imageUrl && (
                        <div className="image-preview">
                            <img
                                src={imageUrl}
                                alt="Selected garment preview"
                            />

                            <button
                                className="garment-card__action"
                                type="button"
                                onClick={() => setImageUrl("")}
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
                </FormField>
                <FormField
                    id="garment-name"
                    label="Garment name"
                    hint="Use a recognisable name, such as “Black linen blazer”."

                >
                    <input
                        id="garment-name"
                        name="name"
                        type="text"
                        autoFocus
                        value={name}
                        required
                        onChange={(event) => setName(event.target.value)}
                        aria-describedby="garment-name-hint"
                    />
                </FormField>
            </div>
            <div>
                <FormField id="garment-category" label="Category">
                    <select
                        id="garment-category"
                        name="category"
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value as GarmentCategory)
                        }
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>

                        {garmentCategories.map((garmentCategory) => (
                            <option key={garmentCategory} value={garmentCategory}>
                                {garmentCategory}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>
            <div>
                <FormField
                    id="garment-colour"
                    label="Primary colour"
                    hint="Use the colour that is most useful when combining outfits."
                >
                    <input
                        id="garment-colour"
                        name="primaryColour"
                        type="text"
                        value={primaryColour}
                        onChange={(event) => setPrimaryColour(event.target.value)}
                        placeholder="For example, black"
                        required
                    />
                </FormField>
            </div>
            <div>
                <FormField id="garment-season" label="Season">
                    <select
                        id="garment-season"
                        name="season"
                        value={season}
                        onChange={(event) =>
                            setSeason(event.target.value as GarmentSeason)
                        }
                        required
                    >
                        <option value="" disabled>
                            Select a season
                        </option>

                        {garmentSeasons.map((garmentSeason) => (
                            <option key={garmentSeason} value={garmentSeason}>
                                {garmentSeason.replaceAll("-", " ")}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>
            <div className="form-actions">
                <button
                    className="button button--secondary"
                    type="button"
                    onClick={onCancel}>
                    Cancel
                </button>

                <button
                    className="button button--primary"
                    type="submit">
                    {initialGarment ? "Save changes" : "Add garment"}
                </button>
            </div>
        </form>
    );
}
