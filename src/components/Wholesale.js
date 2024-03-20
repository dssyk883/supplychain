import React, { useState } from 'react';
import config from '../config/config.json';
import { useContractInitialization } from './Contract';
import { ethers } from 'ethers';

const Wholesale = () => {
  const { web3, accounts, contract } = useContractInitialization();
  
  const [inventory, setInventoryData] = useState([]);
  const [manufacturerIds, setmanufacturerIds] = useState([]);
  const [discounts, setdiscounts] = useState([]);
  const [requestsPH, setrequestsPH] = useState([]);
  const [requestsMA, setrequestsMA] = useState([]);


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

  useEffect(() => {
    const retrieveInventory = async () => {
      try {
          if (web3 && accounts && contract) {
              const drugs = await contract.methods.retrieveInventoryWDFront().call({ from: accounts[config.id] });
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

  const getAllMA = async () => {
    try {
        if (web3 && accounts && contract) {
            const MAs = await contract.methods.getAllMA().call();
            if (MAs) {
              console.log("Manufacturer IDs:");
              MAs.forEach((id, index) => {
              console.log(`ID ${index + 1}: ${id}`);
              });
              setmanufacturerIds(MAs);
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

  const getAllRequestsPH = async () => {
    try {
      if (web3 && accounts && contract) {
          const Reqs = await contract.methods.getAllRequestsWDPH().call({ from: accounts[config.id] });
          if (Reqs) {
            setrequestsPH(Reqs);
          }
      }
    } catch (error) {
      console.error('Error in retrieving inventory:', error);
  }
  };

  const getAllRequestsMA = async () => {
    try {
      if (web3 && accounts && contract) {
          const Reqs = await contract.methods.getAllRequestsWDMA().call({ from: accounts[config.id] });
          if (Reqs) {
            setrequestsMA(Reqs);
          }
      }
    } catch (error) {
      console.error('Error in retrieving inventory:', error);
  }
  };

  retrieveInventory();
  getAllMA();
  getAllWD();
  getAllDiscounts();
  getAllRequestsPH();
  getAllRequestsMA();
}, [web3, accounts, contract]);

  return (
    <div>
      <h2>Wholesale | User Id: {config.id}</h2>

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

      <h3>Drug Requests (from pharmacy) </h3>
      <ul>
        {/* Render drug information here */}
        {requestsPH && requestsPH.map((request, index) => (
        <li key={index}>
          <h4>Request ID: {String(request.requestID)}</h4>
          <p>Drug ID: {String(request.drugID)}</p>
          <p>Quantity: {String(request.quant)}</p>
          <p>Discount code: {String(request.dcCode)}</p>
          <p>Pharmacy: {request.sender}</p>
          <p>Is Confirmed: {request.confirmed ? 'Yes' : 'No'}</p>
        </li>
        ))}
      </ul>

      <h3>Drug Requests (to manufacturer) </h3>
      <ul>
        {/* Render drug information here */}
        {requestsMA && requestsMA.map((request, index) => (
        <li key={index}>
          <h4>Request ID: {String(request.requestID)}</h4>
          <p>Drug ID: {String(request.drugID)}</p>
          <p>Quantity: {String(request.quant)}</p>
          <p>Discount code: {String(request.dcCode)}</p>
          <p>Manufacturer: {request.receiver}</p>
          <p>Is Confirmed: {request.confirmed ? 'Yes' : 'No'}</p>
        </li>
        ))}
      </ul>
      
      

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
