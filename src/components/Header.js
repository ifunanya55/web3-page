import React from "react";
import quickzapLogo from "../images/quickzap1.png";
//MUI stuff
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
//Web3React stuff
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const styles = {
  logo: {
    width: "9rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  account: {
    padding: "0.5rem 0.3rem",
    border: "1px solid rgb(247, 248, 250)",
  },
};

const Header = ({ classes }) => {
  const { activate, active, account } = useWeb3React();
  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
  });

  const connectWallet = (
    <Button
      variant="contained"
      color="primary"
      onClick={() => activate(injected)}
    >
      Connect Wallet
    </Button>
  );

  return (
    <header className={classes.header}>
      <img className={classes.logo} src={quickzapLogo} alt="logo" />
      {active ? (
        <Paper className={classes.account}>
          <Typography variant="body1">{`${account.slice(
            0,
            6
          )}...${account.slice(-5, -1)}`}</Typography>
        </Paper>
      ) : (
        connectWallet
      )}
    </header>
  );
};

export default withStyles(styles)(Header);
