require("@nomicfoundation/hardhat-toolbox");
<<<<<<< HEAD
require("@nomicfoundation/hardhat-ethers");     
=======
require("@nomicfoundation/hardhat-ethers");
>>>>>>> 7d99f64 (hardhat)

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
paths: {
    artifacts: "./src/artifacts",
  },
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 2d074f6 (hardhat)
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
<<<<<<< HEAD
},
=======
=======
=======
>>>>>>> 7d99f64 (hardhat)
networks: {
                localhost: {
                        url: "http://ec2-54-219-16-72.us-west-1.compute.amazonaws.com:8545",
                        chainID: 1337
                },
                hardhat: {
                        chainID: 1337
                }
},
<<<<<<< HEAD
namedAccounts: { 
=======
namedAccounts: {
>>>>>>> 7d99f64 (hardhat)
    deployer: {
        default: 0,
        amount: "10000000000000000000000"
        },
<<<<<<< HEAD
>>>>>>> 002b6ca (hardhat)
=======
>>>>>>> 7d99f64 (hardhat)
},

>>>>>>> 2d074f6 (hardhat)
solidity: {
        version: "0.8.24",
        settings: {
                optimizer: {
                        enabled: true,
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 2d074f6 (hardhat)
                        runs: 100000,
			 details: { yul: false },
        }
},
},

<<<<<<< HEAD
};
=======
};

=======
                        runs: 1000,
        }
=======
                        runs: 1000,
			}
>>>>>>> 7d99f64 (hardhat)
},
},
allowUnlimitedContractSize: true,
};
<<<<<<< HEAD
>>>>>>> 002b6ca (hardhat)
=======
>>>>>>> 7d99f64 (hardhat)
>>>>>>> 2d074f6 (hardhat)
