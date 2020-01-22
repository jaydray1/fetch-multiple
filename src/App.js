import React from "react";
import "./styles.css";

export default function App() {
  const [data, setData] = React.useState({});
  // const [posts, setPosts] = React.useState({});

  const loadData = () => {
    const urls = [
      "https://jsonplaceholder.typicode.com/users",
      "https://jsonplaceholder.typicode.com/posts"
    ];

    Promise.all(urls.map(url => fetch(url)))
      .then(resp => Promise.all(resp.map(r => r.json())))
      .then(result => {
        setData(result);
        console.log(data[0]);
      });
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "10em",
          justifyContent: "center"
        }}
      >
        <button onClick={loadData}>Load Data</button>
        {data[0]
          ? data[0].map(el => <span key={el.name}>{el.name}</span>)
          : null}
        {data[1]
          ? data[1].map(el => <span key={el.body}>{el.body}</span>)
          : null}
      </div>
    </div>
  );
}
