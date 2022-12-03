import { Injectable } from '@nestjs/common';
import { SetupSigner } from './utils';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import { tokenContractAddress } from "./constants";


@Injectable()
export class AppService {

}
