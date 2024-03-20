import React, { useState, useEffect } from 'react';
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

  const [orderForm, setOrderForm] = useState({
    amount: 0,
    drugName: '',
    drug: 0,
    price: 0,
    manufacturerId: 0
  });

  const [shipForm, setShipForm] = useState({
    amount: 0,
    drugName: '',
    drug: 0,
    price: 0,
    pharmacyId: 0,
    requestId: 0,
  });

  const [selectedDrug, setSelectedDrug] = useState(null);
  const [selectedDrugShip, setSelectedDrugShip] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Function to handle adding bulk order
  const handleAddBulkOrder = async (e) => {
    e.preventDefault();
    // Handle order submission logic here
    console.log("Order Submitted:", orderForm);
    //let uint256Id = web3.eth.abi.encodeParameter('uint256',id)
    //sendDrugRequestPH(uint drugID, uint quant, uint WDaccNum, uint dcCode)
    let dID = web3.eth.abi.encodeParameter('uint256', orderForm.drug);
    let amount = web3.eth.abi.encodeParameter('uint256', orderForm.amount);
    let maid = web3.eth.abi.encodeParameter('uint256', orderForm.manufacturerId);
    let price = web3.eth.abi.encodeParameter('uint256', orderForm.price);
    let msgvalue = price * (amount + 1);
    await contract.methods.sendDrugRequestWD(dID, amount, maid).send({ from: accounts[config.id], value: msgvalue});
    
  };

  const handleShipDrug = async (e) => {
    e.preventDefault();
    // Handle order submission logic here
    console.log("Order Submitted:", shipForm);
    //let uint256Id = web3.eth.abi.encodeParameter('uint256',id)
    //function shipDrugWD(uint drugID, uint quant, uint PHaccNum, uint reqID) public onlyWD() 
    let dID = web3.eth.abi.encodeParameter('uint256', shipForm.drug);
    let amount = web3.eth.abi.encodeParameter('uint256', shipForm.amount);
    let phid = web3.eth.abi.encodeParameter('uint256', shipForm.pharmacyId);
    let reqID = web3.eth.abi.encodeParameter('uint256', shipForm.requestId);
    await contract.methods.shipDrugWD(dID, amount, phid, reqID).call({ from: accounts[config.id]});
  };

    // Function to handle drug selection
  const handleDrugSelect = (e) => {
    const selectedDrugName = e.target.value;
    const selectedDrugData = inventory.find(drug => drug.name === selectedDrugName);
    console.log(selectedDrugData);
    setSelectedDrug(selectedDrugData);
    setOrderForm({ ...orderForm, drug: selectedDrugData.id, drugName: selectedDrugData.name, price: selectedDrugData.price }); // Reset discount code and price when drug changes
  };

  const handleShipDrugSelect = (e) => {
    const selectedDrugName = e.target.value;
    const selectedDrugData = inventory.find(drug => drug.name === selectedDrugName);
    console.log(selectedDrugData);
    setSelectedDrugShip(selectedDrugData);
    setShipForm({ ...shipForm, drug: selectedDrugData.id, drugName: selectedDrugData.name, price: selectedDrugData.price }); // Reset discount code and price when drug changes
  };
  
  const handleRequestSelect = (e) => {
    const selectedRequestID = e.target.value;
    console.log(e.target.value);
    const selectedRequest = requestsPH.find(request => String(request.requestID) === selectedRequestID);
    if (selectedRequest) {
      setSelectedRequest(selectedRequest);
      setShipForm({ ...shipForm, requestId: selectedRequest.requestID });
    } else {
      // Handle the case where no request is found, e.g., reset to default values
      console.log("No request found with ID:", selectedRequestID);
      setSelectedRequest(null); // or appropriate default value
      setShipForm({ ...shipForm, requestId: '' }); // Reset or handle as appropriate
    }
  };

  const showRequestsMA = async () => {
      try {
        if (web3 && accounts && contract) {
            const Reqs = await contract.methods.getAllRequestsWDMA().call({ from: accounts[config.id] });
            Reqs.forEach((request, index) => {
              console.log(`Request ID: ${request.requestID}`);
              console.log(`Request ID: ${request.drugID}`);
              console.log('----------');
            });
            if (Reqs) {
              setrequestsMA(Reqs);
            }
        }
      } catch (error) {
        console.error('Error in retrieving inventory:', error);
      }
  };

  const showRequestsPH = async () => {
    try {
      if (web3 && accounts && contract) {
          const Reqs = await contract.methods.getAllRequestsWDPH().call({ from: accounts[config.id] });
          if (Reqs) {
            Reqs.forEach((request, index) => {
              console.log(`Request ID: ${request.requestID}`);
              console.log(`Request ID: ${request.drugID}`);
              console.log('----------');
            });
          
            setrequestsPH(Reqs);
          }
      }
    } catch (error) {
      console.error('Error in retrieving inventory:', error);
    }
};

