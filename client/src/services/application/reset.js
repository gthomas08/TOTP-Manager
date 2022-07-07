/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const baseUrl = "/api/application/reset";

// Reset application client secret
const resetClientSecret = async (token) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.put(baseUrl, null, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

export default { resetClientSecret };
