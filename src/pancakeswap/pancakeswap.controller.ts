import { Controller, Get, Param } from '@nestjs/common';
import { PancakeswapService } from './pancakeswap.service';

@Controller('/pancakeswap')
export class PancakeswapController {
  constructor(private pancakeswapService: PancakeswapService) {}

  @Get('/pools')
  async getPools() {
    const pools = await this.pancakeswapService.getPools();

    return {
      pools,
    };
  }

  @Get('/:user_address')
  async getLiquidityPoolStake(@Param('user_address') userAddress: string) {
    const users = await this.pancakeswapService.getUserStake(userAddress);

    return {
      users,
    };
  }
}
