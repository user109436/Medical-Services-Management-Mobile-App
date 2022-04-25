import React from "react";
import {
  Alert,
  IconButton,
  HStack,
  VStack,
  CloseIcon,
  Text,
} from "native-base";

export const AlertMessage = ({message, status}) => {
  return (
    <Alert w="100%" status={status}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {message}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Alert>
  );
};
