import React, { useState, useEffect, useRef, useCallback } from "react";
import TokenList from "./TokenList";
import usePay from "../utils/usePay";
import erc20 from "../utils/abis/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import fetcher from "../utils/fetcher";
import quickzap from "../utils/abis/contracts/Quickzap.sol/IQuickZap.json";
import { divide } from "mathjs";
//MUI stuff
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
//Web3React Stuff
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
//Uniswap stuff
import { WETH } from "@uniswap/sdk";
//Ethersjs stuff
import { formatUnits, parseUnits } from "@ethersproject/units";
import { MaxUint256 } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";

const styles = {
  pay: {
    display: "inline-block",
    position: "relative",
    top: "4rem",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "1rem",
    borderRadius: "30px",
    width: "23rem",
  },
  token: {
    borderRadius: 20,
    border: "1px solid rgb(247, 248, 250)",
    padding: "1rem 1rem",
    position: "relative",
    "& div": {
      justifyContent: "space-between",
      display: "flex",
    },
  },
  tokenSymbol: {
    fontWeight: "500",
  },
  payBtn: {
    marginTop: "1rem",
  },
  usdEqv: {
    position: "absolute",
    right: 10,
    top: 3,
  },
  selectToken: {
    fontSize: 15,
  },
  center: {
    textAlign: "center",
  },
};

//Deployed Quickzap
const quickzapAddress = "0xc6FED2F29e40ACb9b8ba06c9e9A03A7A34Bad4a0";
console.log(MaxUint256.toString());

