import classes from "./App.module.css";
import Header from "./components/Header";
import Pay from "./components/Pay";
//MUI stuff
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
//Web3React stuff
import { Web3ReactProvider } from "@web3-react/core";
//Ethersjs stuff
import { Web3Provider } from "@ethersproject/providers";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7a17f9",
    },
    secondary: {
      main: "#ff13b0",
    },
  },
});

const getLibrary = (provider, connector) => new Web3Provider(provider);

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme}>
        <div className={classes.App}>
          <Header />
          <Pay />
        </div>
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default App;
