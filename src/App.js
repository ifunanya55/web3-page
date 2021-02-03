import classes from "./App.module.css";
import Header from "./components/Header";
import Pay from "./components/Pay";

//MUI stuff
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.App}>
        <Header />
        <Pay />
      </div>
    </ThemeProvider>
  );
}

export default App;
