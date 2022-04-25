// In App.js in a new project

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Chat } from "./screens/Chat";
import { MedicalRecord } from "./screens/MedicalRecord";
import { Prescriptions } from "./screens/Prescriptions";


const Drawer = createDrawerNavigator();

const SideDrawer = () => (
  <NavigationContainer>
    <Drawer.Navigator screenOptions={{ headerShown: false }} initialRouteName="Chat">
      <Drawer.Screen name="Chat" component={Chat}></Drawer.Screen>
      <Drawer.Screen name="MedicalRecord" component={MedicalRecord}></Drawer.Screen>
      <Drawer.Screen name="Prescriptions" component={Prescriptions}></Drawer.Screen>
    </Drawer.Navigator>
  </NavigationContainer>
);
export default SideDrawer;
