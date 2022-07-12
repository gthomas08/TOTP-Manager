/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Title,
  ActionIcon,
  Button,
  Input,
  InputWrapper,
  Tooltip,
  Space,
  Text,
  Popover,
  Group,
  TextInput,
  Anchor,
  useMantineTheme,
} from "@mantine/core";
import { Check, Edit } from "tabler-icons-react";
import { useClipboard, useForm } from "@mantine/hooks";
import { Copy } from "tabler-icons-react";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import { useAuth } from "../../../contexts/AuthContext";
import applicationService from "../../../services/application/application";
import applicationResetService from "../../../services/application/reset";

const Settings = () => {
  const bulletChar = "\u2022";

  const { adminInfo } = useAuth();
  const modals = useModals();

  const clipboardID = useClipboard();
  const clipboardSecret = useClipboard();

  const theme = useMantineTheme();

  const [clientID, setClientID] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [appName, setAppName] = useState("");

  const [opened, setOpened] = useState(false);
  const [forceUseEffect, setForceUseEffect] = useState(false);

  const form = useForm({
    initialValues: {
      name: appName,
    },
  });

  useEffect(() => {
    applicationService.getAppInfo(adminInfo?.token).then((response) => {
      setAppName(response.name);
      setClientID(response.clientID);
      setClientSecret(response.clientSecret);
      form.setFieldValue("name", response.name);
    });
  }, [adminInfo?.token, forceUseEffect]);

  const onSubmit = () => {
    applicationService.changeName(adminInfo?.token, {
      name: form.values.name,
    });
    setOpened(false);
    setForceUseEffect((prev) => !prev);
  };

  const toHiddenString = (secret) => {
    if (secret.length > 0) {
      const visibleCharsLength = 6;
      const visibleChars = secret.substr(secret.length - visibleCharsLength);
      const secretLength = secret.length;
      const hiddenChars = bulletChar.repeat(secretLength - visibleCharsLength);

      const hiddenString = hiddenChars.concat(visibleChars);

      return hiddenString;
    }
  };

  const openResetModal = () => {
    return modals.openConfirmModal({
      title: "Reset Client Secret",
      centered: true,
      children: (
        <>
          <Text size="sm">
            Are you sure you want to reset the client secret?
          </Text>
        </>
      ),
      labels: {
        confirm: "Reset Client Secret",
        cancel: "Cancel",
      },
      confirmProps: { color: "red" },
      onConfirm: handleReset,
    });
  };

  const handleReset = () => {
    applicationResetService
      .resetClientSecret(adminInfo?.token)
      .then((response) => {
        showNotification({
          color: "teal",
          title: "Client secret successfully reset.",
          icon: <Check />,
        });
        setForceUseEffect((prev) => !prev);
      });
  };

  return (
    <>
      <Title
        order={1}
        style={{
          fontFamily: "Sans Serif",
          fontWeight: 500,
        }}
      >
        Settings
      </Title>

      <Space h="md" />

      <Group>
        <Popover
          opened={opened}
          onClose={() => setOpened(false)}
          position="bottom"
          placement="start"
          withCloseButton
          title="Edit Name"
          transition="pop-top-left"
          target={
            <ActionIcon
              variant={theme.colorScheme === "dark" ? "hover" : "light"}
              onClick={() => setOpened((o) => !o)}
            >
              <Edit size={16} />
            </ActionIcon>
          }
        >
          <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
              required
              label="Name"
              placeholder="Name"
              style={{ minWidth: 300 }}
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              error={form.errors.name}
              variant="default"
            />

            <Group position="apart" style={{ marginTop: 15 }}>
              <Anchor
                component="button"
                color="gray"
                size="sm"
                onClick={() => setOpened(false)}
              >
                Cancel
              </Anchor>
              <Button type="submit" size="sm">
                Save
              </Button>
            </Group>
          </form>
        </Popover>
        <div>
          <Text>Application Name</Text>
          <Text size="xs" color="gray">
            {appName}
          </Text>
        </div>
      </Group>

      <Space h="md" />

      <InputWrapper label="Client ID">
        <Input
          style={{ width: "320px" }}
          defaultValue={clientID}
          disabled
          rightSection={
            <Tooltip
              label="Copied!"
              gutter={10}
              placement="center"
              position="right"
              radius="md"
              transition="slide-right"
              transitionDuration={200}
              opened={clipboardID.copied}
            >
              <ActionIcon onClick={() => clipboardID.copy(clientID)}>
                <Copy size={24} />
              </ActionIcon>
            </Tooltip>
          }
        />
      </InputWrapper>

      <Space h="md" />

      <InputWrapper label="Client Secret">
        <Input
          style={{ width: "320px" }}
          defaultValue={toHiddenString(clientSecret)}
          disabled
          rightSection={
            <Tooltip
              label="Copied!"
              gutter={10}
              placement="center"
              position="right"
              radius="md"
              transition="slide-right"
              transitionDuration={200}
              opened={clipboardSecret.copied}
            >
              <ActionIcon onClick={() => clipboardSecret.copy(clientSecret)}>
                <Copy size={24} />
              </ActionIcon>
            </Tooltip>
          }
        />
      </InputWrapper>

      <Space h="md" />

      <Button color="red" onClick={openResetModal}>
        Reset Client Secret
      </Button>
    </>
  );
};

export default Settings;
