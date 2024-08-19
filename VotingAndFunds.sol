// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract VotingAndFunds {
    address payable public owner;
    uint256 public balance;
    string[] public proposals;
    mapping(string => uint256) public votes;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event ProposalSubmitted(string proposal);
    event VoteCast(string proposal, uint256 votes);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function submitProposal(string memory _proposal) public {
        proposals.push(_proposal);
        emit ProposalSubmitted(_proposal);
    }

    function vote(string memory _proposal) public {
        votes[_proposal] += 1;
        emit VoteCast(_proposal, votes[_proposal]);
    }

    // custom errors
    error UnauthorizedUser(address user);
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);
}
