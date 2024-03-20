pragma solidity ^0.8.0;

import "./Roles/Insurer.sol";
import "./Roles/Manufacturer.sol";
import "./Roles/Pharmacy.sol";
import "./Roles/Wholesale.sol";

import "hardhat/console.sol";

// between PH & WD, WD & MA 
contract SupplyChain is Pharmacy, Manufacturer, Wholesale, Insurer {

    address owner;

    // Drug ID => Drug amount
    mapping (uint => Drug) drugs;

    mapping (address => DrugRequest[]) pharmacyRequests;
    mapping (address => DrugRequest[]) wholesaleRequestsFromPH;
    mapping (address => DrugRequest[]) wholesaleRequestsToMA;
    mapping (address => DrugRequest[]) manufacturerRequests;

    // Discount code to discount contract 
    Discount[] public discountCodes;

    // entity => (Drug array) so that we can retrieve each inventory 
    mapping(address => Drug[]) pharmacyInventory;
    mapping(address => Drug[]) wholesaleInventory;
    mapping(address => Drug[]) manufacturerInventory;

    // account # to addresses

    // add this account address to Pharmacies when addPH is executed 
    // 
    uint drugCount;
    uint drugRequestCount;
    uint dcCount;

    struct Drug {
        uint id;
        string name;
        uint price;
        uint quantity;
        address currentOwner;
        address manufacturer;
        address wholesale;
        address pharmacy;
        bool isSoldOut;
    }

    struct DrugRequest {
        uint requestID;
        uint drugID;
        uint quant;
        uint totalPrice;
        uint dcCode;
        address sender; //can be PH or WD
        address receiver; //can be WD or MA
        address manufacturer;
        bool confirmed;
    }

    struct Discount{
        uint discountCode;
        address insurer;
        uint drugID;
        uint discountPrice;
        uint dateFinalized;
    }   

    
    event DrugAdded(uint id, string name, uint quantity, uint price);
    
    event DrugAddedPH(uint drugID, uint quantity, address phAddr);
    event DrugAddedWD(uint drugID, uint quantity, address wdAddr);
    event DrugAddedMA(uint drugID, uint quantity, address maAddr);
    event DiscountCodeAddedIN(uint discountCode, uint drugID, address ins);

    event SendRequestByPH(uint drugID, uint q, uint totalPrice, address toWD);
    event ShipDrugByWD(uint drugID, uint quant, uint PHaccNum);
    event SendRequestByWD(uint drugID, uint quant, uint totalPrice, address toMAaddr);
    event ShipDrugByMA(uint drugID, uint quant, uint WDaccNum);
    event ReqConfirmedByPH(uint reqID, address phar, address wd);
    event ReqConfirmedByWD(uint reqID, address wd, address ma);

    constructor() {
        owner = msg.sender;
        drugCount = 0;
        drugRequestCount = 0;
        dcCount = 0;
        addInitialDrugs();
        addPHaccounts();
        // function addDrugInPH(uint dID, uint quant, address WD, address MA) public onlyPH() {
        // test 
        addDrugInPH(0, 10, address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8), address(0x90F79bf6EB2c4f870365E785982E1f101E93b906));
        addDrugInPH(1, 5, address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8), address(0x90F79bf6EB2c4f870365E785982E1f101E93b906));
        addDrugInPH(1, 5, address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8), address(0x90F79bf6EB2c4f870365E785982E1f101E93b906));
        addInitialDrugsWD();
        addInitialDrugsMA();
        addInitialDiscounts();
        console.log("Contructor called");
    }

    function addPHaccounts() public {
        //accnum = 0
        // you should be able to see an event emitted: PHAdded(address, accNum)
        super.addThisAsPH(address(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266));
        //accnum = 1
        super.addThisAsWD(address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8));
        //accnum = 2
        super.addThisAsIN(address(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC));
        //accnum = 3
        super.addThisAsMA(address(0x90F79bf6EB2c4f870365E785982E1f101E93b906));
    }
    
    //Adding drug information about drug id, name, and price
    function addDrug(string memory name, uint price) public {
        uint dID = drugCount;
        drugs[drugCount++] = Drug(dID, name, price, 0, address(0), address(0), address(0), address(0), false);
        emit DrugAdded(dID, name, 0, price);
    }

    function addInitialDrugs() public {
        addDrug("Drug A", 30);
        addDrug("Drug B", 20);
        addDrug("Drug C", 60);
        addDrug("Drug D", 90);
        addDrug("Drug E", 10);
    }

    function addInitialDrugsMA() public {
        address ma = super.getMAaddr(3);
        manufacturerInventory[ma].push(Drug(0, "Drug A", 30, 246, ma, ma, address(0), address(0), false));
        emit DrugAddedMA(0, 246, ma);
        manufacturerInventory[ma].push(Drug(1, "Drug B", 20, 692, ma, ma, address(0), address(0), false));
        emit DrugAddedMA(1, 692, ma);
        manufacturerInventory[ma].push(Drug(2, "Drug C", 60, 804, ma, ma, address(0), address(0), false));
        emit DrugAddedMA(2, 804, ma);
        manufacturerInventory[ma].push(Drug(3, "Drug D", 90, 779, ma, ma, address(0), address(0), false));
        emit DrugAddedMA(3, 779, ma);
    }

    function addInitialDrugsWD() public {
        address wd = super.getWDaddr(1);
        address ma = super.getMAaddr(3);
        wholesaleInventory[wd].push(Drug(0, "Drug A", 30, 102, wd, ma, wd, address(0), false));
        emit DrugAddedWD(0, 102, wd);
        wholesaleInventory[wd].push(Drug(1, "Drug B", 20, 60, wd, ma, wd, address(0), false));
        emit DrugAddedWD(1, 60, wd);
        wholesaleInventory[wd].push(Drug(2, "Drug C", 60, 20, wd, ma, wd, address(0), false));
        emit DrugAddedWD(2, 20, wd);
        wholesaleInventory[wd].push(Drug(3, "Drug D", 90, 15, wd, ma, wd, address(0), false));
        emit DrugAddedWD(3, 15, wd);
    }

    function addInitialDiscounts() public {
        addDiscountInIN(101, 3, 0, 2);
        addDiscountInIN(202, 1, 1, 2);
        addDiscountInIN(303, 6, 2, 2);
        addDiscountInIN(404, 7, 3, 2);
    }

    function addDrugInPH(uint dID, uint quant, address WD, address MA) public onlyPH() {
        uint find = findDrugInPH(dID);
        if(find == pharmacyInventory[msg.sender].length) {
            pharmacyInventory[msg.sender].push(Drug(dID, drugs[dID].name, drugs[dID].price, quant, msg.sender, MA, WD, msg.sender, false));
        }
        else pharmacyInventory[msg.sender][find].quantity += quant;
        emit DrugAddedPH(dID, quant, msg.sender);
    }

    function addDrugInWD(uint dID, uint quant, address MA) public onlyWD() {
        uint find = findDrugInWD(dID);
        if(find == wholesaleInventory[msg.sender].length) {
            wholesaleInventory[msg.sender].push(Drug(dID, drugs[dID].name, drugs[dID].price, quant, msg.sender, MA, msg.sender, address(0), false));
        }
        else wholesaleInventory[msg.sender][find].quantity += quant;
        emit DrugAddedWD(dID, quant, msg.sender);
    }

    //onlyIN
    function addDiscountInIN(uint dcCode, uint discountprice, uint drugID, uint INaccNum) public  {
        address ins = super.getINaddr(INaccNum);
        discountCodes.push(Discount(dcCode, ins, drugID, discountprice, block.timestamp));
        emit DiscountCodeAddedIN(dcCode, drugID, msg.sender);
    }
    //----------------------------------------------

    function sendDrugRequestPH(uint drugID, uint quant, uint WDaccNum, uint dcCode)  public payable 
        onlyPH()   {
        uint drugIDinDiscount = discountCodes[findDCcode(dcCode)].drugID;
        require(drugIDinDiscount == drugID, "This discount cannot be applied to this drug.");
        console.log(msg.value);
        uint totalPrice = (drugs[drugID].price - discountCodes[findDCcode(dcCode)].discountPrice) * quant;
        address payable toWDaddr = payable(super.getWDaddr(WDaccNum));
        require(totalPrice <= msg.value, "Insufficient fund.");
        
        uint reqID = drugID + quant + dcCode + WDaccNum + block.timestamp%1000;
        pharmacyRequests[msg.sender].push(DrugRequest(reqID, drugID, quant, totalPrice, dcCode, msg.sender, toWDaddr, address(0),false));
        wholesaleRequestsFromPH[toWDaddr].push(DrugRequest(reqID, drugID, quant, totalPrice, dcCode, msg.sender, toWDaddr, address(0), false));
        toWDaddr.transfer(totalPrice);
        emit SendRequestByPH(drugID, quant, totalPrice, toWDaddr);
    }

    function shipDrugWD(uint drugID, uint quant, uint PHaccNum, uint reqID) public onlyWD() {
        console.log(drugID);
        console.log(quant);
        console.log(PHaccNum);
        console.log(reqID);
        address toPHaddr = super.getPHaddr(PHaccNum);
        uint findDrugWD = findDrugInWD(drugID);
        uint findreqPH = findRequestInPH(reqID);

        uint oldQ = wholesaleInventory[msg.sender][findDrugWD].quantity;
        console.log(oldQ);

        require(findDrugWD != wholesaleInventory[msg.sender].length, "There's no drug with the drug id");
        require(wholesaleInventory[msg.sender][findDrugWD].quantity >= quant, "Not enough drug quantity in the inventory.");
        wholesaleInventory[msg.sender][findDrugWD].quantity -= quant;
        if(wholesaleInventory[msg.sender][findDrugWD].quantity == 0) wholesaleInventory[msg.sender][drugID].isSoldOut = true;
        uint findreqWD = findRequestInWDPH(reqID);
        wholesaleRequestsFromPH[msg.sender][findreqWD].confirmed = true;
        pharmacyRequests[toPHaddr][findreqPH].manufacturer = wholesaleInventory[msg.sender][findDrugWD].manufacturer;

        uint newQ = wholesaleInventory[msg.sender][0].quantity;
        console.log(newQ);
        emit ShipDrugByWD(drugID, quant, PHaccNum);
    }

    function confirmDrugShipmentPH(uint reqID, uint quant, uint WDaccNum) public onlyPH() {
        uint findreqPH = findRequestInPH(reqID);
        pharmacyRequests[msg.sender][findreqPH].confirmed = true;
        uint drugID = pharmacyRequests[msg.sender][findreqPH].drugID;
        address toWDaddr = super.getWDaddr(WDaccNum);
        address MA = pharmacyRequests[msg.sender][findreqPH].manufacturer;
        addDrugInPH(drugID, quant, toWDaddr, MA);
        emit ReqConfirmedByPH(reqID, msg.sender, toWDaddr);
    }

    function sendDrugRequestWD(uint drugID, uint quant, uint MAaccNum) public onlyWD() payable {
        uint totalPrice = drugs[drugID].price * quant;
        address payable toMAaddr = payable(super.getMAaddr(MAaccNum));
        require(totalPrice <= msg.value, "Insufficient fund.");
        uint reqID = drugID + quant + MAaccNum + block.timestamp%1000;
        wholesaleRequestsToMA[msg.sender].push(DrugRequest(reqID, drugID, quant, totalPrice, 0, msg.sender, toMAaddr, toMAaddr, false));
        manufacturerRequests[toMAaddr].push(DrugRequest(reqID, drugID, quant, totalPrice, 0, msg.sender, toMAaddr, toMAaddr, false));
        toMAaddr.transfer(totalPrice);
        emit SendRequestByWD(drugID, quant, totalPrice, toMAaddr);
    }

    function shipDrugMA(uint drugID, uint quant, uint WDaccNum, uint reqID) public onlyMA() {
        address toWDaddr = super.getWDaddr(WDaccNum);
        uint findDrugMA = findDrugInMA(drugID);

        require(findDrugMA != manufacturerInventory[msg.sender].length, "There's no drug with the drug id");
        require(manufacturerInventory[msg.sender][findDrugMA].quantity >= quant, "Not enough drug quantity in the inventory.");
        
        manufacturerInventory[msg.sender][findDrugMA].quantity -= quant;
        if(manufacturerInventory[msg.sender][findDrugMA].quantity == 0) wholesaleInventory[msg.sender][drugID].isSoldOut = true;
        uint findreqMA = findRequestInMA(reqID);
        manufacturerRequests[msg.sender][findreqMA].confirmed = true;
        emit ShipDrugByMA(drugID, quant, WDaccNum);
    }

    function confirmDrugShipmentWD(uint reqID, uint quant, uint MAaccNum) public onlyWD() {
        uint findreqMA = findRequestInWDMA(reqID);
        wholesaleRequestsToMA[msg.sender][findreqMA].confirmed = true;
        uint drugID = wholesaleRequestsToMA[msg.sender][findreqMA].drugID;
        address toMAaddr = super.getMAaddr(MAaccNum);
        addDrugInWD(drugID, quant, toMAaddr);
        emit ReqConfirmedByWD(reqID, msg.sender, toMAaddr);
    }

    // function rebateRequestWD(uint reqID, uint MAaccNum) public onlyWD() payable {
    //     uint findreqWDMA = findRequestInWDMA(reqID);
    //     DrugRequest memory dr = wholesaleRequestsToMA[msg.sender][findreqMA];
    //     uint quant = dr.quant;
    //     uint dcCode = dr.dcCode;
    //     Discount memory dc = discountCodes[findDCcode(dcCode)];
    //     uint rebated = dc.discountPrice * quant;
    //     require(rebated <= msg.value, "Insufficient fund!");
    //     address payable toMA
    // }

    function findDrugInPH(uint dID) public view onlyPH() returns (uint) {
        uint len = pharmacyInventory[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (pharmacyInventory[msg.sender][i].id == dID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function findDrugInWD(uint dID) public view onlyWD() returns (uint)  {
        uint len = wholesaleInventory[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (wholesaleInventory[msg.sender][i].id == dID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function findDrugInMA(uint dID) public view onlyMA() returns (uint)  {
        uint len = manufacturerInventory[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (manufacturerInventory[msg.sender][i].id == dID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function findRequestInPHout(uint reqID) external view returns (uint) {
        uint len = pharmacyRequests[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (pharmacyRequests[msg.sender][i].requestID == reqID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function findRequestInPH(uint reqID) public returns (uint) {
        uint len = pharmacyRequests[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (pharmacyRequests[msg.sender][i].requestID == reqID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }


    function findRequestInWDPH(uint reqID) public view returns (uint) {
        uint len = wholesaleRequestsFromPH[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (wholesaleRequestsFromPH[msg.sender][i].requestID == reqID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function findRequestInWDMA(uint reqID) public view returns (uint) {
        uint len = wholesaleRequestsToMA[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (wholesaleRequestsToMA[msg.sender][i].requestID == reqID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function findRequestInMA(uint reqID) public view returns (uint) {
        uint len = manufacturerRequests[msg.sender].length;
        uint ind = len;
        for(uint i = 0; i < len; i++) {
            if (manufacturerRequests[msg.sender][i].requestID == reqID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function retrieveInventoryPHFront() public view onlyPH() returns (Drug[] memory) {
        return pharmacyInventory[msg.sender];
    }

    function retrieveInventoryWDFront() public view onlyWD() returns (Drug[] memory) {
        uint q = wholesaleInventory[msg.sender][0].quantity;
        console.log("retrieve inventory wd front");
        console.log(q);
        return wholesaleInventory[msg.sender];
    }

    function retrieveInventoryMAFront() public view onlyWD() returns (Drug[] memory) {
        return wholesaleInventory[msg.sender];
    }

    function getAllWD() public view returns (uint[] memory) {
        return super.showAllWD();
    }

    function getAllPH() public view returns (uint[] memory) {
        return super.showAllPH();
    }

    function getAllMA() public view returns (uint[] memory) {
        return super.showAllMA();
    }

    function getAllIN() public view returns (uint[] memory) {
        return super.showAllIN();
    }

    function getAllDiscounts() public view returns (Discount[] memory) {
        return discountCodes;
    }

    function getAllRequestsPH() public view returns (DrugRequest[] memory) {
        return pharmacyRequests[msg.sender];
    }

    function getAllRequestsWDPH() public view returns (DrugRequest[] memory) {
        return wholesaleRequestsFromPH[msg.sender];
    }

    function getAllRequestsWDMA() public view returns (DrugRequest[] memory) {
        return wholesaleRequestsToMA[msg.sender];
    }

    function findDCcode(uint dc) public view returns (uint) {
        uint ind = discountCodes.length;
        for(uint i = 0; i < discountCodes.length; i++){
            if(discountCodes[i].discountCode == dc) ind = i;
        }
        return ind;
    }

    function getRequestIDWD() external view returns (uint) {
        DrugRequest[] memory thisRequest = wholesaleRequestsFromPH[msg.sender];
        return thisRequest[0].requestID;
    }

    function getRequestIDPH() external view returns (uint) {
        DrugRequest[] memory thisRequest = pharmacyRequests[msg.sender];
        return thisRequest[0].requestID;
    }

    function getRequestIDMA() external view returns (uint) {
        DrugRequest[] memory thisRequest = manufacturerRequests[msg.sender];
        return thisRequest[0].requestID;
    }

    function getRequestIDWDMA() external view returns (uint) {
        DrugRequest[] memory thisRequest = wholesaleRequestsToMA[msg.sender];
        return thisRequest[0].requestID;
    }

}