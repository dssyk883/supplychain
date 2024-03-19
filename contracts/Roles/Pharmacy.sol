pragma solidity ^0.8.0;

import "./Roles.sol";
import "hardhat/console.sol";

contract Pharmacy {
    using Roles for Roles.Role;

    Roles.Role private _pharmacies;    
    uint phcounter;

    event PHAdded(address indexed account, uint accNum);
    event PHRemoved(address indexed account);

    constructor ()  {
        phcounter = 0;
    }
    
    function addThisAsPH(address account) public {
        _addPH(account, phcounter*5);
        phcounter++;
    }

    function _addPH(address account, uint accNum) internal {
        _pharmacies.add(account, accNum);

        emit PHAdded(account, accNum);
    }

    function _removePH(address account) internal {
        _pharmacies.remove(account);
        emit PHRemoved(account);
    }

    modifier onlyPH(){
        require(isPH(msg.sender), "Not a Pharmacy!");
        _;
    }

    function isPH(address account) public view returns (bool) {
        return _pharmacies.has(account);
    }

    function getPHaddr(uint accNumber) public view returns (address) {
        return _pharmacies.returnAddress(accNumber);
    }

    function showAllPH() public view {
        uint ind = 0;
        for(uint i = 0; i < phcounter; i++){
            ind = i * 5;
            console.log("Pharmacy acc# ", i, ": ", _pharmacies.returnAddress(ind));
        }
    }

}