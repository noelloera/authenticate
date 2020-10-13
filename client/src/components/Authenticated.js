import React from "react";
import { getToken } from "./helpers/jwt";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Data from "./Data";

class Authenticated extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: false };
  }

  componentDidMount() {
    const jwt = getToken();
    if (!jwt) {
      this.props.history.push("/login");
    }
    axios
      .get("/me/", {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then((res) => {
        //Here you can choose what happens w
        //status codes
        if(res.status===204||res.status===304){
          this.setState({authenticated:true})
        }
      })
      .catch((err) => {
        localStorage.removeItem("access_token");
        this.props.history.push("/login");
      });
  }
  render(){
    if(this.state.authenticated){
      {this.props.history.push('/login')}
    }
    return(
      <Data/>
    )
  }

}

export default withRouter(Authenticated);
