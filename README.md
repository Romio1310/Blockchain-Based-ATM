# Voting and Funds Smart Contract

This Solidity smart contract named `VotingandFunds` serves as a dual-purpose system that allows users to vote on proposals and manage funds within the contract. The system ensures only authorized users can vote and interact with funds, enforcing ownership and handling errors effectively.

## Description

The `VotingandFunds` contract is designed to handle both a simple voting mechanism and the management of Ether funds. Users can submit proposals, vote on them, and also deposit or withdraw funds securely. The contract uses custom error handling to manage scenarios like unauthorized voting or insufficient balance.

## Getting Started

### Prerequisites

To deploy and interact with this contract, you will need:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Hardhat](https://hardhat.org/)
- An Ethereum wallet (e.g., MetaMask)
- [Solidity](https://soliditylang.org/)

### Installing

1. Clone the repository in your desired location:
    ```sh
    git clone https://github.com/Romio1310/VotingAndFunds.git
    ```
2. Open the cloned folder.
3. Install dependencies:
    ```sh
    npm install
    ```

## Running the Project

After cloning the GitHub repository, you will want to do the following to get the code running on your computer:

1. Inside the project directory, in the terminal type:
    ```sh
    npm i
    ```
2. Open two additional terminals in your VS Code.
3. In the second terminal, type:
    ```sh
    npx hardhat node
    ```
4. In the third terminal, deploy the contract to the local network:
    ```sh
    npx hardhat run --network localhost scripts/deploy.js
    ```
5. Back in the first terminal, launch the front-end:
    ```sh
    npm run dev
    ```
    This will start the application at [http://localhost:3000/](http://localhost:3000/).

## Contract Details

### State Variables

- **address payable public owner:** Stores the address of the contract owner.
- **uint256 public balance:** Tracks the current balance of the contract.
- **string[] public proposals:** An array of proposals available for voting.
- **mapping(string => uint256) public votes:** Maps proposals to the number of votes they have received.

### Functions

- **function getBalance() public view returns (uint256):** Returns the current balance of the contract.
- **function deposit(uint256 _amount) public payable:** Allows the owner to deposit funds into the contract. Emits a Deposit event.
- **function withdraw(uint256 _withdrawAmount) public:** Allows the owner to withdraw funds from the contract. Emits a Withdraw event.
- **function submitProposal(string memory _proposal) public:** Allows users to submit a new proposal for voting. Emits a ProposalSubmitted event.
- **function vote(string memory _proposal) public:** Allows users to vote on a proposal. Emits a VoteCast event.

### Events

- **event Deposit(uint256 amount):** Emitted when funds are deposited.
- **event Withdraw(uint256 amount):** Emitted when funds are withdrawn.
- **event ProposalSubmitted(string proposal):** Emitted when a new proposal is submitted.
- **event VoteCast(string proposal, uint256 votes):** Emitted when a vote is cast on a proposal.

### Error Handling

- **error UnauthorizedUser(address user):** Custom error for handling unauthorized access.
- **error InsufficientBalance(uint256 balance, uint256 withdrawAmount):** Custom error for handling insufficient balance during withdrawal.

## Smart Contract Code

### VotingandFunds.sol
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract VotingandFunds {
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
```

## Hardhat Configuration

### hardhat.config.js
```js
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};
```

## Help

This `README.md` file provides a comprehensive and structured guide for setting up, running, and understanding the `VotingandFunds` smart contract. If you encounter any issues, please open an issue in the GitHub repository or reach out for support.
