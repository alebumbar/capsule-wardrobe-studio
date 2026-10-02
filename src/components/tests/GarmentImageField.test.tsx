import { useState } from "react";
import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GarmentImageField } from "../GarmentImageField";

vi.mock("../../services/removeImageBackground", () => ({
    removeImageBackground: vi.fn(async () =>
        new Blob(
            ["processed garment image"],
            { type: "image/webp" },
        ),
    ),
}));

function TestGarmentImageField() {
    const [imageUrl, setImageUrl] = useState("");

    return (
        <GarmentImageField
            value={imageUrl}
            onChange={setImageUrl}
        />
    );
}

describe("GarmentImageField", () => {
    it("replaces an uploaded image with its processed version", async () => {
        const user = userEvent.setup();

        render(<TestGarmentImageField />);

        const image = new File(
            ["original garment image"],
            "garment.png",
            { type: "image/png" },
        );

        await user.upload(
            screen.getByLabelText("Garment photo"),
            image,
        );

        const preview = await screen.findByAltText(
            "Selected garment preview",
        );

        expect(preview.getAttribute("src")).toMatch(
            /^data:image\/png;base64,/,
        );

        await user.click(
            screen.getByRole("button", {
                name: "Remove background",
            }),
        );

        await waitFor(() => {
            expect(preview.getAttribute("src")).toMatch(
                /^data:image\/webp;base64,/,
            );
        });
    });
});