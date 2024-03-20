import React, { useState, useEffect } from 'react';
import config from '../config/config.json'
import { useContractInitialization } from './Contract';

//TODO, add current contract drugs/discounts on them

const Manufacture = () => {
  const { web3, accounts, contract } = useContractInitialization();

  // Fake incoming requests
  const [incomingRequests, setIncomingRequests] = useState([  ]);
  const [inventory, setInventoryData] = useState([]);
  const [wholesaleIds, setwholesaleIds] = useState([]);


  // Function to handle confirmation of incoming requests
  const handleConfirmRequest = async (id) => {
    // Logic to confirm the request, here we will remove the request from the list


    let req = incomingRequests.filter(request => request.requestID === id); 
    try {
      await contract.methods.shipDrugMA(req.dID, req.quant, req.sender, req.requestID)
    } catch (error){
      console.error('Error in Shipping Drugs:', error)
    }
    refreshInventory();
    setIncomingRequests(incomingRequests.filter(request => request.id !== id));
    
    
  };

  const refreshInventory = async () => {
    try {
        if (web3 && accounts && contract) {
            const drugs = await contract.methods.retrieveInventoryMAFront().call({ from: accounts[config.id] });
            if (drugs) {
              setInventoryData(drugs);
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
              const drugs = await contract.methods.retrieveInventoryMAFront().call({ from: accounts[config.id] });
              if (drugs) {
                setInventoryData(drugs);
          }          
          }
      } catch (error) {
          console.error('Error in retrieving inventory:', error);
      }
  };

    const getAllRequests = async () => {
      try {
        if (web3 && accounts && contract) {
            const Reqs = await contract.methods.getAllRequestsMA().call({ from: accounts[config.id] });
            Reqs.forEach((request, index) => {
              console.log(`Request ID: ${request.requestID}`);
              console.log(`Request ID: ${request.drugID}`);
              console.log('----------');
            });
            console.log(Reqs);
            if (Reqs) {
              setIncomingRequests(Reqs);
            }
        }
      } catch (error) {
        console.error('Error in retrieving requests:', error);
    }
  };

  const getAllWD = async () => {
    try {
        if (web3 && accounts && contract) {
            const WDs = await contract.methods.getAllWD().call();
            if (WDs) {
              console.log("Wholesale IDs:");
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
  retrieveInventory()
  getAllRequests();
  getAllWD();
}, [web3, accounts, contract]);


  return (
    <div>
      <h2>Manufacturer | User Id: {config.id}</h2>

      <div>
        <h3>Incoming Requests</h3>
        <ul>
          {incomingRequests.map(request => (
            <li key={request.id}>
              {request.amount} units of {request.drug} - 
              <button onClick={() => handleConfirmRequest(request.id)}>Confirm Request</button>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
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
      </div>


    </div>
  );
};

export default Manufacture;
