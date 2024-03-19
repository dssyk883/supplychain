import { useEffect, useState } from 'react';
import Web3 from 'web3';
import SupplyChainAbi from '../contractsData/SupplyChain.json';
import SupplyChainAddress from '../contractsData/SupplyChain-address.json';


// Custom hook for initializing Web3 and contract
export function useContractInitialization() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [contract, setcontract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!initialized) {
          const web3Instance = new Web3(new Web3.providers.HttpProvider("http://ec2-18-144-28-49.us-west-1.compute.amazonaws.com:8545"));
          const accounts = await web3Instance.eth.getAccounts();
          const contract = new web3Instance.eth.Contract(SupplyChainAbi.abi, SupplyChainAddress.address);
          console.log("This is called")
          setWeb3(web3Instance);
          setAccounts(accounts);
          setcontract(contract);
          setInitialized(true);
 	        console.log("Account [0]: ", accounts[0]);
          // const drugs = await contract.methods.retrieveInventoryPHFront().call({ from: accounts[0] });
          // if (drugs) {
          //   // Log each drug's details
          //   drugs.forEach((drug, index) => {
          //     console.log(`Drug ${index + 1}:`);
          //     console.log(`ID: ${drug.id}`);
          //     console.log(`Name: ${drug.name}`);
          //     console.log(`Price: ${drug.price}`);
          //     console.log(`Quantity: ${drug.quantity}`);
          //     console.log(`Current Owner: ${drug.currentOwner}`);
          //     console.log(`Manufacturer: ${drug.manufacturer}`);
          //     console.log(`Wholesale: ${drug.wholesale}`);
          //     console.log(`Pharmacy: ${drug.pharmacy}`);
          //     console.log(`Is Sold Out: ${drug.isSoldOut}`);
          //     console.log('----------');
          //   });
          // }
           
        }
      } catch (error) {
        console.error('Error initializing DApp:', error);
      }
    };

    init(); // Call the initialization function once when the component mounts
  }, [initialized]);
  
  return { web3, accounts, contract };
}

