export class PoolInfo {
  lpToken: string;
  allocPoint: number;
  lastRewardBlock: number;
  accCakePerShare: number;
}

export class PoolDTOReponse {
  id: number;
  lpAddress: string;
  token0: string | null;
  token0Symbol: string | null;
  token1: string | null;
  token1Symbol: string | null;
}
