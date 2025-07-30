import "../css/App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {

  /// home
    const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((response) => {
        setData(response.data.message)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>{data}</h1>
      </header>
    </div>
  );
}

export default Home;