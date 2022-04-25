import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Box, Center, Image, Text, Stack, Heading } from "native-base";
import moment from "moment";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ViewMedicalRecord = ({ navigation, route }) => {
 const [userData, setUserData]=React.useState(null);
  let medicalRecord = route.params;
  React.useEffect(()=>{
    const fetchData = async () => {
       try{
        let userData = await AsyncStorage.getItem("userData");
        setUserData(userData);
       }catch(e){
         console.log(e);
       }
    };
    fetchData();
  }, []);
  if (!userData) {
    return (
      <Box safeArea flex="1" justifyContent="center">
        <Center>
        <LoadingSpinner text={"Getting Medical Record"} />
        </Center>
      </Box>
    );
  }
  
  return (
    <SafeAreaView>
      <ScrollView>
        <Center>
          <Box safeArea>
            <Center>
              <Text mt="10" fontSize="md">
                Medical Record as of{" "}
                {moment(medicalRecord.createdAt).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              </Text>
            </Center>

            <Box
              maxW="400"
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
                  <Text
                    _light={{
                      color: "blue.500"
                    }}
                    _dark={{
                      color: "blue.400"
                    }}
                    fontSize="lg"
                    mt="1"
                  >
                    Diagnosis
                  </Text>
                  {medicalRecord.diagnosis.length > 0 ? (
                    <>
                      {medicalRecord.diagnosis.map((item, i) => (
                        <Text key={item._id} fontSize="md" mt="1">
                          > {item.diagnose}
                        </Text>
                      ))}
                    </>
                  ) : (
                    <>
                      <Center key={"diagnosis"}>
                        <Image
                          source={require(`../../../assets/folder.png`)}
                          alt="Empty Folder"
                        />
                        <Text fontSize="md" fontWeight="500" mt="5">
                          No Diagnosis Found
                        </Text>
                      </Center>
                    </>
                  )}
                </Stack>
              </Stack>
            </Box>
            <Box
              mt="5"
              maxW="400"
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
                  <Text
                    _light={{
                      color: "blue.500"
                    }}
                    _dark={{
                      color: "blue.400"
                    }}
                    fontSize="lg"
                    mt="1"
                  >
                    Symptoms
                  </Text>
                  {medicalRecord.symptoms.length > 0 ? (
                    <>
                      {medicalRecord.symptoms.map((item, i) => (
                        <Text key={item._id} fontSize="md" mt="1">
                          > {item.symptom}
                        </Text>
                      ))}
                    </>
                  ) : (
                    <>
                      <Center key={"symptom"}>
                        <Image
                          source={require(`../../../assets/folder.png`)}
                          alt="Empty Folder"
                        />
                        <Text fontSize="md" fontWeight="500" mt="5">
                          No Symptoms Found
                        </Text>
                      </Center>
                    </>
                  )}
                </Stack>
              </Stack>
            </Box>
            <Box
              my="5"
              maxW="400"
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
                  <Text
                    _light={{
                      color: "blue.500"
                    }}
                    _dark={{
                      color: "blue.400"
                    }}
                    fontSize="lg"
                    mt="1"
                  >
                    Laboratories
                  </Text>
                  {medicalRecord.laboratories.length > 0 ? (
                    <>
                      {medicalRecord.laboratories.map((item, i) => (
                        <Text key={item._id} fontSize="md" mt="1">
                          > {item.laboratory}
                        </Text>
                      ))}
                    </>
                  ) : (
                    <>
                      <Center key={"laboratories"}>
                        <Image
                          source={require(`../../../assets/folder.png`)}
                          alt="Empty Folder"
                        />
                        <Text fontSize="md" fontWeight="500" mt="5">
                          No Laboratories Found
                        </Text>
                      </Center>
                    </>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Center>
      </ScrollView>
    </SafeAreaView>
  );
};
