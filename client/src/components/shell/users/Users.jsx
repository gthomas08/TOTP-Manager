import { useState, useEffect } from "react";
import {
  Table,
  Checkbox,
  ScrollArea,
  createStyles,
  TextInput,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { Search, Check } from "tabler-icons-react";

import { useAuth } from "../../../contexts/AuthContext";
import usersService from "../../../services/users/users";

const Users = () => {
  const { adminInfo } = useAuth();
  const { classes, cx } = useStyles();
  const modals = useModals();

  const [forceUseEffect, setForceUseEffect] = useState(false);
  const [selection, setSelection] = useState([]);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    usersService.getUsers(adminInfo?.token).then((response) => {
      setData(response);
      setUsers(response);
    });
  }, [adminInfo?.token, forceUseEffect]);

  const handleDeleteUsers = () => {
    usersService.deleteUsers(adminInfo?.token, selection).then((response) => {
      showNotification({
        color: "teal",
        title: `${
          selection.length > 1 ? "Users" : "User"
        } successfully deleted`,
        icon: <Check />,
      });
      setForceUseEffect((prev) => !prev);
      setSelection([]);
    });
  };

  const openDeleteModal = () => {
    return modals.openConfirmModal({
      title: selection.length > 1 ? "Delete users" : "Delete user",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the selected{" "}
          {selection.length > 1 ? "users" : "user"}?
        </Text>
      ),
      labels: {
        confirm: selection.length > 1 ? "Delete users" : "Delete user",
        cancel: "Cancel",
      },
      confirmProps: { color: "red" },
      onConfirm: handleDeleteUsers,
    });
  };

  const toggleRow = (username) =>
    setSelection((current) =>
      current.includes(username)
        ? current.filter((item) => item !== username)
        : [...current, username]
    );

  const toggleAll = () =>
    setSelection((current) =>
      current.length === users.length ? [] : users.map((item) => item.username)
    );

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    const filteredUsers = data.filter((user) =>
      user.username.toLowerCase().includes(value.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const rows = users.map((user) => {
    const selected = selection.includes(user.username);
    return (
      <tr
        key={user.username}
        className={cx({ [classes.rowSelected]: selected })}
      >
        <td>
          <Checkbox
            checked={selection.includes(user.username)}
            onChange={() => toggleRow(user.username)}
            transitionDuration={0}
          />
        </td>
        <td>{user.username}</td>
        <td>{user.status}</td>
        {/* <td>{user.lastLogin}</td> */}
      </tr>
    );
  });

  return (
    <>
      <h1>Users</h1>
      <div style={{ width: 800 }}>
        <Group position="apart">
          <TextInput
            placeholder="Search"
            mb="md"
            icon={<Search size={14} />}
            onChange={handleSearchChange}
          />
          <Button
            color="red"
            disabled={selection.length > 0 ? false : true}
            onClick={openDeleteModal}
          >
            Delete
          </Button>
        </Group>
        {users.length > 0 ? (
          <ScrollArea sx={{ height: 500 }}>
            <Table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <Checkbox
                      onChange={toggleAll}
                      checked={selection.length === users.length}
                      indeterminate={
                        selection.length > 0 &&
                        selection.length !== users.length
                      }
                      transitionDuration={0}
                    />
                  </th>
                  <th>Username</th>
                  <th>Status</th>
                  {/* <th>Last Login</th> */}
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        ) : (
          <Text align="center">No users found.</Text>
        )}
      </div>
    </>
  );
};

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export default Users;
