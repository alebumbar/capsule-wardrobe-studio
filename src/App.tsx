import { useEffect, useState } from "react";
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

export function App() {
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [garments, setGarments] = useState<Garment[]>(loadGarments);

  useEffect(() => {
    localStorage.setItem(
      GARMENTS_STORAGE_KEY, JSON.stringify(garments),
    );
  }, [garments]);

  function handleAddGarment(garment: Garment) {
    setGarments((currentGarments) => [
      ...currentGarments,
      garment,
    ]);

    setIsAddPanelOpen(false);
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
        <button className="button button--primary" onClick={() => setIsAddPanelOpen(true)}>
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
              onAddGarment={() => setIsAddPanelOpen(true)}
            />
          ) : (
            <ul className="garment-grid">
              {garments.map((garment) => (
                <li key={garment.id}>
                  <GarmentCard garment={garment}
                    onDelete={handleDeleteGarment}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {isAddPanelOpen && (
        <div className="panel-backdrop" role="presentation">
          <section
            className="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
          >
            <div>
              <p className="eyebrow">First milestone</p>
              <h2 id="panel-title">Add a garment</h2>
            </div>
            <GarmentForm
              onCancel={() => setIsAddPanelOpen(false)}
              onSubmit={handleAddGarment}
            />
          </section>
        </div>
      )}
    </div>
  );
}
