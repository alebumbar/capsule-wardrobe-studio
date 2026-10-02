import { removeBackground } from "@imgly/background-removal";

type ProgressHandler = (percentage: number) => void;

export async function removeImageBackground(
    image: Blob,
    onProgress?: ProgressHandler,
): Promise<Blob> {
    return removeBackground(image, {
        progress: (_resource, current, total) => {
            if (total > 0) {
                onProgress?.(
                    Math.round((current / total) * 100),
                );
            }
        },
        output: {
            format: "image/webp",
            quality: 0.85,
        },
    });
}