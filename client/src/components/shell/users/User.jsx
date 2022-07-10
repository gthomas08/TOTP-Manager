import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Space, ScrollArea, Button, Group, Badge } from "@mantine/core";
import { Check, X } from "tabler-icons-react";

import usersService from "../../../services/users/users";
import { useAuth } from "../../../contexts/AuthContext";

const User = () => {
  const { user } = useParams();
  const { adminInfo } = useAuth();
  const [logs, setLogs] = useState([]);
  const [enrolled, setEnrolled] = useState();

  useEffect(() => {
    usersService.getUserInfo(adminInfo?.token, user).then((response) => {
      setLogs(response.logs);
      setEnrolled(response.enrolled);
    });
  }, [adminInfo?.token, user]);

  const rows = logs.map((log) => {
    const date = new Date(log.date);
    return (
      <tr key={log.date}>
        <td>{date.toString().split("(")[0]}</td>
        <td>
          <Group>
            {log.type === "Granted" ? (
              <Check color="green" />
            ) : (
              <X color="red" />
            )}

            {log.type}
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <>
      <h1>{user}</h1>
      <Group style={{ width: 800 }} position="apart">
        {enrolled ? (
          <Badge color="green">Enrolled</Badge>
        ) : (
          <Badge color="red">Not Enrolled</Badge>
        )}
        <Button color="red">Reset Token</Button>
      </Group>

      <Space h="md" />
      <ScrollArea style={{ height: 400, width: 800 }}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default User;
