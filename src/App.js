import React from "react";
import "./styles.css";

export default function App() {
  const [data, setData] = React.useState();
  // const [posts, setPosts] = React.useState({});

  const loadData = () => {
    const urls = [
      "https://jsonplaceholder.typicode.com/users",
      "https://jsonplaceholder.typicode.com/posts"
    ];

    Promise.all(urls.map(url => fetch(url)))
      .then(resp => Promise.all(resp.map(r => r.json())))
      .then(result => {
        result[0].forEach(user => {
          user["posts"] = result[1].filter(posts => {
            return posts.userId === user.id;
          });
        });
        setData(result[0]);
        // console.log(result[0]);
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
        {data
          ? data.map(el => (
              <React.Fragment key={el.name}>
                <span>{el.name}</span>
                {el.posts.map(item => (
                  <span>{item}</span>
                ))}
              </React.Fragment>
            ))
          : null}
        {/* {data[1]
          ? data[1].map(el => <span key={el.body}>{el.body}</span>)
          : null} */}
      </div>
    </div>
  );
}
