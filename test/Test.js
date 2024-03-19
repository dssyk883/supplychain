const { expect } = require("chai");

describe("Test Supply Chain contract", function () {
    let contract;
    let owner;

    beforeEach(async function () {
        // Create the smart contract object to test from
        [PH_addr, WD_addr, IN_addr, MA_addr] = await ethers.getSigners();
        const TestContract = await ethers.getContractFactory("SupplyChain");
        contract = await TestContract.deploy();

    });

    // it("Add Drug should emit DrugAdded event", async function () {
    //     // Add Drug
    //     await expect(contract.addDrug('DrugA', 10))
    //     .to.emit(contract, "DrugAdded")
    //     .withArgs(0, 'DrugA', 0, 10);
    // });

    it("PH: Add Drug should emit DrugAddedPH event", async function () {
        // Add Drug in PH
        await contract.connect(PH_addr).retrieveInventoryPH();
        await expect(contract.connect(PH_addr).addDrugInPH(0, 10, WD_addr, MA_addr))
        .to.emit(contract, "DrugAddedPH")
        .withArgs(0, 10, PH_addr);
        console.log("After adding 10 units of Drug 0")
        await contract.connect(PH_addr).retrieveInventoryPH();
    });

    it("Non-PH: Add Drug should fail", async function () {
        // Add Drug in PH (not permitted)
        await expect(contract.connect(WD_addr).addDrugInPH(0, 10, WD_addr, MA_addr))
        .to.be.revertedWith("Not a Pharmacy!");
    });

    it("WD: Add Drug should emit DrugAddedWD event", async function () {
        // Add Drug in WD
        await contract.connect(WD_addr).retrieveInventoryWD();
        await expect(contract.connect(WD_addr).addDrugInWD(0, 10, MA_addr))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 10, WD_addr);
        console.log("After adding 10 units of Drug 0")
        await contract.connect(WD_addr).retrieveInventoryWD();
    });

    it("Non-WD: Add Drug should fail", async function () {
        // Add Drug in WD (not permitted)
        await expect(contract.connect(MA_addr).addDrugInWD(0, 10, MA_addr))
        .to.be.revertedWith("Not a Wholesale Distributor!");
    });

    it("IN: Add Discount code should emit DrugAddedWD event", async function () {
        // Add Discount code
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);
    });

    it("Non-IN: Add Discount code should fail", async function () {
        // Add Discount code (not permitted)
        await expect(contract.connect(PH_addr).addDiscountInIN(1, 5, 0, 2))
        .to.be.revertedWith("Not an Insurer!");
    });

    it("Supply chain: PH request shipment, WD ships drug, PH confirms shipment", async function () {
        // Add Discount code
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 25, 0, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // PH Requests Drug Shipment
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, 1, 1, {value: ethers.parseEther("50")}))
        .to.emit(contract, "SendRequestByPH")
        .withArgs(0, 10, 50, WD_addr);

        // Ship Drug from WD
        await expect(contract.connect(WD_addr).addDrugInWD(0, 10, MA_addr))  
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 10, WD_addr);

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();

        const reqID =  await contract.connect(WD_addr).getRequestIDWD();
        await expect(contract.connect(WD_addr).shipDrugWD(0, 10, 0, reqID))
        .to.emit(contract, "ShipDrugByWD")
        .withArgs(0, 10, 0);

        const reqIDPH =  await contract.connect(PH_addr).getRequestIDPH();
        // PH confirms Drug Shipment
        await expect(contract.connect(PH_addr).confirmDrugShipmentPH(reqIDPH, 10, 1))
        .to.emit(contract, "ReqConfirmedByPH")
        .withArgs(reqIDPH, PH_addr, WD_addr);

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();
    });

    it("PH: Insufficient funds from Pharmacy to request shipment", async function () {
        // Add Discount code
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 25, 0, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // Request Drug Shipment from PH
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, 1, 1, {value: ethers.parseEther("10")}))
        .to.be.revertedWith("Insufficient fund.");
    });

    it("WD: Requested Drug is not valid", async function () {
        // Add Discount code
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 15, 1, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 1, IN_addr);

        // Request Drug Shipment
        await expect(contract.connect(PH_addr).sendDrugRequestPH(1, 10, 1, 1, {value: ethers.parseEther("50")}))
        .to.emit(contract, "SendRequestByPH")
        .withArgs(1, 10, 50, WD_addr);

        await expect(contract.connect(WD_addr).addDrugInWD(0, 10, MA_addr))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 10, WD_addr);

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();

        const reqID =  await contract.connect(WD_addr).getRequestIDWD();
        console.log(reqID)
        const id = await contract.connect(WD_addr).findRequestInPHout(reqID);
        console.log(id);
        await expect(contract.connect(WD_addr).shipDrugWD(1, 10, 0, reqID))
        .to.be.revertedWith("There's no drug with the drug id");

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();
    });

    it("WD: Insufficient drugs in WD to ship drugs", async function () {
        // Add Discount code
        await contract.addDrug('DrugA', 10);
        await expect(contract.connect(IN_addr).addDiscountInIN(1, 25, 0, 2))
        .to.emit(contract, "DiscountCodeAddedIN")
        .withArgs(1, 0, IN_addr);

        // Request Drug Shipment
        // await expect(contract.connect(PH_addr).addDrugInPH(0,0));
        await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 40, 1, 1, {value: ethers.parseEther("200")}))
        .to.emit(contract, "SendRequestByPH")
        .withArgs(0, 40, 200, WD_addr);

        await expect(contract.connect(WD_addr).addDrugInWD(0, 10, MA_addr))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(0, 10, WD_addr);

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();

        const reqID =  await contract.connect(WD_addr).getRequestIDWD();
        await expect(contract.connect(WD_addr).shipDrugWD(0, 40, 0, reqID))
        .to.be.revertedWith("Not enough drug quantity in the inventory.");

        await contract.connect(PH_addr).retrieveInventoryPH();
        await contract.connect(WD_addr).retrieveInventoryWD();
    });
});