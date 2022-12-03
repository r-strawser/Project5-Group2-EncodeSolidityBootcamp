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
    wallet: string | undefined;
}
