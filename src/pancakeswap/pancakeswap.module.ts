import { Module } from '@nestjs/common';
import { PancakeswapController } from './pancakeswap.controller';
import { PancakeswapService } from './pancakeswap.service';

@Module({
  controllers: [PancakeswapController],
  providers: [PancakeswapService],
})
export class PancakeswapModule {}
