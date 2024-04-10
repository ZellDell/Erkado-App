import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { queryTrader } from "../features/trader-actions";

const getRoute = ({ startingCoords, endingCoords }) => {
  const dispatch = useDispatch();

  const [routeDirections, setRouteDirections] = useState(null);
  const [distance, setDistance] = useState(null);

  const [zoomLvl, setZoomLvl] = useState(null);

  const [coordinates, setCoordinates] = useState([]);

  function makeRouterFeature(coordinates) {
    let routerFeature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      ],
    };
    return routerFeature;
  }

  const handleDistance = (distance) => {
    if (distance < 0.5) {
      setZoomLvl(18);
    } else if (distance < 1) {
      setZoomLvl(16);
    } else if (distance < 2) {
      setZoomLvl(15.5);
    } else if (distance < 4) {
      setZoomLvl(13.5);
    } else {
      setZoomLvl(13);
    }
  };

  const queryRoute = async () => {
    const APIKEY =
      "pk.eyJ1IjoiemVsbGRlbGwiLCJhIjoiY2x0d3hjdG91MDBheTJqczdqcHRjdWhpZSJ9.UyWdrUlPhJlQN-XE_JoP6Q";
    const startCoords = startingCoords;
    const endCoords = endingCoords;
    const geometries = "geojson";

    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${startCoords};${endCoords}?alternatives=true&geometries=${geometries}&steps=true&overview=full&access_token=${APIKEY}`;

    try {
      let response = await axios.get(url); // Use Axios instead of fetch

      const data = response.data.routes.map((data) => {
        DISTANCE = (data.distance / 1000).toFixed(2);
        setDistance(DISTANCE);
      });
      handleDistance(DISTANCE);
      console.log(DISTANCE);

      let coords = response.data["routes"][0]["geometry"]["coordinates"];
      if (coords.length) {
        const routerFeature = makeRouterFeature([...coords]);
        setRouteDirections(routerFeature);
      }
    } catch (error) {
      console.log(
        "Error fetching directions, ",
        error?.response ? error?.response : error
      );
    }
  };

  const calculateMidpoint = () => {
    let lon1 = startingCoords[0];
    let lat1 = startingCoords[1];

    let lon2 = endingCoords[0];
    let lat2 = endingCoords[1];

    let avgLat = (lat1 + lat2) / 2;
    let avgLon;

    if (Math.abs(lon1 - lon2) > 180) {
      if (lon1 > 0) {
        lon1 -= 360;
      } else {
        lon2 -= 360;
      }
    }
    avgLon = (lon1 + lon2) / 2;

    setCoordinates([avgLat, avgLon]);
  };

  useEffect(() => {
    queryRoute();
    calculateMidpoint();
  }, []);
  return {
    routeDirections,
    distance,
    coordinates,
    calculateMidpoint,
    zoomLvl,
    queryRoute,
  };
};

export default getRoute;
