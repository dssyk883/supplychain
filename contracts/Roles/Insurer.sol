pragma solidity ^0.8.0;

import "./Roles.sol";
import "hardhat/console.sol";

contract Insurer {
    using Roles for Roles.Role;

    Roles.Role private insurers;
    uint incounter;

    event INAdded(address indexed account);
    event INRemoved(address indexed account);

    constructor () {       
        incounter = 0;
    }

    function addThisAsIN(address account) public {
        _addIN(account, incounter*5 + 2);
        incounter++;
    }

    function _addIN(address account, uint accNum) internal {
        insurers.add(account, accNum);
        emit INAdded(account);
    }

    function _removeIN(address account) internal {
        insurers.remove(account);
        emit INRemoved(account);
    }

    modifier onlyIN(){
        require(isIN(msg.sender), "Not an Insurer!");
        _;
    }

    function isIN(address account) public view returns (bool) {
        return insurers.has(account);
    }

    function getINaddr(uint accNumber) public view returns (address) {
        return insurers.returnAddress(accNumber);
    }

    function showAllIN() public view {
        uint ind = 0;
        for(uint i = 0; i < incounter; i++){
            ind = i * 5 + 2;
            console.log("Insurer acc# ", i, ": ", insurers.returnAddress(ind));
        }
    }
}