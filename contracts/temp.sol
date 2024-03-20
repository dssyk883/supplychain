function retrieveInventoryPH() public view onlyPH() {
        uint i = 0;
        Drug[] memory thisInventory = pharmacyInventory[msg.sender];
        while(i < thisInventory.length) {
            console.log(thisInventory[i].id, ": quant - " , thisInventory[i].quantity);
            i++;
        }
    }

    function retrieveInventoryWD() public view onlyWD() {
        uint i = 0;
        Drug[] memory thisInventory = wholesaleInventory[msg.sender];
        while(i < thisInventory.length) {
            console.log(thisInventory[i].id, ": quant - " , thisInventory[i].quantity);
            i++;
        }
    }

    function retrieveInventoryMA() public view onlyMA() {
        uint i = 0;
        Drug[] memory thisInventory = manufacturerInventory[msg.sender];
        while(i < thisInventory.length) {
            console.log(thisInventory[i].id, ": quant - " , thisInventory[i].quantity);
            i++;
        }
    }

    function retrieveRequestsPH() public view onlyPH() {
        uint i = 0;
        DrugRequest[] memory thisRequest = pharmacyRequests[msg.sender];
        while(i < thisRequest.length) {
            console.log(thisRequest[i].requestID, ": DrugID - " , thisRequest[i].drugID);
            console.log("Confirmed: ", thisRequest[i].confirmed);
            console.log(": sender: ", thisRequest[i].sender, ", receiver: ", thisRequest[i].receiver);
            console.log("-------------------------------");
            i++;
        }
    }

    function retrieveRequestsWDPH() public view onlyWD() {
        uint i = 0;
        DrugRequest[] memory thisRequest = wholesaleRequestsFromPH[msg.sender];
        while(i < thisRequest.length) {
            console.log(thisRequest[i].requestID, ": DrugID - " , thisRequest[i].drugID);
            console.log("Confirmed: ", thisRequest[i].confirmed);
            console.log(": sender: ", thisRequest[i].sender, ", receiver: ", thisRequest[i].receiver);
            console.log("-------------------------------");
            i++;
        }
    }

    function retrieveRequestsWDMA() public view onlyWD() {
        uint i = 0;
        DrugRequest[] memory thisRequest = wholesaleRequestsToMA[msg.sender];
        while(i < thisRequest.length) {
            console.log(thisRequest[i].requestID, ": DrugID - " , thisRequest[i].drugID);
            console.log("Confirmed: ", thisRequest[i].confirmed);
            console.log(": sender: ", thisRequest[i].sender, ", receiver: ", thisRequest[i].receiver);
            console.log("-------------------------------");
            i++;
        }
    }

    function retrieveRequestsMA() public view onlyMA() {
        uint i = 0;
        DrugRequest[] memory thisRequest = manufacturerRequests[msg.sender];
        while(i < thisRequest.length) {
            console.log(thisRequest[i].requestID, ": DrugID - " , thisRequest[i].drugID);
            console.log("Confirmed: ", thisRequest[i].confirmed);
            console.log(": sender: ", thisRequest[i].sender, ", receiver: ", thisRequest[i].receiver);
            console.log("-------------------------------");
            i++;
        }
    }