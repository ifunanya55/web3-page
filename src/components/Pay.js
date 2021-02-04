import React, { useState } from "react";
import TokenList from "./TokenList";
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
  //hooks
  const [tokenListOpen, setTokenListOpen] = useState(false);
  const { activate, active, account } = useWeb3React();

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

  const handleTokenListOpen = () => {
    setTokenListOpen(true);
  };

  const handleTokenListClose = () => {
    setTokenListOpen(false);
  };

  return (
    <Paper className={classes.pay}>
      <div className={classes.token}>
        <Typography variant="h6">Pay</Typography>
        <div>
          <span>0.0</span>
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
      {console.log(active)}
      <div className={classes.payBtn}>{active ? payBtn : connectWalletBtn}</div>
      <TokenList open={tokenListOpen} handleClose={handleTokenListClose} />
    </Paper>
  );
};

export default withStyles(styles)(Pay);
