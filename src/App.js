import React from "react";
import "./styles.css";

export default function App() {
  const [data, setData] = React.useState();
  // const [specificUsers, setSpecificUsers] = React.useState();
  const [missingUsers, setMissingUsers] = React.useState();

  const loadData = (userIds = []) => {
    // let appendParams = '';
    // if (userIds.length) {
    //   // filteredUrl = "https://jsonplaceholder.typicode.com/users?id=1&id=5"
    //   userIds.reduce((acc, curr) => {
    //     return acc+curr+'&';
    //   }, 'https://jsonplaceholder.typicode.com/users?')
    // }
    const urls = [
      "https://jsonplaceholder.typicode.com/users?id=1&id=11",
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
        // setData(Object.assign({}, (result[0])));
        setData(result[0]);
        // console.log(data);
        setMissingUsers(checkForMissingIds(result[0], [1, 11]));

        // const users = data.filter((user) => {
        //   const foundUser = userIds.map((found) => {
        //     return found === user.userId;
        //   })
        //   return foundUser;
        // });

        // setSpecificUsers(users);
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

  return (
    <div className="App">
      <h1>Hello Team</h1>
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "10em",
          justifyContent: "center"
        }}
      >
        <button onClick={loadData}>Load Data</button>
        <div>
          {data
            ? data.map(el => (
                <div key={el.name}>
                  <h3>{el.name}</h3>
                  {el.posts.map((item, index) => (
                    <p key={index}>{item.body}</p>
                  ))}
                </div>
              ))
            : null}
        </div>
        {/* {data[1]
          ? data[1].map(el => <span key={el.body}>{el.body}</span>)
          : null} */}
      </div>
    </div>
  );
}
