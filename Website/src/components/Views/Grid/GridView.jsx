import "./GridView.css"
import { toTitleCase, findSchoolLogo, abstractDataSearch } from "../../shared"
import PersonIcon from '@mui/icons-material/PersonRounded';

function GridView({data, searchQuery, setSearchText}) {
    data = data.filter(item => {
        if (searchQuery === "") return true;
        return abstractDataSearch(item, searchQuery);
    });
    return (
        <div className='grid-container'>
            {data == 0 && <span className="loader flex place-self-center col-span-5"/>}
            {data.map((item, index) => (<AbstractGrid key={index} item={item} index={index} setSearchText={(e) => setSearchText(e)}/>))}
        </div>
    );
}

function AbstractGrid({item, index, setSearchText}) {
    return (
        <div key={index} className="item">
            <img src={findSchoolLogo(item.school)} alt="school logo" className="mt-5 p-[2px]"/>
            <a href={`#/abstract/${item.abstractNumber}`} className="author-link">{`${item.abstractNumber}: ${toTitleCase(item.title)}`}</a>
            <span><PersonIcon className="mr-[2px]"/><h4 onClick={() => setSearchText(item.author)} className="author-link inline-block leading-[24px]"> {toTitleCase(item.author)}</h4></span>
        </div>
    )
}

export default GridView