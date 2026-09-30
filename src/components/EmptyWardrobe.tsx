type EmptyWardrobeProps = {
  onAddGarment: () => void;
};

export function EmptyWardrobe({ onAddGarment }: EmptyWardrobeProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__illustration" aria-hidden="true">
        <span className="hanger" />
      </div>
      <div className="empty-state__content">
        <h2>Start with a piece you love</h2>
        <p>
          Add your first garment, then combine it into outfits for the moments
          that matter.
        </p>
        <button className="button button--primary" onClick={onAddGarment}>
          Add your first garment
        </button>
      </div>
    </div>
  );
}
