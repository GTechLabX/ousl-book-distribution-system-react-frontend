import { useEffect, useState } from "react";

const AllocationList = () => {
  const [allocations, setAllocations] = useState([]);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 🔹 Fetch allocation data
  const fetchAllocations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/allocations");
      const data = await response.json();
      setAllocations(data);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // 🔹 Search filter
  const filteredAllocations = allocations.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
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
          Allocation Submissions
        </h3>

        <div className="overflow-x-auto overflow-y-auto max-h-64">
          <table className="w-full border-collapse min-w-[700px]">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="border p-2">Code</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Program</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((item, index) => (
                <tr key={index} className="bg-gray-200">
                  <td className="border p-2">{item.code}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.program}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedId(item.id);
                        setShowConfirm(true);
                      }}
                      className="bg-indigo-800 text-white px-3 py-1 rounded text-xs"
                    >
                      Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAllocations.length === 0 && (
            <p className="text-center mt-4 text-gray-600">
              No data found
            </p>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-gray-300 p-6 rounded-lg w-80 text-center">
            <p className="mb-4 text-sm">
              Are you sure you want to confirm this allocation?
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="bg-indigo-800 text-white px-4 py-1 rounded"
                onClick={() => {
                  // 🔹 Call confirm API here
                  setShowConfirm(false);
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllocationList;
