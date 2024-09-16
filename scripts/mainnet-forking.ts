import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    // const LP_TOKEN_RECIPIENT = "0x9ce826910f5e22A6e22A6a0418033b2677505752";
    const ROUTER_ADDRESS = "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a"; //0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
     const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const LSK = "0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f";

    const TOKEN_HOLDER = "0x28C6c06298d514Db089934071355E5743bf21d60";
//
    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);
//  The amount of USDT i actually want to deposit
  const usdtAmount = ethers.parseUnits("100", 6);
  //  The amount of LSK i actually want to deposit
  const lskAmount = ethers.parseUnits("1000", 18);
  
  //  The minimum amount of USDT i want to deposit.
  const AmountusdtMin = ethers.parseUnits("10", 6);
  // The minimum amount of LSK i want to deposit.
  const AmountLskMin = ethers.parseUnits("50", 18);

    const USDT_Contract = await ethers.getContractAt("IERC20", USDT, impersonatedSigner);
    const LSK_Contract = await ethers.getContractAt("IERC20", LSK, impersonatedSigner); 
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    await USDT_Contract.approve(ROUTER, usdtAmount);
    await LSK_Contract.approve(ROUTER, lskAmount);

    const usdtBal = await USDT_Contract.balanceOf(impersonatedSigner);
    const lskBal = await LSK_Contract.balanceOf(impersonatedSigner);
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdt balance before liquidity", Number(usdtBal));
    console.log("LSK balance before liquidity", Number(lskBal));

    await ROUTER.addLiquidity(
        USDT,
        LSK,
      usdtAmount,
       lskAmount,
        AmountusdtMin,
      AmountLskMin,
        impersonatedSigner,
        deadline
    );

    const usdtBalAfter = await USDT_Contract.balanceOf(impersonatedSigner);
    const LSKBalAfter = await LSK_Contract.balanceOf(impersonatedSigner);

    console.log("=========================================================");

    console.log("usdt balance after liquidity", Number(usdtBalAfter));
    console.log("LSK balance after liquidity", Number(LSKBalAfter));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 