import React, { useState } from 'react';
import config from '../config/config.json'

//TODO, add current contract drugs/discounts on them

const Manufacture = () => {
  // Fake incoming requests
  const [incomingRequests, setIncomingRequests] = useState([
    { id: 1, drug: 'Drug A', amount: 100 },
    { id: 2, drug: 'Drug B', amount: 150 },
    { id: 3, drug: 'Drug C', amount: 200 }
  ]);

  // Fake list of contract requests
  const [contractRequests, setContractRequests] = useState([
    { id: 1, drug: 'Drug A', discount: 5, amount: 20000 }
  ]);

  // State for discount code form inputs
  const [discountCodeForm, setDiscountCodeForm] = useState({
    drug: '',
    discount: '',
    expirationDate: ''
  });

  // Function to handle confirmation of incoming requests
  const handleConfirmRequest = (id) => {
    // Logic to confirm the request, here we will remove the request from the list
    setIncomingRequests(incomingRequests.filter(request => request.id !== id));
  };

  // Function to handle approval of contract requests
  const handleApproveContract = (id) => {
    // Logic to approve the contract, here we will remove the request from the list
    setContractRequests(contractRequests.filter(request => request.id !== id));
  };

  // Function to handle sending out discount codes
  const handleSendDiscountCode = (e) => {
    e.preventDefault();
    // Logic to send discount code, here you can implement your desired action
    console.log("Discount Code Sent:", discountCodeForm);
    // Reset the form fields after sending the discount code
    setDiscountCodeForm({ drug: '', discount: '', expirationDate: '' });
  };

  return (
    <div>
      <h2>Manufacture | User Id: {config.id}</h2>

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
        <h3>Contract Requests</h3>
        <ul>
          {contractRequests.map(request => (
            <li key={request.id}>
              Contract for {request.drug} - Discount: {request.discount} - Paid Amount: ${request.amount} - 
              <button onClick={() => handleApproveContract(request.id)}>Approve Contract</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Send Discount Code</h3>
        <form onSubmit={handleSendDiscountCode}>
          <label>
            Drug:
            <input
              type="text"
              value={discountCodeForm.drug}
              onChange={e => setDiscountCodeForm({ ...discountCodeForm, drug: e.target.value })}
            />
          </label>
          <br />
          <label>
            Discount (%):
            <input
              type="number"
              value={discountCodeForm.discount}
              onChange={e => setDiscountCodeForm({ ...discountCodeForm, discount: e.target.value })}
            />
          </label>
          <br />
          <label>
            Expiration Date:
            <input
              type="date"
              value={discountCodeForm.expirationDate}
              onChange={e => setDiscountCodeForm({ ...discountCodeForm, expirationDate: e.target.value })}
            />
          </label>
          <br />
          <button type="submit">Send Discount Code</button>
        </form>
      </div>
    </div>
  );
};

export default Manufacture;
