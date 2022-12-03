import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/Lottery.json'
import ballotJson from '../assets/LotteryToken.json'

export class requestTokensDTO {
    constructor(public address: string, public amount: string) { }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    wallet: ethers.Wallet | undefined;

    provider: ethers.providers.Provider;

    backendUrl: string | undefined;

    ethBalance: number | string | undefined;

    errorMsg: string | undefined;

    constructor() {
        // set the provider object
        this.provider = ethers.getDefaultProvider('goerli');

        this.backendUrl = "http://localhost:3000"
    }


    createWallet() {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    }


    importWallet(secret: string, importMethod: string) {
        if (importMethod == 'mnemonic') {
            this.wallet = ethers.Wallet.fromMnemonic(secret ?? "").connect(this.provider);
        } else {
            this.wallet = new ethers.Wallet(secret ?? "").connect(this.provider);
        }
        if (this.wallet.address.length == 42) {
            this.updateValues();
        } else {
            this.errorMsg = 'Could not import wallet, invalid mnumonic or private key';
            console.log(this.errorMsg);
            alert(this.errorMsg);
        }
    }


    async updateValues() {
        [this.ethBalance] = [
            'loading...'
        ];

        this.wallet?.getBalance().then((balance) => {
            this.ethBalance = parseFloat(ethers.utils.formatEther(balance));
        });
    }
}
