import React, { useState, useEffect } from 'react';
import config from '../config/pharmExample.json';
import { useContractInitialization } from './Contract';

const Pharmacy = () => {
  const { web3, accounts, contract } = useContractInitialization();

  // Inventory of drugs with different coverage plans
  // const [inventory, setInventory] = useState(config.inventory);

  const [inventory, setInventoryData] = useState(null);
  

  // const inventory = async () => {
  //   try {
  //       // Send a transaction to the smart contract
  //       await contract.methods.retrieveInventoryPHFront().send({ from: accounts[config.id] });
  //       console.log(await contract.methods.retrieveInventoryPHFront().send({ from: accounts[config.id] }));
  //   } catch (error) {
  //       console.error('Error in retrieving inventory:', error);
  //   }
  // };

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

  // const retrieveInventory = async () => {
  //   try {
  //     // Retrieve inventory data from the smart contract
  //     const inventory = await contract.methods.retrieveInventoryPHFront().send({ from: accounts[config.id] });
  //     setInventoryData(inventory);
  //   } catch (error) {
  //     console.error('Error in retrieving inventory:', error);
  //   }
  // };

  useEffect(() => {
    const retrieveInventory = async () => {
        try {
            const inventoryData = await contract.methods.retrieveInventoryPHFront().send({ from: accounts[config.id] });
            setInventoryData(inventoryData);
        } catch (error) {
            console.error('Error in retrieving inventory:', error);
        }
    };

    if (web3 && accounts && contract) {
        retrieveInventory();
    }
}, [web3, accounts, contract]);

  // Rest of your component logic
  // },
  // Effect to recalculate price when amount, drug, or discount code changes
  // useEffect(() => {
  //   retrieveInventory();
  //   calculatePrice();
  // }, [orderForm.amount, orderForm.discountCode, selectedDrug]);

  return (
    <div>
      <h2>Pharmacy | User ID: {config.id}</h2>

      <h3>Plans</h3>
      <ul>
        {inventory && inventory.map((drug, index) => (
                <li key={index}>
                    <h3>Drug {index}</h3>
                    <p>Name: {drug.name}</p>
                    <p>Quantity: {drug.quantity}</p>
                    <p>Price: {drug.price}</p>
                    {/* Add more properties as needed */}
                </li>
            ))}
        {/* {inventory.map(drug => (
          <li key={drug.id}>
            {drug.name} - Price: ${drug.price} - Quantity: {drug.quantity} */}
            {/* <ul>
              {drug.coveragePlans.map((plan, index) => (
                <li key={index}>
                  Coverage Plan: {plan.plan} - Discount: {plan.discountRate} - Discount Code: {plan.discountCode}
                </li>
              ))}
            </ul> */}
          {/* </li> */}
        {/* ))} */}
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