const refreshInventory = async () => {
  try {
      if (web3 && accounts && contract) {
          const newdrugs = await contract.methods.retrieveInventoryWDFront().call({ from: accounts[config.id] });
          if (newdrugs) {
            setInventoryData(newdrugs);
            // Log each drug's details
              newdrugs.forEach((drug, index) => {
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
      }
  } catch (error) {
      console.error('Error in retrieving inventory:', error);
  }
};

  useEffect(() => {
    const retrieveInventory = async () => {
      try {
          if (web3 && accounts && contract) {
              const drugs = await contract.methods.retrieveInventoryWDFront().call({ from: accounts[config.id] });
              if (drugs) {
                setInventoryData(drugs);
          }          
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
  getAllDiscounts();
  getAllRequestsPH();
  getAllRequestsMA();
}, [web3, accounts, contract]);

  return (
    <div>
      <h2>Wholesale | User Id: {config.id}</h2>
      <button onClick={refreshInventory}> Refresh Inventory </button>      
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

      <button onClick={showRequestsPH}> Show Request from Pharmacy </button>
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

      <button onClick={showRequestsMA}> Show Request to Manufacturer </button>
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

      <h3>Ship Drug Form</h3>
      <form onSubmit={handleShipDrug}>
        <label>
          Amount:
          <input
            type="number"
            value={shipForm.amount}
            onChange={e => setShipForm({ ...shipForm, amount: parseInt(e.target.value) })}
          />
        </label>
        <br />
        <label>
          Drug:
          <select
            value={shipForm.drugName}
            onChange={handleShipDrugSelect}
          >
            <option value="">Select Drug</option>
            {inventory && inventory.map(drug => (
              <option key={drug.id} value={drug.name}>
                {drug.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Drug Request:
          <select
            value={String(shipForm.requestId)}
            onChange={handleRequestSelect}
          >
            <option value="">Select Request</option>
            {requestsPH && requestsPH.map(request => (
              <option key={String(request.requestID)} value={String(request.requestID)}>
                {String(request.requestID)}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br />
        <label>
          Price:
          <input
            type="string"
            value={String(shipForm.price)}
            readOnly // Price is now read-only
          />
        </label>
        <br />
        <label>
          Pharmacy ID:
          <input
            type="number"
            value={shipForm.pharmacyId}
            onChange={e => setShipForm({ ...shipForm, pharmacyId: parseInt(e.target.value, 10) })}
          />
        </label>
        <br />
        <button type="submit">Order</button>
      </form>


      <h3>Bulk Order Form</h3>
      <form onSubmit={handleAddBulkOrder}>
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
          Manufcaturer ID:
          <input
            type="number"
            value={orderForm.manufacturerId}
            onChange={e => setOrderForm({ ...orderForm, manufacturerId: parseInt(e.target.value, 10) })}
          />
        </label>
        <br />
        <button type="submit">Order</button>
      </form>
      

    </div>
  );
};

export default Wholesale;
