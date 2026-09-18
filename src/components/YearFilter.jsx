function YearFilter({ selectedYear, onChange }) {
    return (
        <select className="year-filter" value={selectedYear} onChange={onChange}>
            <option value="">All Years</option>
            <option value="5">Last 5 Years</option>
            <option value="10">Last 10 Years</option>
            <option value="20">Last 20 Years</option>
            <option value="30">Last 30 Years</option>
            <option value="40">40+ Years Ago</option>
        </select>
    );
}

export default YearFilter;