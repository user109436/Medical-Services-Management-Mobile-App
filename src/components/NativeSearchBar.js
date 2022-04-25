import React from "react";
import {
  VStack,
  Input,
  Icon,
  Center,
  Box,
  Divider
} from "native-base";
import {Entypo, MaterialIcons } from "@expo/vector-icons";

export const NativeSearchBar = ({searchPhrase, setSearchPhrase, placeholder="Search Medical Record"}) => {
  return (
    <Center flex={1} px="2">
      <VStack
        my="4"
        w="100%"
        maxW="400"
        divider={
          <Box px="2">
            <Divider />
          </Box>
        }
        bg={"white"}
      >
        <VStack w="100%" alignSelf="center">
          <Input
            placeholder={placeholder}
            width="100%"
            borderRadius="4"
            py="3"
            px="1"
            fontSize="14"
            value={searchPhrase}
            onChangeText={(value)=>setSearchPhrase(value)}
            InputLeftElement={
              <Icon
                m="2"
                ml="3"
                size="6"
                color="gray.400"
                as={<MaterialIcons name="search" />}
              />
            }
            InputRightElement={
                <Icon
                  m="2"
                  ml="3"
                  size="6"
                  color="gray.400"
                  as={<Entypo name="erase" />}
                  onPress={()=>setSearchPhrase("")}
                />
              }
          />
        </VStack>
      </VStack>
    </Center>
  );
};
