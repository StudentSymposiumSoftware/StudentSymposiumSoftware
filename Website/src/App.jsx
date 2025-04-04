import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'

import { storage } from "./firebase/firebaseConfig";
import { ref as storageRef, listAll } from "firebase/storage";

import HomepageComponent from './components/Homepage/Homepage';
import SearchView from './components/Views/Search/SearchView';
import ListView from './components/Views/List/ListView';
import GridView from './components/Views/Grid/GridView';
import AuthorPage from "./components/AuthorPage/AuthorPage.jsx";
import AdminPage from "./components/Admin/AdminPage.jsx";
import YearSelector from "./firebase/yearSelector.jsx";

import { fetchXLSXData, parseInput } from './firebase/xlsxDataFetcher.js';

function App() {
  const [abstractData, setAbstractData] = useState([]);
  const [year, setYear] = useState();
  const [availableYears, setAvailableYears] = useState(false);
  /* v8 ignore start */
  useEffect(() => {
    if (year) {
      fetchXLSXData(year)
        .then(data => parseInput(data['studentApplicationsLinkedRaw']))
        .then(parsedData => setAbstractData(parsedData));
    }
  }, [year]);

  useEffect(() => {
    var listOfAvailableYears = [];
    var maxYear = 0;
    const availableYearsRef = storageRef(storage, "symposium/")
    listAll(availableYearsRef).then((res) => {
        res.items.forEach((itemRef) => {
          var year = itemRef.name.split("-")[0]
          if (parseInt(year) > maxYear) maxYear = year;
          listOfAvailableYears.push(year);
        })
        setYear(maxYear);
        listOfAvailableYears = listOfAvailableYears.reverse()
        setAvailableYears(listOfAvailableYears);
    })
  }, [])
  /* v8 ignore end */
  return (
    <Router>
      <div id="site-container">      
        <div id="navbar" className="bg-white m-5 rounded-lg ml-[20px] mr-[20px] h-[100px] w-[calc(100% - 50px)] mt-[15px] flex flex-row pr-5 drop-shadow-xl">

          <span className="inline-flex items-center align-middle mr-5 h-[100px] p-[10px]">
            <img src="logo.png" id="navbar_logo" className="h-[80px]"/>
          </span>

          <span className="inline-flex items-center align-middle mr-5">
            <Link className="PageLink" to={"/"}><h3>Home Page</h3></Link>
            <Link className="PageLink" to={"/search"}><h3>Search View</h3></Link>
            <Link className="PageLink" to={"/list"}><h3>List View</h3></Link>
            <Link className="PageLink" to={"/grid"}><h3>Grid View</h3></Link>
            <Link className="PageLink" to={"/admin"}><h3>Admin</h3></Link>
          </span>

          <span className="inline-flex items-center justify-items-end align-middle text-right grow">
            {availableYears && <YearSelector setYear={setYear} availableYears={availableYears} currYear={year}/> }
          </span>
        </div>
      
        <Routes>
          <Route path="/" element={<HomepageComponent/>} />
          <Route path="/search" element={<SearchView data={abstractData}/>} />
          <Route path="/list" element={<ListView data={abstractData}/>} />
          <Route path="/grid" element={<GridView data={abstractData}/>} />
          <Route path="/author/:name" element={<AuthorPage data={abstractData}/>} />
          <Route path="/admin" element={<AdminPage/>}/>
        </Routes>
      
      </div>
    </Router>
  )
}

export default App