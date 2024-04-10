import { useEffect, useState } from "react";

const getTimeAgoUtil = () => {
  const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = now - date;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    // Check the time elapsed and return the appropriate description
    if (secondsDifference < 30) {
      return "Just now";
    } else if (secondsDifference < 60) {
      return "Few seconds ago";
    } else if (minutesDifference < 2) {
      return "A minute ago";
    } else if (minutesDifference < 5) {
      return "5 minutes ago";
    } else if (minutesDifference < 60) {
      return `${minutesDifference} minutes ago`;
    } else if (hoursDifference < 1) {
      return "An hour ago";
    } else if (hoursDifference < 24) {
      return `${hoursDifference} hours ago`;
    } else if (daysDifference < 1) {
      return "A day ago";
    } else if (daysDifference < 30) {
      return `${daysDifference} days ago`;
    } else {
      // For months and years, you can customize the logic as needed
      // For simplicity, let's return the date in YYYY-MM-DD format
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Month is zero-based
      const day = date.getDate();
      return `${year}-${month < 10 ? "0" : ""}${month}-${
        day < 10 ? "0" : ""
      }${day}`;
    }
  };

  return {
    getTimeAgo,
  };
};

export default getTimeAgoUtil;
