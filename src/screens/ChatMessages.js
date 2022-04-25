import React from "react";
import { SafeAreaView } from "react-native";
import {
  VStack,
  Box,
  FormControl,
  Input,
  HStack,
  Text,
  Icon,
  ScrollView,
  Button,
  Image,
  Pressable,
  Center,
  View,
  Badge
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ImageModal } from "../components/ImageModal";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { hasFileExtension, fullname } from "../utils/Utilities";
import io from "socket.io-client";
import * as ImagePicker from "expo-image-picker";
import { AlertMessage } from "../components/Alert";
var socket;
const assets = "https://e-consultation-app.herokuapp.com/";
// const assets = "http://192.168.18.2:3001/";
export const ChatMessages = () => {
  const [message, setMessages] = React.useState({
    message: "",
    chatRoom: "",
    images: []
  });
  const [chatRoomMessages, setChatRoomMessages] = React.useState(null);
  const [selectedChatRoom, setSelectedChatRoom] = React.useState("");
  const [sendMessage, setSendMessage] = React.useState(false);
  const scrollViewRef = React.useRef();

  const [showModal, setShowModal] = React.useState({
    open: false,
    img: ""
  });
  const [userData, setUserData] = React.useState(null);
  const [networkError, setNetworkError] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState({
    status: "",
    message: ""
  });
  const imagePreview = img => {
    setShowModal({
      open: true,
      img
    });
  };
  const handleChange = (name, value) => {
    setMessages({ ...message, [name]: value });
  };
  const handleSubmit = async () => {
    // validate for errors
    setSendMessage(true);
    if (!message.message && !message.chatRoom && message.images.length === 0)
      return false;
    try {
      //send message
      if (message.message) {
        await axios.post(`api/chats/${selectedChatRoom}`, {
          message: message.message
        });
      }
      //send files
      if (message.images.length > 0 && message.images.length <= 10) {
        const formData = new FormData();
        for (const image of message.images) {
          // ImagePicker saves the taken photo to disk and returns a local URI to it
          let localUri = image.uri;
          let filename = localUri.split("/").pop();

          // Infer the type of the image
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image`;
          formData.append("images", { uri: localUri, name: filename, type });
        }
        // await axios.post(`api/chats/${selectedChatRoom}/files`, formData);
        const url = `https://e-consultation-app.herokuapp.com/`;
        // const url = `http://192.168.18.2:3001/`; //local server for development
        const res = await fetch(`${url}api/chats/${selectedChatRoom}/files`, {
          method: "POST",
          body: formData,
          header: {
            "content-type": "multipart/form-data"
          }
        });
      }
      const messages = await axios.get(`api/chats/${selectedChatRoom}`);
      socket.emit("send-message", messages.data, selectedChatRoom);
      socket.emit("updateChatrooms", { message: "update-chatrooms" });
      setChatRoomMessages({ ...messages.data });
      handleClear();
    } catch (err) {
      if (err.response.data) {
        //   message.message = err.response.data.message;
        //   setMessage({ ...message, status:"info" });
        console.log(err.response.data);
        return;
      }
      console.log(err.message);
      if (err.message) {
        setNetworkError(true);
      }
    }
  };
  const handleClear = () => {
    setMessages({ message: "", chatRoom: "", images: [] });
    setSendMessage(false);
    scrollViewRef.current ? scrollViewRef.current.scrollToEnd() : "";
  };
  const openImagePickerAsync = async () => {
    setAlertMessage({
      status: "",
      message: ""
    });
    if (message.images.length > 10) {
      setAlertMessage({
        status: "error",
        message: "Maximum of 10 image only"
      });
      return false;
    }
    try {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
        // base64: true
      });

      if (result.cancelled === true) {
        return;
      }
      //push files to message.images
      message.images.push(result);
      setMessages({ ...message });
      return true;
    } catch (e) {
      console.log(e);
    }
    setSendMessage(false);
  };
  //fetch chatroom messages
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        //get user_id from localstorage
        let userData = await AsyncStorage.getItem("userData");
        if (userData) {
          userData = JSON.parse(userData);
          setUserData(userData);
          //get chatrooms of this user
          let room = await axios.get(
            `api/chats/chat-rooms/${userData.user_id._id}`
          );
          if (room.data.doc.length > 0) {
            //has a room already
            setSelectedChatRoom(room.data.doc[0]._id);
            //fetch chatroom messages
            let res = await axios.get(`api/chats/${room.data.doc[0]._id}`); //has conversation
            setChatRoomMessages(res.data);
            return true;
          }
          //create new room
          let obj = {
            users: [userData.user_id._id], //include all physicians in the back-end
            message: "chatroom created"
          };
          let res = await axios.post(`api/chats/chat-rooms`, obj);
          setSelectedChatRoom(res.data.chatroom._id);
          let messages = await axios.get(`api/chats/${res.data.chatroom._id}`); //has conversation
          setChatRoomMessages(messages.data);
        }
        //log out user
      } catch (err) {
        if (err.response.data) {
          //   message.message = err.response.data.message;
          //   setMessage({ ...message, status:"info" });
          console.log(err.response.data);
        }
        console.log(err.message);
        if (err.message) {
          setNetworkError(true);
        }
      }
    };
    fetchData();
  }, []);
  //connect to websocket server
  React.useEffect(() => {
    socket = io("https://e-consultation-app.herokuapp.com");
    return () => {
      socket.disconnect();
    };
  }, []);
  //join room
  React.useEffect(() => {
    if (selectedChatRoom) {
      console.log(`joining ${selectedChatRoom}`);
      socket.emit("join-room", selectedChatRoom);
    }
  }, [selectedChatRoom]);
  //listen for incoming messages
  React.useEffect(() => {
    socket.off("receive-message").on("receive-message", (message, room) => {
      console.log("useEffect receive messsage update");
      if (room === selectedChatRoom) {
        setChatRoomMessages(message);
      }
    });
    scrollViewRef.current ? scrollViewRef.current.scrollToEnd() : "";
  });
  if (networkError) {
    return (
      <SafeAreaView>
        <VStack justifyContent="center" alignItems="center">
          <Center>
            <Image
              mt="40"
              source={require(`../../assets/network.png`)}
              alt="Network Error"
            />
            <Text fontSize="md" fontWeight="500" mt="5">
              Network Error: Could not connect to the Server
            </Text>
          </Center>
        </VStack>
      </SafeAreaView>
    );
  }
  if (!chatRoomMessages || !userData) {
    return (
      <Box safeArea justifyContent="center">
        <Center>
          <LoadingSpinner text={"Getting Messages"} />
        </Center>
      </Box>
    );
  }
  return (
    <Center flex={1}>
      <SafeAreaView>
        <Box flexWrap="wrap">
          <Box height="85%" safeArea w="100%" maxW="390">
            {alertMessage.message ? (
              <AlertMessage
                message={alertMessage.message}
                status={alertMessage.status}
              />
            ) : (
              <Text></Text>
            )}
            <ScrollView ref={scrollViewRef}>
              <ImageModal showModal={showModal} setShowModal={setShowModal} />
              {chatRoomMessages.length > 0 ? (
                <>
                  {chatRoomMessages.doc.map(message => (
                    <Box
                      flexWrap="wrap"
                      alignItems={
                        message.sender._id === userData.user_id._id
                          ? "flex-end"
                          : "flex-start"
                      }
                      //flex-end for you as the sender
                      alignSelf={
                        message.sender._id === userData.user_id._id
                          ? "flex-end"
                          : "flex-start"
                      }
                      //flex-end for you as the sender
                      my="5"
                      maxW="90%"
                      key={message._id}
                    >
                      {/* container for all image sent 2x2 */}
                      {message.files.length > 0 ? (
                        <>
                          <HStack flexWrap="wrap">
                            {message.files.map((image, i) => {
                              let path = hasFileExtension(image)
                                ? `${assets}api/images/${image}`
                                : image;
                              return (
                                <Pressable
                                  key={i}
                                  onPress={() => imagePreview(path)}
                                >
                                  <Image
                                    source={{
                                      uri: path
                                    }}
                                    alt={`Image from:${path}`}
                                    size="sm"
                                    px="4"
                                    py="3"
                                    ml="3"
                                    my="2"
                                  />
                                </Pressable>
                              );
                            })}
                          </HStack>
                        </>
                      ) : (
                        <View></View>
                      )}
                      <Text fontSize="xs" px="4" ml="3" color="muted.500">
                        {fullname(message.sender.name)}
                      </Text>
                      {message.message && (
                        <MessageSent message={message} userData={userData} />
                      )}
                      <DateSent date={message.createdAt} />
                    </Box>
                  ))}
                </>
              ) : (
                <>
                  <Center>
                    <Image
                      mt="20"
                      source={require(`../../assets/empty.png`)}
                      alt="Empty Message"
                    />
                    <Text fontSize="md" fontWeight="500" mt="5">
                      No Conversation Found
                    </Text>
                  </Center>
                </>
              )}
            </ScrollView>
          </Box>
          <HStack
            height="15%"
            alignItems="center"
            justifyContent="center"
            p="2"
            borderTopWidth="1"
            borderColor="muted.300"
          >
            <HStack justifyContent="space-evenly" alignItems="center">
              {/* message input */}
              <Box flex="1">
                <FormControl>
                  <Input
                    size="md"
                    variant="rounded"
                    onChangeText={value => handleChange("message", value)}
                    value={message.message}
                    placeholder="Type Message"
                    isDisabled={sendMessage}
                  />
                </FormControl>
              </Box>
              <HStack w="35%" justifyContent="center" space={4}>
                {/* send button and upload image */}
                <Button
                  bg="blue.500"
                  isDisabled={sendMessage}
                  onPress={openImagePickerAsync}
                >
                  {message.images.length>0 && (
                    <Badge
                      colorScheme="warning"
                      rounded="full"
                      mb={-6}
                      mr={-4}
                      zIndex={1}
                      variant="solid"
                      alignSelf="flex-end"
                      _text={{
                        fontSize: 12
                      }}
                    >
                      {message.images.length}
                    </Badge>
                  )}
                  <Icon
                    as={MaterialCommunityIcons}
                    name="image"
                    color="white"
                    _dark={{
                      color: "warmGray.50"
                    }}
                  />
                </Button>
                <Button
                  isDisabled={sendMessage}
                  bg="blue.500"
                  onPress={() => handleSubmit()}
                >
                  <Icon
                    as={MaterialCommunityIcons}
                    name="send"
                    color="white"
                    _dark={{
                      color: "warmGray.50"
                    }}
                  />
                </Button>
              </HStack>
            </HStack>
          </HStack>
        </Box>
      </SafeAreaView>
    </Center>
  );
};

