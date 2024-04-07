import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { queryTrader } from "../features/trader-actions";

const getRoute = ({ startingCoords, endingCoords }) => {
  const dispatch = useDispatch();

  const [routeDirections, setRouteDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [offSet, setOffSet] = useState(null);
  const [HorioffSet, setHoriOffSet] = useState(null);
  const [zoomLvl, setZoomLvl] = useState(null);

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
      setOffSet(0.0001);
      setZoomLvl(18);
    } else if (distance < 1) {
      setOffSet(0.0001);
      setZoomLvl(17);
    } else if (distance < 2) {
      setOffSet(0.0004);
      setZoomLvl(16);
    } else if (distance < 3) {
      setOffSet(0.0008);
      setZoomLvl(15.5);
    } else if (distance < 4) {
      setOffSet(0.01);
      setZoomLvl(13.4);
      setHoriOffSet(-0.005);
    } else if (distance < 5) {
      setOffSet(0.015);
      setZoomLvl(13.5);
      setHoriOffSet(-0.003);
    } else {
      setOffSet(0.018);
      setZoomLvl(12);
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

  useEffect(() => {
    queryRoute();
  }, []);
  return {
    routeDirections,
    distance,
    offSet,
    HorioffSet,
    zoomLvl,
    queryRoute,
  };
};

export default getRoute;
