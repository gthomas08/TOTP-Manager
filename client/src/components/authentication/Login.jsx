import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/hooks";
import { useAuth } from "../../contexts/AuthContext";
import {
  Space,
  Alert,
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from "@mantine/core";
import loginService from "../../services/authentication/login";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { setAdminInfo } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async () => {
    try {
      const returnedAdminInfo = await loginService.login({
        username: form.values.username,
        password: form.values.password,
      });

      setAdminInfo(returnedAdminInfo);
      window.localStorage.setItem(
        "loggedAdmin",
        JSON.stringify(returnedAdminInfo)
      );
      navigate("/dashboard");
    } catch (exception) {
      setErrorMessage(exception.response.data.error);
    }
  };

  return (
    <>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          TOTP Manager
        </Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleLogin)}>
            <TextInput
              required
              label="Username"
              placeholder="Username"
              value={form.values.username}
              onChange={(event) => {
                form.setFieldValue("username", event.currentTarget.value);
                setErrorMessage(null);
              }}
            />
            <PasswordInput
              required
              label="Password"
              placeholder="Password"
              value={form.values.password}
              onChange={(event) => {
                form.setFieldValue("password", event.currentTarget.value);
                setErrorMessage(null);
              }}
            />

            {errorMessage && (
              <div>
                <Space h="lg" />
                <Alert color="red">{`${errorMessage}`}</Alert>
              </div>
            )}

            <Button type="submit" fullWidth mt="xl">
              Log in
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
