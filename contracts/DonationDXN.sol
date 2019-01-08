pragma solidity ^0.5.0;

contract DXNDonationContract {

    address payable[] donationList = [
        0xa7A47db8F29Dd62807F0ec33735827e154E0d4c3
    ];
    
    function multiTransfer() public payable {
        uint256 amount = msg.value / donationList.length;

        for (uint256 i = 0; i < donationList.length; i++) {
            address payable sendToAddress = donationList[i];
            sendToAddress.transfer(amount);
        }

    }
}
