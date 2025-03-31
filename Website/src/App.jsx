import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'

import HomepageComponent from './components/Homepage/Homepage';
import SearchView from './components/Views/Search/SearchView';
import ListView from './components/Views/List/ListView';
import GridView from './components/Views/Grid/GridView';
import AuthorPage from "./components/AuthorPage/AuthorPage.jsx";
import AdminPage from "./components/Admin/AdminPage.jsx";

import { fetchCsvData, parseInput } from './firebase/CsvFetcher.js';

function App() {
  const [abstractData, setAbstractData] = useState([]);

  useEffect(() => {
    fetchCsvData("2025_abstracts.csv")
    .then(data => parseInput(data))
    .then(parsedData => setAbstractData(parsedData));
  }, []);

  return (
    <Router>
      <div id="site-container">      
        <div id="navbar">
          <span className="inline-block mr-5 p-2">
            <img src="logo.png" id="navbar_logo"/>
          </span>
          <span className="inline-block">
            <Link className="PageLink" to={"/"}><h3>Home Page</h3></Link>
            <Link className="PageLink" to={"/search"}><h3>Search View</h3></Link>
            <Link className="PageLink" to={"/list"}><h3>List View</h3></Link>
            <Link className="PageLink" to={"/grid"}><h3>Grid View</h3></Link>
            <Link className="PageLink" to={"/admin"}><h3>Admin</h3></Link>
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
