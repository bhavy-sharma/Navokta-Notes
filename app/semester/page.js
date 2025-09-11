"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState } from 'react'


function Semester() {
    const router =useRouter();
    const searchParams = useSearchParams();
     const courseName = searchParams.get("courseName");
  const semesterCount = parseInt(searchParams.get("sem"));

  const handleSub = (semester)=>{
    alert(`Going to Semester ${semester}`);
    
    router.push(`/semester?courseName=${courseName}&semester=${semester}`);
   
  }

   
  return (
    <>
       <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center py-10">
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-20 animate-fadeIn">
                    
                    <h2 className="text-3xl font-semibold mb-8">
                        🎓 {courseName} - Choose Semester
                    </h2>
                   
                    {Array.from({ length:semesterCount }, (_, i) => (
                        <div key={i} className="mb-6 flex flex-col items-center">
                            <h3 className="text-xl mb-2">Semester {i + 1}</h3>
                            <button
                                className="w-56 h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-lg
                                           hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 
                                           transition-all duration-300"
                                onClick={() => handleSub(i + 1)}
                            >
                                Go to Semester {i + 1}
                            </button>
                        </div>
                    ))}

                   
                    <button
                        
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-lg font-medium 
                                   shadow-md hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-300"
                    >
                        ⬅ Back to Courses
                    </button>
                </div>
        </div>
      
    </>
  )
}

export default Semester
