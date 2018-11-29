pragma solidity ^0.4.25;

contract Election {

    address owner;
    uint public totalVote = 0;
    bool public isVoting = false;
    uint public round = 0;
    uint public guaranteedDeposit = 1000000000000000000;
    uint public refundRatio = 5; // more than 1/5 to get refund

    struct Candidate {
        uint vote;
        string name;
        bool isRegistered;
        uint candidateNumber;
    }

    address[] public candiatesList;
    mapping(uint => mapping(address => Candidate)) public candidateData;
    mapping(uint => mapping(address => bool)) public voted;

    event voteStart(uint round);
    event elected(uint round, address candidate, string name, uint vote);
    event reset(uint round);
    event registered(uint round, address candidate);
    event voteCandidate(uint round, address candidate, address voter);
    event sponsorCandidate(uint round, address candidate, string name, address sponsor, uint amount);
    event refund(address candidate, string name, uint amount, uint round);

    constructor() public {
        owner = msg.sender;
        resetElection();
    }

    // Announce the elected person and restart election
    function resetElection() public onlyOwner {
        if (round > 0) {
            refundDeposit();
            announceElectedPerson();
        }

        totalVote = 0;
        round += 1;
        isVoting = false;
        emit reset(round);
    }

    function startVoting() public onlyOwner {
        isVoting = true;
        emit voteStart(round);
    }

    function vote(address candidateAddr) public onlyInVote candidateShouldExist(candidateAddr) {
        require(voted[round][msg.sender] != true, "Already voted");
        Candidate storage candidate = candidateData[round][candidateAddr];
        candidate.vote += 1;
        voted[round][msg.sender] = true;
        emit voteCandidate(round, candidateAddr, msg.sender);

        totalVote += 1; // extra bonus
    }

    function register(string memory name) public onlyInRegister payable {
        Candidate storage candidate = candidateData[round][msg.sender];
        require(candidate.isRegistered != true, "Already registered");

        /* Extra bonus implementation */
        require(msg.value >= guaranteedDeposit, "Insufficient deposit");

        Candidate memory newCandidate;
        newCandidate.name = name;
        newCandidate.vote = 0;
        newCandidate.isRegistered = true;
        candidateData[round][msg.sender] = newCandidate;
        candiatesList.push(msg.sender);
        emit registered(round, msg.sender);
    }

    function refundDeposit() private {
        /* extra - refund guaranteedDeposit */
        uint numOfCandidates = candiatesList.length;
        for (uint x = 0; x < numOfCandidates; x++) {
            address currentAddr = candiatesList[x];
            Candidate storage currentCandidate = candidateData[round][currentAddr];
            if ((currentCandidate.vote * refundRatio) >= totalVote) {
                currentAddr.transfer(guaranteedDeposit);
                emit refund(currentAddr, currentCandidate.name, guaranteedDeposit, round);
            }
        }
    }

    function announceElectedPerson() private {
        uint numOfCandidates = candiatesList.length;
        uint maxVote = 0;
        address highestCandidate;
        for (uint x = 0; x < numOfCandidates; x++) {
            address currentAddr = candiatesList[x];
            Candidate storage currentCandidate = candidateData[round][currentAddr];
            if (currentCandidate.vote > maxVote) {
                highestCandidate = currentAddr;
                maxVote = currentCandidate.vote;
            }
        }
        Candidate storage electedPerson = candidateData[round][highestCandidate];
        emit elected(round, highestCandidate, electedPerson.name, electedPerson.vote);
        delete candiatesList;
    }

    function sponsor(address candidateAddr) public onlyInRegister candidateShouldExist(candidateAddr) payable {
        Candidate storage candidate = candidateData[round][candidateAddr];
        candidateAddr.transfer(msg.value);
        emit sponsorCandidate(round, candidateAddr, candidate.name, msg.sender, msg.value);
    }

    function getCandidatesList() public view returns (address[]) {
        return candiatesList;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is allowed");
        _;
    }

    modifier onlyInVote() {
        require(isVoting == true, "Voting should be started");
        _;
    }

    modifier onlyInRegister() {
        require(isVoting == false, "Only allowed before voting period");
        _;
    }
    modifier candidateShouldExist (address candidateAddr) {
        Candidate storage candidate = candidateData[round][candidateAddr];
        require(candidate.isRegistered == true, "Candidate not exists");
        _;
    }

}
