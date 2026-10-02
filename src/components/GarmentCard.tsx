import type { Garment } from "../types/garment";
import { useState } from "react";

type GarmentCardProps = {
    garment: Garment;
    onEdit: (garment: Garment) => void;
    onDelete: (garmentId: string) => void;
};

function formatLabel(value: string) {
    return value.replaceAll("-", " ");
}

export function GarmentCard({
    garment,
    onEdit,
    onDelete,
}: GarmentCardProps) {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
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
                {isConfirmingDelete ? (
                    <div
                        className="garment-card__confirmation"
                        role="group"
                        aria-label={`Remove ${garment.name}?`}
                    >
                        <p>Remove this garment?</p>

                        <div className="garment-card__confirmation-actions">
                            <button
                                className="button button--secondary"
                                type="button"
                                onClick={() => setIsConfirmingDelete(false)}
                            >
                                Keep it
                            </button>

                            <button
                                className="button button--danger"
                                type="button"
                                onClick={() => onDelete(garment.id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="garment-card__actions">
                        <button
                            className="garment-card__action"
                            type="button"
                            aria-label={`Edit ${garment.name}`}
                            onClick={() => onEdit(garment)}
                        >
                            Edit
                        </button>

                        <button
                            className="garment-card__action"
                            type="button"
                            aria-label={`Remove ${garment.name}`}
                            onClick={() => setIsConfirmingDelete(true)}
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
        </article>
    )
}