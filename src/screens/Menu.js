import React from "react";
import { Pressable, ScrollView } from "react-native";
import {
  Center,
  Box,
  Heading,
  Image,
  Stack,
  Button,
  HStack
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import AuthContext from "../provider/AuthProvider";
import axios from "axios";

export const Menu = ({ navigation }) => {
  const { setAuth } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const navigateTo = screen => {
    navigation.navigate(screen);
  };
  const handleLogOut = async () => {
    setLoading(true);
    try {
      //log out on api
      await axios.post("api/account/logout");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.clear();
      setAuth(null);
      return true;
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <Box safeArea flex="1" justifyContent="center">
        <Center>
          <LoadingSpinner text={'Logging Out'} />
        </Center>
      </Box>
    );
  }
  return (
    <Center w="100%" _light={{ bg: "blueGray.50" }} px={4} flex={1}>
      <Box safeArea w="100%" maxW="400">
        <ScrollView>
          <HStack flexWrap="wrap" justifyContent="space-evenly">
            {/* Consult/Chat */}
            <Pressable onPress={() => navigateTo("Chat")}>
              <Box
                mt="5"
                maxW="400"
                width="150"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0
                }}
                _light={{
                  backgroundColor: "gray.50"
                }}
              >
                <Stack p="4" space={3}>
                  <Stack space={2}>
                    <Center>
                      <Image
                        source={require(`../../assets/doctor.png`)}
                        alt="image"
                      />
                      <Heading
                        _light={{
                          color: "blue.500"
                        }}
                        size="sm"
                        mt="2"
                        ml="-1"
                      >
                        Consult
                      </Heading>
                    </Center>
                  </Stack>
                </Stack>
              </Box>
            </Pressable>
            {/* MedicalRecord */}
            <Pressable onPress={() => navigateTo("MedicalRecord")}>
              <Box
                mt="5"
                maxW="400"
                width="150"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0
                }}
                _light={{
                  backgroundColor: "gray.50"
                }}
              >
                <Stack p="4" space={3}>
                  <Stack space={2}>
                    <Center>
                      <Image
                        source={require(`../../assets/medical-record.png`)}
                        alt="image"
                      />
                      <Heading
                        _light={{
                          color: "blue.500"
                        }}
                        size="sm"
                        mt="2"
                        ml="-1"
                      >
                        Medical Record
                      </Heading>
                    </Center>
                  </Stack>
                </Stack>
              </Box>
            </Pressable>
            {/* Prescriptions */}
            <Pressable onPress={() => navigateTo("Prescriptions")}>
              <Box
                mt="5"
                maxW="400"
                width="150"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0
                }}
                _light={{
                  backgroundColor: "gray.50"
                }}
              >
                <Stack p="4" space={3}>
                  <Stack space={2}>
                    <Center>
                      <Image
                        source={require(`../../assets/prescription.png`)}
                        alt="image"
                      />
                      <Heading
                        _light={{
                          color: "blue.500"
                        }}
                        size="sm"
                        mt="2"
                        ml="-1"
                      >
                        Prescriptions
                      </Heading>
                    </Center>
                  </Stack>
                </Stack>
              </Box>
            </Pressable>
            {/* Account Info */}
            <Pressable onPress={() => navigateTo("UpdateMyInfo")}>
              <Box
                mt="5"
                maxW="400"
                width="150"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0
                }}
                _light={{
                  backgroundColor: "gray.50"
                }}
              >
                <Stack p="4" space={3}>
                  <Stack space={2}>
                    <Center>
                      <Image
                        source={require(`../../assets/info.png`)}
                        alt="image"
                      />
                      <Heading
                        _light={{
                          color: "blue.500"
                        }}
                        size="sm"
                        mt="2"
                        ml="-1"
                      >
                        Personal Info
                      </Heading>
                    </Center>
                  </Stack>
                </Stack>
              </Box>
            </Pressable>
             {/* Change Password */}
            <Pressable onPress={() => navigateTo("ChangePassword")}>
              <Box
                mt="5"
                maxW="400"
                width="150"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0
                }}
                _light={{
                  backgroundColor: "gray.50"
                }}
              >
                <Stack p="4" space={3}>
                  <Stack space={2}>
                    <Center>
                      <Image
                        source={require(`../../assets/password.png`)}
                        alt="image"
                      />
                      <Heading
                        _light={{
                          color: "blue.500"
                        }}
                        size="sm"
                        mt="2"
                        ml="-1"
                      >
                        Password
                      </Heading>
                    </Center>
                  </Stack>
                </Stack>
              </Box>
            </Pressable> 
             {/* Log Out */}
             <Pressable  onPress={() => handleLogOut()}>
              <Box
                mt="5"
                maxW="400"
                width="150"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700"
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0
                }}
                _light={{
                  backgroundColor: "gray.50"
                }}
              >
                <Stack p="4" space={3}>
                  <Stack space={2}>
                    <Center>
                      <Image
                        source={require(`../../assets/logout.png`)}
                        alt="image"
                      />
                      <Heading
                        _light={{
                          color: "blue.500"
                        }}
                        size="sm"
                        mt="2"
                        ml="-1"
                      >
                       Log Out
                      </Heading>
                    </Center>
                  </Stack>
                </Stack>
              </Box>
            </Pressable>      
          </HStack>
        </ScrollView>
      </Box>
    </Center>
  );
};
