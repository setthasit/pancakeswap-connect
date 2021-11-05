import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PancakeswapModule } from './pancakeswap/pancakeswap.module';

@Module({
  imports: [PancakeswapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
