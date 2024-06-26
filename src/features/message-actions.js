import client from "../api/client";

export const fetchMessages = (query, userType) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await client.get(`/messages/`, {
        params: { query, userType },
      });

      return response;
    };

    try {
      const response = await sendRequest();
      console.log(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.log(err?.response?.data.message);
    }
  };
};

// export const fetchMessagesWithTrader = (traderId) => {
//   return async (dispatch) => {
//     const sendRequest = async () => {
//       const response = await client.get(`/messages/convo`, {
//         params: { traderId },
//       });

//       return response;
//     };

//     try {
//       const response = await sendRequest();

//       return { success: true, data: response.data };
//     } catch (err) {
//       console.log(err?.response?.data.message);
//     }
//   };
// };