const Pay = ({ classes }) => {
  //constants

  // function getUrlVars() {
  //   var vars = {};
  //   var parts = window.location.href.replace(
  //     /[?&]+([^=&]+)=([^&]*)/gi,
  //     function (m, key, value) {
  //       vars[key] = value;
  //     }
  //   );
  //   return vars;
  // }

  // function getUrlParam(parameter, defaultvalue) {
  //   var urlparameter = defaultvalue;
  //   if (window.location.href.indexOf(parameter) > -1) {
  //     urlparameter = getUrlVars()[parameter];
  //   }
  //   return urlparameter;
  // }

  // var add = getUrlParam("x", "0xnull");
  // var amount = getUrlParam("y", "0");
  // var tokentype = getUrlParam("z", "");

  // const receiverAddress = add;
  // const payAmount = amount;
  // const receiverToken = tokentype;

  const receiverAddress = "0xD346449636D4f585a83d3b099Ca774AC9b4098e2";
  const receiverToken = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  const payAmount = 50;

  //hooks
  const [tokenListOpen, setTokenListOpen] = useState(false);
  const [tokens, setTokens] = useState();
  const [senderToken, setSenderToken] = useState();
  const [senderTokenAmount, setSenderTokenAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [senderTokenValue, setSenderTokenValue] = useState();
  const [paid, setPaid] = useState(false);
  const [mainBtn, setMainBtn] = useState();
  const { activate, active, account, library } = useWeb3React();

  let bestSenderToken = useRef(null);

  let [tokenAmount, tokenValue, token, newPath] = usePay(
    tokens,
    tokens && tokens.find((token) => token.address === receiverToken),
    senderToken,
    payAmount
  );

  useEffect(() => {
    setSenderTokenAmount(tokenAmount);
    setSenderTokenValue(tokenValue);
    setSenderToken(token);
  }, [tokenAmount, tokenValue, token, newPath]);

  const pay = useCallback(() => {
    let path;
    let value = parseUnits("0");
    if (senderToken.address === "0xnull") {
      senderToken.address = AddressZero;
      value = parseUnits(senderTokenAmount.toString(), 18);
    } else if (receiverToken === "0xnull") {
      senderToken.address = AddressZero;
    }

    if (senderToken.address === receiverToken) {
      path = [receiverToken];
    } else {
      path = [senderToken.address, receiverToken];
    }

    const amountIn = parseUnits(senderTokenAmount.toString(), 18);
    const amountOut = parseUnits(
      divide(
        payAmount,
        tokens.find((token) => token.address === receiverToken).price.usd
      ).toString(),
      18
    );
    const deadline = Math.floor(Date.now() / 1000) + 20 * 6000000;
    setLoading(true);
    fetcher(
      library,
      quickzapAddress,
      quickzap.abi,
      "pay",
      path,
      amountIn,
      amountOut,
      receiverAddress,
      deadline,
      { value: value }
    );
  }, [receiverToken, library, senderToken, senderTokenAmount, tokens]);

  useEffect(() => {
    const injected = new InjectedConnector({
      supportedChainIds: [1, 3, 4, 5, 42],
    });

    const allowedQuickzap = async () => {
      const allowed = await fetcher(
        library,
        senderToken.address,
        erc20.abi,
        "allowance",
        account,
        quickzapAddress
      );
      return await allowed;
    };

    const approveQuickzap = async () => {
      fetcher(
        library,
        senderToken.address,
        erc20.abi,
        "approve",
        quickzapAddress,
        MaxUint256
      );
      setLoading(true);
    };

    let btn;
    btn = !active ? (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={() => activate(injected)}
      >
        Connect Wallet
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled
      >
        Insufficient Tokens
      </Button>
    );
    if (senderToken && senderToken.balance && senderToken.price) {
      if (senderToken.balance >= senderTokenAmount) {
        btn = (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={pay}
          >
            Pay
          </Button>
        );
      }
      if (senderToken.address !== "0xnull") {
        const allowed = allowedQuickzap();
        allowed.then((res) => {
          if (formatUnits(res, 18) < senderTokenAmount) {
            btn = (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={approveQuickzap}
              >
                Approve Token
              </Button>
            );
            setMainBtn(btn);
          }
        });
      }
    }
    setMainBtn(btn);
  }, [senderToken, active, account, library, activate, pay, senderTokenAmount]);

  useEffect(() => {
    if (!senderToken || !senderToken.balance || !senderToken.price) return;
    let contract, myApproval;
    if (senderToken.address !== "0xnull") {
      contract = new Contract(
        senderToken.address,
        erc20.abi,
        library.getSigner()
      );
      myApproval = contract.filters.Approval(account, quickzapAddress);
      library.on(myApproval, () => {
        setLoading(false);
        setSenderToken({ ...senderToken });
      });
    }

    contract = new Contract(quickzapAddress, quickzap.abi, library.getSigner());
    const myPayment = contract.filters.Payment(account, receiverAddress);
    library.on(myPayment, () => {
      setPaid(true);
      setLoading(false);
    });

    return () => {
      senderToken.address !== "0xnull" &&
        library.removeAllListeners(myApproval);
      library.removeAllListeners(myPayment);
    };
  });

  //!senderToken && setSenderToken(bestSenderToken);

  const handleTokenListOpen = () => {
    setTokenListOpen(true);
  };

  const handleTokenListClose = (token) => {
    if (token.address) {
      setSenderToken(token);
      bestSenderToken.current = undefined;
    }
    setTokenListOpen(false);
  };

  return (
    <Paper className={classes.pay}>
      <div className={classes.token}>
        <Typography variant="h6">Pay</Typography>
        <div>
          <span>{payAmount}</span>
          <span className={classes.tokenSymbol}>USD</span>
        </div>
      </div>
      <br />
      <div className={classes.token}>
        <Typography variant="h6">With</Typography>
        <div>
          <span className={classes.input}>{senderTokenAmount || "0.0"}</span>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ExpandMore />}
            onClick={handleTokenListOpen}
            className={classes.selectToken}
          >
            {senderToken ? senderToken.symbol : "Select Token"}
          </Button>
          <Typography className={classes.usdEqv} variant="subtitle2">
            USD {senderTokenValue || "0.0"}{" "}
            {senderToken &&
            senderToken.address !== receiverToken &&
            senderToken.address !== "0xnull" &&
            receiverToken !== WETH[3] &&
            senderToken.address !== WETH[3] &&
            receiverToken !== "0xnull"
              ? "inl. 1% slippage tolerance"
              : ""}
          </Typography>
        </div>
      </div>
      {loading ? (
        <div className={classes.center}>
          <CircularProgress color="primary" size={60} />
        </div>
      ) : paid ? (
        <div className={classes.center}>
          <CheckCircleIcon color="primary" fontSize="large" />
        </div>
      ) : (
        <div className={classes.payBtn}>{mainBtn}</div>
      )}
      <TokenList
        open={tokenListOpen}
        handleClose={handleTokenListClose}
        setTokens={(_tokens) => !tokens && setTokens(_tokens)}
      />
    </Paper>
  );
};

export default withStyles(styles)(Pay);
