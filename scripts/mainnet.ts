// import helpers from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  //? add liquidity USDT/LSK

  const LP_TOKEN_RECIPIENT = "0x9ce826910f5e22A6e22A6a0418033b2677505752";
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const LSK = "0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f";
  const TOKEN_HOLDER = "0x28C6c06298d514Db089934071355E5743bf21d60";
  const UNISWAP_V2_ROUTER = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a";

  const USDTDesired = ethers.parseUnits("100", 6);
  const LSKDesired = ethers.parseUnits("1000", 18);
  const USDTMin = ethers.parseUnits("10", 6);
  const LSKMin = ethers.parseUnits("50", 18);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; //30 Minutes in UNIX Timestamp

  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const USDTContract = await ethers.getContractAt(
    "IERC20",
    USDT,
    impersonatedSigner
  );
  const LSKContract = await ethers.getContractAt(
    "IERC20",
    LSK,
    impersonatedSigner
  );
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router01",
    UNISWAP_V2_ROUTER,
    impersonatedSigner
  );

  await USDTContract.approve(ROUTER, USDTDesired);
  await LSKContract.approve(ROUTER, LSKDesired);

  const USDTBalanceBeforeTransaction = await USDTContract.balanceOf(
    TOKEN_HOLDER
  );
  const LSKBalanceBeforeTransaction = await LSKContract.balanceOf(TOKEN_HOLDER);

  console.log("USDT IN HOLDER WALLET BEFORE:", USDTBalanceBeforeTransaction);
  console.log("LSK IN HOLDER WALLET BEFORE:", LSKBalanceBeforeTransaction);
  console.log(
    "==================================================================="
  );

  await ROUTER.addLiquidity(
    USDT,
    LSK,
    USDTDesired,
    LSKDesired,
    USDTMin,
    LSKMin,
    LP_TOKEN_RECIPIENT,
    deadline
  );

  const USDTBalanceAfterTransaction = await USDTContract.balanceOf(
    TOKEN_HOLDER
  );
  const LSKBalanceAfterTransaction = await LSKContract.balanceOf(TOKEN_HOLDER);

  console.log("USDT IN HOLDER WALLET AFTER:", USDTBalanceAfterTransaction);
  console.log("LSK IN HOLDER WALLET AFTER:", LSKBalanceAfterTransaction);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});