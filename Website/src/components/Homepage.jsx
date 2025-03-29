import "./Homepage.css";
import { useEffect, useState } from "react";

function HomepageComponent(props) {
    const [randomAbstract, setRandomAbstract] = useState(null);

    useEffect(() => {
        const updateAbstract = () => {
            if (props.data && props.data.length > 0) {
                const randomIndex = Math.floor(Math.random() * props.data.length);
                setRandomAbstract(props.data[randomIndex]);
            }
        };

        updateAbstract();
        const interval = setInterval(updateAbstract, 5000);

        return () => clearInterval(interval);
    }, [props.data]);

    return (
        <div id="homepage-container">
            <h2>Welcome to the Symposium Recap site !!</h2>
            <h3>Please select the needed link above to route to your component</h3>
            {randomAbstract && (
                <div className="abstract-display">
                    <h4>{randomAbstract.title}</h4>
                    <p><strong>Author:</strong> {randomAbstract.author}</p>
                    <p><strong>Professor:</strong> {randomAbstract.professor}</p>
                    <p><strong>School:</strong> {randomAbstract.school}</p>
                    <p><strong>Major:</strong> {randomAbstract.Major_1}</p>
                    <p><strong>Category:</strong> {randomAbstract.category}</p>
                    <p><strong>Abstract Number:</strong> {randomAbstract.abstractNumber}</p>
                </div>
            )}
        </div>
    );
}

export default HomepageComponent;
