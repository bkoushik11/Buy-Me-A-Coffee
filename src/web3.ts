import {
  createWalletClient,
  createPublicClient,
  custom,
  parseEther,
  defineChain,
  formatEther,
  type WalletClient,
  type PublicClient,
} from 'viem';
import { contractAddress, coffeeAbi } from './constants';

let walletClient: WalletClient | null = null;
let publicClient: PublicClient | null = null;

export interface WalletState {
  connected: boolean;
  address: string;
  balance: string;
}

export async function connectWallet(): Promise<WalletState> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install MetaMask!');
  }

  walletClient = createWalletClient({
    transport: custom(window.ethereum),
  });

  publicClient = createPublicClient({
    transport: custom(window.ethereum),
  });

  const [address] = await walletClient.requestAddresses();
  const balance = await publicClient.getBalance({ address });

  return {
    connected: true,
    address,
    balance: formatEther(balance),
  };
}

export async function getBalance(address: string): Promise<string> {
  if (!publicClient) {
    throw new Error('Wallet not connected');
  }

  const balance = await publicClient.getBalance({ address });
  return formatEther(balance);
}

export async function fundCoffee(ethAmount: string, account: string): Promise<string> {
  if (!walletClient || !publicClient) {
    throw new Error('Wallet not connected');
  }

  const currentChain = await getCurrentChain(walletClient);

  try {
    // Simulate the contract call first
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: coffeeAbi,
      functionName: 'fund',
      account: account as `0x${string}`,
      chain: currentChain,
      value: parseEther(ethAmount),
    });

    // Execute the transaction
    const txHash = await walletClient.writeContract(request);
    return txHash;
  } catch (error) {
    console.error('Error funding:', error);
    throw error;
  }
}

async function getCurrentChain(client: WalletClient) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: 'Custom Chain',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['http://localhost:8545'],
      },
    },
  });
  return currentChain;
}

export async function getAddressToAmountFunded(address: string): Promise<string> {
  if (!publicClient) {
    throw new Error('Wallet not connected');
  }

  try {
    const amount = await publicClient.readContract({
      address: contractAddress,
      abi: coffeeAbi,
      functionName: 'getAddressToAmountFunded',
      args: [address as `0x${string}`],
    });

    return formatEther(amount as bigint);
  } catch (error) {
    console.error('Error getting funded amount:', error);
    return '0';
  }
}