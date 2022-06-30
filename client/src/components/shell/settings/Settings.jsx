import { useState, useEffect } from "react";
import {
  ActionIcon,
  Button,
  Input,
  InputWrapper,
  Popover,
  Tooltip,
  Space,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Copy } from "tabler-icons-react";

import { useAuth } from "../../../contexts/AuthContext";
import applicationInfoService from "../../../services/application/info";
import applicationResetService from "../../../services/application/reset";

const Settings = () => {
  const bulletChar = "\u2022";
  const [opened, setOpened] = useState(false);
  const [clientID, setClientID] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [forceUseEffect, setForceUseEffect] = useState(false);
  const { adminInfo } = useAuth();
  const clipboardID = useClipboard();
  const clipboardSecret = useClipboard();

  useEffect(() => {
    applicationInfoService.info(adminInfo?.token).then((response) => {
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

  const handleReset = () => {
    applicationResetService.reset(adminInfo?.token).then((response) => {
      setForceUseEffect((prev) => !prev);
      setOpened(false);
    });
  };

  return (
    <>
      <h1>Settings</h1>
      <h2>Details</h2>
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

      <Popover
        opened={opened}
        onClose={() => setOpened(false)}
        target={
          <Button color="red" onClick={() => setOpened((o) => !o)}>
            Reset Client Secret
          </Button>
        }
        position="bottom"
        placement="start"
        withArrow
      >
        <div>
          <div style={{ marginBottom: "10px" }}>Are you sure?</div>
          <div>
            <Button style={{ marginRight: "10px" }} onClick={handleReset}>
              Yes
            </Button>
            <Button
              color="red"
              variant="light"
              onClick={() => setOpened(false)}
            >
              No
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default Settings;
