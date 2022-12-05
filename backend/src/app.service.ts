import { Injectable } from '@nestjs/common';
import { SetupSigner } from './utils';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import { lotteryContractAddress, tokenContractAddress } from "./constants";


@Injectable()
export class AppService {
  getTokenContractAddress() {
    return { result: tokenContractAddress }
  }

  getLotteryContractAddress() {
    return { result: lotteryContractAddress }
  }

  async requestTokens(address, amount) {
    const signer = await SetupSigner();
    const contract = new ethers.Contract(tokenContractAddress, tokenJson.abi, signer);

    const mintTx = await contract.mint(address, ethers.utils.parseEther(amount));
    const receipt = await mintTx.wait();

    return { result: receipt.transactionHash };
  }

}
