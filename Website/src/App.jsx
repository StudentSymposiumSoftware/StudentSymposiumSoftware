import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'

import HomepageComponent from './components/Homepage';
import SearchView from './components/SearchView';
import ListView from './components/ListView';
import GridView from './components/GridView';

import { fetchCsvData, parseInput } from './firebase/CsvFetcher.js';

function App() {
  const [abstractData, setAbstractData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      let data = await fetchCsvData("2025_abstracts.csv");
      let parsedData = parseInput(data);
      setAbstractData(parsedData);
    };

    loadData();
  }, []);

  return (
    <Router>
      <div id="site-container">      
        <div id="navbar">
          <h3>Navigate to our different displays here:</h3>
          
          <Link className="PageLink" to={"/"}><h3>Home Page</h3></Link>
          <Link className="PageLink" to={"/search"}><h3>Search View</h3></Link>
          <Link className="PageLink" to={"/list"}><h3>List View</h3></Link>
          <Link className="PageLink" to={"/grid"}><h3>Grid View</h3></Link>

        </div>
      
        <Routes>
          <Route path="/" element={<HomepageComponent/>} />
          <Route path="/search" element={<SearchView data={abstractData}/>} />
          <Route path="/list" element={<ListView data={abstractData}/>} />
          <Route path="/grid" element={<GridView data={abstractData}/>} />
        </Routes>
      
      </div>
    </Router>
  )
}

export default App
