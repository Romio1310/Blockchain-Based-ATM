
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/VotingAndFunds.sol/VotingAndFunds.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [loanAmount, setLoanAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update if needed
  const atmABI = atm_abi.abi;

  // Initialize wallet connection
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) handleAccount(accounts[0]);
    } else {
      alert("Please install MetaMask to use this application.");
    }
  };
  

  // Handle account selection
  const handleAccount = async (account) => {
    if (!ethWallet) {
      console.error("Ethereum wallet is not initialized.");
      return;
    }
    setAccount(account);
    getATMContract();
  };

  // Connect MetaMask account
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert(`Connection failed: ${error.message}`);
    }
  };

  // Get ATM contract instance
  const getATMContract = () => {
    if (!ethWallet) {
      console.error("Ethereum wallet is not initialized.");
      return;
    }
    console.log("Getting ATM contract...");
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    console.log("ATM contract:", atmContract);
    setATM(atmContract);
  };
  
  // Get contract balance
  const getBalance = async () => {
    if (atm) {
      try {
        const balanceBigNumber = await atm.getBalance();
        setBalance(ethers.utils.formatEther(balanceBigNumber));
      } catch (error) {
        console.error("Error fetching balance:", error);
        alert(`Failed to fetch balance: ${error.message}`);
      }
    }
  };
  
  // Deposit funds
  const deposit = async () => {
    if (atm) {
      try {
        const tx = await atm.deposit({ 
          value: ethers.utils.parseEther("1.0"),
          gasLimit: ethers.utils.hexlify(300000)  // Increase gas limit
        });
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Deposit failed:", error);
        alert(`Deposit failed: ${error.message || JSON.stringify(error)}`);
      }
    }
  };
  
  

  // Withdraw funds
  const withdraw = async () => {
    if (atm) {
      try {
        const amountToWithdraw = ethers.utils.parseEther("1.0"); // Adjust as needed
        const tx = await atm.withdraw(amountToWithdraw);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Withdrawal failed:", error);
        alert(`Withdrawal failed: ${error.message}`);
      }
    }
  };

  // Take a loan
  const takeLoan = async () => {
    if (atm) {
      try {
        const amountToLoan = ethers.utils.parseEther(loanAmount);
        const tx = await atm.takeLoan(amountToLoan);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Loan request failed:", error);
        alert(`Loan request failed: ${error.message}`);
      }
    }
  };

  // Repay a loan
  const repayLoan = async () => {
    if (atm) {
      try {
        // Ensure the repayment amount is exactly what's owed
        const repaymentAmount = ethers.utils.parseEther(repayAmount);
  
        // Fetch the expected repayment amount from the contract
        const expectedRepaymentAmount = await atm.loans(account);
  
        if (!repaymentAmount.eq(expectedRepaymentAmount)) {
          alert(`Repayment amount must be exactly ${ethers.utils.formatEther(expectedRepaymentAmount)} ETH.`);
          return;
        }
  
        // Repay the loan
        const tx = await atm.repayLoan({ value: repaymentAmount });
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Repayment failed:", error);
        alert(`Repayment failed: ${error.message}`);
      }
    }
  };
  

  // Initialize user interface
  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your MetaMask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>

        <div>
          <h3>Loan</h3>
          <input
            type="text"
            placeholder="Loan Amount (in ETH)"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
          <button onClick={takeLoan}>Take Loan</button>
        </div>

        <div>
          <h3>Repay Loan</h3>
          <input
            type="text"
            placeholder="Repay Amount (in ETH)"
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
          />
          <button onClick={repayLoan}>Repay Loan</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
