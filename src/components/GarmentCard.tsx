import type { Garment } from "../types/garment";

type GarmentCardProps = {
    garment: Garment;
};

function formatLabel(value: string) {
    return value.replaceAll("-", " ");
}

export function GarmentCard({ garment }: GarmentCardProps) {
    const titleId = `garment-${garment.id}-title`;

    const addedOn = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(garment.createdAt));

    return (
        <article
            className="garment-card"
            aria-labelledby={titleId}
        >
            <div
                className="garment-card__visual"
                aria-hidden="true"
            >
                <span>
                    {garment.category.charAt(0).toUpperCase()}
                </span>
            </div>

            <div
                className="garment-card__content">
                <p className="garment-card__meta">
                    {formatLabel(garment.category)}
                    {" · "}
                    {formatLabel(garment.season)}
                </p>

                <h2 id={titleId}>{garment.name}</h2>

                <dl className="garment-card__details">
                    <div>
                        <dt>Colour</dt>
                        <dd>{garment.primaryColour}</dd>
                    </div>
                </dl>

                <time dateTime={garment.createdAt}>
                    Added {addedOn}
                </time>
            </div>
        </article>
    )
}