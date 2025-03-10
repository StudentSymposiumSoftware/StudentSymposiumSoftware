import "./SearchView.css";
import React, { useState } from "react";

function SearchView(props) {
    console.log(props.data); // <-- Here's the data for your ticket

    const [filters, setFilters] = useState({
        major: null,
        professor: null,
        category: null,
        university: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            updatedFilters[name] = value;
            return updatedFilters;
        });
    };


    const getUniqueValues = (key) => {
        return [...new Set(props.data.map(item => item[key]))];
    };

    const majorOptions = getUniqueValues("major");
    const professorOptions = getUniqueValues("professor");
    const categoryOptions = getUniqueValues("category");
    const universityOptions = getUniqueValues("school");

    return (
        <div id="search-container">
            <h2>Welcome to the search page</h2>

            <div>
                <label htmlFor="major">Major:</label>
                <select
                    id="major"
                    name="major"
                    value={filters.major || ""}
                    onChange={handleChange}
                >
                    <option value="">Select a major</option>
                    {majorOptions.map((major, index) => (
                        <option key={index} value={major}>
                            {major}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="professor">Professor:</label>
                <select
                    id="professor"
                    name="professor"
                    value={filters.professor || ""}
                    onChange={handleChange}
                >
                    <option value="">Select a professor</option>
                    {professorOptions.map((professor, index) => (
                        <option key={index} value={professor}>
                            {professor}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="category">Category:</label>
                <select
                    id="category"
                    name="category"
                    value={filters.category || ""}
                    onChange={handleChange}
                >
                    <option value="">Select a category</option>
                    {categoryOptions.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="university">University:</label>
                <select
                    id="university"
                    name="university"
                    value={filters.university || ""}
                    onChange={handleChange}
                >
                    <option value="">Select a university</option>
                    {universityOptions.map((university, index) => (
                        <option key={index} value={university}>
                            {university}
                        </option>
                    ))}
                </select>
            </div>

            <pre>{JSON.stringify(filters, null, 2)}</pre>
        </div>
    );
}

export default SearchView;
