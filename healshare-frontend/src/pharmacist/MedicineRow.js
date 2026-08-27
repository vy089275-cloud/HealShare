import React from "react";

function MedicineRow({
  medicine,
  editMode,
  deleteMode,
  isSelected,
  toggleSelect,
  updateRow,
  editData,
}) {
  const row = editData?.[medicine.id] || medicine;

  const handleChange = (field, value) => {
    updateRow(medicine.id, { ...row, [field]: value });
  };

  const editable = editMode && isSelected;

  // EXPIRY COLOR LOGIC
  const expiryDate = new Date(row.expiry);
  const today = new Date();
  const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

  let rowClass = "";
  if (diffDays <= 10) rowClass = "expire-very-soon";
  else if (diffDays <= 30) rowClass = "expire-soon";

  return (
    <tr className={rowClass}>
      {(editMode || deleteMode) && (
        <td>
          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(medicine.id)} />
        </td>
      )}

      <td>
        {editable ? (
          <input value={row.name} onChange={(e) => handleChange("name", e.target.value)} />
        ) : row.name}
      </td>

      <td>
        {editable ? (
          <input
            type="number"
            value={row.quantity}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
          />
        ) : row.quantity}
      </td>

      <td>
        {editable ? (
          <input type="date" value={row.expiry} onChange={(e) => handleChange("expiry", e.target.value)} />
        ) : row.expiry}
      </td>

      <td>
        {editable ? (
          <input type="number" value={row.price} onChange={(e) => handleChange("price", Number(e.target.value))} />
        ) : row.price}
      </td>

      <td>
        {editable ? (
          <input
            type="number"
            value={row.discountedPrice || ""}
            onChange={(e) =>
              handleChange("discountedPrice", e.target.value === "" ? null : Number(e.target.value))
            }
          />
        ) : row.discountedPrice || "–"}
      </td>

      <td>{row.free ? "Yes" : "–"}</td>
    </tr>
  );
}

export default MedicineRow;
