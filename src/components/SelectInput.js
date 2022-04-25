import React from "react";
import { Select, Box, CheckIcon, Center } from "native-base";
import uuid from "react-native-uuid";

export const SelectInput = ({
  isInvalid,
  itemName,
  items,
  label,
  selected,
  setSelected,
  handleChange
}) => {
const itemChange=(value)=>{
  handleChange(itemName, value);
  setSelected(value)
}
  return (
    <Center>
      <Box maxW="390" >
        <Select
        isInvalid={isInvalid}
          key={uuid.v4()}
          selectedValue={selected}
          minWidth="200"
          accessibilityLabel={label}
          placeholder={label}
          _selectedItem={{
            bg: "blue.100",
            endIcon: <CheckIcon size="5" />
          }}
          mt={1}
          onValueChange={itemValue => itemChange(itemValue)}
        >
          {items.map(item => (
            <Select.Item
              key={uuid.v4()}
              label={item[itemName]}
              value={item._id}
            />
          ))}
        </Select>
      </Box>
    </Center>
  );
};
