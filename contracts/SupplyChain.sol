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
    mapping (address => DrugRequest[]) wholesaleRequests;
    mapping (address => DrugRequest[]) manufacturerRequests;

    mapping (uint => Discount) discountCodes;

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
        address sender; //can be PH or WD
        address receiver; //can be WD or MA
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
    event DiscountCodeAddedIN(uint discountCode, uint drugID, address ins);

    event SendRequestByPH(uint drugID, uint q, uint totalPrice, address toWD);
    event ShipDrugByWD(uint drugID, uint quant, uint PHaccNum);
    event ReqConfirmedByPH(uint reqID, address phar, address wd);

    constructor() {
        owner = msg.sender;
        drugCount = 0;
        drugRequestCount = 0;
        dcCount = 0;
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

    function addDrugInPH(uint dID, uint quant) public onlyPH() {
        uint find = findDrugInPH(dID);
        if(find == pharmacyInventory[msg.sender].length) {
            pharmacyInventory[msg.sender].push(Drug(dID, drugs[dID].name, drugs[dID].price, quant, msg.sender, address(0), address(0), msg.sender, false));
        }
        else pharmacyInventory[msg.sender][find].quantity += quant;
        emit DrugAddedPH(dID, quant, msg.sender);
    }

    function addDrugInWD(uint dID, uint quant) public onlyWD() {
        uint find = findDrugInWD(dID);
        if(find == wholesaleInventory[msg.sender].length) {
            wholesaleInventory[msg.sender].push(Drug(dID, drugs[dID].name, drugs[dID].price, quant, msg.sender, address(0), address(0), msg.sender, false));
        }
        else wholesaleInventory[msg.sender][find].quantity += quant;
        emit DrugAddedWD(dID, quant, msg.sender);
    }

    function addDiscountInIN(uint dcCode, uint discountprice, uint drugID, uint INaccNum) public onlyIN() {
        address ins = super.getINaddr(INaccNum);
        discountCodes[dcCode] = Discount(dcCode, ins, drugID, discountprice, block.timestamp);
        emit DiscountCodeAddedIN(dcCode, drugID, msg.sender);
    }

    function sendDrugRequestPH(uint drugID, uint quant, uint WDaccNum, uint dcCode)  public payable 
        onlyPH()   {
        uint totalPrice = (drugs[drugID].price - discountCodes[dcCode].discountPrice) * quant;
        address payable toWDaddr = payable(super.getWDaddr(WDaccNum));
        require(totalPrice <= msg.value, "Insufficient fund.");

        uint reqID = drugID + quant + dcCode + WDaccNum + block.timestamp%1000;
        pharmacyRequests[msg.sender].push(DrugRequest(reqID, drugID, quant, totalPrice, msg.sender, toWDaddr, false));
        wholesaleRequests[toWDaddr].push(DrugRequest(reqID, drugID, quant, totalPrice, msg.sender, toWDaddr, false));
        toWDaddr.transfer(totalPrice);
        emit SendRequestByPH(drugID, quant, totalPrice, toWDaddr);
    }

    function shipDrugWD(uint drugID, uint quant, uint PHaccNum) public onlyWD() {
        address toPHaddr = super.getPHaddr(PHaccNum);
        uint findDrugWD = findDrugInWD(drugID);

        require(findDrugWD != wholesaleInventory[msg.sender].length, "There's no drug with the drug id");
        require(wholesaleInventory[msg.sender][findDrugWD].quantity >= quant, "Not enough drug quantity in the inventory.");
        
        wholesaleInventory[msg.sender][findDrugWD].quantity -= quant;
        if(wholesaleInventory[msg.sender][findDrugWD].quantity == 0) wholesaleInventory[msg.sender][drugID].isSoldOut = true;
        emit ShipDrugByWD(drugID, quant, PHaccNum);
    }

    function confirmDrugShipment(uint reqID, uint quant, uint WDaccNum) public onlyPH() {
        uint findreqPH = findRequestInPH(reqID);
        pharmacyRequests[msg.sender][findreqPH].confirmed = true;
        uint drugID = pharmacyRequests[msg.sender][findreqPH].drugID;
        pharmacyInventory[msg.sender][drugID].quantity += quant;
        address toWDaddr = super.getWDaddr(WDaccNum);
        emit ReqConfirmedByPH(reqID, msg.sender, toWDaddr);
    }

    function sendDrugRequestWD(uint drugID, uint quant, uint MAaccNum) public onlyWD() payable {
        uint totalPrice = drugs[drugID].price * quant;
        address payable toMAaddr = payable(super.getMAaddr(MAaccNum));
        require(totalPrice <= msg.value, "Insufficient fund.");
        uint reqID = drugID + quant + MAaccNum + block.timestamp%1000;
        pharmacyRequests[msg.sender].push(DrugRequest(reqID, drugID, quant, totalPrice, msg.sender, toMAaddr, false));
        manufacturerRequests[toMAaddr].push(DrugRequest(reqID, drugID, quant, totalPrice, msg.sender, toMAaddr, false));
        toMAaddr.transfer(totalPrice);
        emit SendRequestByPH(drugID, quant, totalPrice, toMAaddr);
    }

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

    function findRequestInPH(uint reqID) public view onlyPH() returns (uint) {
        uint len = pharmacyRequests[msg.sender].length;
        uint ind = len-1;
        for(uint i = 0; i < len; i++) {
            if (pharmacyRequests[msg.sender][i].requestID == reqID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function findRequestInWD(uint reqID) public view returns (uint) {
        uint len = wholesaleRequests[msg.sender].length;
        uint ind = len-1;
        for(uint i = 0; i < len; i++) {
            if (wholesaleRequests[msg.sender][i].requestID == reqID) ind = i;
        }
        return ind;
        // if index == len, it's not found
    }

    function retrieveInventoryPH() public view onlyPH() {
        uint i = 0;
        Drug[] memory thisInventory = pharmacyInventory[msg.sender];
        while(i < thisInventory.length) {
            console.log(thisInventory[i].id, ": quant - " , thisInventory[i].quantity);
            i++;
        }
    }

    function retrieveInventoryPHFront() public view onlyPH() returns (Drug[] memory) {
        return pharmacyInventory[msg.sender];
    }

    function retrieveInventoryWD() public view onlyWD() {
        uint i = 0;
        Drug[] memory thisInventory = wholesaleInventory[msg.sender];
        while(i < thisInventory.length) {
            console.log(thisInventory[i].id, ": quant - " , thisInventory[i].quantity);
            i++;
        }
    }

    function showAllEntities() public view {
        super.showAllPH();
        super.showAllWD();
        super.showAllMA();
        super.showAllIN();
    }

}