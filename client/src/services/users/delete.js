/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const baseUrl = "/api/users/delete";

// Delete selected users
const deleteUsers = async (token, users) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.delete(baseUrl, {
    headers: { Authorization: tokenToSend },
    data: users,
  });
  return response.data;
};

export default { deleteUsers };
