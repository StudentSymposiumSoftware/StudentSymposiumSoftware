import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import { useState } from 'react'
import './App.css'

import HomepageComponent from './components/Homepage';
import SearchView from './components/SearchView';
import ListView from './components/ListView';
import GridView from './components/GridView';

import { getMockData } from "./mockData";

function App() {
  let mockData = getMockData();

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
          <Route path="/search" element={<SearchView data={mockData}/>} />
          <Route path="/list" element={<ListView data={mockData}/>} />
          <Route path="/grid" element={<GridView data={mockData}/>} />
        </Routes>
      
      </div>
    </Router>
  )
}

export default App
