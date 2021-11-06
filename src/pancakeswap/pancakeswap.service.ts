import Web3 from 'web3';
import { Injectable } from '@nestjs/common';

// Contract ABI
import MasterChef from './abi/MasterChef.json';
import PancakePair from './abi/PancakePair.json';
import BEP20 from './abi/BEP20.json';
import { configuration } from 'src/config/config';
import { PoolDTOReponse, PoolInfo } from './interface/pool';
import { UserInfo } from './interface/user';
import { StakeDTOReponse } from './interface/stake';
import BigNumber from 'bignumber.js';

@Injectable()
export class PancakeswapService {
  web3: Web3;

  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(configuration.pancakeswap.httpProvider, {
        keepAlive: true,
      }),
    );
  }

  private getContract(abi: any, address: string) {
    return new this.web3.eth.Contract(abi, address);
  }

  async getPools(): Promise<PoolDTOReponse[]> {
    // Get MasterChef Contract
    const masterChefContract = this.getContract(
      MasterChef.abi,
      configuration.pancakeswap.masterchefAddress,
    );

    // Get Cake Address
    const poolLength: number = await masterChefContract.methods
      .poolLength()
      .call();

    // Create variable that contain all Pool IDs
    const poolIds = [...Array(Number(poolLength)).keys()];

    const pools = await Promise.all(
      poolIds.map(async (poolID) => {
        const poolInfo: PoolInfo = await masterChefContract.methods
          .poolInfo(poolID)
          .call();
        const lpAddress = poolInfo.lpToken;

        try {
          const pair = await this.getTokenPair(lpAddress);

          return {
            id: poolID,
            lpAddress: lpAddress,
            token0: pair.token0Address,
            token0Symbol: pair.token0Symbol,
            token1: pair.token1Address,
            token1Symbol: pair.token1Symbol,
          };
        } catch {
          return {
            id: poolID,
            lpAddress: lpAddress,
            token0: null,
            token0Symbol: null,
            token1: null,
            token1Symbol: null,
          };
        }
      }),
    );

    return pools;
  }

  async getUserStake(userAddress: string): Promise<StakeDTOReponse[]> {
    // Get MasterChef Contract
    const masterChefContract = this.getContract(
      MasterChef.abi,
      configuration.pancakeswap.masterchefAddress,
    );

    const poolLength: number = await masterChefContract.methods
      .poolLength()
      .call();

    // Create variable that contain all Pool IDs
    const poolIds = [...Array(Number(poolLength)).keys()];

    const stakes = await Promise.all(
      poolIds.map(async (poolID) => {
        // Get user stake
        const stake = await this.getStake(poolID, userAddress);
        if (Number(stake.amount) !== 0) {
          return stake;
        }
      }),
    );

    return stakes.filter((stake) => {
      if (stake) {
        return stake;
      }
    });
  }

  async getUserStakeByPool(
    poolID: number,
    userAddress: string,
  ): Promise<StakeDTOReponse> {
    return this.getStake(poolID, userAddress);
  }

  private async getStake(
    poolID: number,
    userAddress: string,
  ): Promise<StakeDTOReponse> {
    const masterChefContract = this.getContract(
      MasterChef.abi,
      configuration.pancakeswap.masterchefAddress,
    );

    const poolInfo: PoolInfo = await masterChefContract.methods
      .poolInfo(poolID)
      .call();
    const lpAddress = poolInfo.lpToken;
    try {
      const pair = await this.getTokenPair(lpAddress);

      const userInfo: UserInfo = await masterChefContract.methods
        .userInfo(poolID, userAddress)
        .call();

      // Get token and reward decimal
      const cakeAddress = await masterChefContract.methods.cake().call();
      const tokenDecimal = await this.getTokenDecimal(lpAddress);
      const rewardDecimal = await this.getTokenDecimal(cakeAddress);

      return {
        id: poolID,
        lpAddress: lpAddress,
        token0: pair.token0Address,
        token0Symbol: pair.token0Symbol,
        token1: pair.token1Address,
        token1Symbol: pair.token1Symbol,
        amount: this.convertBigNumberToDecimal(userInfo.amount, tokenDecimal),
        reward: this.convertBigNumberToDecimal(
          userInfo.rewardDebt,
          rewardDecimal,
        ),
      };
    } catch {
      return {
        id: poolID,
        lpAddress: lpAddress,
        token0: null,
        token0Symbol: null,
        token1: null,
        token1Symbol: null,
        amount: null,
        reward: null,
      };
    }
  }

  // getTokenPair - Get infomation of the token pair in the pool
  private async getTokenPair(address: string) {
    // Get PancakePair Contract
    const pancakeContract = this.getContract(PancakePair.abi, address);

    // Get token address
    const token0Address = await pancakeContract.methods.token0().call();
    const token1Address = await pancakeContract.methods.token1().call();

    // Get token symbol
    const token0Symbol = await this.getTokenSymbol(token0Address);
    const token1Symbol = await this.getTokenSymbol(token1Address);

    return {
      token0Address,
      token0Symbol,
      token1Address,
      token1Symbol,
    };
  }

  // getTokenSymbol - Get token's symbol with address
  private async getTokenSymbol(address: string) {
    // Get BEP20 Contract
    const tokenContract = this.getContract(BEP20.abi, address);

    const tokenSymbol: string = await tokenContract.methods.symbol().call();
    return tokenSymbol;
  }

  // getTokenDecimal - Get token's symbol with address
  private async getTokenDecimal(address: string): Promise<number> {
    // Get BEP20 Contract
    const tokenContract = this.getContract(BEP20.abi, address);

    const tokenSymbol = await tokenContract.methods.decimals().call();
    return Number(tokenSymbol);
  }

  private convertBigNumberToDecimal(number: any, decimal: number) {
    return new BigNumber(number).dividedBy(`1e${decimal}`).toNumber();
  }
}
