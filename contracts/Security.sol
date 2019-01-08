pragma solidity ^0.5.0;

/**
 * @title This is a smart contract that helps to expose some potential issue
*/
contract FloatingNumberIssue {
    uint one = 1;
    uint two = 2;
    uint three = 3;
    uint zero = 0;
    
    function surpriseYou() view public returns(uint) {
        return one / three;
    }

    function areYouSure() view public returns(bool) {
        return (one / three) > zero;
    }

}
