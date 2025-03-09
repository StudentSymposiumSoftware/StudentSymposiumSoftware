import { storage } from "./firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import Papa from "papaparse";

export const fetchCsvData = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);

    const response = await fetch(url);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true, 
        skipEmptyLines: true,
        complete: (result) => resolve(result.data),
        error: (error) => reject(error),
      });
    });
  } catch (error) {
    console.error("Error fetching CSV:", error);
    return [];
  }
};

export const parseInput = (inputData) => {
  // Transforms CSV into data similar to the mock data
  for (let i = 0; i < inputData.length; i++){
    inputData[i].author = `${inputData[i]['Student First Name']} ${inputData[i]['Student Last Name']}`
    inputData[i].professor = inputData[i]["Faculty Mentor Name"]
    inputData[i].school = inputData[i]["At which University are you currently enrolled?"]
    inputData[i].title = inputData[i]["Project Title"]
    inputData[i].category = inputData[i]["Undergraduate Presentations: Please select one of the following categories that best fits your research. *For more information about being a presenter at the Symposium, and for a helpful guide on the categories below, visit: https://umaine.edu/umss/list-of-majors-categories/"] || inputData[i]["Graduate Presentations: Please select one of the following categories that best fit your research. *For more information about being a presenter at the Symposium and for a helpful guide on the below categories, visit: https://umaine.edu/umss/list-of-majors-categories/"]
    inputData[i].abstractNumber = inputData[i]["Abstract Numbers"]
  }

  return inputData;
}
