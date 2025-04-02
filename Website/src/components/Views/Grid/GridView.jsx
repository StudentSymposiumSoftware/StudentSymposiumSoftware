import "./GridView.css"
import { toTitleCase, findSchoolLogo } from "../../shared"
import PersonIcon from '@mui/icons-material/PersonRounded';

function GridView({data, searchQuery, setSearchText}) {
    data = data.filter(item => {
        if (searchQuery === "") return true;
        const searchRegex = new RegExp(searchQuery, "i");
        return searchRegex.test(item.title) || searchRegex.test(item.abstractNumber) || searchRegex.test(item.author);
    });
    return (
        <div className="grid-container">
            {data.map((item, index) => (<AbstractGrid key={index} item={item} index={index} setSearchText={(e) => setSearchText(e)}/>))}
        </div>
    );
}

function AbstractGrid({item, index, setSearchText}) {
    return (
        <div key={index} className="item">
            <img src={findSchoolLogo(item.school)} alt="school logo" className="mt-5 p-[2px]"/>
            <h4>{`${item.abstractNumber}: ${toTitleCase(item.title)}`}</h4>
            <span><PersonIcon className="mr-[2px]"/><h4 onClick={() => setSearchText(item.author)} className="author-link inline-block leading-[24px]"> {toTitleCase(item.author)}</h4></span>
        </div>
    )
}

export default GridView