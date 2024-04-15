import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransaction } from "../features/transaction-actions";

const useQueryTransaction = (initialValue, userType) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(initialValue);
  const [results, setResult] = useState([]);

  const handleChange = async (inputText) => {
    setValue(inputText);
    console.log("USERTYPE = ", userType);
    try {
      const transaction = await dispatch(
        fetchTransaction({ UserType: userType, query: inputText })
      );

      setResult(transaction?.data.transactions);
      console.log("=========", transaction?.data.transactions);
    } catch (error) {
      console.log(
        "Error fetching data, ",
        error.message ? error?.message : error.response
      );
    }
  };

  // useEffect(() => {
  //   handleChange(initialValue);
  // }, []);

  return {
    value,
    onChangeText: handleChange,
    setValue,
    results,
    setResult,
  };
};

export default useQueryTransaction;
