import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import lotteryJson from '../assets/Lottery.json'
import tokenJson from '../assets/LotteryToken.json'

export class requestTokensDTO {
    constructor(public address: string, public amount: string) { }
}

const lotteryAddress: string = '0xA520E49A056D9eB838d9c5D316c636B03B11Dad9';
const tokenAddress: string = '0x37C33e20d4766F84e1a18053519Aa2BA66bF0D4a'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    // wallet object
    wallet: ethers.Wallet | undefined;

    // provider object connecting to goerli
    provider: ethers.providers.Provider;

    // token contract object
    tokenContract: ethers.Contract | undefined;

    // lottery contract object
    lotteryContract: ethers.Contract | undefined;


    ethBalance: number | string | undefined;
    tokenBalance: number | string | undefined;
    votePower: number | string | undefined;

    lotteryBetsOpen: boolean | string | undefined;
    lotteryWinningProposal: number | string | undefined;
    lotteryWinnerName: string | undefined;
    lotteryWinningVotes: number | string | undefined;

    backendUrl: string | undefined;
    tokenContractAddress: string | undefined;
    lotteryContractAddress: string | undefined;

    tokenRequestPending: boolean;
    errorMsg: string | undefined;

    historicalDataWallet: any | undefined;
    k_historicalDataWallet: string[] | undefined;
    historicalDataToken: any | undefined;
    k_historicalDataToken: string[] | undefined;
    historicalDataLottery: any | undefined;
    k_historicalDataLottery: string[] | undefined;

    constructor(private http: HttpClient) {
        // set the provider object
        this.provider = ethers.getDefaultProvider('goerli');

        this.backendUrl = "http://localhost:3000"
        this.http.get<any>(`${this.backendUrl}/get-token-contract-address`).subscribe((ans) => {
            this.tokenContractAddress = ans.result;
        })
        
        this.tokenContractAddress = tokenAddress;
        this.lotteryContractAddress = lotteryAddress;

        // this.http.get<any>(`${this.backendUrl}/get-lottery-contract-address`).subscribe((ans) => {
        //   this.lotteryContractAddress = ans.result;
        // })

        this.tokenRequestPending = false;
    }

    setTokenContract() {
        if (this.tokenContractAddress) {
            this.tokenContract = new ethers.Contract(this.tokenContractAddress, tokenJson.abi, this.wallet);
        }
    }

    connectLotteryContract(address: string) {
        this.lotteryContractAddress = address;
        this.lotteryContract = new ethers.Contract(this.lotteryContractAddress, lotteryJson.abi, this.wallet);

        this.updateValues();
    }

    createWallet() {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        if (this.tokenContractAddress) {
            this.setTokenContract();
            this.updateValues();
        }
    }

    async updateValues() {
        [this.ethBalance, this.tokenBalance, this.votePower] = [
            'loading...',
            'loading...',
            'loading...'
        ];

        [this.lotteryBetsOpen, this.lotteryWinningProposal, this.lotteryWinnerName, this.lotteryWinningVotes] = [
            'loading...',
            'loading...',
            'loading...',
            'loading...'
        ];

        this.wallet?.getBalance().then((balance) => {
            this.ethBalance = parseFloat(ethers.utils.formatEther(balance));
            if (this.tokenContract) {
                this.tokenContract['balanceOf'](this.wallet?.address).then(
                    (balanceBN: ethers.BigNumberish) => {
                        this.tokenBalance = parseFloat(ethers.utils.formatEther(balanceBN));
                    }
                );
            }

            // check the bets status to see if it is true or false
            if (this.lotteryContract) {
                this.lotteryContract['betsOpen']().then(
                    (betsOpenStatus: boolean) => {
                        this.lotteryBetsOpen = betsOpenStatus;
                    }
                );
            }
            
            // read from the public boolean 'betsOpen' variable and set the value of the lotteryBetsOpen variable
            // this.lotteryBetsOpen = this.lotteryContract['betsOpen']();
            

            // if (this.lotteryContract) {
            //     this.lotteryContract['votePower'](this.wallet?.address).then(
            //         (lotteryVotePowerBN: ethers.BigNumberish) => {
            //             this.lotteryVotePower = parseFloat(ethers.utils.formatEther(lotteryVotePowerBN));
            //         }
            //     );
            //     this.lotteryContract['winningProposal']().then(
            //         (lotteryWinningProposal: number) => {
            //             this.lotteryWinningProposal = lotteryWinningProposal;
            //             if (this.lotteryContract) {
            //                 this.lotteryContract['proposals'](this.lotteryWinningProposal).then((lotteryWinningVotes: any) => {
            //                     console.log(lotteryWinningVotes.voteCount)
            //                     this.lotteryWinningVotes = lotteryWinningVotes.voteCount;
            //                 })
            //             }
            //         }
            //     );
            //     this.lotteryContract['winnerName']().then(
            //         (lotteryWinnerName: string) => {
            //             // convert lotteryWinnerName to string
            //             this.lotteryWinnerName = ethers.utils.parseBytes32String(lotteryWinnerName);
            //         }
            //     );
            // }
        });

        this.historicalDataWallet = await this.getHistoricalData(this.wallet?.address ?? "");
        this.historicalDataToken = await this.getHistoricalData(this.tokenContractAddress ?? "");
        this.historicalDataLottery = await this.getHistoricalData(this.lotteryContractAddress ?? "");

        this.k_historicalDataWallet = Object.keys(this.historicalDataWallet[0]) ?? undefined;
        this.k_historicalDataToken = Object.keys(this.historicalDataToken[0]) ?? undefined;
        this.k_historicalDataLottery = Object.keys(this.historicalDataLottery[0]) ?? undefined;
    }

    importWallet(secret: string, importMethod: string) {
        if (importMethod == 'mnemonic') {
            this.wallet = ethers.Wallet.fromMnemonic(secret ?? "").connect(this.provider);
        } else {
            this.wallet = new ethers.Wallet(secret ?? "").connect(this.provider);
        }
        if (this.wallet.address.length == 42) {
            this.setTokenContract();
            this.updateValues();
        } else {
            this.errorMsg = 'Could not import wallet, invalid mnumonic or private key';
            console.log(this.errorMsg);
            alert(this.errorMsg);
        }
    }


    requestTokensTen() {
        // TODO: request 10 tokens to be minted in the backend
        this.tokenRequestPending = true;

        const body = new requestTokensDTO(this.wallet?.address ?? "", "10");
        this.http.post<any>(`${this.backendUrl}/request-tokens`, body).subscribe(async (ans) => {
            const txHash = ans.result;
            console.log({ ans });
            let status: number | undefined;
            while (!status) {
                status = await this.getTransactionStatus(txHash);
            }
            this.updateValues();
        })
    }

    delegateTokens(to: string) {
        console.log(`you are delegating tokens to ${to}`);
        if (this.tokenContract) {
            console.log('there is a contract and you are inside the if about to delegate');
            this.tokenContract['delegate'](to).then(this.updateValues());
            console.log('you are done with delegating');
        }
    }

    transferTokens(to: string, amount: number | string) {
        console.log(`you are delegating ${amount} tokens to ${to}`);
        if (this.tokenContract) {
            console.log('there is a contract and you are inside the if about to delegate');
            this.tokenContract['transfer'](to).then(this.updateValues());
            console.log('you are done with delegating');
        }
    }

    vote(proposal: number | string, amount: number | string) {
        console.log(`you are using lottery contract ${this.lotteryContractAddress} and ${amount} vote power to vote towards proposal ${proposal}`);
        if (this.lotteryContract) {
            console.log(`there is a lottery contract of address ${this.lotteryContract.address} and you are inside the if about to vote`);
            this.lotteryContract['vote'](proposal, amount).then(this.updateValues());
            console.log('you are done with voting');
        }
    }

    connectWallet() {
    }

    disconnectWallet() {
        this.wallet = undefined;
    }

    async getHistoricalData(address: string): Promise<any> {
        console.log(`fetching data for ${address}`)
        // this.http.get<any>(`${this.backendUrl}/get-historical-data`).subscribe((ans) => {
        //     this.historicalData = ans.result;
        // })

        let etherscanProvider = new ethers.providers.EtherscanProvider("goerli");

        if (address != "" && etherscanProvider) {
            const history = await etherscanProvider.getHistory(address)
            return history
        }
    }

    async getTransaction(hash: string) {
        const tx = await this.provider.getTransaction(hash)
        return await tx.wait();
    }

    async getTransactionStatus(hash: string) {
        const resp = await this.getTransaction(hash);
        return resp.status;
    }

    shorten(data: string) {
        if (data.length > 9) {
            return `${data.slice(0, 3)}...${data.slice(-3)}`
        }
        return data
    }

    async deployLotteryContract() {

    }
}
