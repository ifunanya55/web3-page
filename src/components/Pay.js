import React, { useState } from "react";
import TokenList from "./TokenList";
import usePay from "../utils/usePay";
//MUI stuff
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";
//Web3React Stuff
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

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
    "& span": {
      fontSize: "20px",
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
};

const Pay = ({ classes }) => {
  //constants
  const receiverAddress = "0xD346449636D4f585a83d3b099Ca774AC9b4098e2";
  const receiverToken = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  const payAmount = 50;
  //hooks
  const [tokenListOpen, setTokenListOpen] = useState(false);
  const [tokens, setTokens] = useState();
  const [senderToken, setSenderToken] = useState();
  const { activate, active } = useWeb3React();

  const [senderTokenAmount, senderTokenValue] = usePay(
    tokens,
    receiverToken,
    senderToken,
    payAmount
  );

  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
  });

  const connectWalletBtn = (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      size="large"
      onClick={() => activate(injected)}
    >
      Connect Wallet
    </Button>
  );

  const payBtn = (
    <Button variant="contained" color="primary" fullWidth size="large">
      Pay
    </Button>
  );
  const approveBtn = (
    <Button variant="contained" color="primary" fullWidth size="large">
      Approve Token
    </Button>
  );
  const insufficientBtn = (
    <Button variant="contained" color="primary" fullWidth size="large" disabled>
      Insufficient Tokens
    </Button>
  );

  const mainBtn = () => {
    let btn;
    btn = !active ? connectWalletBtn : insufficientBtn;
    if (senderToken) {
      if (senderToken.balance > payAmount) {
        btn = payBtn;
      }
    }
    return <div className={classes.payBtn}>{btn}</div>;
  };

  const handleTokenListOpen = () => {
    setTokenListOpen(true);
  };

  const handleTokenListClose = (token) => {
    if (token) {
      setSenderToken(token);
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
          <span className={classes.input}>0.0</span>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ExpandMore />}
            onClick={handleTokenListOpen}
          >
            ETH
          </Button>
          <Typography className={classes.usdEqv} variant="subtitle2">
            USD 0.0 (inl. 1% slippage tolerance)
          </Typography>
        </div>
      </div>
      {mainBtn()}
      <TokenList
        open={tokenListOpen}
        handleClose={handleTokenListClose}
        setTokens={(tokens) => setTokens(tokens)}
      />
    </Paper>
  );
};

export default withStyles(styles)(Pay);
