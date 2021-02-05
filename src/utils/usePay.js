import React from "react";

//mathjs stuff
import { fraction } from "mathjs";
//Uniswap stuff
import {
  ChainId,
  Token,
  TokenAmount,
  Pair,
  TradeType,
  Route,
} from "@uniswap/sdk";

export default function usePay(tokens, receiverToken, senderToken, payAmount) {
  if (!tokens || !tokens[0].price || !tokens[0].balance) return [0, 0];

  receiverToken = tokens.find((token) => token.address === receiverToken);
  const receiverTokenAmount = fraction(payAmount, receiverToken.price.usd);
  console.log(receiverTokenAmount);

  const uniReceiverToken = new Token(
    receiverToken.chainId,
    receiverToken.address,
    receiverToken.decimals,
    receiverToken.symbol,
    receiverToken.name
  );

  return [0, 0];
}
