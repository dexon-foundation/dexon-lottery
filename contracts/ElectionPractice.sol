pragma solidity ^0.5.0;

/**
 * @title - How to use this?
 * @dev - deploy contract to DEXON netowkr
 * @dev - copy deployed address to https://dexon-workshop-vote.netlify.com/
*/

/**
 * @title - In this Election Contract, it could take as many rounds of election.
 *        - As a user of this contract, you are able to
 *        - 1. Register as a candiate of the election.
 *        - 2. Everyone can vote only ONE candidate in each round but we can fund multiple candidates as much money as we want.
 *        - 3. Candidates will be funded when the current round is over.
 *
 * @dev - There would be only 1 active round at a time.
 *      - Before round start, any user can use their `wallet` to register as candiate "once".
 *      - Only the contract owner can start voting process and call a voting process to the end.
 *      - Once a voting proces start, no more user can register as candiate.
 * 
 * @notice - Search for "TODO" for what you need to implement.
 *      
 *
*/

/**
 * @title - Events
 * @dev - Events will serve two purposes
 *      - 1. Update Election UI via websocket
 *      - 2. To save data that you want on the blockchain but won't be needed in the contract
 * 
 * @notice - do not change the name of event, otherwise the UI will not update automatically
*/
contract Events {
    event voteStart(uint round);
    event elected(uint round, address candidate, string name, uint vote);
    event reset(uint round);
    event registered(uint round, address candidate);
    event voteCandidate(uint round, address candidate, address voter);
    event sponsorCandidate(uint round, address candidate, string name, address sponsor, uint amount);
    event refund(address candidate, string name, uint amount, uint round);
} 
 
contract Election is Events {

    /**
     * @notice - This is for functions that can be used/called by the owner.
     */
    address public owner;
    
    constructor() public {
        // TODO - Set up owner right after the contract get deployed.
    }
    
    /**
     * @title isVoting
     * @dev a mark to determine if 
     * @notice a public variable that is used for contract and UI update
     */
    bool public isVoting = false;
    
    function startVoting() public {
        /**
         * TODO - to make voting process start
         * TODO - only contract owner can call this function
         * TODO - emit event voteStart
        */
    }
    

    /**
     * @notice - With solidity, it gives you "mapping" as one of the data store mechanism.
     *         - it's a key-value pair
     *         - However, you cannot iterate the keys, because it uses hash table as its storing mechanism.
     *         - In theroy, you can use "array" to store data as you would with "mapping".
     *         - Within smart contract, each line of running code cost money.
     *         - In other words, the bigger of an array it gets the higher of gas a user should pay.
     * 
     * @dev - In order for user not spending too much gas to interact with the contract.
     *      - We set four state variables to achieve.
     */

     /**
     * @title candidateData
     * @param uint - election round
     * @param address - candidate's wallet address
     * @param Candidate - candidate's election data
     */
    mapping(uint => mapping(address => Candidate)) public candidateData;
     
     /**
     * @title candiatesList
     * @dev - This array stores candidates address of current round, and will be reset whenever an election is over.
     *      - The reason of this approach is because we cannot iterate the keys in the mapping There would be only 1 active round at a time.

     *
     * @title round 
     * @dev - This is the mark of current active round, and will increase by one if a new round start
     */
    uint public round = 0;
    address[] public candiatesList;
     
     /**
     * @title Candidate
     * @param vote - count of votes
     * @param name - candidate's registed name
     * @param isRegistered - a quick way to check if a user has been registed with "round" and "address"
     *                     - the reason of this approach is because how "mapping" works
     * @param candidateNumber - a unique serial number for each candidate in each round
     */
    struct Candidate {
        uint vote;
        string name;
        bool isRegistered;
        uint candidateNumber;
    }
    
    function register(string memory name) public payable {
        /**
         * TODO - to register user in current active round
         * TODO - emit event registered
         * 
         * @notice - candidate can only registered once in each round
         * @notice - without emit event registered, UI will not update itself via websocket
         * @notice - can only be called before election process start
         */
    }
    

    /**
     * @title voted
     * @param uint - election round
     * @param address - the address of the voting person
     * @param bool - has registered or not
    */
    mapping(uint => mapping(address => bool)) public voted;
    function vote(address candidateAddr) public {
        /**
         * TODO - a user can only vote once each round
         * TODO - increase candidate's vote by one
         * TODO - emit event voteCandidate
         * 
         * @notice - can only vote for an exist candidate
         * @notice - can only be called before election process start
         */
    }
    
     function sponsor(address candidateAddr) public payable {
         /**
         * TODO - emit event sponsorCandidate;
         *
         * @notice - can only give to an exist candidate
         * @notice - can only be called before election process start
         */
    }
    
    
    function resetElection() public {
        /**
         * TODO - select the winner
         * TODO - emit event elected
         * TODO - emit event refund;
         * 
         * @notice - don't forget to clean up data in candiatesList
         */
    }
}
