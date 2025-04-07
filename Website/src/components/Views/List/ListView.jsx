import "./ListView.css"

import { findSchoolLogo, abstractDataSearch } from "../../shared"

function ListView({data, searchQuery, setSearchText}) {
    data = data.filter(item => {
            if (searchQuery === "") return true;
            return abstractDataSearch(item, searchQuery);
        });
    return (
        <div className={`pt-2 text-primary-background ml-[20px] mr-[20px] mt-[0px] rounded-lg ${data.length != 0 && "bg-white"}`}>
            {data.length == 0 && <span className="loader flex place-self-center col-span-5"/>}
            {data.length != 0 && 
                <table className="w-[100%] text-black pb-3 rounded-t-lg">
                    <SortingBar/>
                    <tbody className="w-[100%] h-[50px] overflow-auto">
                        {data.map((item, index) => (
                            <ListItem key={index} data={item} setSearchText={(e) => setSearchText(e)}/>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    )
}

function SortingBar() {
    return (
        <tr className="sticky top-0 w-[100%] p-5 mb-2 bg-white rounded-t-lg italic">
            <th>Abstract</th>
            <th>School</th>
            <th>Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Mentor</th>
        </tr>
    )
}


function ListItem({data, setSearchText}) {
    return (
        <tr className="p-5 w-[100%] text-center align-middle listItem">
            <td>{data.abstractNumber}</td>
            <td><img src={findSchoolLogo(data.school)}/></td>
            <td className="italic"><a href={`#/abstract/${data.abstractNumber}`}>{data.title}</a></td>
            <td><a onClick={() => setSearchText(data.major)}>{data.major}</a></td>
            <td><a onClick={() => setSearchText(data.author)}>{data.author}</a></td>
            <td><a onClick={() => setSearchText(data.professor)}>{data.professor}</a></td>
        </tr>
    )
}

export default ListView