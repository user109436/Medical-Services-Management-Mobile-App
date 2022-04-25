import React from "react";
import { View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Text, Center } from "native-base";
import moment from 'moment';

export const CustomDateTimePicker = ({ date, setDate, setSignUpForm, signUpForm }) => {
  const [mode, setMode] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [text, setText] = React.useState("no date selected");
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios"); //setting it to ios closes it on select, i duno why
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = `${tempDate.getDate()}/${tempDate.getMonth() +
      1}/${tempDate.getFullYear()}`;
    setText(fDate);
    let age= moment(tempDate, "YYYYMMDD").fromNow();
    if(age==='a year ago'){
      age='1';
    }else{
      let text=age.indexOf('years');
      age=age.substr(0, text).trim();
    }
    //update age
    setSignUpForm({...signUpForm, age});

  };
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };
  React.useEffect(() => {
    return () => {
     setText('no date selected');
    }
  }, [])
  return (
    <View>
      <Center>
        <Text  fontSize="xl" >{text}</Text>
      </Center>
      <Button title="DatePicker" small onPress={() => showMode("date")}>
        <Text>Select Date</Text>
      </Button>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};
