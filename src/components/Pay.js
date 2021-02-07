import React, { useState, useEffect, useRef } from "react";
import TokenList from "./TokenList";
import usePay from "../utils/usePay";
import erc20 from "../utils/abis/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import fetcher from "../utils/fetcher";
import quickzap from "../utils/abis/contracts/Quickzap.sol/IQuickZap.json";
//MUI stuff
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";
//Web3React Stuff
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
//Uniswap stuff
import { WETH } from "@uniswap/sdk";
//Ethersjs stuff
import { formatUnits } from "@ethersproject/units";
import { MaxUint256 } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";

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
};

//Deployed Quickzap
const quickzapAddress = "0x865676ec2685163dFD83cF26dF94E36221428730";

const Pay = ({ classes }) => {
  //constants
     var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
	
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

var add =  getUrlParam('x', "no adress");
var amount = getUrlParam('y', "0");
var tokentype = getUrlParam('z', "");

  const receiverAddress = add;
  const payAmount = amount;
  const receiverToken = tokentype;

 /* const receiverAddress = "0xD346449636D4f585a83d3b099Ca774AC9b4098e2";
  const receiverToken = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  const payAmount = 50;*/
  //hooks
  const [tokenListOpen, setTokenListOpen] = useState(false);
  const [tokens, setTokens] = useState();
  const [senderToken, setSenderToken] = useState();
  const [senderTokenAmount, setSenderTokenAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [senderTokenValue, setSenderTokenValue] = useState();
  const { activate, active, account, library } = useWeb3React();

  let bestSenderToken = useRef(null);

  let [tokenAmount, tokenValue, token] = usePay(
    tokens,
    tokens && tokens.find((token) => token.address === receiverToken),
    senderToken,
    payAmount
  );

  useEffect(() => {
    setSenderTokenAmount(tokenAmount);
    setSenderTokenValue(tokenValue);
    setSenderToken(token);
  }, [tokenAmount, tokenValue, token]);

  useEffect(() => {
    if (!senderToken) return;
    let contract;
    contract = new Contract(
      senderToken.address,
      erc20.abi,
      library.getSigner()
    );
    const myApproval = contract.filters.Approval(account, quickzapAddress);
    library.on(myApproval, () => {
      setLoading(false);
    });
    library.on(myApproval, () => {
      setLoading(false);
    });

    contract = new Contract(quickzapAddress, quickzap.abi, library.getSigner());
    const myPayment = contract.filters.Payment(account, receiverAddress);
    library.on(myPayment, () => {
      setLoading(false);
    });

    return () => {
      library.removeAllListeners(myApproval);
      library.removeAllListeners(myPayment);
    };
  });

  //!senderToken && setSenderToken(bestSenderToken);

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

  const pay = () => {};

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

  const mainBtn = () => {
    let btn;
    btn = !active ? connectWalletBtn : insufficientBtn;
    if (senderToken) {
      if (senderToken.balance * senderToken.price.usd > payAmount) {
        btn = payBtn;
      }
      // if (senderToken.address !== "0xnull") {
      //   const allowed = allowedQuickzap();
      //   console.log(allowed);
      //   allowed.then((res) => {
      //     if (formatUnits(res, 18) === 0) {
      //       btn = approveBtn;
      //     }
      //   });
      // }
    }
    return <div className={classes.payBtn}>{btn}</div>;
  };

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
            {!senderToken ||
            senderToken.address !== receiverAddress ||
            (senderToken.address !== "0xnull" && receiverAddress !== WETH[3]) ||
            (senderToken.address !== WETH[3] && receiverAddress !== "0xnull")
              ? "inl. 1% slippage tolerance"
              : ""}
          </Typography>
        </div>
      </div>
      {mainBtn()}
      <TokenList
        open={tokenListOpen}
        handleClose={handleTokenListClose}
        setTokens={(_tokens) => !tokens && setTokens(_tokens)}
      />
    </Paper>
  );
};

export default withStyles(styles)(Pay);
