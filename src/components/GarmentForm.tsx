import { useState } from "react";
import {
    garmentCategories,
    garmentSeasons,
    type GarmentCategory,
    type GarmentSeason,
    type Garment
} from "../types/garment";
import { FormField } from "./FormField";

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
            createdAt: initialGarment?.createdAt ?? new Date().toISOString(),
        };
        onSubmit(garment);
    }

    return (
        <form className="garment-form" onSubmit={handleSubmit}>
            <div>
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