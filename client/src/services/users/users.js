/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const baseUrl = "/api/users";

// Get all users
const getUsers = async (token) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.get(baseUrl, {
    headers: { Authorization: tokenToSend },
  });
  return response.data;
};

// Delete selected users
const deleteUsers = async (token, users) => {
  const tokenToSend = `bearer ${token}`;
  const response = await axios.delete(baseUrl, {
    headers: { Authorization: tokenToSend },
    data: users,
  });
  return response.data;
};

export default { getUsers, deleteUsers };
