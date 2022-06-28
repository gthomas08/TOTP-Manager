import {
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { useAuth } from "../../contexts/AuthContext";

const ShellHeader = ({ opened, setOpened }) => {
  const theme = useMantineTheme();
  const { adminInfo } = useAuth();

  return (
    <Header height={70} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <div>
          <Text>TOTP Manager</Text>
          <Text weight={500} size="sm" color="dimmed" mb="xs">
            {adminInfo?.username}
          </Text>
        </div>
      </div>
    </Header>
  );
};

export default ShellHeader;
