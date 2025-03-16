import "./AbstractPage.css"
import { useNavigate, useParams  } from "react-router-dom"

function AbstractPage(props) {
    const navigate = useNavigate();

    let { id} = useParams();
    for (let i = 0; i < props.data.length; i++) {
        if (props.data[i].abstractNumber == id) {
        return (
            <div id="abstract-container">
                <h1 style={{ fontSize: "50px" }}>{props.data[i].title}</h1>
                <h2  className="author-link" id="author-abstract-page"><i>Authors:</i> {[props.data[i].author, props.data[i]["1st Co-author's Full Name"], props.data[i]["2nd Co-author's Full Name"], props.data[i]["3rd Co-author's Full Name"], props.data[i]["4th Co-author's Full Name"], props.data[i]["5th Co-author's Full Name"], props.data[i]["If you have more than 5 co-authors, please list their names and emails below, and whether they are an undergraduate student, graduate student, faculty, or external author. Please see the example."]].join(', ')}</h2>
                <h2><i>Faculty Advisor:</i> {props.data[i]["Faculty Mentor Name"]}</h2>
                <h2><i>Abstract Number:</i> {props.data[i].abstractNumber}</h2>
                <br></br>
                <p>{props.data[i]['Project Abstract']}</p>
            </div>
      );
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: "50px" }}>
          Uh-oh! 
      </h1>
      <div style={{ fontSize: "50px" }}>
          Abstract {id} does not exist.
      </div>
    </div>
  );

}

export default AbstractPage