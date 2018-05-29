import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Popover from "material-ui/Popover";
import { MenuItem } from "material-ui/Menu";
import Avatar from "material-ui/Avatar";
import Typography from "material-ui/Typography";

const styles = {
  avatar: {
    "margin-right": "10px",
    color: "#fff",
    backgroundColor: "#888888"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    "align-items": "center",
    "border-bottom": "1px #dddddd solid"
  }
};

class AuthMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: props.anchorEl
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleClose = event => {
    this.setState({ anchorEl: null });
    if (event.target.id === "mi8") this.setState({ extra: " (sss)" });
  };

  show(anchorEl) {
    this.setState({ anchorEl: anchorEl });
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={open}
        onClose={this.handleClose}
      >
        <div className={classes.row}>
          <Avatar className={classes.avatar}>K</Avatar>
          <Typography variant="caption">Kirill.N</Typography>
        </div>

        <MenuItem id="mi8" onClick={this.handleClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={this.handleClose}>My account</MenuItem>
      </Popover>
    );
  }
}

AuthMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AuthMenu);
