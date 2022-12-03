import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

export class requestTokensDTO {
  address: string;
  amount: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
}
