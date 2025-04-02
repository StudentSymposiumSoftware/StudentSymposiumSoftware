import "./SearchView.css";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"

function SearchView(props) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const filteredData = useMemo(() => {
        return props.data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        )
    }, [query, props.data])

    return (
        <div id="search-container">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-bar"
            />
            
            <div className="search-results">
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <div key={index} className="search-item" onClick={() => navigate(`/author/${item.author}`)}>
                            <h4>#{item.abstractNumber}</h4> 
                            <h3>{item.title}</h3>      
                            <h4>by {item.author}</h4>
                        </div>
                    ))
                ) : (
                <div className="no-results-found">No results found</div>
                )}
            </div>
        
{/* 
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
            </div> */}

       
        </div>
    );
}

export default SearchView;
