// https://github.com/user109436/e-consultation-app/blob/main/client/src/utils/Utilities.js
export const hasErrors = (obj, whiteList = []) => {
  let errors = 0;
  for (let key in obj) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (key.includes("Error")) continue; //ignore non-database field
    if (obj[key] === "") {
      obj[`${key}Error`] = true;
      errors++;
    }
  }
  return errors;
};

export const resetErrors = (obj, whiteList = []) => {
  for (let key in obj) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (!key.includes("Error")) continue; //ignore non-error field
    obj[key] = false;
  }
};
export const makeFieldsError = (obj, whiteList = []) => {
  for (let key in obj) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (!key.includes("Error")) continue; //ignore non-error field
    obj[key] = true;
  }
};
export const resetFields = (obj, whiteList = []) => {
  for (let key in obj) {
    if (whiteList.includes(key)) continue; //ignore not required field
    if (key.includes("Error")) continue; //ignore non-database field
    obj[key] = "";
  }
};

export const fullname = name => {
  if (!name) return false;
  let fullname = "";
  fullname += name.firstname + " ";
  fullname += name.middlename ? name.middlename + " " : "";
  fullname += name.lastname + " ";
  fullname += name.suffix ? name.suffix + " " : "";
  return fullname;
};

export const getYearSection = student => {
  if (Object.keys(student).length === 0) return false;
  let yearSection = "";
  yearSection += student.year_id ? student.year_id.year + " ":"";
  // yearSection += student.course_id.course_code + "-";
  yearSection += student.course_id.course;
  yearSection += student.section ? student.section_id.section : "";
  return yearSection;
};
export const hasFileExtension = (
  imagePath,
  fileExtensions = [".jpeg", ".jpg", ".png"]
) => {
  let hasExtension = false;
  fileExtensions.forEach(extension => {
    if (imagePath.includes(extension)) {
      hasExtension = true;
      return;
    }
  });
  return hasExtension;
};
