import React, { useState, useEffect } from 'react';
import config from '../config/pharmExample.json';
import { useContractInitialization } from './Contract';

const Pharmacy = () => {
  const { web3, accounts, contract } = useContractInitialization();

  // Inventory of drugs with different coverage plans
  // const [inventory, setInventory] = useState(config.inventory);

  const [inventory, setInventoryData] = useState([]);
  
  // State for form inputs
  const [orderForm, setOrderForm] = useState({
    amount: 0,
    drug: '',
    price: 0,
    discountCode: '',
    wholesaleId: ''
  });

  // State to track selected drug and its coverage plans
  const [selectedDrug, setSelectedDrug] = useState(null);

  // Wholesale ID list
  const wholesaleIds = config.wholesaleIds;

  // Function to handle order form submission
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    // Handle order submission logic here
    console.log("Order Submitted:", orderForm);
    //TODO: change this
    this.state.contract.methods.sendDrugRequestPH(e.target.setText.value).send({ from: this.state.account });
  };

  // Function to handle drug selection
  const handleDrugSelect = (e) => {
    const selectedDrugName = e.target.value;
    const selectedDrugData = inventory.find(drug => drug.name === selectedDrugName);
    setSelectedDrug(selectedDrugData);
    setOrderForm({ ...orderForm, drug: selectedDrugName, discountCode: '', price: 0 }); // Reset discount code and price when drug changes
  };

  // Function to calculate price based on amount, drug price, and discount rate
  const calculatePrice = () => {
    if (selectedDrug && orderForm.amount && orderForm.discountCode) {
      const selectedPlan = selectedDrug.coveragePlans.find(plan => plan.discountCode === orderForm.discountCode);
      if (selectedPlan) {
        const price = orderForm.amount * (selectedDrug.price - selectedPlan.discountRate);
        setOrderForm({ ...orderForm, price });
      }
    }
  };


  useEffect(() => {
    const retrieveInventory = async () => {
      try {
          if (web3 && accounts && contract) {
              const drugs = await contract.methods.retrieveInventoryPHFront().call({ from: accounts[config.id] });
              if (drugs) {
            // Log each drug's details
              drugs.forEach((drug, index) => {
              console.log(`Drug ${index + 1}:`);
              console.log(`ID: ${drug.id}`);
              console.log(`Name: ${drug.name}`);
              console.log(`Price: ${drug.price}`);
              console.log(`Quantity: ${drug.quantity}`);
              console.log(`Current Owner: ${drug.currentOwner}`);
              console.log(`Manufacturer: ${drug.manufacturer}`);
              console.log(`Wholesale: ${drug.wholesale}`);
              console.log(`Pharmacy: ${drug.pharmacy}`);
              console.log(`Is Sold Out: ${drug.isSoldOut}`);
              console.log('----------');
            });
          }
              setInventoryData(drugs);
          }
      } catch (error) {
          console.error('Error in retrieving inventory:', error);
      }
  };

  retrieveInventory();
}, [web3, accounts, contract]);


  return (
    <div>
      <h2>Pharmacy | User ID: {config.id}</h2>

      <h3>Plans</h3>
      <ul>
        {/* Render drug information here */}
        {inventory && inventory.map((drug, index) => (
        <li key={index}>
          <h4>{drug.name}</h4>
          <p>ID: {drug.id}</p>
          <p>Price: {drug.price}</p>
          <p>Quantity: {drug.quantity}</p>
          <p>Current Owner: {drug.currentOwner}</p>
          <p>Manufacturer: {drug.manufacturer}</p>
          <p>Wholesale: {drug.wholesale}</p>
          <p>Pharmacy: {drug.pharmacy}</p>
          <p>Is Sold Out: {drug.isSoldOut ? 'Yes' : 'No'}</p>
        </li>
        ))}
      </ul>

      <h3>Order Form</h3>
      <form onSubmit={handleOrderSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={orderForm.amount}
            onChange={e => setOrderForm({ ...orderForm, amount: parseInt(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Drug:
          <select
            value={orderForm.drug}
            onChange={handleDrugSelect}
          >
            <option value="">Select Drug</option>
            {inventory && inventory.map(drug => (
              <option key={drug.id} value={drug.name}>
                {drug.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Discount Code:
          <select
            value={orderForm.discountCode}
            onChange={e => setOrderForm({ ...orderForm, discountCode: e.target.value })}
          >
            <option value="">Select Discount Code</option>
            {selectedDrug &&
              selectedDrug.coveragePlans.map(plan => (
                <option key={plan.discountCode} value={plan.discountCode}>
                  {plan.discountCode}
                </option>
              ))}
          </select>
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            value={orderForm.price}
            readOnly // Price is now read-only
          />
        </label>
        <br />
        <label>
          Wholesale ID:
          <select
            value={orderForm.wholesaleId}
            onChange={e => setOrderForm({ ...orderForm, wholesaleId: e.target.value })}
          >
            <option value="">Select Wholesale ID</option>
            {wholesaleIds.map(id => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Order</button>
      </form>
    </div>
  );
};

export default Pharmacy;
