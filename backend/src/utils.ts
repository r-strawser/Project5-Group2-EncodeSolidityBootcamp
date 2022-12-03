import { ethers, Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config()

export async function SetupSigner(): Promise<Wallet> {
    const provider = ethers.getDefaultProvider("goerli", { etherscan: process.env.ETHERSCAN_API_KEY })
    let wallet: Wallet;

    if (process.env.MNEMONIC != "") {
        wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
    } else {
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "")
    }
    return wallet.connect(provider)
}
