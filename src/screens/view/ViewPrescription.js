import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Box, Center, Image, Text, Stack, Link } from "native-base";
import { fullname, hasFileExtension } from "../../utils/Utilities";
import moment from "moment";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ViewPrescription = ({ navigation, route }) => {
 const [userData, setUserData]=React.useState(null);
  let medicalRecord = route.params;
  const assets = "https://e-consultation-app.herokuapp.com/api";
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
        <LoadingSpinner text={"Getting Prescriptions"} />
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
                Prescription Record as of{" "}
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
                    Prescriptions
                  </Text>
                  {medicalRecord.prescriptions.length > 0 ? (
                    <>
                      {medicalRecord.prescriptions.map((item, i) => {
                        let path = hasFileExtension(item.physician_id.photo)
                          ? `${assets}/images/${item.physician_id.photo}`
                          : item.physician_id.photo;
                        return (
                          <Box
                            key={i}
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
                              <Text fontSize="sm" mt="1">
                                Date Issued:
                                {moment(item.createdAt).format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                )}
                              </Text>
                              <Text my="4">
                                {item.medicine.map(med => {
                                  return `> ${med.details}`;
                                })}
                              </Text>
                              <Center>
                                <Image
                                  size={50}
                                  resizeMode={"contain"}
                                  borderRadius={100}
                                  source={{
                                    uri: path
                                  }}
                                  alt="Alternate Text"
                                />
                                <Text fontSize="sm" mt="1">
                                  Prescribed by:
                                </Text>
                                <Text fontSize="sm" mt="1">
                                  {fullname(item.physician_id.name)}
                                  {"\n"}
                                </Text>
                                <Link
                                  href={`https://e-consultation-app.herokuapp.com/api/medical-records/${medicalRecord._id}/prescriptions/${item._id}/export`}
                                  isExternal
                                  _text={{
                                    color: "blue.400"
                                  }}
                                  mt={-0.5}
                                  _web={{
                                    mb: -2
                                  }}
                                >
                                  Download Prescription.
                                </Link>
                              </Center>
                            </Stack>
                          </Box>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <Center key={"prescriptions"}>
                        <Image
                          source={require(`../../../assets/folder.png`)}
                          alt="Empty Folder"
                        />
                        <Text fontSize="md" fontWeight="500" mt="5">
                          No Prescriptions Found
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
