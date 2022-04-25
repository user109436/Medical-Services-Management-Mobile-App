// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./screens/Login";
import { SignUp } from "./screens/SignUp";
import { Chat } from "./screens/Chat";
import { MedicalRecord } from "./screens/MedicalRecord";
import { Prescriptions } from "./screens/Prescriptions";
import { Menu } from "./screens/Menu";
import { ViewMedicalRecord } from "./screens/view/ViewMedicalRecord";
import { ViewPrescription } from "./screens/view/ViewPrescription";
import { UpdateMyInfo } from "./screens/UpdateMyInfo";
import {ChangePassword} from "./screens/ChangePassword";

import AuthContext from "./provider/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const { Navigator, Screen } = createNativeStackNavigator();

const AppNavigator = () => {
  const { auth, setAuth } = React.useContext(AuthContext);
  React.useEffect(() => {
    const getItem = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setAuth(token);
          return token;
        }
      } catch (e) {
        console.log(e);
      }
    };
    getItem();
    return()=>{
      setAuth(null);
    }
  }, []);
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        {!auth  ? (
          <>
            <Screen name="Login" component={Login}></Screen>
            <Screen name="SignUp" component={SignUp}></Screen>
          </>
        ) : (
          <>
            <Screen name="Menu" component={Menu}></Screen>
            <Screen name="Chat" component={Chat}></Screen>
            <Screen name="MedicalRecord" component={MedicalRecord}></Screen>
            <Screen name="Prescriptions" component={Prescriptions}></Screen>
            <Screen name="ViewMedicalRecord" component={ViewMedicalRecord}></Screen>
            <Screen name="ViewPrescription" component={ViewPrescription}></Screen>
            <Screen name="UpdateMyInfo" component={UpdateMyInfo}></Screen>
            <Screen name="ChangePassword" component={ChangePassword}></Screen>
          </>
        )}
      </Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
