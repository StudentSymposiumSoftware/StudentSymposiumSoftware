import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react'
import './App.css'

import HomepageComponent from './components/Homepage';
import SearchView from './components/SearchView';
import ListView from './components/ListView';
import GridView from './components/GridView';

/*

  Mock Data has many objects of these fields:
   - Author
   - Title
   - Category
   - Major
   - Professor
   - University
   - Abstract Number

*/
const mock_data = []


function App() {
  

  return (
    <Router>
      <div id="site-container">      
        <div id="navbar">
          Navigate to our different displays here:
          
          <Link className="PageLink" to={"/"}><h3>Home Page</h3></Link>
          <Link className="PageLink" to={"/search"}><h3>Search View</h3></Link>
          <Link className="PageLink" to={"/list"}><h3>List View</h3></Link>
          <Link className="PageLink" to={"/grid"}><h3>Grid View</h3></Link>

        </div>
      
        <Routes>
          <Route path="/" element={<HomepageComponent/>} />
          <Route path="/search" element={<SearchView/>} />
          <Route path="/list" element={<ListView/>} />
          <Route path="/grid" element={<GridView/>} />
        </Routes>
      
      </div>
    </Router>
  )
}

export default App
