import "./AbstractPage.css";
import { useParams, useNavigate } from "react-router-dom";

import { findSchoolLogo } from "../shared";

function AbstractPage({data}) {
    const navigate = useNavigate();
    var abstractNumber = useParams().number;
    data = data.filter(item => {
        return item.abstractNumber == abstractNumber;
    });
    if (data.length != 0) {
        data = data[0];
    }

    return (
        <div className="bg-white rounded-lg mt-[0px] m-5 h-[calc(100vh-160px)] text-black p-3">
            {data.length != 0 && (
                <div className="grid grid-cols-3">
                    <div className="col-span-2">
                        <a className="cursor-pointer all-link" onClick={() => navigate(-1)}>Return to Previous Page</a><br/>
                        <span className="text-[24px]">{data.major} {abstractNumber} - {data.title}</span><br/>
                        <span className="text-[20px] italic">{data.allAuthors}</span><br/>
                        <span className="text-[20px] italic">Mentor: {data.professor}</span>
                    </div>
                    <img src={findSchoolLogo(data.school)} className="place-self-center"/>
                    <div className="col-span-3">
                        <span className="block mb-3 mt-2">{data.keywords.map((keyword) => <Keyword keyword={keyword.trim()} key={keyword}/>)}</span>
                        {data.abstract}
                    </div>
                </div>
            )}
        </div>
    )
}

function Keyword({keyword}) {
    return (
        <span className="bg-primary-background text-white rounded-lg p-[5px] m-[5px] mb-0 ml-0">
            {keyword}
        </span>
    )
}

export default AbstractPage