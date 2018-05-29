import React, { Component } from "react";
import TopBar from "./TopBar/topBar";
import { MuiThemeProvider } from "material-ui/styles";
import theme from "./theme";
import Table from "./simpleTable";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <TopBar />
        <Table />
      </MuiThemeProvider>
    );
  }
}

export default App;
