import React from "react";
import PropTypes from "prop-types";

//MUI stuff
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

//MUI icons
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CloseIcon from "@material-ui/icons/Close";

const styles = {
  dialog: {
    position: "relative",
  },
  dialogTitle: {
    width: "23rem",
  },
  listItemText: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 3,
  },
};

const TokenList = ({ classes, open, handleClose }) => (
  <Dialog
    onClose={handleClose}
    aria-labelledby="simple-dialog-title"
    open={open}
    className={classes.dialog}
  >
    <DialogTitle className={classes.dialogTitle}>Select Token </DialogTitle>
    <List>
      <ListItem button>
        <ListItemIcon>
          <MonetizationOnIcon />
        </ListItemIcon>
        <div className={classes.listItemText}>
          <Typography variant="h6">ETH 80</Typography>
          <Typography variant="h6">$ 333</Typography>{" "}
        </div>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <MonetizationOnIcon />
        </ListItemIcon>
        <div className={classes.listItemText}>
          <Typography variant="h6">ETH 80</Typography>
          <Typography variant="h6">$ 333</Typography>{" "}
        </div>
      </ListItem>
    </List>
    <IconButton
      onClick={handleClose}
      aria-label="close"
      className={classes.closeBtn}
    >
      <CloseIcon />
    </IconButton>
  </Dialog>
);

TokenList.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(TokenList);
