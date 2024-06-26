import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { queryTrader } from "../features/trader-actions";

const useQueryTrader = (initialValue, queryType) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(initialValue);
  const [results, setResult] = useState([]);

  const handleChange = async (inputText) => {
    setValue(inputText);

    try {
      const response = await dispatch(queryTrader(inputText, queryType));

      setResult(response?.data);
      console.log(response.data);
    } catch (error) {
      console.log(
        "Error fetching data, ",
        error.message ? error?.message : error.response
      );
    }
  };

  return {
    value,
    onChangeText: handleChange,
    setValue,
    results,
    setResult,
  };
};

export default useQueryTrader;
