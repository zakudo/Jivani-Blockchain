const hre = require("hardhat");

async function main() {
  const MedChain = await hre.ethers.getContractFactory("MedChain");
  const medChain = await MedChain.deploy();

  await medChain.waitForDeployment();

  const contractAddress = await medChain.getAddress();
  console.log(`\n==================================================`);
  console.log(`✅ MedChain Contract Deployed Successfully!`);
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`==================================================\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});