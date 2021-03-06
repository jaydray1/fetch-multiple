import React from "react";
import "./styles.css";

export default function App() {
  const [data, setData] = React.useState();
  // const [specificUsers, setSpecificUsers] = React.useState();
  const [missingUsers, setMissingUsers] = React.useState();
  const groupRef = React.useRef([1, 4, 12, 32]);

  const loadData = userIds => {
    const queryUrl = buildQuery(
      "https://jsonplaceholder.typicode.com/users",
      userIds
    );
    const urls = [queryUrl, "https://jsonplaceholder.typicode.com/posts"];

    Promise.all(urls.map(url => fetch(url)))
      .then(resp => Promise.all(resp.map(r => r.json())))
      .then(result => {
        result[0].forEach(user => {
          user["posts"] = result[1].filter(posts => {
            return posts.userId === user.id;
          });
        });
        // setData(Object.assign({}, (result[0])));
        setData(result[0]);
        // console.log(data);
        setMissingUsers(checkForMissingIds(result[0], userIds.current));
      });
  };

  const checkForMissingIds = (response, ids) => {
    const missingIds = [];
    for (let i = 0; i < ids.length; i++) {
      const found = response.find(item => item.id === ids[i]);
      if (found) {
        continue;
      } else {
        missingIds.push(ids[i]);
      }
    }
    return missingIds;
  };

  const buildQuery = (baseUrl, userIds) => {
    let appendParams = "";
    // console.log('inside build', baseUrl, userIds.current)
    if (!userIds.current.length) return baseUrl;
    appendParams = userIds.current
      .reduce((acc, curr) => {
        return acc + "id=" + curr + "&";
      }, `${baseUrl}?`)
      .slice(0, -1);
    return appendParams;
  };

  return (
    <div className="App">
      <h1>Data Fetching</h1>
      <h2>
        Fetch users and posts, append posts on users, and fetch a specific list
        of users
      </h2>
      {missingUsers &&
        missingUsers.map(item => (
          <p style={{ fontStyle: "italic" }} key={item}>
            User: {item} could not be found, please check users
          </p>
        ))}
      <button onClick={() => loadData(groupRef)}>Load Data</button>
      <div className="data-cards">
        {data
          ? data.map(el => (
              <div key={el.name} className="data-card">
                <h3>{el.name}</h3>
                {el.posts.map((item, index) => (
                  <div className="post-container">
                    <p key={index}>{item.body}</p>
                    <div className="bottom-line" />
                  </div>
                ))}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
