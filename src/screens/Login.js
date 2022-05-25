import * as React from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  Text,
  View
} from "native-base";
import { Image } from "react-native";
import axios from "axios";
import { AlertMessage } from "../components/Alert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../provider/AuthProvider";
//navigation comes with React Navigation if you create Navigator.js
export const Login = ({ navigation }) => {
  const { setAuth } = React.useContext(AuthContext);
  const [loginForm, setLoginForm] = React.useState({
    email: "",
    password: "",
    emailError: false,
    passwordError: false
  });
  const [message, setMessage] = React.useState({ status: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const notAllowed = ["nurse", "dentist", "doctor"];
  const handleLogin = async () => {
    //reset errors
    loginForm.emailError = false;
    loginForm.passwordError = false;
    message.message = "";
    message.status = "";
    setMessage({ ...message });
    setLoginForm({ ...loginForm });
    //error validation
    let errors = 0;
    if (!loginForm.email) {
      loginForm.emailError = true;
      errors++;
    }
    if (!loginForm.password) {
      loginForm.passwordError = true;
      errors++;
    }
    if (errors) {
      setLoginForm({ ...loginForm });
      return;
    }
    if (loginForm.email && loginForm.password) {
      setLoading(true);
      try {
        const res = await axios.post(`api/account/login`, loginForm);
        let token = res.data.token,
          account = res.data.data.user;
        if (notAllowed.includes(account.role)) {
          setMessage({
            status: "error",
            message: "Physicians are not allowed to login in Mobile App"
          });
          setLoading(false);
          return false;
        }
        const user = await axios.post(`api/users/identify-user-type`, {
          token
        }); //info of authenticated user
        //save cookie
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(account));
        await AsyncStorage.setItem("userData", JSON.stringify(user.data.doc));
        setAuth(token);
        handleClear();
        //automatically redirect to home because of navigator config
      } catch (err) {
        if (err.response.data) {
          setMessage({ status: "error", message: err.response.data.message });
        }
      }
    }
    setLoading(false);
  };
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  const handleChange = (name, value) => {
    setLoginForm({ ...loginForm, [name]: value });
  };
  const isEmailEmpty = (message = "", status = "error") => {
    //reset errors
    loginForm.emailError = false;
    message.message = "";
    message.status = "";
    setMessage({ ...message });
    setLoginForm({ ...loginForm });
    //error validation
    let errors = 0;
    //check for email
    if (!loginForm.email) {
      loginForm.emailError = true;
      errors++;
    }
    if (errors) {
      setMessage({ message, status });
    }
    return errors;
  };
  const handleForgotPassword = async () => {
    if (isEmailEmpty("Email is required to send new password")) return false;
    try {
      const res = await axios.post(`api/account/forgot-password`, {
        email: loginForm.email
      });
      // console.log('res.bodyUsed',res.bodyUsed);
      setMessage({ status: "success", message: res.data.message });
    } catch (err) {
      if (err.response.data) {
        setMessage({ status: "error", message: err.response.data.message });
      }
    }
  };

  const handleResendEmailVerification = async () => {
    if (isEmailEmpty("Email is required to resend email verification"))
      return false;
    try {
      const res = await axios.post(
        `api/account/signup/resend-email-verification`,
        { email: loginForm.email }
      );
      setMessage({ status: "success", message: res.data.message });
    } catch (err) {
      if (err.response.data) {
        setMessage({ status: "error", message: err.response.data.message });
      }
    }
  };
  const handleClear = () => {
    setLoginForm({
      email: "",
      password: "",
      emailError: false,
      passwordError: false
    });
    setMessage({ status: "", message: "" });
  };
  if (loading) {
    return (
      <Box safeArea flex="1" justifyContent="center">
        <Center>
          <LoadingSpinner text={"Authenticating"} />
        </Center>
      </Box>
    );
  }
  return (
    <Center w="100%" _light={{ bg: "blueGray.50" }} px={4} flex={1}>
      <Box safeArea p="2" py="8" w="90%" maxW="390">
        <Center>
          <View>
            <Image
              source={require("../../assets/snt.jpg")}
              alt="SNT Building"
            />
          </View>
          <VStack space={1} alignItems="center">
          <Text fontSize="md">Welcome to</Text>
            <Text fontSize="md">MOBILE-BASED MEDICAL SERVICES</Text>
            <Text fontSize="md">MANAGEMENT APPLICATION</Text>
            <Text fontSize="md">FOR UNIVERSITY OF RIZAL SYSTEM</Text>
          </VStack>
          <Heading
            mt="1"
            _dark={{
              color: "warmGray.200"
            }}
            color="coolGray.600"
            fontWeight="medium"
            size="xs"
          >
            Log In to continue
          </Heading>
        </Center>
        {message.message ? (
          <AlertMessage message={message.message} status={message.status} />
        ) : (
          <Text></Text>
        )}
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              type="email"
              isInvalid={loginForm.emailError}
              onChangeText={value => handleChange("email", value)}
              defaultValue={loginForm.email}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              isInvalid={loginForm.passwordError}
              onChangeText={value => handleChange("password", value)}
              defaultValue={loginForm.password}
            />
            <HStack justifyContent="space-between">
              <Link
                _text={{
                  fontSize: "xs",
                  fontWeight: "500",
                  color: "indigo.500"
                }}
                mt="1"
                onPress={handleForgotPassword}
              >
                Forget Password?
              </Link>
              <Link
                _text={{
                  fontSize: "xs",
                  fontWeight: "500",
                  color: "indigo.500"
                }}
                mt="1"
                onPress={handleResendEmailVerification}
              >
                Resend Email Verifcation?
              </Link>
            </HStack>
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={handleLogin}>
            Log In
          </Button>
          <Button mt="2" colorScheme="success" onPress={handleSignUp}>
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};
