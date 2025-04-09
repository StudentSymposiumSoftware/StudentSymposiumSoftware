import "./ListView.css"

function ListView(props) {

    console.log(props.data) // <-- Here's the data for your ticket

    return (
        <div id="list-container">
            
                {props.data.map((item, index) => (
                    <div key={index} className="listItem" >

                        <h4>{item.title}</h4>
                        <a href={`/author/${item.author}`} className="author-link">By {item.author}</a>
                        <div className = "list-Contents" >{[item.major, 'at', item.school].join(' ')}<br/>{['Abstract number', item.abstractNumber].join(' ')}</div>


                    </div>
            ))}


            </div>

    )
}

export default ListView
  