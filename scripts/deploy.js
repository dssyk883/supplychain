

const hre = require("hardhat")

async function main() {
    const SupplyChain  = await hre.ethers.getContractFactory("SupplyChain");
    // deploy contracts
    const supplychain  = await SupplyChain.deploy();
    await supplychain.waitForDeployment();
    console.log("Supply Chain contract deployed to: ", await supplychain.getAddress());
    const supplyChainAddress  = await supplychain.getAddress();
    saveFrontendFiles(supplyChainAddress  , "SupplyChain");
}

function saveFrontendFiles(contractAddress, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }
  
  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contractAddress }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
