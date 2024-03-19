import { useEffect, useState } from 'react';
import Web3 from 'web3';
import SupplyChainAbi from '../contractsData/SupplyChain.json';
import SupplyChainAddress from '../contractsData/SupplyChain-address.json';


// Custom hook for initializing Web3 and contract
export function useContractInitialization() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!initialized) {
          const web3Instance = new Web3(new Web3.providers.HttpProvider("http://ec2-18-144-28-49.us-west-1.compute.amazonaws.com:8545"));
          const accounts = await web3Instance.eth.getAccounts();
          const contractInstance = new web3Instance.eth.Contract(SupplyChainAbi.abi, SupplyChainAddress);
          console.log("This is called")
          setWeb3(web3Instance);
          setAccounts(accounts);
          setContractInstance(contractInstance);
          setInitialized(true);
          const arr = await contractInstance.methods.retrieveInventoryPHFront().call({ from: accounts[0] });
          console.log(arr[0].id, ": ", arr[0].name);
        }
      } catch (error) {
        console.error('Error initializing DApp:', error);
      }
    };

    init(); // Call the initialization function once when the component mounts
  }, [initialized]);
  
  return { web3, accounts, contractInstance };
}

