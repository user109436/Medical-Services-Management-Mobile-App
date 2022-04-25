import React from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box, Center, Image, Text, Stack, Pressable } from "native-base";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { fullname, getYearSection, hasFileExtension } from "../utils/Utilities";
import axios from "axios";
import { NativeSearchBar } from "../components/NativeSearchBar";
import { MedicalRecordList } from "../components/MedicalRecordList";
export const Prescriptions = ({ navigation }) => {
  const [userData, setUserData] = React.useState(null);
  const [medicalRecord, setMedicalRecord] = React.useState(null);
  const [networkError, setNetworkError] = React.useState(false);
  const [searchPhrase, setSearchPhrase] = React.useState("");
  // const [message, setMessage] = React.useState({
  //   message: "",
  //   status: "error"
  // });
  const assets = "https://e-consultation-app.herokuapp.com/api";
  React.useEffect(() => {
    const getItem = async () => {
      try {
        let userData = await AsyncStorage.getItem("userData");
        if (userData) {
          userData = JSON.parse(userData);
          setUserData(userData);
        }
      } catch (e) {
        console.log("Error:", e);
        if (e.message) {
          setNetworkError(true);
        }
      }
    };
    getItem();
    return () => {
      setUserData(null);
    };
  }, []);
  React.useEffect(() => {
    // api/medical-records/user
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `api/medical-records/user/${userData.user_id._id}`
        );
        if (res.data.length > 0) {
          setMedicalRecord(res.data.doc);
        } else {
          setMedicalRecord("no-record");
        }
      } catch (err) {
        if (err.response.data) {
          //err is operational
          // message.message = err.response.data.message;
          // setMessage({ ...message, status:"info" });
          setMedicalRecord("no-record");
          return true;
        }
        //err is non-operational
        if (e.message) {
          setNetworkError(true);
        }
      }
    };
    if (userData) {
      fetchData();
    }
    return () => {
      setMedicalRecord(null);
    };
  }, [userData]);
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
  if (!userData || !medicalRecord) {
    return (
      <Box safeArea flex="1" justifyContent="center">
        <Center>
          <LoadingSpinner text={"Getting All Prescriptions"} />
        </Center>
      </Box>
    );
  }
  let path=hasFileExtension(userData.photo)? `${assets}/images/${userData.photo}`: userData.photo;
  return (
    <View>
      <SafeAreaView>
        <ScrollView>
          {/* {message.message ? (
            <AlertMessage message={message.message} status={message.status} />
          ) : (
            <Text></Text>
          )} */}
          <Box safeArea flex="1" mt="5" justifyContent="center">
            <Center>
              {/* //image */}
              <Image
                size={100}
                resizeMode={"contain"}
                borderRadius={300}
                source={{
                  uri: path
                }}
                alt="Alternate Text"
              />
              {/* name */}
              <Text
                fontSize="lg"
                _light={{
                  color: "blue.500"
                }}
                _dark={{
                  color: "blue.400"
                }}
                fontWeight="500"
                mt="1"
              >
                {fullname(userData.name)}
              </Text>
              {/* type, section or faculty */}
              <Text
                fontSize="sm"
                _light={{
                  color: "blue.500"
                }}
                _dark={{
                  color: "blue.400"
                }}
                fontWeight="500"
                mt="1"
              >
                {userData.user_id.role === "student"
                  ? getYearSection(userData)
                  : userData.department_id.department}
              </Text>
              {/* card records */}
              {medicalRecord === "no-record" || !medicalRecord ? (
                <>
                  <Center>
                    <Image
                      mt="20"
                      source={require(`../../assets/folder.png`)}
                      alt="Empty Folder"
                    />
                  </Center>
                  <Text fontSize="md" fontWeight="500" mt="5">
                    No Prescriptions Found
                  </Text>
                </>
              ) : (
                <>
                  <NativeSearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    placeholder="Search Prescription Record"
                  />
                </>
              )}
            </Center>
          </Box>
        </ScrollView>
        {medicalRecord === "no-record" || !medicalRecord ? (
          <View></View>
        ) : (
          <Center>
            <MedicalRecordList
              navigation={navigation}
              item={medicalRecord}
              searchPhrase={searchPhrase}
              navigateTo="ViewPrescription"
            />
          </Center>
        )}
      </SafeAreaView>
    </View>
  );
};
