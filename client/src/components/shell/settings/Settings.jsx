import { useState, useEffect } from "react";
import {
  ActionIcon,
  Button,
  Input,
  InputWrapper,
  Tooltip,
  Space,
  Text,
} from "@mantine/core";
import { Check } from "tabler-icons-react";
import { useClipboard } from "@mantine/hooks";
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

  const [clientID, setClientID] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [appName, setAppName] = useState("");
  const [forceUseEffect, setForceUseEffect] = useState(false);

  useEffect(() => {
    applicationService.getAppInfo(adminInfo?.token).then((response) => {
      setAppName(response.name);
      setClientID(response.clientID);
      setClientSecret(response.clientSecret);
    });
  }, [adminInfo?.token, forceUseEffect]);

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
      <h1>Settings</h1>
      <h2>Details</h2>
      <h3>Application Name: {appName}</h3>
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
