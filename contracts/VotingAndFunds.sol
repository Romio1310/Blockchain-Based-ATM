// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Contract for managing voting and funds
contract VotingAndFunds {
    address payable public owner;  
    uint256 public balance;        

    // Events for logging important actions
    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event VoteCasted(address indexed voter, uint8 candidate);
    event LoanTaken(address indexed borrower, uint256 amount, uint256 interest);
    event LoanRepaid(address indexed borrower, uint256 amount);

    // Struct to store voter information
    struct Voter {
        bool voted;                                                 // Indicates if the voter has voted
        uint8 vote;                                                 // Candidate voted for
    }

    // Mappings to track voters, votes, and loans
    mapping(address => Voter) public voters;
    mapping(uint8 => uint256) public votes;
    mapping(address => uint256) public loans;

    uint256 public constant INTEREST_RATE = 5;                      // Interest rate for loans

    // Constructor to initialize the contract
    constructor() payable {
        owner = payable(msg.sender);                                // Set contract creator as owner
        balance = msg.value;         
    }

    // Function to get the contract's balance
    function getBalance() public view returns (uint256) {
        return balance;
    }

    // Custom error for insufficient balance
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    // Function to deposit Ether into the contract
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");  // Ensure deposit is positive
        balance += msg.value;  
        emit Deposit(msg.value);  
    }

    // Function to withdraw Ether from the contract
    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");  // Check owner
        if (balance < _withdrawAmount) {
            revert InsufficientBalance(balance, _withdrawAmount);               // Revert if insufficient balance
        }
        balance -= _withdrawAmount;                                             // Update balance
        payable(msg.sender).transfer(_withdrawAmount);                          // Transfer funds
        emit Withdraw(_withdrawAmount);                                         // Emit withdraw event
    }

    // Function to cast a vote for a candidate
    function vote(uint8 _candidate) public {
        require(!voters[msg.sender].voted, "You have already voted.");  
        voters[msg.sender] = Voter(true, _candidate);                           // Record the vote
        votes[_candidate] += 1;                                                 // Update vote count
        emit VoteCasted(msg.sender, _candidate);                                // Emit vote cast event
    }

    // Function to get the number of votes for a candidate
    function getVotes(uint8 _candidate) public view returns (uint256) {
        return votes[_candidate];
    }

    // Function to take a loan
    function takeLoan(uint256 _amount) public {
        require(_amount > 0, "Loan amount must be greater than 0");  
        require(_amount <= balance, "Not enough funds in the contract");  
        uint256 interest = (_amount * INTEREST_RATE) / 100;                     // Calculate interest
        loans[msg.sender] = _amount + interest;                                 // Record loan and interest
        balance -= _amount;                                                     // Update balance
        payable(msg.sender).transfer(_amount);                                  // Transfer loan amount
        emit LoanTaken(msg.sender, _amount, interest);                          // Emit loan taken event
    }

    // Function to repay a loan
    function repayLoan() public payable {
        require(loans[msg.sender] > 0, "You have no loans to repay");           // Check if there is a loan
        require(msg.value == loans[msg.sender], "Incorrect repayment amount");  // Ensure correct repayment amount

        loans[msg.sender] = 0;  
        balance += msg.value;  
        emit LoanRepaid(msg.sender, msg.value);                                 // Emit loan repaid event
    }
}
