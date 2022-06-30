import { useState, useEffect } from "react";
import {
  ActionIcon,
  Button,
  Input,
  InputWrapper,
  Popover,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Copy } from "tabler-icons-react";

import { useAuth } from "../../../contexts/AuthContext";
import applicationService from "../../../services/application";

const Settings = () => {
  const bulletChar = "\u2022";
  const [opened, setOpened] = useState(false);
  const [clientID, setClientID] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const { adminInfo } = useAuth();
  const clipboard = useClipboard();

  useEffect(() => {
    applicationService.info(adminInfo?.token).then((response) => {
      setClientID(response.clientID);
      setClientSecret(response.clientSecret);
    });
  }, [adminInfo?.token]);

  const toHiddenString = (secret) => {
    const secretLength = secret.length;
    const hiddenString = bulletChar.repeat(secretLength);

    return hiddenString;
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
            <ActionIcon onClick={() => clipboard.copy(clientID)}>
              <Copy size={24} />
            </ActionIcon>
          }
        />
      </InputWrapper>
      <InputWrapper label="Client Secret">
        <Input
          style={{ width: "320px" }}
          defaultValue={toHiddenString(clientSecret)}
          disabled
          rightSection={
            <ActionIcon onClick={() => clipboard.copy(clientSecret)}>
              <Copy size={24} />
            </ActionIcon>
          }
        />
      </InputWrapper>

      <Popover
        opened={opened}
        onClose={() => setOpened(false)}
        target={
          <Button color="red" onClick={() => setOpened((o) => !o)}>
            Reset Client Secret
          </Button>
        }
        width={180}
        position="bottom"
        placement="start"
        withArrow
      >
        <div>
          <div>Are you sure?</div>
          <div>
            <Button variant="light">Yes</Button>
            <Button variant="light" color="red">
              No
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default Settings;