const DateSent = ({ date }) => {
  if (!date) date = Date.now();
  return (
    <Text fontSize="xs" px="4" ml="3" color="muted.500">
      {moment(date).format("MMMM Do YYYY, h:mm:ss a")}
    </Text>
  );
};
const MessageSent = ({ message, userData }) => {
  if (!message) return false;

  let imgPath = hasFileExtension(message.sender.photo)
    ? `${assets}api/images/${message.sender.photo}`
    : message.sender.photo;
  return (
    <HStack alignItems="center" flexWrap="wrap">
      {message.sender._id !== userData.user_id._id && (
        <Image
          size={45}
          resizeMode={"contain"}
          borderRadius={300}
          source={{
            uri: imgPath
          }}
          alt={`${message.sender.role} image`}
        />
      )}
      <Text
        fontSize="sm"
        bg={
          message.sender._id === userData.user_id._id
            ? "blue.500"
            : message.sender.role === "doctor"
            ? "info.500"
            : message.sender.role === "dentist"
            ? "purple.800"
            : message.sender.role === "nurse"
            ? "#ad1457"
            : "blue.500"
        }
        //   "muted.500"
        //blue.500 for you as the sender
        px="4"
        py="3"
        ml="3"
        my="2"
        color="white"
        borderRadius="20"
      >
        {message.message}
      </Text>
    </HStack>
  );
};
