import React, { useState } from "react";

function AddMedicineForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiry: "",
    price: "",
    discountedPrice: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="add-medicine-form" onSubmit={handleSubmit}>

      <input
        placeholder="Medicine Name"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
        required
      />

      {/* Date does not support placeholder, so wrap it with label */}
      <label style={{ display: "block", marginBottom: "5px", color: "gray" }}>
        Expiry Date:
        <input
          type="date"
          value={formData.expiry}
          onChange={e => setFormData({ ...formData, expiry: e.target.value })}
          required
        />
      </label>

      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={e => setFormData({ ...formData, price: e.target.value })}
      />

      <input
        type="number"
        placeholder="Discounted Price"
        value={formData.discountedPrice}
        onChange={e => setFormData({ ...formData, discountedPrice: e.target.value })}
      />

      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>

    </form>
  );
}

export default AddMedicineForm;