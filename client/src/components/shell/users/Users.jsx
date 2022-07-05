import { useState } from "react";
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
import { Search } from "tabler-icons-react";

const data = [
  { username: "user1", lastLogin: "17/07/2022" },
  { username: "user2", lastLogin: "02/07/2022" },
  { username: "user3", lastLogin: "03/07/2022" },
  { username: "user4", lastLogin: "03/07/2022" },
  { username: "user5", lastLogin: "03/07/2022" },
  { username: "user6", lastLogin: "03/07/2022" },
  { username: "user7", lastLogin: "03/07/2022" },
  { username: "user8", lastLogin: "03/07/2022" },
  { username: "user9", lastLogin: "03/07/2022" },
  { username: "user10", lastLogin: "03/07/2022" },
  { username: "user11", lastLogin: "03/07/2022" },
  { username: "user12", lastLogin: "03/07/2022" },
  { username: "user13", lastLogin: "03/07/2022" },
  { username: "user14", lastLogin: "03/07/2022" },
  { username: "user15", lastLogin: "03/07/2022" },
  { username: "user16", lastLogin: "03/07/2022" },
  { username: "user17", lastLogin: "03/07/2022" },
  { username: "user18", lastLogin: "03/07/2022" },
  { username: "user19", lastLogin: "03/07/2022" },
  { username: "user20", lastLogin: "03/07/2022" },
  { username: "user21", lastLogin: "03/07/2022" },
  { username: "user22", lastLogin: "03/07/2022" },
  { username: "user23", lastLogin: "03/07/2022" },
  { username: "user24", lastLogin: "03/07/2022" },
  { username: "user25", lastLogin: "03/07/2022" },
  { username: "user26", lastLogin: "03/07/2022" },
  { username: "user27", lastLogin: "03/07/2022" },
];

const Users = () => {
  const [selection, setSelection] = useState([]);
  const [users, setUsers] = useState(data);
  const { classes, cx } = useStyles();

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
        <td>{user.lastLogin}</td>
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
          <Button color="red" disabled={selection.length > 0 ? false : true}>
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
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        ) : (
          <Text align="center">No users found based on your search.</Text>
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
