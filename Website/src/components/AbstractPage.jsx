import "./AbstractPage.css"
import { useParams  } from "react-router-dom"

function AbstractPage(props) {

    let { id} = useParams();
    const abstract = props.data.find(item => item.abstractNumber == id);

    if (abstract) {
      const coAuthors = [
        abstract.author,
        abstract["1st Co-author's Full Name"],
        abstract["2nd Co-author's Full Name"],
        abstract["3rd Co-author's Full Name"],
        abstract["4th Co-author's Full Name"],
        abstract["5th Co-author's Full Name"],
        abstract["If you have more than 5 co-authors, please list their names and emails below, and whether they are an undergraduate student, graduate student, faculty, or external author. Please see the example."]
    ];

    // Filter out any undefined or empty co-author values
    const filteredCoAuthors = coAuthors.filter(coAuthor => coAuthor && coAuthor.trim() !== "");
        return (
            <div id="abstract-container">
                <h1 style={{ fontSize: "50px" }}>{abstract.title}</h1>
                <h2  className="author-link" id="author-abstract-page"><i>Authors:</i> {filteredCoAuthors.join(", ")}</h2>
                <h2><i>Faculty Advisor:</i> {abstract["Faculty Mentor Name"]}</h2>
                <h2><i>Abstract Number:</i> {abstract.abstractNumber}</h2>
                <br></br>
                <p>{abstract['Project Abstract']}</p>
            </div>
      );
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