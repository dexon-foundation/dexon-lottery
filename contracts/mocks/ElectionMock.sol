
pragma solidity ^0.5.0;

import "../Election.sol";

contract ElectionMock is Election {
    function refundDeposit() public {
        _refundDeposit();
    }

    function announceElectedPerson() public {
        _announceElectedPerson();
    }
}