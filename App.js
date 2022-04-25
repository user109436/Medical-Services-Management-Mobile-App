import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import AppNavigator from "./src/Navigator";
import axios from "axios";
import { AuthProvider } from "./src/provider/AuthProvider";

axios.defaults.baseURL = "https://e-consultation-app.herokuapp.com/";
// axios.defaults.baseURL = "http://192.168.18.2:3001/";
axios.create({
  withCredentials: true
});

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "light"
};

// extend the theme
export const theme = extendTheme({ config });

export default function App() {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </NativeBaseProvider>
  );
}
