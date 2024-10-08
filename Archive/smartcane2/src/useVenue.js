import { Mappedin, TGetVenueOptions, getVenue } from "@mappedin/mappedin-js";
import { useEffect, useState } from "react";

export default function useVenue(options) {
  const [venue, setVenue] = useState();

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const data = await getVenue(options);
        if (!ignore) {
          setVenue(data);
        }
      } catch (e) {
        setVenue(undefined);
      }
    }
    fetchData();
    return () => {ignore = true;};
  }, [options]);

  return venue;
}
