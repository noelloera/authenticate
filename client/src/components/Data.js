import React from "react";
import axios from 'axios'
import {getToken, clearToken} from './helpers/jwt'
import {withRouter} from 'react-router-dom'
//Data can be a parent component, since its protected it will only mount if 
//Authentication was valid
class Data extends React.Component{
  constructor(props){
    super(props)
    this.state={
      username: undefined,
      lists:[]

    }
  }
  componentDidMount(){
    const jwt = getToken()
    if(!jwt){
      this.props.history.push('/login')
    }
    try{
      axios.get('/me/',{
        headers:{
          Authorization: `Bearer ${jwt}`
        }
      })
      .then(res=>{
        this.setState({
          username: res.data.username,
          lists: res.data.lists
        })
        console.log(this.state)
      })
    }catch(err){
      console.log(err)
      clearToken();
      this.props.history.push('/login')
    }
  }

  render(){
    return <div><h2>{this.state.username}</h2>
    <h4>{this.state.lists.map(obj=>{
      return <h4>{obj.name}</h4>
    })}</h4>
    </div>
    
  }
}
/*
const Data = (props) => {
  return (
    <div>
      <h1>{props.data.username}</h1>
      {props.data.lists.map((list) => {
        return (
          <ol key={list._id}>
            <h2>{list.name}</h2>
            {list.items.map((item) => {
              return <li key={item._id}>{item.value}</li>;
            })}
          </ol>
        );
      })}
    </div>
  );
};*/

export default withRouter(Data)
