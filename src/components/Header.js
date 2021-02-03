import React from "react";

//MUI stuff
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

const Header = ({ classes }) => (
  <header className={classes.header}>
    <h2>Logo</h2>
    <Button variant="contained" color="primary">
      Connect Wallet
    </Button>
  </header>
);

export default withStyles(styles)(Header);
