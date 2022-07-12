import { useState, useEffect } from "react";
import { Title, Space, Paper, Text, Group } from "@mantine/core";

import { useAuth } from "../../../contexts/AuthContext";
import dashboardService from "../../../services/dashboard/dashboard";

const Dashboard = () => {
  const { adminInfo } = useAuth();
  const [totalUsers, setTotalUsers] = useState();
  const [enrolledUsers, setEnrolledUsers] = useState();

  useEffect(() => {
    dashboardService.getStats(adminInfo?.token).then((response) => {
      setTotalUsers(response.totalUsers);
      setEnrolledUsers(response.enrolledUsers);
    });
  }, [adminInfo?.token]);

  return (
    <>
      <Title
        order={1}
        style={{
          fontFamily: "Sans Serif",
          fontWeight: 500,
        }}
      >
        Dashboard
      </Title>

      <Space h="md" />
      <Group>
        <Paper withBorder radius="md" p="xs">
          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Total Users
            </Text>
            <Text weight={700} size="xl">
              {totalUsers}
            </Text>
          </div>
        </Paper>
        <Paper withBorder radius="md" p="xs">
          <div>
            <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
              Enrolled
            </Text>
            <Text weight={700} size="xl">
              {enrolledUsers}
            </Text>
          </div>
        </Paper>
      </Group>
    </>
  );
};

export default Dashboard;
