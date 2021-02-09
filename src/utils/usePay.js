import { useState, useEffect, useRef } from "react";
//mathjs stuff
import { divide } from "mathjs";
//Uniswap stuff
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
  Percent,
} from "@uniswap/sdk";

const getToken = (token) =>
  new Token(
    token.chainId,
    (token.address =
      token.address === "0xnull"
        ? WETH[ChainId.ROPSTEN].address
        : token.address),
    token.decimals,
    token.symbol,
    token.name1
  );

const getTrade = async (sendToken, receiveToken, amountIn) => {
  //sending and receiving same token
  if (sendToken === receiveToken) return;
  //eth and weth
  if (sendToken.symbol === "WETH" && receiveToken.symbol === "ETH")
    return "WETH";
  if (sendToken.symbol === "ETH" && receiveToken.symbol === "WETH")
    return "ETH";

  sendToken = getToken(sendToken);
  receiveToken = getToken(receiveToken);

  let sendPair, receivePair;

  if (
    sendToken.address !== WETH[ChainId.ROPSTEN].address &&
    receiveToken.address !== WETH[ChainId.ROPSTEN].address
  ) {
    sendPair = await Fetcher.fetchPairData(sendToken, WETH[ChainId.ROPSTEN]);
    receivePair = await Fetcher.fetchPairData(
      receiveToken,
      WETH[ChainId.ROPSTEN]
    );
  } else {
    sendPair = await Fetcher.fetchPairData(sendToken, receiveToken);
  }
  const path = receivePair ? [sendPair, receivePair] : [sendPair];
  const route = new Route(path, sendToken);

  const trade = new Trade(
    route,
    new TokenAmount(receiveToken, amountIn),
    TradeType.EXACT_OUTPUT
  );
  console.log(trade.route.path);
  return trade;
};

let trades, amountsIn, sendPrices;

export default function usePay(tokens, receiveToken, sendToken, payAmount) {
  const [senderTokenAmount, setSenderTokenAmount] = useState(0);
  const [senderTokenValue, setSenderTokenValue] = useState(0);

  const bestToken = useRef(null);

  useEffect(() => {
    if (!tokens || !tokens[0].price || !tokens[0].balance) return [0, 0];

    const slippageTolerance = new Percent("100", "10000"); // 50 bips, or 0.50%
    const amountIn = parseInt(
      divide(payAmount, receiveToken.price.usd) * 10 ** 18
    );
    const getTrades = (trades) =>
      !trades
        ? tokens.map((token) => getTrade(token, receiveToken, amountIn))
        : trades;

    trades = getTrades(trades);
    amountsIn = Promise.all(trades).then((trades) => {
      return trades.map((trade) => {
        if (typeof trade === "string") {
          return divide(
            payAmount,
            tokens.find((token) => token.symbol === trade).price.usd
          );
        }
        if (!trade) {
          return divide(payAmount, receiveToken.price.usd);
        }

        return divide(
          parseInt(trade.maximumAmountIn(slippageTolerance).raw.toString()),
          10 ** 18
        );
      });
    });

    let index;
    amountsIn
      .then((amounts) => {
        amountsIn = amounts;
        sendPrices = amounts.map((amount, index) => {
          return (amount * tokens[index].price.usd).toFixed(2);
        });
      })
      .then(() => {
        if (!sendToken) {
          index = sendPrices.indexOf(Math.min(...sendPrices).toString());
        } else {
          index = tokens.findIndex((token) => {
            return token.address === sendToken.address;
          });
        }

        bestToken.current = tokens[index];
        setSenderTokenAmount(amountsIn[index]);
        setSenderTokenValue(sendPrices[index]);
        // const newPath = () => {
        //   if (!trades[index]) return [sendToken.address];
        //   else if (trades[index] === "ETH") return [AddressZero];
        //   else if (trades[index] === "WETH") return [WETH[ChainId.ROPSTEN]];
        //   else {
        //     console.log(trades[index]);
        //     return trades[index].route.path.map((token) => token.address);
        //   }
        // };
        // setPath(newPath);
      });
  }, [payAmount, sendToken, tokens, receiveToken]);

  return [senderTokenAmount, senderTokenValue, sendToken || bestToken.current];
}
