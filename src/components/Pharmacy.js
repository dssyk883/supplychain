import React, { useState, useEffect } from 'react';
import config from '../config/pharmExample.json';
import { useContractInitialization } from './Contract';
import { ethers } from 'ethers';

const Pharmacy = () => {
  const { web3, accounts, contract } = useContractInitialization();

  // Inventory of drugs with different coverage plans
  // const [inventory, setInventory] = useState(config.inventory);
  const [inventory, setInventoryData] = useState([]);
  const [wholesaleIds, setwholesaleIds] = useState([]);
  const [discounts, setdiscounts] = useState([]);
  const [requests, setrequests] = useState([]);
  
  // State for form inputs
  const [orderForm, setOrderForm] = useState({
    amount: 0,
    drugName: '',
    drug: 0,
    price: 0,
    discountCode: 0,
    wholesaleId: 0
  });

  const [confirmForm, setConfirmForm] = useState({
    amount: 0,
    requestId: 0,
    wholesaleId: 0
  });

  // State to track selected drug and its coverage plans
  const [selectedDrug, setSelectedDrug] = useState(null);

  // Wholesale ID list
  //const wholesaleIds = config.wholesaleIds;

  // Function to handle order form submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    // Handle order submission logic here
    console.log("Order Submitted:", orderForm);
    //let uint256Id = web3.eth.abi.encodeParameter('uint256',id)
    //sendDrugRequestPH(uint drugID, uint quant, uint WDaccNum, uint dcCode)
    let dID = web3.eth.abi.encodeParameter('uint256', orderForm.drug);
    let amount = web3.eth.abi.encodeParameter('uint256', orderForm.amount);
    let wdid = web3.eth.abi.encodeParameter('uint256', orderForm.wholesaleId);
    let dc = web3.eth.abi.encodeParameter('uint256', orderForm.discountCode);
    let price = web3.eth.abi.encodeParameter('uint256', orderForm.price);
    let msgvalue = price * amount;
    await contract.methods.sendDrugRequestPH(dID, amount, wdid, dc).send({ from: accounts[config.id], value: msgvalue});
  };

  const handleConfirmShipment = async (e) => {
    e.preventDefault();
    // Handle order submission logic here
    console.log("Order Submitted:", orderForm);
    //let uint256Id = web3.eth.abi.encodeParameter('uint256',id)
    //function confirmDrugShipmentPH(uint reqID, uint quant, uint WDaccNum) public onlyPH() {
    let amount = web3.eth.abi.encodeParameter('uint256', confirmForm.amount);
    let wdid = web3.eth.abi.encodeParameter('uint256', confirmForm.wholesaleId);
    let reqID = web3.eth.abi.encodeParameter('uint256', confirmForm.requestId);
    await contract.methods.confirmDrugShipmentPH(reqID, amount, wdid).send({ from: accounts[config.id]});
  };

  // Function to handle drug selection
  const handleDrugSelect = (e) => {
    const selectedDrugName = e.target.value;
    const selectedDrugData = inventory.find(drug => drug.name === selectedDrugName);
    console.log(selectedDrugData);
    setSelectedDrug(selectedDrugData);
    setOrderForm({ ...orderForm, drug: selectedDrugData.id, drugName: selectedDrugData.name, price: selectedDrugData.price }); // Reset discount code and price when drug changes
  };

  const handleRequestSelect = (e) => {
    const selectedRequestID = e.target.value;
    console.log(e.target.value);
    const selectedRequest = requests.find(request => String(request.requestID) === selectedRequestID);
    if (selectedRequest) {
      setConfirmForm({ ...confirmForm, requestId: selectedRequest.requestID });
    } else {
      // Handle the case where no request is found, e.g., reset to default values
      console.log("No request found with ID:", selectedRequestID);
      setConfirmForm({ ...confirmForm, requestId: '' }); // Reset or handle as appropriate
    }
  };

  const handleWDselect = (e) => {
    const selectedWDnum = e.target.value;
    console.log(e.target.value);
    const selectedWDIndex = wholesaleIds.findIndex(wd => String(wd) === selectedWDnum);
    if (selectedWDIndex !== -1) {
      setConfirmForm({ ...confirmForm, wholesaleId: wholesaleIds[selectedWDIndex] });
    } else {
      // Handle the case where no request is found, e.g., reset to default values
      console.log("No request found with ID:", selectedWDnum);
      setConfirmForm({ ...confirmForm, wholesaleId: '' }); // Reset or handle as appropriate
    }
  };

  const showRequests = async () => {
    try {
      if (web3 && accounts && contract) {
          const Reqs = await contract.methods.getAllRequestsPH().call({ from: accounts[config.id] });
          Reqs.forEach((request, index) => {
            console.log(`Request ID: ${request.requestID}`);
            console.log(`Request ID: ${request.drugID}`);
            console.log('----------');
          });
          if (Reqs) {
            setrequests(Reqs);
          }
      }
    } catch (error) {
      console.error('Error in retrieving inventory:', error);
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

  const getAllWD = async () => {
    try {
        if (web3 && accounts && contract) {
            const WDs = await contract.methods.getAllWD().call();
            if (WDs) {
              console.log("Wholesale Distributor IDs:");
              WDs.forEach((id, index) => {
              console.log(`ID ${index + 1}: ${id}`);
              });
              setwholesaleIds(WDs);
            }
        }
    } catch (error) {
        console.error('Error in retrieving inventory:', error);
    }
};
  const getAllDiscounts = async () => {
  try {
      if (web3 && accounts && contract) {
          const DCs = await contract.methods.getAllDiscounts().call();
          if (DCs) {
            setdiscounts(DCs);
          }
      }
  } catch (error) {
      console.error('Error in retrieving inventory:', error);
  }
};

  const getAllRequests = async () => {
    try {
      if (web3 && accounts && contract) {
          const Reqs = await contract.methods.getAllRequestsPH().call({ from: accounts[config.id] });
          if (Reqs) {
            setrequests(Reqs);
          }
      }
    } catch (error) {
      console.error('Error in retrieving inventory:', error);
  }
  };

  retrieveInventory();
  getAllWD();
  getAllDiscounts();
  getAllRequests();
}, [web3, accounts, contract]);


  return (
    <div>
      <h2>Pharmacy | User ID: {config.id}</h2>

      <h3>Drugs</h3>
      <ul>
        {/* Render drug information here */}
        {inventory && inventory.map((drug, index) => (
        <li key={index}>
          <h4>{drug.name}</h4>
          <p>ID: {String(drug.id)}</p>
          <p>Price: {String(drug.price)}</p>
          <p>Quantity: {String(drug.quantity)}</p>
          <p>Current Owner: {drug.currentOwner}</p>
          <p>Manufacturer: {drug.manufacturer}</p>
          <p>Wholesale: {drug.wholesale}</p>
          <p>Pharmacy: {drug.pharmacy}</p>
          <p>Is Sold Out: {drug.isSoldOut ? 'Yes' : 'No'}</p>
        </li>
        ))}
      </ul>
      
      <h3>Discounts</h3>
      <ul>
        {/* Render drug information here */}
        {discounts && discounts.map((discount, index) => (
        <li key={index}>
          <p>Discount code: {String(discount.discountCode)}</p>
          <p>Drug ID: {String(discount.drugID)}</p>
          <p>Discount price: {String(discount.discountPrice)}</p>
          <p>Insurer: {discount.insurer}</p>
        </li>
        ))}
      </ul>
      <button onClick={showRequests}> Show Request </button>
      <h3>Drug Requests (to wholesale) </h3>
      <ul>
        {/* Render drug information here */}
        {requests && requests.map((request, index) => (
        <li key={index}>
          <h4>Request ID: {String(request.requestID)}</h4>
          <p>Drug ID: {String(request.drugID)}</p>
          <p>Quantity: {String(request.quant)}</p>
          <p>Discount code: {String(request.dcCode)}</p>
          <p>Wholesale: {request.receiver}</p>
          <p>Is Confirmed: {request.confirmed ? 'Yes' : 'No'}</p>
        </li>
        ))}
      </ul>

      <h3>Confirm Drug Shipment Form</h3>
      <form onSubmit={handleConfirmShipment}>
        <label>
          Amount:
          <input
            type="number"
            value={confirmForm.amount}
            onChange={e => setConfirmForm({ ...confirmForm, amount: parseInt(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Drug Request:
          <select
            value={String(confirmForm.requestId)}
            onChange={handleRequestSelect}
          >
            <option value="">Select Request</option>
            {requests && requests.map(request => (
              <option key={String(request.requestID)} value={String(request.requestID)}>
                {String(request.requestID)}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Wholesale ID:
          <select
            value={String(confirmForm.wholesaleId)}
            onChange={handleWDselect}
          >
            <option value="">Select Wholesale ID</option>
            {wholesaleIds && wholesaleIds.map(wd => (
              <option key={String(wd)} value={String(wd)}>
                {String(wd)}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Order</button>
      </form>

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
            value={orderForm.drugName}
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
            onChange={e => setOrderForm({ ...orderForm, discountCode: parseInt(e.target.value, 10) })}
          >
            <option value="">Select Discount Code</option>
            {discounts &&
              discounts.map((discount, index) =>  (
                <option key={index}>
                  {String(discount.discountCode)}
                </option>
              ))}
          </select>
        </label>
        <br />
        <label>
          Price:
          <input
            type="string"
            value={String(orderForm.price)}
            readOnly // Price is now read-only
          />
        </label>
        <br />
        <label>
          Wholesale ID:
          <input
            type="number"
            value={orderForm.wholesaleId}
            onChange={e => setOrderForm({ ...orderForm, wholesaleId: parseInt(e.target.value, 10) })}
          />
        </label>
        <br />
        <button type="submit">Order</button>
      </form>
    </div>
  );
};

export default Pharmacy;
