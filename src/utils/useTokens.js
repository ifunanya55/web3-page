import { useState, useEffect } from "react";
import fetcher from "./fetcher";
import erc20 from "./abis/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import axios from "axios";
import ethImage from "../images/eth-symbol.png";
//Ethersjs stuff
import { formatUnits } from "@ethersproject/units";
//Web3React stuff
import { useWeb3React } from "@web3-react/core";

const initialTokens = [
  {
    name1: "Ether",
    name2: "ethereum",
    symbol: "ETH",
    address: "0xnull",
    logoURI: ethImage,
    decimals: 18,
  },
  {
    name1: "Wrapped Ether",
    name2: "weth",
    address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    symbol: "WETH",
    decimals: 18,
    chainId: 3,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  {
    name1: "Dai Stablecoin",
    name2: "dai",
    address: "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
    symbol: "DAI",
    decimals: 18,
    chainId: 3,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  },
  {
    name1: "Uniswap",
    name2: "uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    symbol: "UNI",
    decimals: 18,
    chainId: 3,
    logoURI:
      "https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/",
  },
];

export default function useTokens() {
  const { active, account, library } = useWeb3React();
  const [price, setPrice] = useState(false);
  let [tokens, setTokens] = useState(initialTokens);

  useEffect(() => {
    if (!active) return;
    const tokenBalances = tokens.map((token) => {
      if (token.name1 === "Ether") {
        return fetcher(library, "getBalance", account);
      }
      return fetcher(library, token.address, erc20.abi, "balanceOf", account);
    });

    let newTokens = [];

    Promise.all(tokenBalances).then((balances) => {
      balances.forEach((balance, index) => {
        newTokens.push({ ...tokens[index], balance: formatUnits(balance, 18) });
      });
      setTokens(newTokens);
    });
  }, [active, library, account, tokens]);

  useEffect(() => {
    if (price) return;
    axios
      .get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: tokens.map((token) => token.name2).join(","),
          vs_currencies: "usd",
        },
      })
      .then((res) => {
        const prices = res.data;
        const newTokens = [...tokens];
        for (const [tokenName, price] of Object.entries(prices)) {
          const token = newTokens.find((token) => token.name2 === tokenName);
          token.price = price;
        }
        setPrice(true);
        setTokens(newTokens);
      });
  });
  return tokens;
}
