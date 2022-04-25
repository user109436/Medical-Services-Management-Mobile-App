import React from "react";
import { FlatList } from "react-native";
import { Box, Text, Stack, Pressable } from "native-base";
import moment from "moment";
export const MedicalRecordList = ({
  navigation,
  item,
  searchPhrase,
  navigateTo = "ViewMedicalRecord"
}) => {
  const renderList = ({ item }) => {
    let date = moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a");
    if (searchPhrase === "") {
      return (
        <MedicalRecord
          record={item}
          navigation={navigation}
          navigateTo={navigateTo}
        />
      );
    }
    if (
      date.toUpperCase().includes(
        searchPhrase
          .toUpperCase()
          .trim()
          .replace(/\s/g, "")
      )
    ) {
      return <MedicalRecord record={item} />;
    }
  };
  return (
    <FlatList
      data={item}
      renderItem={renderList}
      keyExtractor={item => item._id}
    />
  );
};

const MedicalRecord = ({ record, navigation, navigateTo }) => {
  return (
    <Pressable onPress={() => navigation.navigate(navigateTo, record)}>
      <Box
        mt="5"
        px="3"
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
              fontSize="md"
              mt="1"
            >
              {navigateTo === "ViewMedicalRecord"
                ? "Medical Record as of "
                : "Prescription Record as of"}
              {moment(record.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Pressable>
  );
};

