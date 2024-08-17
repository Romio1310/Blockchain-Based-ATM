async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const initBalance = hre.ethers.utils.parseEther("1.0"); // 1 ETH initial balance
  const VotingAndFunds = await hre.ethers.getContractFactory("VotingAndFunds");
  const votingAndFunds = await VotingAndFunds.deploy({ value: initBalance });

  await votingAndFunds.deployed();

  console.log(`Contract deployed to ${votingAndFunds.address} with balance ${initBalance.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});