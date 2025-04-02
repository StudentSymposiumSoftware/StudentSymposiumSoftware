import "./GridView.css"
import { useNavigate } from "react-router-dom"
import { toTitleCase, findSchoolLogo } from "../../shared"

function GridView({data, searchQuery}) {
    data = data.filter(item => {
        if (searchQuery === "") return true;
        const searchRegex = new RegExp(searchQuery, "i");
        return searchRegex.test(item.title) || searchRegex.test(item.abstractNumber) || searchRegex.test(item.author);
    });
    return (
        <div className="grid-container">
            {data.map((item, index) => (<AbstractGrid key={index} item={item} index={index}/>))}
        </div>
    );
}

function AbstractGrid({item, index}) {
    const navigate = useNavigate();
    return (
        <div key={index} className="item">
            <img src={findSchoolLogo(item.school)} alt="school logo" className="mt-5 p-[2px]"/>
            <h4>{`${item.abstractNumber}: ${toTitleCase(item.title)}`}</h4>
            <h4 onClick={() => navigate(`/author/${item.author}`)} className="author-link">{toTitleCase(item.author)}</h4>
        </div>
    )
}

export default GridView