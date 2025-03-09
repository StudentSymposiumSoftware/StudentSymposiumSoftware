import "./SearchView.css";
import React, { useState } from "react";
import Select from "react-select";

function SearchView(props) {
    console.log(props.data); // <-- Here's the data for your ticket

    const [filters, setFilters] = useState({
        major: null,
        professor: null,
        category: null,
        university: null,
    });

    const options = {
        major: Array.from(new Set(props.data.map(item => item.major))).map(major => ({
            value: major,
            label: major
        })),
        professor: Array.from(new Set(props.data.map(item => item.professor))).map(professor => ({
            value: professor,
            label: professor
        })),
        category: Array.from(new Set(props.data.map(item => item.category))).map(category => ({
            value: category,
            label: category
        })),
        university: Array.from(new Set(props.data.map(item => item.school))).map(school => ({
            value: school,
            label: school
        })),
    };

    const handleChange = (selectedOption, field) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: selectedOption,
        }));
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white',
            color: 'black',
        }),
        option: (provided) => ({
            ...provided,
            color: 'black',
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: '#f0f0f0', 
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#f0f0f0', 
            color: 'black', 
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: 'black', 
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: 'black', 
            ':hover': {
                backgroundColor: '#ff6b6b', 
                color: 'white',
            },
        }),
    };

    return (
        <div id="search-container">
            <h2>Welcome to the search page</h2>
            {Object.keys(options).map((key) => (
                <Select
                    key={key}
                    options={options[key]}
                    isMulti
                    value={filters[key]}
                    onChange={(selected) => handleChange(selected, key)}
                    placeholder={`Select ${key}`}
                    styles={customStyles} 
                />
            ))}
            <pre>{JSON.stringify(filters, null, 2)}</pre>
        </div>
    );
}

export default SearchView;
  