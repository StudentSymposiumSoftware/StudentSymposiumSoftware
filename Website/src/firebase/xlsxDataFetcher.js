import { read, utils } from 'xlsx';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebaseConfig";

const XLSXMappingKey = {
    "Student Scores": "studentScores",
    "Judge Assigning": "judgeAssigning",
    "Demographics": "demographics",
    "Final Results": "finalResults",
    "Judge Scores": "judgeScoresRaw",
    "Judge Application": "judgeApplicationRaw",
    "Student Applications Linked": "studentApplicationsLinkedRaw"
}

export async function fetchXLSXData(year) {
    const fileRef = ref(storage, `symposium/${year}-symposium.xlsx`);
    const url = await getDownloadURL(fileRef);

    const xlsxFile = await (await fetch(url)).arrayBuffer();

    return new Promise((resolve) => {
        var jsonData = {
            "studentScores": {},
            "judgeAssigning": {},
            "demographics": {},
            "finalResults": {},
            "judgeScoresRaw": {},
            "judgeApplicationRaw": {},
            "studentApplicationsLinkedRaw": {}
        }
        const workbook = read(xlsxFile);
        for (var i = 0; i < workbook.SheetNames.length; i++) {
            jsonData[XLSXMappingKey[workbook.SheetNames[i]]] = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]]);
        }
        resolve(jsonData);
    });
}


export const parseInput = (inputData) => {
    // Transforms JSON into data similar to the mock data
    for (let i = 0; i < inputData.length; i++){
      inputData[i].author = `${inputData[i]['Student First Name']} ${inputData[i]['Student Last Name']}`
      inputData[i].coauthors = [inputData[i]["1st Co-author's Full Name"], inputData[i]["2nd Co-author's Full Name"], inputData[i]["3rd Co-author's Full Name"], inputData[i]["4th Co-author's Full Name"]].join(", ").replace(/, ,/g, ",").trim();
      inputData[i].allAuthors = [inputData[i].author, ...inputData[i].coauthors.split(",").map(name => name.trim()).filter(name => name.length > 0)].join(", ").replace(/, ,/g, ",").trim()
      inputData[i].professor = inputData[i]["Faculty Mentor Name"]
      inputData[i].school = inputData[i]["At which University are you currently enrolled?"]
      inputData[i].title = inputData[i]["Project Title"]
      inputData[i].category = inputData[i]["Undergraduate Presentations: Please select one of the following categories that best fits your research. *For more information about being a presenter at the Symposium, and for a helpful guide on the categories below, visit: https://umaine.edu/umss/list-of-majors-categories/"] || inputData[i]["Graduate Presentations: Please select one of the following categories that best fit your research. *For more information about being a presenter at the Symposium and for a helpful guide on the below categories, visit: https://umaine.edu/umss/list-of-majors-categories/"]
      inputData[i].abstractNumber = inputData[i]["Abstract Numbers"]
      inputData[i].keywords = inputData[i]["Project Keywords (Up to 3)"] || inputData[i]["Project Keywords (Up to 3)_1"] || "";
      inputData[i].keywords = inputData[i].keywords.split(",").map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
      inputData[i].abstract = inputData[i]["Project Abstract"];
      inputData[i].major = inputData[i]["Major"] || inputData[i]["Major_1"] || "";
      inputData[i].mentor = inputData[i]["Faculty Mentor Name"]
    }
  
    return inputData;
}  