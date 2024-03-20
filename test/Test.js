const { expect } = require("chai");

describe("Test Supply Chain contract", function () {
    let contract;
    let owner;

    beforeEach(async function () {
        // Create the smart contract object to test from
        [PH_addr, WD_addr, IN_addr, MA_addr] = await ethers.getSigners();
        const TestContract = await ethers.getContractFactory("SupplyChain");
        contract = await TestContract.deploy();
        await contract.addDrug('A', 5);
await contract.addDrug('B', 10);
await contract.addDrug('C', 15);
await contract.addDrug('D', 20);
await contract.addDrug('E', 25);
await contract.addDrug('F', 30);
await contract.addDrug('G', 35);
await contract.addDrug('H', 40);
await contract.addDrug('I', 45);
await contract.addDrug('J', 50);
await contract.addDrug('K', 55);
await contract.addDrug('L', 60);
await contract.addDrug('M', 65);
await contract.addDrug('N', 70);
await contract.addDrug('O', 75);
await contract.addDrug('P', 80);
await contract.addDrug('Q', 85);
await contract.addDrug('R', 90);
await contract.addDrug('S', 95);
await contract.addDrug('T', 100);
// await contract.addDrug('U', 105);
// await contract.addDrug('V', 110);
// await contract.addDrug('W', 115);
// await contract.addDrug('X', 120);
// await contract.addDrug('Y', 125);
// await contract.addDrug('Z', 130);
// await contract.addDrug('AA', 135);
// await contract.addDrug('AB', 140);
// await contract.addDrug('AC', 145);
// await contract.addDrug('AD', 150);
// await contract.addDrug('AE', 155);
// await contract.addDrug('AF', 160);
// await contract.addDrug('AG', 165);
// await contract.addDrug('AH', 170);
// await contract.addDrug('AI', 175);
// await contract.addDrug('AJ', 180);
// await contract.addDrug('AK', 185);
// await contract.addDrug('AL', 190);
// await contract.addDrug('AM', 195);
// await contract.addDrug('AN', 200);
// await contract.addDrug('AO', 205);
// await contract.addDrug('AP', 210);
// await contract.addDrug('AQ', 215);
// await contract.addDrug('AR', 220);
// await contract.addDrug('AS', 225);
// await contract.addDrug('AT', 230);
// await contract.addDrug('AU', 235);
// await contract.addDrug('AV', 240);
// await contract.addDrug('AW', 245);
// await contract.addDrug('AX', 250);
// await contract.addDrug('AY', 255);
// await contract.addDrug('AZ', 260);
// await contract.addDrug('BA', 265);
// await contract.addDrug('BB', 270);
// await contract.addDrug('BC', 275);
// await contract.addDrug('BD', 280);
// await contract.addDrug('BE', 285);
// await contract.addDrug('BF', 290);
// await contract.addDrug('BG', 295);
// await contract.addDrug('BH', 300);
// await contract.addDrug('BI', 305);
// await contract.addDrug('BJ', 310);
// await contract.addDrug('BK', 315);
// await contract.addDrug('BL', 320);
// await contract.addDrug('BM', 325);
// await contract.addDrug('BN', 330);
// await contract.addDrug('BO', 335);
// await contract.addDrug('BP', 340);
// await contract.addDrug('BQ', 345);
// await contract.addDrug('BR', 350);
// await contract.addDrug('BS', 355);
// await contract.addDrug('BT', 360);
// await contract.addDrug('BU', 365);
// await contract.addDrug('BV', 370);
// await contract.addDrug('BW', 375);
// await contract.addDrug('BX', 380);
// await contract.addDrug('BY', 385);
// await contract.addDrug('BZ', 390);
// await contract.addDrug('CA', 395);
// await contract.addDrug('CB', 400);
// await contract.addDrug('CC', 405);
// await contract.addDrug('CD', 410);
// await contract.addDrug('CE', 415);
// await contract.addDrug('CF', 420);
// await contract.addDrug('CG', 425);
// await contract.addDrug('CH', 430);
// await contract.addDrug('CI', 435);
// await contract.addDrug('CJ', 440);
// await contract.addDrug('CK', 445);
// await contract.addDrug('CL', 450);
// await contract.addDrug('CM', 455);
// await contract.addDrug('CN', 460);
// await contract.addDrug('CO', 465);
// await contract.addDrug('CP', 470);
// await contract.addDrug('CQ', 475);
// await contract.addDrug('CR', 480);
// await contract.addDrug('CS', 485);
// await contract.addDrug('CT', 490);
// await contract.addDrug('CU', 495);
// await contract.addDrug('CV', 500);



    });

    // it("Add Drug should emit DrugAdded event", async function () {
    //     // Add Drug
    //     await expect(contract.addDrug('DrugA', 10))
    //     .to.emit(contract, "DrugAdded")
    //     .withArgs(0, 'DrugA', 0, 10);
    // });

    it("PH: Add Drug should emit DrugAddedPH event", async function () {
        // Add Drug in PH
        // await contract.connect(PH_addr).retrieveInventoryPH();
        console.time('a');
        // await expect(contract.connect(PH_addr).addDrugInPH(20, 10, WD_addr, MA_addr))
        // .to.emit(contract, "DrugAddedPH")
        // .withArgs(20, 10, PH_addr);
        await expect(contract.connect(PH_addr).addDrugInPH(20, 10, WD_addr, MA_addr))
        .to.emit(contract, "DrugAddedPH")
        .withArgs(20, 10, PH_addr);
        // console.log("After adding 10 units of Drug 0")
        console.timeEnd('a');
        // await contract.connect(PH_addr).retrieveInventoryPH();
    });

    // it("Non-PH: Add Drug should fail", async function () {
    //     // Add Drug in PH (not permitted)
    //     console.time('a');
    //     await expect(contract.connect(WD_addr).addDrugInPH(20, 10, WD_addr, MA_addr))
    //     .to.be.revertedWith("Not a Pharmacy!");
    //     console.timeEnd('a');
    // });

    it("WD: Add Drug should emit DrugAddedWD event", async function () {
        // Add Drug in WD
        // await contract.connect(WD_addr).retrieveInventoryWD();
        console.time('a');
        await expect(contract.connect(WD_addr).addDrugInWD(20, 10, MA_addr))
        .to.emit(contract, "DrugAddedWD")
        .withArgs(20, 10, WD_addr);
        // console.log("After adding 10 units of Drug 0")
        console.timeEnd('a');
        // await contract.connect(WD_addr).retrieveInventoryWD();
    });

    // it("Non-WD: Add Drug should fail", async function () {
    //     // Add Drug in WD (not permitted)
    //     console.time('a');
    //     await expect(contract.connect(MA_addr).addDrugInWD(20, 10, MA_addr))
    //     .to.be.revertedWith("Not a Wholesale Distributor!");
    //     console.timeEnd('a');
    // });

    // it("IN: Add Discount code should emit DrugAddedWD event", async function () {
    //     // Add Discount code
    //     await expect(contract.connect(IN_addr).addDiscountInIN(1, 5, 0, 2))
    //     .to.emit(contract, "DiscountCodeAddedIN")
    //     .withArgs(1, 0, IN_addr);
    // });

    // it("Supply chain: PH request shipment, WD ships drug, PH confirms shipment", async function () {
    //     // Add Discount code
    //     // await expect(contract.connect(IN_addr).addDiscountInIN(1, 25, 0, 2))
    //     // .to.emit(contract, "DiscountCodeAddedIN")
    //     // .withArgs(1, 0, IN_addr);

    //     // PH Requests Drug Shipment
    //     await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, 1, 101, {value: ethers.parseEther("270")}))
    //     .to.emit(contract, "SendRequestByPH")
    //     .withArgs(0, 10, 270, WD_addr);

    //     // Ship Drug from WD
    //     await expect(contract.connect(WD_addr).addDrugInWD(0, 10, MA_addr))  
    //     .to.emit(contract, "DrugAddedWD")
    //     .withArgs(0, 10, WD_addr);

    //     await contract.connect(PH_addr).retrieveInventoryPH();
    //     await contract.connect(WD_addr).retrieveInventoryWD();

    //     const reqID =  await contract.connect(WD_addr).getRequestIDWD();
    //     await expect(contract.connect(WD_addr).shipDrugWD(0, 10, 0, reqID))
    //     .to.emit(contract, "ShipDrugByWD")
    //     .withArgs(0, 10, 0);

    //     const reqIDPH =  await contract.connect(PH_addr).getRequestIDPH();
    //     // PH confirms Drug Shipment
    //     await expect(contract.connect(PH_addr).confirmDrugShipmentPH(reqIDPH, 10, 1))
    //     .to.emit(contract, "ReqConfirmedByPH")
    //     .withArgs(reqIDPH, PH_addr, WD_addr);

    //     await contract.connect(PH_addr).retrieveInventoryPH();
    //     await contract.connect(WD_addr).retrieveInventoryWD();
    // });

    // it("PH: Insufficient funds from Pharmacy to request shipment", async function () {
    //     // Add Discount code

    //     // Request Drug Shipment from PH
    //     await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 10, 1, 101, {value: ethers.parseEther("10")}))
    //     .to.be.revertedWith("Insufficient fund.");
    // });

    it("WD: Requested Drug is not valid", async function () {
        // Add Discount code
        // Request Drug Shipment
        console.time('a');
        await expect(contract.connect(PH_addr).sendDrugRequestPH(1, 10, 1, 202, {value: ethers.parseEther("190")}))
        .to.emit(contract, "SendRequestByPH")
        .withArgs(1, 10, 190, WD_addr);
        console.timeEnd('a');
        // await expect(contract.connect(WD_addr).addDrugInWD(0, 10, MA_addr))
        // .to.emit(contract, "DrugAddedWD")
        // .withArgs(0, 10, WD_addr);

        // await contract.connect(PH_addr).retrieveInventoryPH();
        // await contract.connect(WD_addr).retrieveInventoryWD();

        // const reqID =  await contract.connect(WD_addr).getRequestIDWD();
        // console.log(reqID)
        // const id = await contract.connect(WD_addr).findRequestInPHout(reqID);
        // console.log(id);
        // await expect(contract.connect(WD_addr).shipDrugWD(1, 10, 0, reqID))
        // .to.be.revertedWith("There's no drug with the drug id");

        // await contract.connect(PH_addr).retrieveInventoryPH();
        // await contract.connect(WD_addr).retrieveInventoryWD();
    });

    // it("WD: Insufficient drugs in WD to ship drugs", async function () {
    //     // Add Discount code
    //     await contract.addDrug('DrugA', 10);
    //     await expect(contract.connect(IN_addr).addDiscountInIN(1, 25, 0, 2))
    //     .to.emit(contract, "DiscountCodeAddedIN")
    //     .withArgs(1, 0, IN_addr);

    //     // Request Drug Shipment
    //     // await expect(contract.connect(PH_addr).addDrugInPH(0,0));
    //     await expect(contract.connect(PH_addr).sendDrugRequestPH(0, 40, 1, 101, {value: ethers.parseEther("1080")}))
    //     .to.emit(contract, "SendRequestByPH")
    //     .withArgs(0, 40, 1080, WD_addr);

    //     await expect(contract.connect(WD_addr).addDrugInWD(0, 10, MA_addr))
    //     .to.emit(contract, "DrugAddedWD")
    //     .withArgs(0, 10, WD_addr);

    //     // await contract.connect(PH_addr).retrieveInventoryPH();
    //     // await contract.connect(WD_addr).retrieveInventoryWD();

    //     const reqID =  await contract.connect(WD_addr).getRequestIDWD();
    //     await expect(contract.connect(WD_addr).shipDrugWD(0, 40, 0, reqID))
    //     .to.be.revertedWith("Not enough drug quantity in the inventory.");

    //     // await contract.connect(PH_addr).retrieveInventoryPH();
    //     // await contract.connect(WD_addr).retrieveInventoryWD();
    // });

    it("Supply Chain: WD requests Drug, MA ships Drug, WD confirms shipment", async function () {
        console.time('a');
        // WD requests Drug
        // await contract.connect(MA_addr).retrieveInventoryMA();
        // await contract.connect(WD_addr).retrieveInventoryWD();

        await expect(contract.connect(WD_addr).sendDrugRequestWD(0, 20, 3, {value: ethers.parseEther("600")}))
        .to.emit(contract, "SendRequestByWD")
        .withArgs(0, 20, 600, MA_addr);
        console.timeEnd('a');

        // console.log("Requesting 20 units of Drug 0")

        // const reqID =  await contract.connect(MA_addr).getRequestIDMA();
        // await expect(contract.connect(MA_addr).shipDrugMA(0, 20, 1, reqID))
        // .to.emit(contract, "ShipDrugByMA")
        // .withArgs(0, 20, 1);

        // await expect(contract.connect(WD_addr).confirmDrugShipmentWD(reqID, 20, 3))
        // .to.emit(contract, "ReqConfirmedByWD")
        // .withArgs(reqID, WD_addr, MA_addr);

        // await contract.connect(MA_addr).retrieveInventoryMA();
        // await contract.connect(WD_addr).retrieveInventoryWD();
    })

    // it("WD: Insufficient funds from WD to request shipment from MA", async function () {
    //     // WD requests Drug
    //     await expect(contract.connect(WD_addr).sendDrugRequestWD(0, 20, 3, {value: ethers.parseEther("100")}))
    //     .to.be.revertedWith("Insufficient fund.");
    // })

    // it("MA: Request for Invalid Drug is not shipped", async function () {
    //     // WD requests Drug
    //     // await contract.connect(MA_addr).retrieveInventoryMA();
    //     // await contract.connect(WD_addr).retrieveInventoryWD();

    //     await expect(contract.connect(WD_addr).sendDrugRequestWD(4, 20, 3, {value: ethers.parseEther("200")}))
    //     .to.emit(contract, "SendRequestByWD")
    //     .withArgs(4, 20, 200, MA_addr);

    //     console.log("Requesting 20 units of Drug 4")

    //     const reqID =  await contract.connect(MA_addr).getRequestIDMA();
    //     await expect(contract.connect(MA_addr).shipDrugMA(4, 20, 1, reqID))
    //     .to.be.revertedWith("There's no drug with the drug id");

    //     // await contract.connect(MA_addr).retrieveInventoryMA();
    //     // await contract.connect(WD_addr).retrieveInventoryWD();
    // })

    it("MA: Not enough drug in Inventory", async function () {
//         // WD requests Drug
//         // await contract.connect(MA_addr).retrieveInventoryMA();
//         // await contract.connect(WD_addr).retrieveInventoryWD();
        await expect(contract.connect(WD_addr).sendDrugRequestWD(0, 250, 3, {value: ethers.parseEther("7500")}))
        .to.emit(contract, "SendRequestByWD")
        .withArgs(0, 250, 7500, MA_addr);

//         console.log("Requesting 50 units of Drug 0")

//         const reqID =  await contract.connect(MA_addr).getRequestIDMA();
//         await expect(contract.connect(MA_addr).shipDrugMA(0, 250, 1, reqID))
//         .to.be.revertedWith("Not enough drug quantity in the inventory.");
//         // await contract.connect(MA_addr).retrieveInventoryMA();
//         // await contract.connect(WD_addr).retrieveInventoryWD();
    })
});