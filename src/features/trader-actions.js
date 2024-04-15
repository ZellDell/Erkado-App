import client from "../api/client";

export const queryTrader = (inputText, queryType) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.get(`/traders/search`, {
        params: { inputText, queryType },
      });

      return response;
    };

    try {
      const response = await sendRequest();
      console.log("Responses ", response);
      return { success: true, data: response.data };
    } catch (err) {
      console.log(err?.response?.data.message);
    }
  };
};

export const queryTraderInRadius = (userLat, userLong, Radius) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.get(`/traders/searchInRadius`, {
        params: { userLat, userLong, Radius },
      });

      return response;
    };

    try {
      const response = await sendRequest();

      return { success: true, data: response.data };
    } catch (err) {
      console.log(err?.response?.data.message);
    }
  };
};
