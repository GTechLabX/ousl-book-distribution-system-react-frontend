import { useState } from "react";
import InventoryList from "../Components/Inventory/InventoryList";
import AllocationList from "../Components/Inventory/AllocationList";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="bg-gray-300 p-6 rounded-xl">

      {/* Title */}
      <h2 className="text-center font-semibold text-lg mb-4">
        Inventory
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-6 py-1 rounded-lg ${
            activeTab === "inventory"
              ? "bg-indigo-700 text-white"
              : "bg-white"
          }`}
        >
          Inventory
        </button>

        <button
          onClick={() => setActiveTab("allocation")}
          className={`px-6 py-1 rounded-lg ${
            activeTab === "allocation"
              ? "bg-indigo-700 text-white"
              : "bg-white"
          }`}
        >
          Allocation
        </button>
      </div>

      {/* Content */}
      {activeTab === "inventory" && <InventoryList />}
      {activeTab === "allocation" && <AllocationList />}
    </div>
  );
};

export default Inventory;



// import React from 'react'
// import { useEffect, useState } from "react";

// function Inventory() {
//   // 🔹 State variables
//   const [courses, setCourses] = useState([]);
//   const [program, setProgram] = useState("All");
//   const [search, setSearch] = useState("");


//   // 🔹 Fetch data from backend
//   const fetchInventory = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/inventory");
//       const data = await response.json();
//       setCourses(data);
//     } catch (error) {
//       console.error("Error fetching inventory:", error);
//     }
//   };





//   useEffect(() => {
//     fetchInventory();
//   }, []);





//   // 🔹 Filter logic
//   const filteredCourses = courses.filter((item) => {
//     const matchesProgram =
//       program === "All" || item.program === program;
//     const matchesSearch =
//       item.name.toLowerCase().includes(search.toLowerCase()) ||
//       item.code.toLowerCase().includes(search.toLowerCase());

//     return matchesProgram && matchesSearch;
//   });




//   return (
//     <div>
      
//       <div className="min-h-[80px] bg-gray-200 p-5">
//       <h1 className="text-center text-2xl font-bold text-indigo-900 mb-1">
//         Inventory
//       </h1>
//       </div>

      
//       <div className="flex  justify-center gap-44 mb-5 mt-3">
//         <button className="px-6 py-2 bg-indigo-800 text-white rounded-lg">
//           Inventory
//         </button>
//         <button className="px-6 py-2 bg-white border rounded-lg">
//           Allocation
//         </button>
//       </div>

//       {/* 🔹 Filters */}
//       <div className="flex flex-row justify-center items-center mx-auto w-4/5 bg-gray-300 p-2 rounded-lg mb-4">
//         <select
//           className="  w-2/5 p-1 rounded-md"
//           value={program}
//           onChange={(e) => setProgram(e.target.value)}
//         >
//           <option value="All">All Programs</option>
//           <option value="BSE">BSE</option>
//           <option value="Civil">Civil</option>
//           <option value="Mechanical">Mechanical</option>
//           <option value="Apparel">Apparel</option>
//         </select>
//       </div>


//       {/* 🔹 Search */}
//       <div className="flex flex-row items-center mx-auto w-3/5 gap-3 mb-4 bg-gray-200">
//         <input
//           type="text"
//           placeholder="Search"
//           className="flex-1 p-2 rounded-md"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button className="px-6 bg-indigo-800 text-white rounded-md">
//           Search
//         </button>
//       </div>


//       {/* 🔹 Table */}
//       <div className="w-19/20 mx-auto bg-gray-100 p-4 rounded-lg">
//         <h2 className="text-center font-semibold mb-3">
//           All Courses materials
//         </h2>

//         {/* Scroll Area */}
//         <div className="overflow-x-auto overflow-y-auto max-h-64">
//           <table className="w-full border-collapse min-w-[700px]">
//             <thead className="bg-gray-100 sticky top-0">
//               <tr>
//                 <th className="border p-2 text-left">Code</th>
//                 <th className="border p-2 text-left">Name</th>
//                 <th className="border p-2 text-left">Program</th>
//                 <th className="border p-2 text-left">Quantity</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCourses.map((item, index) => (
//                 <tr key={index} className="bg-gray-200">
//                   <td className="border p-2">{item.code}</td>
//                   <td className="border p-2">{item.name}</td>
//                   <td className="border p-2">{item.program}</td>
//                   <td className="border p-2">{item.quantity}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredCourses.length === 0 && (
//             <p className="text-center mt-4 text-gray-600">
//               No data found
//             </p>
//           )}
//         </div>
//       </div>
    
      
//     </div>
//   )
// }

// export default Inventory
   