import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { TGetVenueOptions } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import useMapView from "./useMapView";
import useVenue from "./useVenue";

const options = { //TODO: talk to Mappedin about this
  key: "mik_Qar1NBX1qFjtljLDI52a60753",
  mapId: "66ce20fdf42a3e000b1b0545",
  secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee"
};

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    const watchId = getUserLocation();
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const getUserLocation = () => {
    if(navigator.geolocation){
      const watch = navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        setUserLocation({latitude,longitude});
      },
      (error)=>{
        console.error('error getting location: ',error)
      }
    );
    return watch;
    }
    else console.error('Geolocation is not supported by this browser');
  }

  //mappedin
  const mapRef = useRef(null);
  const venue = useVenue(options);
  const mapView = useMapView(mapRef.current, venue);

  async function getDirections(end="E7 Main Entrance"){
    const startLocation = venue.locations.find((location) => location.coords === userLocation);
  
    //Find the location with the name "The Body Shop" to use as an end point.
    const endLocation = venue.locations.find((location) => location.name === "The Body Shop");
  
    //Get directions between the start and end locations.
    const directions = startLocation?.directionsTo(endLocation);
  
    console.log(directions.instructions[0]);
  }

  return (
    <div className="App">
        <p>Welcome to smart cane</p>
      <div className='App-link'>
        {/*userLocation ? 
        <div>
        <p>Latitude: {JSON.stringify(userLocation.latitude)}</p>
        <p>Longitude: {JSON.stringify(userLocation.longitude)}</p>
        </div>
        : <p>Getting the location data</p>*/}
      </div>
      <div style={{'background-color':'#000000','border':'10px'}}><div  id="app" ref={mapRef} /></div>
      <button onClick={()=>getDirections()}>get directions</button>
      
    </div>
  );
}
