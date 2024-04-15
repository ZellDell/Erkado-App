import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { queryTrader } from "../features/trader-actions";
import { fetchMessages } from "../features/message-actions";

const useQueryMessages = (initialValue, userType) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(initialValue);
  const [results, setResult] = useState([]);

  const handleChange = async (inputText) => {
    setValue(inputText);

    try {
      const response = await dispatch(fetchMessages(inputText, userType));

      setResult(response?.data);
      console.log("SEARCH RESULT ==============", response.data);
    } catch (error) {
      console.log(
        "Error fetching data, ",
        error.message ? error?.message : error.response
      );
    }
  };
  useEffect(() => {
    handleChange(value);
  }, []);

  return {
    value,
    onChangeText: handleChange,
    setValue,
    results,
    setResult,
  };
};

export default useQueryMessages;
