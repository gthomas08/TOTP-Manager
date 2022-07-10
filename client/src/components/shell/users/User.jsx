import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Space,
  ScrollArea,
  Button,
  Group,
  Badge,
  Text,
} from "@mantine/core";
import { Check, X } from "tabler-icons-react";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import usersService from "../../../services/users/users";
import { useAuth } from "../../../contexts/AuthContext";

const User = () => {
  const { user } = useParams();
  const { adminInfo } = useAuth();
  const modals = useModals();

  const [forceUseEffect, setForceUseEffect] = useState(false);

  const [logs, setLogs] = useState([]);
  const [enrolled, setEnrolled] = useState(true);

  useEffect(() => {
    usersService.getUserInfo(adminInfo?.token, user).then((response) => {
      setLogs(response.logs);
      setEnrolled(response.enrolled);
    });
  }, [adminInfo?.token, user, forceUseEffect]);

  const openDeleteModal = () => {
    return modals.openConfirmModal({
      title: "Reset token for user",
      centered: true,
      children: (
        <>
          <Text size="sm">
            Are you sure you want to reset the token for the user?
          </Text>
          <Text size="sm">
            {" "}
            The user will have to setup the authenticator again.
          </Text>
        </>
      ),
      labels: {
        confirm: "Reset Token",
        cancel: "Cancel",
      },
      confirmProps: { color: "red" },
      onConfirm: handleResetToken,
    });
  };

  const handleResetToken = () => {
    usersService.resetToken(adminInfo?.token, user).then((response) => {
      showNotification({
        color: "teal",
        title: "Token successfully reset.",
        icon: <Check />,
      });
      setForceUseEffect((prev) => !prev);
    });
  };

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
        <Button color="red" onClick={openDeleteModal}>
          Reset Token
        </Button>
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
