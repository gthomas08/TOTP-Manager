/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const baseUrl = "/api/application";

// Get application info
const getAppInfo = async (token) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(baseUrl, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

// Change application name
const changeName = async (token, body) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.put(baseUrl, body, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { getAppInfo, changeName };
