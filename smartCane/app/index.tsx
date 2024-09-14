import { Text, View, ViewProps } from "react-native";
import React, { useEffect, useState, useMemo, forwardRef } from "react";
import * as Location from "expo-location";
import { TGetVenueOptions } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";

import useMapView from "./useMapView";
import useVenue from "./useVenue";

const CustomView = forwardRef<View, ViewProps>((props, ref) => {
  return <View ref={ref} {...props} />;
});

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location: LocationObject = await Location.getCurrentPositionAsync({});
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
  
  const options = useMemo<TGetVenueOptions>(
    () => ({
      venue: "mappedin-demo-mall",
      clientId: "5eab30aa91b055001a68e996",
      clientSecret: "RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1"
    }),
    []
  );
  const venue = useVenue(options);
  const { elementRef, mapView } = useMapView(venue);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome to Smart Cane</Text>
      <Text>{text}</Text>
      <CustomView ref={elementRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}
