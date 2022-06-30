/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const baseUrl = "/api/application";

// Get application info
const info = async (token) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(baseUrl, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { info };
