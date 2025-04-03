import "./AbstractPage.css";
import { useParams } from "react-router-dom";

function AbstractPage({data}) {
    var abstractNumber = useParams().number;
    return (
        <div className="bg-white rounded-lg mt-[0px] m-5 h-[calc(100vh-160px)] text-black p-3">
            {abstractNumber}
        </div>
    )
}

export default AbstractPage