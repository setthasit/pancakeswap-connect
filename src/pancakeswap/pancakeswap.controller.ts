import { Controller, Get, Param } from '@nestjs/common';

@Controller('/pancakeswap')
export class PancakeswapController {
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
