import { useState } from "react";
import { AppShell } from "@mantine/core";
import { useScrollLock } from "@mantine/hooks";
import { useLocation } from "react-router-dom";
import ShellHeader from "./ShellHeader";
import ShellNavbar from "./ShellNavbar";
import Dashboard from "./dashboard/Dashboard";
import Users from "./users/Users";
import User from "./users/User";
import Settings from "./settings/Settings";

const Shell = () => {
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  useScrollLock(true);
  const regex = new RegExp(/\/users\/\w+/);

  const renderCorrectComponent = (loc) => {
    const path = loc?.pathname;

    if (path === "/dashboard") {
      return <Dashboard />;
    } else if (path === "/users") {
      return <Users />;
    } else if (regex.test(path)) {
      return <User />;
    } else if (path === "/settings") {
      return <Settings />;
    }
  };

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<ShellNavbar opened={opened} />}
      header={<ShellHeader opened={opened} setOpened={setOpened} />}
    >
      {renderCorrectComponent(location)}
    </AppShell>
  );
};

export default Shell;
