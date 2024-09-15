import {
    Mappedin,
    MapView,
    showVenue,
    TMapViewOptions
  } from "@mappedin/mappedin-js";
  import { useCallback, useEffect, useRef, useState } from "react";
  import { View } from "react-native";
  
  export default function useMapView(
    venue: Mappedin | undefined,
    options?: TMapViewOptions
  ) {
    // Store the MapView instance in a state variable
    const [mapView, setMapView] = useState<MapView | undefined>();
    const mapRef = useRef<View | null>(null);
    const isRendering = useRef(false);
  
    // Render the MapView asynchronously
    const renderVenue = useCallback(
      async (el: View, venue: Mappedin, options?: TMapViewOptions) => {
        if (isRendering.current === true || mapView != null) {
          return;
        }
  
        isRendering.current = true;
  
        const _mapView = await showVenue(el, venue, options);
        setMapView(_mapView);
  
        isRendering.current = false;
      },
      [isRendering, mapView, setMapView]
    );
  
    // Pass this ref to the target div which will render the MapView
    const elementRef = useCallback(
      (element: View | null) => {
        if (element == null) {
          return;
        }
  
        mapRef.current = element;
  
        if (mapView == null && venue != null && isRendering.current == false) {
          renderVenue(element, venue, options);
        }
      },
      [mapView, venue, renderVenue, options]
    );
  
    // Initialize the MapView if the element has beeeate andd the and venue loaded afterwards
    useEffect(() => {
      if (mapView) {
        return;
      }
  
      if (mapRef.current != null && venue != null) {
        renderVenue(mapRef.current, venue, options);
      }
    }, [venue, mapView, renderVenue, options]);
  
    return { mapView, elementRef };
  }