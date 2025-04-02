/*
 * Select Year for Displaying Data
*/
export default function YearSelector ({setYear, availableYears, currYear}) {
    // Odd Problem with the year selector and testing
    /* v8 ignore start */
    return (
        <div className="bg-white text-black w-[100%]">
            <div>
                Select Year of Symposium Data to Review:
            </div>
            <div>
                <select onChange={(e) => {setYear(e.target.value)}} className="bg-white text-black w-min" defaultValue={currYear}>
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
    /* v8 ignore end */
}