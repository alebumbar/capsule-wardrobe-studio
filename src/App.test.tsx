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
});
