import React from "react";
import Paper from "@material-ui/core/Paper";

//MUI stuff
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";

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
  },
};

const Pay = ({ classes }) => {
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
          <Button variant="contained" color="primary" endIcon={<ExpandMore />}>
            ETH
          </Button>
          <Typography className={classes.usdEqv}>
            USD 0.0 (inl. 1% price change tolerance)
          </Typography>
        </div>
      </div>

      <div className={classes.payBtn}>
        <Button variant="contained" color="primary" fullWidth size="large">
          Connect Wallet
        </Button>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(Pay);
