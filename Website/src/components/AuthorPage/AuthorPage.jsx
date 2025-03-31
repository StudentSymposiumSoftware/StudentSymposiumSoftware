import "./AuthorPage.css"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function AuthorPage(props) {
    const [authorData, setAuthorData] = useState([]);
    const [mentorData, setMentorData] = useState([]);
    const authorName = useParams().name;

    useEffect(() => {
        setAuthorData(props.data.filter(abstract => abstract.author == authorName))
        setMentorData(props.data.filter(abstract => abstract.professor == authorName))
    }, [props.data, authorName])
    
    return (
        <div className="author-container">
            <h2 id="author-title">{authorName}</h2>

            <div id="abstract-display">
                {authorData.length > 0 && <div className="abstract-list" id="authored-abstracts">
                    <h3 className="author-subtitle">Authored:</h3>
                    {authorData.map((abstract, index) => (
                        <div className="abstract-item" key={index}>
                            <h3>{abstract.abstractNumber}</h3> 
                            <h3>{abstract.title}</h3>
                        </div>
                    ))}
                </div>}

                {mentorData.length > 0 && <div className="abstract-list" id="approved-abstracts">
                    <h3 className="author-subtitle">Abstracts Approved:</h3>
                    {mentorData.map((abstract, index) => (
                        <div className="abstract-item" key={index}>
                            <h3>{abstract.abstractNumber}</h3>
                            <h3>{abstract.title}</h3> 
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    );
}

export default AuthorPage
