import React from 'react';
import axios from 'axios'
import {withRouter} from 'react-router-dom'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this)
  }

  change(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  submit(e) {
    
    e.preventDefault();
    axios.post('/login',{
        email: this.state.email,
        password: this.state.password
    })
    .then(res=>{
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        this.props.history.push('/main')
    })
  }
  render() {
    return (
      <div style={{textAlign:"center"}}>
        <form onSubmit={e=>this.submit(e)}>
          <label>Email:</label>
          <br/>
          <input
            name="email"
            type="text"
            value={this.state.email}
            onChange={(e) => this.change(e)}
          ></input>
          <br/>
          <label>Password:</label>
          <br/>
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={(e) => this.change(e)}
          ></input>
          <br/>
          <button>log in</button>
        </form>
      </div>
    );
  }
}

export default withRouter(Login)