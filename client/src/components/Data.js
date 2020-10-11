import React from "react";

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
};

export default Data;

