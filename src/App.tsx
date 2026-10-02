import { useEffect, useRef, useState } from "react";
import { EmptyWardrobe } from "./components/EmptyWardrobe";
import { GarmentForm } from "./components/GarmentForm";
import type { Garment } from "./types/garment";
import { GarmentCard } from "./components/GarmentCard";

const GARMENTS_STORAGE_KEY = "elan.garments.v1";

function loadGarments(): Garment[] {
  const storedValue = localStorage.getItem(GARMENTS_STORAGE_KEY,
  );

  if (!storedValue) {
    return [];
  }
  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    return Array.isArray(parsedValue)
      ? (parsedValue as Garment[])
      : [];
  } catch {
    return [];
  }
}

type GarmentFormState =
  | { mode: "add" }
  | { mode: "edit"; garment: Garment }
  | null;

export function App() {
  const [garmentFormState, setGarmentFormState] = useState<GarmentFormState>(null);
  const [garments, setGarments] = useState<Garment[]>(loadGarments);

  function openAddGarmentForm() {
    rememberCurrentFocus();
    setGarmentFormState({ mode: "add" });
  }

  function closeGarmentForm() {
    setGarmentFormState(null);
  }
  const returnFocusRef = useRef<HTMLElement | null>(null);

  function rememberCurrentFocus() {
    if (document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
  }

  useEffect(() => {
    localStorage.setItem(
      GARMENTS_STORAGE_KEY, JSON.stringify(garments),
    );
  }, [garments]);

  useEffect(() => {
    if (garmentFormState === null && returnFocusRef.current) {
      returnFocusRef.current.focus();
      returnFocusRef.current = null;
    }
  }, [garmentFormState]);

  useEffect(() => {
    if (!garmentFormState) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event?.preventDefault();
        setGarmentFormState(null);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [garmentFormState]);

  function openEditGarmentForm(garment: Garment) {
    rememberCurrentFocus();
    setGarmentFormState({
      mode: "edit",
      garment,
    })
  }

  function handleSaveGarment(garment: Garment) {
    setGarments((currentGarments) => {
      if (garmentFormState?.mode === "edit") {
        return currentGarments.map((currentGarment) =>
          currentGarment.id === garment.id
            ? garment
            : currentGarment,
        );
      }
      return [...currentGarments, garment];
    });
    closeGarmentForm();
  }

  function handleDeleteGarment(garmentId: string) {
    setGarments((currentGarments) =>
      currentGarments.filter((g) => g.id !== garmentId),
    );
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="/" aria-label="Élan home">
          Élan
        </a>
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            <li><a aria-current="page" href="#wardrobe">Wardrobe</a></li>
            <li><a href="#outfits">Outfits</a></li>
          </ul>
        </nav>
        <button className="button button--primary" onClick={openAddGarmentForm}>
          Add garment
        </button>
      </header>

      <main id="main-content" className="page">
        <section className="page-heading" aria-labelledby="wardrobe-title">
          <p className="eyebrow">Your collection</p>
          <div>
            <h1 id="wardrobe-title">Wardrobe</h1>
            <p>Build more outfits from pieces you already love.</p>
          </div>
        </section>

        <section id="wardrobe" aria-label="Wardrobe garments">
          {garments.length === 0 ? (
            <EmptyWardrobe
              onAddGarment={openAddGarmentForm}
            />
          ) : (
            <ul className="garment-grid">
              {garments.map((garment) => (
                <li key={garment.id}>
                  <GarmentCard
                    garment={garment}
                    onEdit={openEditGarmentForm}
                    onDelete={handleDeleteGarment}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {garmentFormState && (
        <div className="panel-backdrop" role="presentation">
          <section
            className="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
          >
            <div>
              <p className="eyebrow">First milestone</p>
              <h2 id="panel-title">
                {garmentFormState.mode === "edit"
                  ? "Edit garment"
                  : "Add a garment"}
              </h2>
            </div>
            <GarmentForm
              initialGarment={
                garmentFormState.mode === "edit"
                  ? garmentFormState.garment
                  : undefined
              }
              onCancel={closeGarmentForm}
              onSubmit={handleSaveGarment}
            />
          </section>
        </div>
      )}
    </div>
  );
}
