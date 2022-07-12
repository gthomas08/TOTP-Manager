/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const baseUrl = "/api/dashboard";

// Get stats
const getStats = async (token) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(baseUrl, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { getStats };
