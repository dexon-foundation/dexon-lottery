pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Lottery is Ownable {
    mapping (uint256 => uint256) public numberOfTime;
    uint256[] public revealedTimes;
    uint256 public revealedTimesCount = 0;
    uint256 public lastRevealedTime;

    event NumberRevealed(uint256 indexed timestamp, uint256 number, uint256 rawValue);

    function reveal(uint256 timestamp) public onlyOwner {
        // check if timestamp is in the future
        // or if number of timestamp is already revealed
        if (timestamp > now || numberOfTime[timestamp] != 0) {
            revert();
        }

        uint256 rawValue = rand;
        uint256 number = rawValue % 1000;

        numberOfTime[timestamp] = number;
        revealedTimes.push(timestamp);
        revealedTimesCount++;
        lastRevealedTime = timestamp;

        emit NumberRevealed(timestamp, number, rawValue);
    }
}
