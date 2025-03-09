import "./GridView.css"

function GridView(props) {
    
    console.log(props.data) // <-- Here's the data for your ticket


    
    return (
        <div class="grid-container">
            {props.data.map((item, index) => (
                <div key={index} className="item" >
                    {/* Render the item data here */}
                    <h4>{[item.title, 'by', item.author].join(' ')}</h4>
                    <p>{[item.major, 'at', item.school].join(' ')}</p>
                    <p>{['Abstract number', item.abstractNumber].join(' ')}</p>
                </div>
      ))}
        </div>
    );


}

export default GridView
