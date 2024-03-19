import React, { useState } from 'react';
import config from '../config/config.json';

const Wholesale = () => {
  // Fake incoming requests of drugs
  const [incomingRequests, setIncomingRequests] = useState([
    { id: 1, drug: 'Drug A', amount: 50, discountCode: 'DISCOUNT1', finalPrice: 100 }, // Added finalPrice
    { id: 2, drug: 'Drug B', amount: 30, discountCode: 'DISCOUNT2', finalPrice: 150 }, // Added finalPrice
    { id: 3, drug: 'Drug C', amount: 20, discountCode: 'DISCOUNT3', finalPrice: 200 }  // Added finalPrice
  ]);

  // Fake inventory of drugs
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Drug A', quantity: 200 },
    { id: 2, name: 'Drug B', quantity: 150 },
    { id: 3, name: 'Drug C', quantity: 100 }
  ]);

  // List of available drugs
  const availableDrugs = inventory.map(drug => drug.name);

  // Function to handle shipment confirmation
  const handleConfirmShipment = (id, amount) => {
    // Logic to confirm shipment, here we will remove the request from the list
    setIncomingRequests(incomingRequests.filter(request => request.id !== id));
    // Update inventory by subtracting the shipped quantity
    setInventory(prevInventory => {
      return prevInventory.map(drug => {
        if (drug.id === id) {
          return { ...drug, quantity: drug.quantity - amount };
        }
        return drug;
      });
    });
  };

  // Function to handle adding bulk order
  const handleAddBulkOrder = (drug, amount, price) => {
    // Logic to handle adding bulk order
    console.log("Bulk Order Added:", { drug, amount, price });
  };

  return (
    <div>
      <h2>Wholesale | User Id: {config.id}</h2>

      <div>
        <h3>Incoming Requests</h3>
        <ul>
          {incomingRequests.map(request => (
            <li key={request.id}>
              {request.amount} units of {request.drug} - Discount Code: {request.discountCode} - Final Price: {request.finalPrice} {/* Display finalPrice */}
              <button onClick={() => handleConfirmShipment(request.id, request.amount)}>Confirm Shipment</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Current Inventory</h3>
        <ul>
          {inventory.map(drug => (
            <li key={drug.id}>
              {drug.name} - Quantity: {drug.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Place Bulk Order</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const drug = e.target.elements.drug.value;
          const amount = parseInt(e.target.elements.amount.value);
          const price = parseFloat(e.target.elements.price.value);
          handleAddBulkOrder(drug, amount, price);
        }}>
          <label htmlFor="drug">Drug Name:</label>
          <select id="drug" name="drug" required>
            <option value="" disabled selected>Select a drug</option>
            {availableDrugs.map((drug, index) => (
              <option key={index} value={drug}>{drug}</option>
            ))}
          </select>
          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" name="amount" required />
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" step="0.01" required />
          <button type="submit">Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default Wholesale;
