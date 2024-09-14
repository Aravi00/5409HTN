import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from 'react';
import * as Location from "expo-location";

function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;
    text = JSON.stringify({latitude, longitude});
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to smart cane</p>
      </header>
      <p>{text}</p>

    </div>
  );
}

export default App;
