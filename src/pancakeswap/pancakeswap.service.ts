import Web3 from 'web3';
import { Injectable } from '@nestjs/common';

// Contract ABI
import MasterChef from './abi/MasterChef.json';
import PancakePair from './abi/PancakePair.json';
import BEP20 from './abi/BEP20.json';
import { configuration } from 'src/config/config';
import { PoolInfo } from './interface/pool';
import { UserInfo } from './interface/user';

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

  async getPools() {
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
            lpAddress: lpAddress as string,
            token0: pair.token0Address as string,
            token0Symbol: pair.token0Symbol as string,
            token1: pair.token1Address as string,
            token1Symbol: pair.token1Symbol as string,
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

  async getUserStake(userAddress: string) {
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
        const poolInfo: PoolInfo = await masterChefContract.methods
          .poolInfo(poolID)
          .call();
        const lpAddress = poolInfo.lpToken;

        try {
          const pair = await this.getTokenPair(lpAddress);

          const userInfo: UserInfo = await masterChefContract.methods
            .userInfo(poolID, userAddress)
            .call();

          return {
            id: poolID,
            lpAddress: lpAddress as string,
            token0: pair.token0Address as string,
            token0Symbol: pair.token0Symbol as string,
            token1: pair.token1Address as string,
            token1Symbol: pair.token1Symbol as string,
            amount: userInfo.amount,
            reward: userInfo.rewardDebt,
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
      }),
    );

    return stakes;
  }

  async getUserStakeByPool(poolID: number, userAddress: string) {
    // Get MasterChef Contract
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

      return {
        id: poolID,
        lpAddress: lpAddress as string,
        token0: pair.token0Address as string,
        token0Symbol: pair.token0Symbol as string,
        token1: pair.token1Address as string,
        token1Symbol: pair.token1Symbol as string,
        amount: userInfo.amount,
        reward: userInfo.rewardDebt,
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
    const tokenContract = this.getContract(PancakePair.abi, address);

    // Get token address
    const token0Address = await tokenContract.methods.token0().call();
    const token1Address = await tokenContract.methods.token1().call();

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
}
