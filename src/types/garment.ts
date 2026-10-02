
export const garmentCategories = [
    "top", "bottom", "dress", "outerwear", "shoes", "accessory",
] as const;

export const garmentSeasons = [
    "all-season", "spring-summer", "autumn-winter",
] as const;

export type GarmentCategory = (typeof garmentCategories)[number];
export type GarmentSeason = (typeof garmentSeasons)[number];

export type Garment = {
    id: string;
    name: string;
    category: GarmentCategory;
    primaryColour: string;
    season: GarmentSeason;
    imageUrl?: string;
    createdAt: string;
};