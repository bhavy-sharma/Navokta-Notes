"use client";
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Subject() {
    const searchParams=useSearchParams();
    const course=searchParams.get('courseName');
    const semesterNumber=searchParams.get('semester');
    const [subject,setSubject]=useState([]);

    useEffect(()=>{
        fetchSubject();
    })

    const fetchSubject = async () => {
        try {
            const res=await fetch();
        const data=await res.json();
        if(res.ok){
                setSubject(data);
            }
        } catch (error) {
            console.error('Failed to load courses:', err);
        }

    }

    const data = subject.filter(
        (items) =>
            items.courseName === course &&
            items.semester === Number(semesterNumber)
    );

    const handleDowlode=(item)=>{
        //file dowlode ka kaam 

        //update api call to incrrease download count
    }
  return (
    <>
       <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold mb-10 tracking-wide">
                {subject?.courseName || "Course"} - {semesterNumber}th Semester
            </h1>

            {data.length === 0 ? (
                <p className="text-red-400 text-xl">No subjects found for this semester.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="w-64 h-40 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg
                                       flex items-center justify-center text-xl font-semibold cursor-pointer
                                       transform transition-all duration-300 hover:scale-110 hover:from-green-500 hover:to-green-400"
                       onClick={()=>handleDowlode(item)}                
                        >
                            {item.subject}
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={handleBack}
                className="mt-12 px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-lg font-medium 
                           shadow-md hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-300"
            >
                Back to Courses
            </button>
        </div>
    </>
  )
}

export default Subject
