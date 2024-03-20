import React, { useState, useEffect } from 'react';
import config from '../config/config.json'
import { useContractInitialization } from './Contract';

const Insurance = () => {
  const { web3, accounts, contract } = useContractInitialization();
  const [discounts, setdiscounts] = useState([]);
  // State for contract form inputs
  const [contractForm, setContractForm] = useState({
    drug: 0,
    discountCode: 0,
    discount: 0
  });

  // Fake list of received discount codes with expiration dates
  const [receivedDiscountCodes, setReceivedDiscountCodes] = useState([]);

  // Function to handle sending a contract to manufacture
  const handleSendContract = async (e) => {


    e.preventDefault();
    // Handle order submission logic here
    console.log("Order Submitted:", contractForm);
    //let uint256Id = web3.eth.abi.encodeParameter('uint256',id)
    //sendDrugRequestPH(uint drugID, uint quant, uint WDaccNum, uint dcCode)
    let dID = web3.eth.abi.encodeParameter('uint256', contractForm.drug);
    let dcCode = web3.eth.abi.encodeParameter('uint256', contractForm.discountCode);
    let discountAmount = web3.eth.abi.encodeParameter('uint256', contractForm.discount);
    await contract.methods.sendDrugRequestPH(dcCode, discountAmount, dID, config.id).send({ from: accounts[config.id]});

    // Logic to send contract, here you can implement your desired action
    console.log("Contract Sent:", contractForm);
    // Reset the form fields after sending the contract
    setContractForm({ drug: '', discountCode: '', discount: '' });
  };

  // Function to handle sending discount codes to pharmacies
  const handleSendDiscountCodes = () => {
    // Logic to send discount codes to pharmacies, here you can implement your desired action
    console.log("Discount Codes Sent:", receivedDiscountCodes);
    // Clear the received discount codes after sending
    setReceivedDiscountCodes([]);
  };

  useEffect(() => {

    const getAllDiscounts = async () => {
    try {
        if (web3 && accounts && contract) {
            const DCs = await contract.methods.getAllDiscounts().call();
            if (DCs) {
              const filteredDiscounts = DCs.filter(discount => discount.insurer === accounts[config.id]);       
              setdiscounts(filteredDiscounts);
            }
        }
    } catch (error) {
        console.error('Error in retrieving discount codes:', error);
    }
  };

  // retrieveInventory();
  // getAllWD();
  getAllDiscounts();
}, [web3, accounts, contract]);


  return (
    <div>
      <h2>Insurance | User Id: {config.id}</h2>

      <div>
        <h3>Send Contract to Set up Discount Code</h3>
        <form onSubmit={handleSendContract}>
          <label>
            Drug:
            <input
              type="text"
              value={contractForm.drug}
              onChange={e => setContractForm({ ...contractForm, drug: e.target.value })}
            />
          </label>
          <br />
          <label>
            Discount (Number):
            <input
              type="number"
              value={contractForm.discountCode}
              onChange={e => setContractForm({ ...contractForm, discountCode: e.target.value })}
            />
          </label>
          <label>
            Discount Amount:
            <input
              type="number"
              value={contractForm.discount}
              onChange={e => setContractForm({ ...contractForm, discount: e.target.value })}
            />
          </label>
          <button type="submit">Send Contract</button>
        </form>
      </div>

      <div>
      <h3>Discounts</h3>
        <ul>
          {/* Render drug information here */}
          {discounts && discounts.map((discount, index) => (
          <li key={index}>
            <p>Discount code: {String(discount.discountCode)}</p>
            <p>Drug ID: {String(discount.drugID)}</p>
            <p>Discount price: {String(discount.discountPrice)}</p>
          </li>
          ))}
        </ul>
        
      </div>
    </div>
  );
};

export default Insurance;
