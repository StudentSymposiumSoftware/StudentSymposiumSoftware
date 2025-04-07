import "./GridView.css"
import { useNavigate } from "react-router-dom"

function GridView(props) {
    const navigate = useNavigate();
    
    return (
        <div className="grid-container">
            {props.data.map((item, index) => (
                <div key={index} className="item" >
  
                    <h4>{item.title}</h4>
                    <h4 onClick={() => navigate(`/author/${item.author}`)} className="author-link">By {item.author}</h4>
                    <p>{[item.major, 'at', item.school].join(' ')}</p>
                    <p>{['Abstract number', item.abstractNumber].join(' ')}</p>
                </div>
      ))}
        </div>
    );


}

export default GridView
