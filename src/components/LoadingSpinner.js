import React from "react";
import { Spinner, HStack, Heading } from "native-base";

export const LoadingSpinner = ({ text = "Loading" }) => {
  return (
    <HStack space={2} alignItems="center">
      <Spinner size="lg" accessibilityLabel={text} />
      <Heading color="primary.500" fontSize="md">
        {text}
      </Heading>
    </HStack>
  );
};
