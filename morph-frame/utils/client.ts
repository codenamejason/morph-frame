import {
  Address,
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config();

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// JSON-RPC Account
export const [address] = await walletClient.getAddresses();

// Local Account
export const adminAccount = privateKeyToAccount(
  process.env.PRIVATE_KEY as `0x${string}`
);

// export const sendMintTransaction = async (to: Address, _value = BigInt(0)) => {
//   const { request } = await publicClient.simulateContract({
//     account: adminAccount,
//     address: pharoTokenAddress,
//     abi: pharoTokenAbi,
//     functionName: "mintTokensTo",
//     args: [to, parseEther(defaultTokensToMint.toString())],
//   });

//   return await walletClient.writeContract(request);
// };

export const getBalance = async (user: Address, token: Address) => {
  const balance = await publicClient.readContract({
    address: token,
    abi: [
      {
        type: "function",
        name: "balanceOf",
        inputs: [{ name: "account", type: "address", internalType: "address" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
    ],
    functionName: "balanceOf",
    args: [user],
  });

  return BigInt(balance);
};

export const getShibPriceData = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=shiba-inu&vs_currencies=usd",
    {
      headers: {
        "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY as string,
      },
    }
  );

  return response.json();
};

export const getUserData = async (fid: number) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY as string,
    },
  };

  const response = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    options
  );

  return response.json();
};
