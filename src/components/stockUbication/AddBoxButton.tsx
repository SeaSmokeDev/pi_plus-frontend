interface AddBoxButtonProps {
  onClick: () => void;
}

function AddBoxButton({ onClick }: AddBoxButtonProps) {
  return (
    <div className="stock-slot-add-box">
      <button type="button" onClick={onClick} className="stock-slot-add-box__button">
        <span className="stock-slot-add-box__icon" aria-hidden="true">
          <i className="bi bi-box-seam" />
        </span>
        Agregar caja
      </button>
    </div>
  );
}

export default AddBoxButton;
