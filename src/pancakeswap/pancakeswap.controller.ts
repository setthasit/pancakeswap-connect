import { Controller, Get, Param } from '@nestjs/common';
import { PancakeswapService } from './pancakeswap.service';

@Controller('/pancakeswap')
export class PancakeswapController {
  constructor(private pancakeswapService: PancakeswapService) {}

  @Get('/pools')
  getPools() {
    return {
      message: 'success',
    };
  }

  @Get('/:user_address')
  getLiquidityPool(@Param('user_address') userAddress: string) {
    return {
      message: `success with address ${userAddress}`,
    };
  }
}
