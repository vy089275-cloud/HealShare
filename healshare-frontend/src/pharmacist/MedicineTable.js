import React, { useState, useEffect } from "react";
import MedicineRow from "./MedicineRow";

function MedicineTable({ medicines, onBulkEdit, onBulkDelete, editMode, deleteMode }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [editData, setEditData] = useState({});

  // 🔥 Reset when edit/delete mode turns off
useEffect(() => {
  if (!editMode && !deleteMode) {
    setSelectedIds([]);
    setEditData({});
  }
}, [editMode, deleteMode]);

// 🔥 Reset selected IDs when medicines list changes
useEffect(() => {
  setSelectedIds([]);
}, [medicines]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSaveAll = () => {
    onBulkEdit(editData);
    setSelectedIds([]);
    setEditData({});
  };

  const handleDeleteSelected = async () => {
  if (selectedIds.length === 0) {
    alert("Select at least one medicine.");
    return;
  }

  const confirmDelete = window.confirm("Delete selected medicines?");
  if (!confirmDelete) return;

  await onBulkDelete(selectedIds); 

  // 🟢 Clear only AFTER delete completed
  setSelectedIds([]);
};
  const updateRow = (id, updatedRow) => {
    setEditData((prev) => ({
      ...prev,
      [id]: updatedRow,
    }));
  };

  return (
    <div className="medicine-table">
      <div className="top-bar">
        {editMode && selectedIds.length > 0 && (
          <button onClick={handleSaveAll}>Save</button>
        )}

        {deleteMode && selectedIds.length > 0 && (
          <button onClick={handleDeleteSelected}>Confirm Delete</button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            {(editMode || deleteMode) && <th>Select</th>}
            <th>Name</th>
            <th>Quantity</th>
            <th>Expiry</th>
            <th>Price</th>
            <th>Discounted Price</th>
            <th>Free</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((med) => (
            <MedicineRow
              key={med.id}
              medicine={med}
              editMode={editMode}
              deleteMode={deleteMode}
              isSelected={selectedIds.includes(med.id)}
              toggleSelect={toggleSelect}
              updateRow={updateRow}
              editData={editData}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicineTable;
