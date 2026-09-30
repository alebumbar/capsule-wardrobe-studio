import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

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

  it("adds a garment to the wardrobe", async () => {
    const user = userEvent.setup();
    render(<App />);

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
  });
});
