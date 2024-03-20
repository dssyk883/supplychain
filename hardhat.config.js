require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");     

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
paths: {
    artifacts: "./src/artifacts",
  },
<<<<<<< HEAD
allowUnlimitedContractSize: true,
networks: {
                localhost: {
                        url: "http://ec2-54-219-16-72.us-west-1.compute.amazonaws.com:8545",
                        chainID: 1337,
			allowUnlimitedContractSize: true,
			gas: 12000000,
			blockGasLimit: 0x1fffffffffffff,
		        ignoreUnknownTxType: true,
                },
                hardhat: {
                        chainID: 1337,
			allowUnlimitedContractSize: true,
			gas: 12000000,
		        blockGasLimit: 0x1fffffffffffff,
	                ignoreUnknownTxType: true,
                }
},
namedAccounts: { 
	deployer: {
		default: 0,
		amount: "10000000000000000000000"
		},
=======
networks: {
                localhost: {
                        url: "http://ec2-54-219-16-72.us-west-1.compute.amazonaws.com:8545",
                        chainID: 1337
                },
                hardhat: {
                        chainID: 1337
                }
},
namedAccounts: { 
    deployer: {
        default: 0,
        amount: "10000000000000000000000"
        },
>>>>>>> 002b6ca (hardhat)
},

solidity: {
        version: "0.8.24",
        settings: {
                optimizer: {
                        enabled: true,
<<<<<<< HEAD
                        runs: 100000,
			 details: { yul: false },
        }
},
},

};

=======
                        runs: 1000,
        }
},
},
allowUnlimitedContractSize: true,
};
>>>>>>> 002b6ca (hardhat)
