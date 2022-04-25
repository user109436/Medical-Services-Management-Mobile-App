import * as React from "react";
import {
  Box,
  Heading,
  FormControl,
  Input,
  Button,
  Center,
  Divider,
  Text,
  Image
} from "native-base";
import { ScrollView } from "react-native";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { AlertMessage } from "../components/Alert";
import { hasErrors, resetErrors } from "../utils/Utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export const ChangePassword = () => {
  const [message, setMessage] = React.useState({
    message: "",
    status: ""
  });
  const [networkError, setNetworkError] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [accountForm, setAccountForm] = React.useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
    passwordCurrentError: false,
    passwordError: false,
    passwordConfirmError: false
  });

  const handleChange = (name, value) => {
    setAccountForm({ ...accountForm, [name]: value });
  };
  const handleSubmit = async () => {
    let errors = 0;
    //reset errors
    resetErrors(accountForm);
    //check for errors
    errors = hasErrors(accountForm);
    //validate if both password and c password is same
    let equal = accountForm.password === accountForm.passwordConfirm;
    if (!equal) {
      setMessage({ status: "error", message: "Password did not match" });
      errors++;
      return false;
    }
    if(accountForm.password.length<=7){
      setMessage({ status: "error", message: "Password atleast 8 characters" });
      errors++;
      return false;
    }
    if (errors) {
      setAccountForm({ ...accountForm });
      return false;
    }
    try {
      setProcessing(true);
      //send to endpoint
      const res = await axios.patch(`api/account/update-password`, accountForm);
      if (res.data.status === "success") {
        setMessage({
          status: "success",
          message: "Password Succesfully Updated"
        });
      } else {
        setMessage({
          status: "error",
          message: res.data.message
        });
        setProcessing(false);
        return false;
      }
      //update new token from server
      await AsyncStorage.setItem("token", res.data.token);
      handleClear();
    } catch (e) {
      setProcessing(false);
      console.log(e);
      if (e.message) {
        setNetworkError(true);
      }
    }
    setProcessing(false);
  };
  const handleClear = () => {
    setAccountForm({
      passwordCurrent: "",
      password: "",
      passwordConfirm: "",
      passwordCurrentError: false,
      passwordError: false,
      passwordConfirmError: false
    });
    setNetworkError(false);
    setProcessing(false);
  };
  if (message.status === "warning") {
    return (
      <Box safeArea flex="1" justifyContent="center">
        <Center>
          {message.message ? (
            <AlertMessage message={message.message} status={message.status} />
          ) : (
            <LoadingSpinner />
          )}
        </Center>
      </Box>
    );
  }
  if (networkError) {
    return (
      <Box safeArea flex="1" justifyContent="center">
        <Center>
          <Image
            source={require(`../../assets/network.png`)}
            alt="Network Error"
          />
          <Text fontSize="md" fontWeight="500" mt="5">
            Network Error: Could not connect to the Server
          </Text>
        </Center>
      </Box>
    );
  }
  return (
    <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="390" py="8">
        <ScrollView>
          <Center>
            <Heading
              size="lg"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50"
              }}
              bold
            >
              Change Password
            </Heading>
          </Center>
          <Divider my="2" />
          {message.message ? (
            <AlertMessage message={message.message} status={message.status} />
          ) : (
            <Text></Text>
          )}
          <FormControl>
            <FormControl.Label>Current Password</FormControl.Label>
            <Input
              onChangeText={value => handleChange("passwordCurrent", value)}
              type="password"
              isInvalid={accountForm.passwordCurrentError}
              value={accountForm.passwordCurrent}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>New Password</FormControl.Label>
            <Input
              onChangeText={value => handleChange("password", value)}
              type="password"
              isInvalid={accountForm.passwordError}
              value={accountForm.password}
              placeholder="Atleast 8 Characters"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input
              onChangeText={value => handleChange("passwordConfirm", value)}
              type="password"
              isInvalid={accountForm.passwordConfirmError}
              value={accountForm.passwordConfirm}
              placeholder="Atleast 8 Characters"
            />
          </FormControl>
          <Button
            isLoading={processing}
            mt="2"
            colorScheme="indigo"
            onPress={handleSubmit}
          >
            Save
          </Button>
        </ScrollView>
      </Box>
    </Center>
  );
};
