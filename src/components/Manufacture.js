import React, { useState, useEffect } from 'react';
import config from '../config/config.json'
import { useContractInitialization } from './Contract';

//TODO, add current contract drugs/discounts on them

const Manufacture = () => {
  const { web3, accounts, contract } = useContractInitialization();

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [inventory, setInventoryData] = useState([]);
  


  // Function to handle confirmation of incoming requests
  const handleConfirmRequest = async (id) => {
    // Logic to confirm the request, here we will remove the request from the list

    let req = incomingRequests.find(request => String(request.requestID) === id); 
    try {
      //function shipDrugMA(uint drugID, uint quant, address toWDaddr, uint reqID) public onlyMA() {
      console.time('shipDrug');
      await contract.methods.shipDrugMA(req.drugID, req.quant, req.sender, req.requestID).send({ from: accounts[config.id] });
      console.timeEnd('shipDrug');
    } catch (error){
      console.error('Error in Shipping Drugs:', error);
    }
    refreshInventory();
    // setIncomingRequests(incomingRequests.filter(request => String(request.requestID) !== id));
    showRequestsMA();
    
  };

  const showRequestsMA = async () => {
    // try {
      if (web3 && accounts && contract) {
        console.log("Getting..")
        try{
          const AllReqs = await contract.methods.getAllRequestsMA().call({ from: accounts[config.id] });
          // Reqs.forEach((request, index) => {
          //   console.log(`Request ID: ${request.requestID}`);
          //   console.log(`Request ID: ${request.drugID}`);
          //   console.log('----------');
          // });
          if (AllReqs) {
            let Reqs = AllReqs.filter(req => req.confirmed === false);      
            setIncomingRequests(Reqs);
          }
        } catch (error){
          console.error('Error in Getting Pending Requests: ', error);
        }
          
      }
    // } catch (error) {
      // console.error('Error in retrieving inventory:', error);
    // }
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
            // const Reqs = await contract.methods.getAllRequestsMA().call({ from: accounts[config.id] });
            
            const AllReqs = await contract.methods.getAllRequestsMA().call({ from: accounts[config.id] });
            if (AllReqs) {
              let Reqs = AllReqs.filter(req => req.confirmed === false);      
              setIncomingRequests(Reqs);
            }
        }
      } catch (error) {
        console.error('Error in retrieving requests:', error);
    }
  };

  
  retrieveInventory()
  getAllRequests();
}, [web3, accounts, contract]);


  return (
    <div>
      <h2>Manufacturer | User Id: {config.id}</h2>

      <div>
        <h3>Incoming Requests</h3>
        <button onClick={showRequestsMA}> Show Incoming Requests </button>
        <ul>
          {incomingRequests.map(request => (
            <li key={String(request.requestID)}>
              {String(request.quant)} units of {String(request.drugID)} - 
              <button onClick={() => handleConfirmRequest(String(request.requestID))}>Confirm Request</button>
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
