import React from "react";
import { getToken } from "./helpers/jwt";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Data from "./Data";

class Authenticated extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: undefined };
  }

  componentDidMount() {
    const jwt = getToken();
    if (!jwt) {
      this.props.history.push("./Login");
    }
    axios
      .get("/me/", {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then((res) => {
        this.setState({
          user: res.data,
        });
      })
      .catch((err) => {
        localStorage.removeItem("access_token");
        this.props.history.push("/Login");
      });
  }
  render() {
    const style={
        textAlign: "center"
    };

    if (this.state.user === undefined) {
      return (
        <div>
          <h1>loading...</h1>
        </div>
      );
    }
    return (
      <div style={style}>
        <Data data={this.state.user} />
      </div>
    );
  }
}

export default withRouter(Authenticated);
