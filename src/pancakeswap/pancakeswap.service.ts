import Web3 from 'web3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PancakeswapService {
  web3: Web3;

  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/', {
        keepAlive: true,
      }),
    );
  }

  private getContract(abi: any, address: string) {
    return new this.web3.eth.Contract(abi, address);
  }
}
