pragma solidity ^0.4.25;

contract Hello {
    uint256 public value;
    function update() public {
        value = rand;
    }

    function get() view public returns (uint256) {
        return value;
    }
}
