import { App } from "./App";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Garment } from "./types/garment";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("opens and closes the add-garment placeholder", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Add your first garment" }));
    expect(screen.getByRole("dialog", { name: "Add a garment" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("adds, restores, and removes a garment", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: "Add your first garment",
      }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Add a garment",
    });

    await user.type(
      within(dialog).getByRole("textbox", {
        name: "Garment name",
      }),
      "Black linen blazer",
    );

    await user.selectOptions(
      within(dialog).getByRole("combobox", {
        name: "Category",
      }),
      "outerwear",
    );

    await user.type(
      within(dialog).getByRole("textbox", {
        name: "Primary colour",
      }),
      "Black",
    );

    await user.selectOptions(
      within(dialog).getByRole("combobox", {
        name: "Season",
      }),
      "autumn-winter",
    );

    await user.click(
      within(dialog).getByRole("button", {
        name: "Add garment",
      }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByText("Black linen blazer"),
    ).toBeInTheDocument();
    unmount();

    const restoredApp = render(<App />);

    expect(
      screen.getByText("Black linen blazer"),
    ).toBeInTheDocument();

    // Open the confirmation.
    await user.click(
      screen.getByRole("button", {
        name: "Remove Black linen blazer",
      }),
    );

    const firstConfirmation = screen.getByRole("group", {
      name: "Remove Black linen blazer?",
    });

    // Cancel deletion.
    await user.click(
      within(firstConfirmation).getByRole("button", {
        name: "Keep it",
      }),
    );

    expect(
      screen.getByText("Black linen blazer"),
    ).toBeInTheDocument();

    // Open the confirmation again.
    await user.click(
      screen.getByRole("button", {
        name: "Remove Black linen blazer",
      }),
    );

    const secondConfirmation = screen.getByRole("group", {
      name: "Remove Black linen blazer?",
    });

    // Confirm deletion.
    await user.click(
      within(secondConfirmation).getByRole("button", {
        name: "Remove",
      }),
    );

    expect(
      screen.queryByText("Black linen blazer"),
    ).not.toBeInTheDocument();

    // Simulate another refresh.
    restoredApp.unmount();

    render(<App />);

    expect(
      screen.queryByText("Black linen blazer"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Start with a piece you love",
      }),
    ).toBeInTheDocument();
  });

  it("edits an existing garment without creating a duplicate", async () => {
    const existingGarment: Garment = {
      id: "garment-1",
      name: "Black linen blazer",
      category: "outerwear",
      primaryColour: "Black",
      season: "autumn-winter",
      createdAt: "2026-10-01T10:00:00.000Z",
    };

    localStorage.setItem(
      "elan.garments.v1",
      JSON.stringify([existingGarment]),
    );

    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: "Edit Black linen blazer",
      }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Edit garment",
    });

    const nameInput = within(dialog).getByRole("textbox", {
      name: "Garment name",
    });

    expect(nameInput).toHaveValue("Black linen blazer");

    await user.clear(nameInput);
    await user.type(nameInput, "Camel wool blazer");

    await user.selectOptions(
      within(dialog).getByRole("combobox", {
        name: "Season",
      }),
      "all-season",
    );

    await user.click(
      within(dialog).getByRole("button", {
        name: "Save changes",
      }),
    );

    expect(
      screen.queryByText("Black linen blazer"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Camel wool blazer"),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("article")).toHaveLength(1);

    // Verify that the edited version survives a reload.
    unmount();
    render(<App />);

    expect(
      screen.getByText("Camel wool blazer"),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("closes the form with Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<App />);

    const openButton = screen.getByRole("button", {
      name: "Add your first garment",
    });

    await user.click(openButton);

    expect(
      screen.getByRole("textbox", {
        name: "Garment name",
      }),
    ).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog"),
    ).not.toBeInTheDocument();

    expect(openButton).toHaveFocus();
  });

  it("validates, saves, and restores a garment photo", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.click(
      screen.getByRole("button", {
        name: "Add your first garment",
      }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Add a garment",
    });
    const imageInput = within(dialog).getByLabelText("Garment photo");

    const oversizedImage = new File(
      [new Uint8Array(750_001)],
      "large-garment.png",
      { type: "image/png" },
    );

    await user.upload(imageInput, oversizedImage);

    expect(
      await within(dialog).findByRole("alert"),
    ).toHaveTextContent("Choose an image smaller than 750 KB.");

    const validImage = new File(
      ["small garment image"],
      "linen-blazer.png",
      { type: "image/png" },
    );

    await user.upload(imageInput, validImage);

    const preview = await within(dialog).findByAltText(
      "Selected garment preview",
    );
    const previewSource = preview.getAttribute("src");

    expect(previewSource).toMatch(/^data:image\/png;base64,/);
    expect(within(dialog).queryByRole("alert")).not.toBeInTheDocument();

    await user.type(
      within(dialog).getByRole("textbox", {
        name: "Garment name",
      }),
      "Black linen blazer",
    );
    await user.selectOptions(
      within(dialog).getByRole("combobox", {
        name: "Category",
      }),
      "outerwear",
    );
    await user.type(
      within(dialog).getByRole("textbox", {
        name: "Primary colour",
      }),
      "Black",
    );
    await user.selectOptions(
      within(dialog).getByRole("combobox", {
        name: "Season",
      }),
      "autumn-winter",
    );
    await user.click(
      within(dialog).getByRole("button", {
        name: "Add garment",
      }),
    );

    const savedCard = screen.getByRole("article", {
      name: "Black linen blazer",
    });
    expect(savedCard.querySelector("img")).toHaveAttribute(
      "src",
      previewSource,
    );

    unmount();
    render(<App />);

    const restoredCard = screen.getByRole("article", {
      name: "Black linen blazer",
    });
    expect(restoredCard.querySelector("img")).toHaveAttribute(
      "src",
      previewSource,
    );
  });

});
