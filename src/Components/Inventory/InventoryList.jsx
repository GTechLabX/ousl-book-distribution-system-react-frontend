import { useEffect, useState } from "react";

const InventoryList = () => {
  // 🔹 State
  const [courses, setCourses] = useState([]);
  const [program, setProgram] = useState("All");
  const [search, setSearch] = useState("");

  // 🔹 Fetch inventory data
  const fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/inventory");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 🔹 Filter logic
  const filteredCourses = courses.filter((item) => {
    const matchesProgram =
      program === "All" || item.program === program;

    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());

    return matchesProgram && matchesSearch;
  });

  return (
    <>
      {/* Program Filter */}
      <div className="bg-gray-200 p-3 rounded-lg mb-3 flex justify-center">
        <select
          className="w-2/5 p-1 rounded-md"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
        >
          <option value="All">All Programs</option>
          <option value="BSE">BSE</option>
          <option value="Civil">Civil</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Apparel">Apparel</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-3 w-3/5 mx-auto">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 p-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="px-6 bg-indigo-800 text-white rounded-md">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-center font-semibold mb-3">
          All Courses materials
        </h3>

        <div className="overflow-x-auto overflow-y-auto max-h-64">
          <table className="w-full border-collapse min-w-[700px]">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="border p-2 text-left">Code</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Program</th>
                <th className="border p-2 text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((item, index) => (
                <tr key={index} className="bg-gray-200">
                  <td className="border p-2">{item.code}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.program}</td>
                  <td className="border p-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCourses.length === 0 && (
            <p className="text-center mt-4 text-gray-600">
              No data found
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryList;
