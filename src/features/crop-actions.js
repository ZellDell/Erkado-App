import client from "../api/client";
import { cropActions } from "./crop-slice";

export const requestCrops = () => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.get(`/crops/`);

      return response;
    };

    try {
      const { data } = await sendRequest();

      const crops = data.Crops.map((crop) => ({
        CropID: crop.CropID,
        CropName: crop.CropName,
        Description: crop.Description,
        Uri: crop.Image,
      }));
      const quality = data.Quality.map((crop) => ({
        QualityType: crop.QualityType,
        QualityTypeID: crop.QualityTypeID,
      }));

      dispatch(cropActions.setCrops({ crops }));
      dispatch(cropActions.setQuality({ quality }));
    } catch (err) {
      console.log(err);
    }
  };
};

export const setCrops = (crops) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.get(`/crops/setCrops`, {
        crops,
      });

      return response;
    };

    try {
      const { data } = await sendRequest();
      const crops = data.Crops.map((crop) => ({
        CropID: crop.CropID,
        Quality: crop.QualityType.QualityType,
        Type: crop.Type.Type,
        CropName: crop.CropName,
        Description: crop.Description,
        Uri: crop.Image,
      }));

      dispatch(cropActions.setCrops({ crops }));
      //   dispatch(uiActions.setAsNewUser(false));
    } catch (err) {
      console.log(err);
    }
  };
};
