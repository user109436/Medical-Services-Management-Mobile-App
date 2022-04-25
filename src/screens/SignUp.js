import * as React from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  Divider,
  Select,
  CheckIcon,
  Text,
  Icon,
  HStack,
  Image
} from "native-base";
import uuid from "react-native-uuid";
import { ScrollView } from "react-native";
import { SelectInput } from "../components/SelectInput";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CustomDateTimePicker } from "../components/CustomDateTimePicker";
import { AlertMessage } from "../components/Alert";
import { hasErrors, resetErrors } from "../utils/Utilities";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
export const SignUp = () => {
  const [year, setYear] = React.useState();
  const [section, setSection] = React.useState();
  const [course, setCourse] = React.useState("620a598c7e4c8d2df21ede45");
  const [department, setDepartment] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [message, setMessage] = React.useState({
    message: "",
    status: ""
  });
  const [userPhoto, setUserPhoto] = React.useState(null);
  const [photoURI, setPhotoURI] = React.useState(
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"
  );
  const [networkError, setNetworkError] = React.useState(false);
  const [signUpForm, setSignUpForm] = React.useState({
    //account info
    email: "pike.allan@orperfect.com",
    password: "12345678",
    role: "student",

    //staffs unique fields
    employee_no: "",
    department_id: "",

    //students unique fields
    student_no: "123",
    // year_id: "",
    // section_id: "",
    course_id: "620a598c7e4c8d2df21ede45",

    //students and staffs same fields
    name: {
      firstname: "Nussen",
      middlename: "",
      lastname: "Jensin",
      suffix: "",
      firstnameError: false,
      lastnameError: false
    },
    sex: "female",
    birthday: "",
    age: "20",
    civil_status: "single",
    religion: "Christian",
    address: [
      {
        house_number: "123",
        street: "Mapagmahal St",
        barangay: "Maybancal",
        municipality: "Morong",
        city_province: "Rizal",
        house_numberError: false,
        streetError: false,
        barangayError: false,
        municipalityError: false,
        city_provinceError: false
      }
    ],
    contact: [{ contact: "09123456789", contactError: false }],

    //ERRORS

    //account info errors
    emailError: false,
    passwordError: false,
    roleError: false,

    //staff errors
    employee_noError: false,
    department_idError: false,

    //students errors
    student_noError: false,
    // year_idError: false,
    // section_idError: false,
    course_idError: false,
    //name errors is already inside of it's object
    sexError: false,
    birthdayError: false,
    ageError: false,
    civil_statusError: false,
    religionError: false
    // address errors is already inside of it's object
    // contact errors is already inside of it's object
  });
  const [selectData, setSelectData] = React.useState({
    years: [],
    sections: [],
    courses: [],
    departments: []
  });
  const [processing, setProcessing]=React.useState(false);//signup button is clicked
  /*
  @param {String} name - field of the state to which this will be assigned
  @param {String} value - value of the field
  @param {String} uniqueField - for Arrays & Objects
  */

  const handleChange = (name, value, uniqueField = "") => {
    const staff = ["faculty", "non-faculty"];
    //exception for name, address and contacts
    const uniqueFields = ["name", "address", "contact"];
    const idFields = ["year", "course", "section", "department"];
    if (idFields.includes(name)) {
      signUpForm[`${name}_idError`] = false;
      return true;
    }
    if (uniqueFields.includes(uniqueField)) {
      if (uniqueField === "name") {
        signUpForm[uniqueField][name] = value;
        signUpForm[uniqueField][`${name}Error`] = false;
        setSignUpForm({ ...signUpForm });
        return true;
      }
      if (uniqueField === "address" || uniqueField === "contact") {
        signUpForm[uniqueField][0][name] = value;
        signUpForm[uniqueField][0][`${name}Error`] = false;
        setSignUpForm({ ...signUpForm });
        return true;
      }
    }
    if (name === "role") {
      //reset unique fields of employee
      if (value === "student") {
        setSignUpForm({
          ...signUpForm,
          employee_no: "",
          department_id: "",
          employee_noError: false,
          department_idError: false,
          [name]: value
        });
        setDepartment("");
        return true;
      }
      //reset unique fields of student
      if (staff.includes(value)) {
        setSignUpForm({
          ...signUpForm,
          student_no: "",
          // section_id: "",
          course_id: "",
          // year_id: "",
          student_noError: false,
          // section_idError: false,
          course_idError: false,
          // year_idError: false,
          [name]: value
        });
        setCourse("");
        // setYear("");
        // setSection("");
        return true;
      }
    }
    signUpForm[`${name}Error`] = false;
    setSignUpForm({ ...signUpForm, [name]: value });
  };
  const handleSubmit = async () => {
    let message = "";
    setMessage({
      message: "",
      status: ""
    });
    //resetErrors
    resetErrors(signUpForm, ["name", "address", "contact"]);
    resetErrors(signUpForm.name, ["middlename", "suffix"]);
    resetErrors(signUpForm.address[0]);
    resetErrors(signUpForm.contact[0]);
    //assignment of independent states to signUpForm
    // signUpForm.year_id = year || "";
    signUpForm.course_id = course || "";
    // signUpForm.section_id = section || "";
    signUpForm.department_id = department || "";
    signUpForm.birthday = date || "";
    let errors = 0;
    //error exception on unique fields
    const staffUniqueField =
      signUpForm.employee_no ||
      signUpForm.department_id ||
      signUpForm.employee_no;
    const studentUniqueField = signUpForm.student_no || signUpForm.course_id;
    // signUpForm.year_id ||
    // signUpForm.section_id;
    if (staffUniqueField) {
      //error exception on student unique fields
      let whitelist = ["student_no", "course_id"];
      errors += hasErrors(signUpForm, whitelist);
    }
    if (studentUniqueField) {
      //error exeception on staff unique fields
      let whitelist = ["employee_no", "department_id"];
      errors += hasErrors(signUpForm, whitelist);
    }
    if (!staffUniqueField && !studentUniqueField) {
      errors += hasErrors(signUpForm, [
        "name",
        "address",
        "contact"
      ]);
    }
    errors += hasErrors(signUpForm.name, ["middlename", "suffix"]);
    errors += hasErrors(signUpForm.address[0]);
    errors += hasErrors(signUpForm.contact[0]);
    //validation, password, email and contact
    if (signUpForm.email.indexOf("@") === -1) {
      signUpForm.emailError = true;
      message += "Invalid Email Address";
      errors++;
    }
    if (signUpForm.password.length <= 7) {
      signUpForm.passwordError = true;
      message += ", Password atleast 8 characters";
      errors++;
    }
    if (signUpForm.contact[0].contact.length !== 11) {
      signUpForm.contact[0].contactError = true;
      message += ", Contact number must be 11 numbers";
      errors++;
    }
    if (!signUpForm.birthday) {
      signUpForm.birthdayError = true;
      message += ", Please select your birthday ";
      errors++;
    }
    
    if (errors) {
      setMessage({ ...message, message, status: "error" });
      setSignUpForm({ ...signUpForm });
      return false;
    }
    setSignUpForm({ ...signUpForm });
    //save
    try {
      setProcessing(true);
      const res = await axios.post("api/account/signup", signUpForm);
      setMessage({ status: "success", message: res.data.message });
      //update user-photo, if person uploads/select image
      if (userPhoto) {
        await fetch(
          `${axios.defaults.baseURL}api/users/update-photo/${res.data.user_id}`,
          {
            method: "PATCH",
            body: userPhoto,
            header: {
              "content-type": "multipart/form-data"
            }
          }
        );
      }

      //clear & reset errors
      handleClear();
      return true;
    } catch (err) {
      if (err.response.data) {
        setMessage({ status: "error", message: err.response.data.message });
      }
    }
    setProcessing(false);
  };
  const handleClear = () => {
    setSignUpForm({
      //account info
      email: "",
      password: "",
      role: "",

      //staffs unique fields
      employee_no: "",
      department_id: "",

      //students unique fields
      student_no: "",
      // year_id: "",
      // section_id: "",
      course_id: "",

      //students and staffs same fields
      name: {
        firstname: "",
        middlename: "",
        lastname: "",
        suffix: "",
        firstnameError: false,
        lastnameError: false
      },
      sex: "",
      birthday: "",
      age: "",
      civil_status: "",
      religion: "",
      address: [
        {
          house_number: "",
          street: "",
          barangay: "",
          municipality: "",
          city_province: "",
          house_numberError: false,
          streetError: false,
          barangayError: false,
          municipalityError: false,
          city_provinceError: false
        }
      ],
      contact: [{ contact: "", contactError: false }],

      //ERRORS

      //account info errors
      emailError: false,
      passwordError: false,
      roleError: false,

      //staff errors
      employee_noError: false,
      department_idError: false,

      //students errors
      student_noError: false,
      // year_idError: false,
      // section_idError: false,
      course_idError: false,
      //name errors is already inside of it's object
      sexError: false,
      birthdayError: false,
      ageError: false,
      civil_statusError: false,
      religionError: false
      // address errors is already inside of it's object
      // contact errors is already inside of it's object
    });
    // setSection("");
    setCourse("");
    // setYear("");
    setDepartment("");
    setDate(new Date());
    setProcessing(false);
  };
  const openImagePickerAsync = async () => {
    try {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      });

      if (result.cancelled === true) {
        return;
      }
      //formdata
      let localUri = result.uri;
      let filename = localUri.split("/").pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      // // Upload the image using the fetch and FormData APIs
      const formData = new FormData();
      // // Assume "photo" is the name of the form field the server expects
      formData.append("photo", { uri: localUri, name: filename, type });
      //save userPhoto to state
      // await fetch(
      //   `${axios.defaults.baseURL}api/users/update-photo/5c8a201e2f8fb814b56fa197`,
      //   {
      //     method: "PATCH",
      //     body: formData,
      //     header: {
      //       "content-type": "multipart/form-data"
      //     }
      //   }
      // );
      setUserPhoto(formData);
      setPhotoURI(result.uri);
    } catch (e) {
      console.log(e);
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // let years = await axios.get(`api/years`);
        // let sections = await axios.get(`api/sections`);
        let courses = await axios.get(`api/courses`);
        let departments = await axios.get(`api/departments`);
        // years = years.data.doc;
        // sections = sections.data.doc;
        courses = courses.data.doc;
        departments = departments.data.doc;
        setSelectData({ ...selectData, courses, departments });
      } catch (err) {
        console.log(err.response.data);
        //TODO:handleError here
        //err is non operational
        if (err.message) {
          setNetworkError(true);
        }
      }
    };
    fetchData();
    handleClear();
    return () => {
      handleClear();
      setMessage({
        message: "",
        status: ""
      });
    };
  }, []);
  if (selectData.courses.length === 0) {
    return (
      <Box safeArea flex="1" justifyContent="center">
        <Center>
          <LoadingSpinner />
        </Center>
      </Box>
    );
  }
  if (networkError) {
    return (
      <Box safeArea flex="1" justifyContent="center">
        <Center>
          <Image
            source={require(`../../assets/network.png`)}
            alt="Network Error"
          />
          <Text fontSize="md" fontWeight="500" mt="5">
            Network Error: Could not connect to the Server
          </Text>
        </Center>
      </Box>
    );
  }
  return (
    <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="390" py="8">
        <ScrollView>
          <Center>
            <Heading
              size="lg"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50"
              }}
              bold
            >
              E-Consultation Sign-Up
            </Heading>
          </Center>
          <Divider my="2" />
          {message.message ? (
            <AlertMessage message={message.message} status={message.status} />
          ) : (
            <Text></Text>
          )}
          <VStack space={3} mt="5">
            {/* Account Info */}
            <Heading
              size="sm"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50"
              }}
              bold
            >
              Account Information
            </Heading>

            <HStack justifyContent="center">
              <Image
                size={100}
                resizeMode={"contain"}
                borderRadius={300}
                source={{
                  uri: photoURI
                }}
                alt="Your Profile Picture"
              />
            </HStack>
            <Button
              bg="blue.500"
              size="sm"
              onPress={openImagePickerAsync}
              leftIcon={
                <Icon
                  as={MaterialCommunityIcons}
                  name="image"
                  color="white"
                  _dark={{
                    color: "warmGray.50"
                  }}
                />
              }
            >
              Choose Your Profile Picture
            </Button>
            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                isInvalid={signUpForm.emailError}
                onChangeText={value => handleChange("email", value)}
                defaultValue={signUpForm.email}
                placeholder="e.g. johndoe@gmail.com"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                isInvalid={signUpForm.passwordError}
                onChangeText={value => handleChange("password", value)}
                defaultValue={signUpForm.password}
                placeholder="min of 8 characters, numbers etc."
                type="password"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Role</FormControl.Label>
              <Select
                isInvalid={signUpForm.roleError}
                selectedValue={signUpForm.role}
                minWidth="200"
                accessibilityLabel="Role"
                placeholder="Role"
                _selectedItem={{
                  bg: "blue.100",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={value => handleChange("role", value)}
              >
                <Select.Item label="Student" value="student" />
                <Select.Item label="Faculty Member" value="faculty" />
                <Select.Item label="Staff" value="non-faculty" />
              </Select>
            </FormControl>
            {/* Staff Student Info */}
            <Divider my="2" />
            <Heading
              size="sm"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50"
              }}
              fontWeight="semibold"
              mt="10"
              bold
            >
              Personal Information
            </Heading>
            <FormControl>
              <FormControl.Label>First Name</FormControl.Label>
              <Input
                isInvalid={signUpForm.name.firstnameError}
                onChangeText={value => handleChange("firstname", value, "name")}
                defaultValue={signUpForm.name.firstname}
                placeholder="e.g. Peter, Mark, John"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Middle Initial</FormControl.Label>
              <Input
                onChangeText={value =>
                  handleChange("middlename", value, "name")
                }
                defaultValue={signUpForm.name.middlename}
                placeholder="e.g. M"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Last Name</FormControl.Label>
              <Input
                isInvalid={signUpForm.name.lastnameError}
                onChangeText={value => handleChange("lastname", value, "name")}
                defaultValue={signUpForm.name.lastname}
                placeholder="e.g. WallStreet, Mapagmahal, Doe"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Suffix</FormControl.Label>
              <Input
                onChangeText={value => handleChange("suffix", value, "name")}
                defaultValue={signUpForm.name.suffix}
                placeholder="e.g. Jr, PhD, MA, MBA, Engr"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Birthday</FormControl.Label>
              <CustomDateTimePicker date={date} setDate={setDate} setSignUpForm={setSignUpForm} signUpForm={signUpForm} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Age</FormControl.Label>
              <Input
                isDisabled
                isInvalid={signUpForm.ageError}
                onChangeText={value => handleChange("age", value)}
                defaultValue={signUpForm.age}
                placeholder="e.g. 20"
                keyboardType="numeric"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Sex</FormControl.Label>
              <Select
                isInvalid={signUpForm.sexError}
                selectedValue={signUpForm.sex}
                minWidth="200"
                accessibilityLabel="Sex"
                placeholder="Sex"
                _selectedItem={{
                  bg: "blue.100",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={value => handleChange("sex", value)}
              >
                <Select.Item label="Male" value="male" />
                <Select.Item label="Female" value="female" />
              </Select>
            </FormControl>
            <FormControl>
              <FormControl.Label>Civil Status</FormControl.Label>
              <Select
                isInvalid={signUpForm.civil_statusError}
                selectedValue={signUpForm.civil_status}
                minWidth="200"
                accessibilityLabel="Civil Status"
                placeholder="Civil Status"
                _selectedItem={{
                  bg: "blue.100",
                  endIcon: <CheckIcon size="5" />
                }}
                mt={1}
                onValueChange={value => handleChange("civil_status", value)}
              >
                <Select.Item label="Single" value="single" />
                <Select.Item label="Married" value="married" />
                <Select.Item label="Widowed" value="widowed" />
                <Select.Item label="Divorced" value="divorced" />
              </Select>
            </FormControl>
            <FormControl>
              <FormControl.Label>Religion</FormControl.Label>
              <Input
                isInvalid={signUpForm.religionError}
                onChangeText={value => handleChange("religion", value)}
                defaultValue={signUpForm.religion}
                placeholder="e.g. Catholic, Christian, Jehova"
              />
            </FormControl>
            {/* Address & Contact */}
            <Divider my="2" />
            <Heading
              size="sm"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50"
              }}
              fontWeight="semibold"
              mt="10"
              bold
            >
              Address & Contact Info
            </Heading>
            <FormControl>
              <FormControl.Label>House Number</FormControl.Label>
              <Input
                isInvalid={signUpForm.address[0].house_numberError}
                onChangeText={value =>
                  handleChange("house_number", value, "address")
                }
                defaultValue={signUpForm.address[0].house_number}
                placeholder="e.g. 123, 25, 26"
                keyboardType="numeric"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Street</FormControl.Label>
              <Input
                isInvalid={signUpForm.address[0].streetError}
                onChangeText={value => handleChange("street", value, "address")}
                defaultValue={signUpForm.address[0].street}
                placeholder="e.g. Mapagmahal Street, Rodriguez Street"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Barangay</FormControl.Label>
              <Input
                isInvalid={signUpForm.address[0].barangayError}
                onChangeText={value =>
                  handleChange("barangay", value, "address")
                }
                defaultValue={signUpForm.address[0].barangay}
                placeholder="e.g. Lagundi, Maybancal, San Guillermo"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Municipality</FormControl.Label>
              <Input
                isInvalid={signUpForm.address[0].municipalityError}
                onChangeText={value =>
                  handleChange("municipality", value, "address")
                }
                defaultValue={signUpForm.address[0].municipality}
                placeholder="e.g. Morong, Baras, Tanay"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>City/Province</FormControl.Label>
              <Input
                isInvalid={signUpForm.address[0].city_provinceError}
                onChangeText={value =>
                  handleChange("city_province", value, "address")
                }
                defaultValue={signUpForm.address[0].city_province}
                placeholder="e.g. Rizal, Makati"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Contact</FormControl.Label>
              <Input
                isInvalid={signUpForm.contact[0].contactError}
                onChangeText={value =>
                  handleChange("contact", value, "contact")
                }
                defaultValue={signUpForm.contact[0].contact}
                placeholder="e.g. 09123456789"
                keyboardType="numeric"
              />
            </FormControl>
            <Divider my="2" />
            {/* School Info Info */}
            <Heading
              size="sm"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50"
              }}
              fontWeight="semibold"
              mt="10"
              bold
            >
              {signUpForm.role === "student"
                ? "School Information for students"
                : "School Information for Faculty & Non-Faculty"}
            </Heading>

            {signUpForm.role === "student" ? (
              <>
                <FormControl key="student_no">
                  <FormControl.Label>Student No.</FormControl.Label>
                  <Input
                    isInvalid={signUpForm.student_noError}
                    onChangeText={value => handleChange("student_no", value)}
                    defaultValue={signUpForm.student_no}
                    placeholder="e.g. 1011901035"
                    keyboardType="numeric"
                    editable={signUpForm.role === "student"}
                  />
                </FormControl>
                {/* key is neccessary  */}
                {/* <FormControl key={uuid.v4()}>
                  <FormControl.Label>Year</FormControl.Label>
                  <SelectInput
                    isInvalid={signUpForm.year_idError}
                    itemName={"year"}
                    items={selectData.years}
                    label={"Year"}
                    selected={year}
                    setSelected={setYear}
                    handleChange={handleChange}
                  />
                </FormControl> */}
                {/* key is neccessary  */}
                <FormControl key={uuid.v4()}>
                  <FormControl.Label>Course</FormControl.Label>
                  <SelectInput
                    isInvalid={signUpForm.course_idError}
                    itemName={"course"}
                    items={selectData.courses}
                    label={"Course"}
                    selected={course}
                    setSelected={setCourse}
                    handleChange={handleChange}
                  />
                </FormControl>
                {/* key is neccessary  */}
                {/* <FormControl key={uuid.v4()}>
                  <FormControl.Label>Section</FormControl.Label>
                  <SelectInput
                    isInvalid={signUpForm.section_idError}
                    itemName={"section"}
                    items={selectData.sections}
                    label={"Section"}
                    selected={section}
                    setSelected={setSection}
                    handleChange={handleChange}
                  />
                </FormControl> */}
              </>
            ) : (
              <>
                <FormControl key="employee_no">
                  <FormControl.Label>Employee No.</FormControl.Label>
                  <Input
                    isInvalid={signUpForm.employee_noError}
                    onChangeText={value => handleChange("employee_no", value)}
                    defaultValue={signUpForm.employee_no}
                    placeholder="e.g. M2021-100001"
                    editable={
                      signUpForm.role === "faculty" ||
                      signUpForm.role === "non-faculty"
                    }
                  />
                </FormControl>
                {/* key is neccessary  */}
                <FormControl key={uuid.v4()}>
                  <FormControl.Label>Department</FormControl.Label>
                  <SelectInput
                    isInvalid={signUpForm.department_idError}
                    itemName={"department"}
                    items={selectData.departments}
                    label={"Department"}
                    selected={department}
                    setSelected={setDepartment}
                    handleChange={handleChange}
                  />
                </FormControl>
              </>
            )}
            {message.message ? (
              <AlertMessage message={message.message} status={message.status} />
            ) : (
              <Text></Text>
            )}
            <Button isLoading={processing} mt="2" colorScheme="indigo" onPress={handleSubmit}>
              Sign up
            </Button>
          </VStack>
        </ScrollView>
      </Box>
    </Center>
  );
};
