import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import logo from "../logo.svg";
import IconButton from "material-ui/IconButton";
import Icon from "material-ui/Icon";
import AuthMenu from "./authMenu";

const styles = {
  bar: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  logo: {
    "margin-right": "10px",
    height: "30px"
  },
  icon: {
    margin: "10px"
  }
};

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.authMenu = null;
  }

  showAuthMenu = event => {
    this.authMenu.show(event.currentTarget);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.bar}>
        <AppBar position="static">
          <Toolbar>
            <img src={logo} className={classes.logo} alt="logo" />

            <Typography variant="title" color="inherit" className={classes.flex}>
              WishList1
            </Typography>

            <IconButton onClick={this.showAuthMenu} color="inherit">
              <Icon className={classes.icon} color="inherit">
                assignment_turned_in
              </Icon>
            </IconButton>

            <IconButton aria-haspopup="true" onClick={this.showAuthMenu} color="inherit">
              <Icon className={classes.icon}>account_circle</Icon>
            </IconButton>
            <AuthMenu onRef={ref => (this.authMenu = ref)} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TopBar);
