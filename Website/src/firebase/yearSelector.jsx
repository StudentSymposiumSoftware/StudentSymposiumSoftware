/*
 * Select Year for Displaying Data
*/
function YearSelector({setYear, availableYears, currYear}) {
    return (
        <div className="bg-white text-black w-[100%]">
            <div>
                Select Year of Symposium Data to Review:
            </div>
            <div>
                <select onChange={(e) => {setYear(e.target.value)}} className="bg-white text-black" defaultValue={currYear}>
                    {availableYears.map((year) => {
                        return (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
}

export default YearSelector;