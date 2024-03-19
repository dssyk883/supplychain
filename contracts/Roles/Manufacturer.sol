pragma solidity ^0.8.0;

import "./Roles.sol";
import "hardhat/console.sol";

contract Manufacturer {
    using Roles for Roles.Role;
    uint macounter;

    Roles.Role private manufacturers;

    event MAAdded(address indexed account);
    event MARemoved(address indexed account);

    constructor () {
        macounter = 0;
    }

    function addThisAsMA(address account) public {
        _addMA(account, macounter*5 + 3);
        macounter++;
    }

    function _addMA(address account, uint accNum) internal {
        manufacturers.add(account, accNum);
        emit MAAdded(account);
    }

    function _removeMA(address account) internal {
        manufacturers.remove(account);
        emit MARemoved(account);
    }

    modifier onlyMA(){
        require(isMA(msg.sender));
        _;
    }

    function isMA(address account) public view returns (bool) {
        return manufacturers.has(account);
    }

    function getMAaddr(uint accNumber) public view returns (address) {
        return manufacturers.returnAddress(accNumber);
    }

    function showAllMA() public view {
        uint ind = 0;
        for(uint i = 0; i < macounter; i++){
            ind = i * 5 + 3;
            console.log("Manufacturer acc# ", i, ": ", manufacturers.returnAddress(ind));
        }
    }
}