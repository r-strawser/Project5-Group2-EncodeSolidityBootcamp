import { ethers } from "ethers";

const TOKEN_RATIO = 1.0;

async function checkState() {
    const state = await contract.betsOpen();
    console.log(`The lottery is ${state ? "open" : "closed"}\n`);
    if (!state) return;
    const closingTime = await contract.betsClosingTime();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    console.log(
        `lottery should close at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
    );
}

async function openBets(duration: string) {
    const currentBlock = await ethers.getDefaultProvider("goerli").getBlock("latest");
    const tx = await contract.openBets(currentBlock.timestamp + Number(duration));
    const receipt = await tx.wait();
    console.log(`Bets opened (${receipt.transactionHash})`);
}

async function displayBalance(index: string) {
    const balanceBN = await ethers.getDefaultProvider("goerli").getBalance(
        accounts[Number(index)].address
    );
    const balance = ethers.utils.formatEther(balanceBN);
    console.log(
        `The account of address ${accounts[Number(index)].address
        } has ${balance} ETH\n`
    );
}

async function buyTokens(index: string, amount: string) {
    const tx = await contract.connect(accounts[Number(index)]).purchaseTokens({
        value: ethers.utils.parseEther(amount).div(TOKEN_RATIO),
    });
    const receipt = await tx.wait();
    console.log(`Tokens bought (${receipt.transactionHash})\n`);
}

async function displayTokenBalance(index: string) {
    const balanceBN = await token.balanceOf(accounts[Number(index)].address);
    const balance = ethers.utils.formatEther(balanceBN);
    console.log(
        `The account of address ${accounts[Number(index)].address
        } has ${balance} LT0\n`
    );
}

async function bet(index: string, amount: string) {
    const allowTx = await token
        .connect(accounts[Number(index)])
        .approve(contract.address, ethers.constants.MaxUint256);
    await allowTx.wait();
    const tx = await contract.connect(accounts[Number(index)]).betMany(amount);
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
}

async function closeLottery() {
    const tx = await contract.closeLottery();
    const receipt = await tx.wait();
    console.log(`Bets closed (${receipt.transactionHash})\n`);
}

async function displayPrize(index: string): Promise<string> {
    const prizeBN = await contract.prize(accounts[Number(index)].address);
    const prize = ethers.utils.formatEther(prizeBN);
    console.log(
        `The account of address ${accounts[Number(index)].address
        } has earned a prize of ${prize} Tokens\n`
    );
    return prize;
}

async function claimPrize(index: string, amount: string) {
    const tx = await contract
        .connect(accounts[Number(index)])
        .prizeWithdraw(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    console.log(`Prize claimed (${receipt.transactionHash})\n`);
}

async function displayOwnerPool() {
    const balanceBN = await contract.ownerPool();
    const balance = ethers.utils.formatEther(balanceBN);
    console.log(`The owner pool has (${balance}) Tokens \n`);
}

async function withdrawTokens(amount: string) {
    const tx = await contract.ownerWithdraw(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    console.log(`Withdraw confirmed (${receipt.transactionHash})\n`);
}

async function burnTokens(index: string, amount: string) {
    const allowTx = await token
        .connect(accounts[Number(index)])
        .approve(contract.address, ethers.constants.MaxUint256);
    const receiptAllow = await allowTx.wait();
    console.log(`Allowance confirmed (${receiptAllow.transactionHash})\n`);
    const tx = await contract
        .connect(accounts[Number(index)])
        .returnTokens(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    console.log(`Burn confirmed (${receipt.transactionHash})\n`);
}

export { }