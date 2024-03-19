pragma solidity ^0.8.0;

import "./Roles.sol";
import "hardhat/console.sol";

contract Wholesale {
    using Roles for Roles.Role;
  
    Roles.Role private wholesales;
    uint wdcounter;

    event WDAdded(address indexed account, uint accNum);
    event WDRemoved(address indexed account);

    constructor () {
        wdcounter = 0;
    }

    function addThisAsWD(address account) public {
        _addWD(account, wdcounter*5 + 1);
        wdcounter++;
    }

    function _addWD(address account, uint accNum) internal {
        wholesales.add(account, accNum);
        emit WDAdded(account, accNum);
    }

    function _removeWD(address account) internal {
        wholesales.remove(account);
        emit WDRemoved(account);
    }

    modifier onlyWD(){
        require(isWD(msg.sender), "Not a Wholesale Distributor!");
        _;
    }

    function isWD(address account) public view returns (bool) {
        return wholesales.has(account);
    }

    function getWDaddr(uint accNumber) public view returns (address) {
        return wholesales.returnAddress(accNumber);
    }

    function showAllWD() public view {
        uint ind = 0;
        for(uint i = 0; i < wdcounter; i++){
            ind = i * 5 + 1;
            console.log("Wholesale acc# ", i, ": ", wholesales.returnAddress(ind));
        }
    }
}