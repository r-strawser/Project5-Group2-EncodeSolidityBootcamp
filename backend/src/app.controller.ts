import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

export class requestTokensDTO {
  address: string;
  amount: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("get-token-contract-address")
  getTokenContractAddress(): any {
    return this.appService.getTokenContractAddress();
  }

  @Get("get-lottery-contract-address")
  getLotteryContractAddress(): any {
    return this.appService.getLotteryContractAddress();
  }

  @Post("request-tokens")
  requestTokens(@Body() body: requestTokensDTO): any {
    return this.appService.requestTokens(body.address, body.amount);
  }
}
