"use client"
import { useState } from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home(){
	const [Success, setSuccess]= useState<string | null>(null);
	const router=useRouter()
	useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/Protected", {
        credentials: "include",
      });

      if (!res.ok) {
        router.replace("/Login");
      }
	  setSuccess("You logged in successfully!");
    } catch {
      router.replace("/Login");
    }
  };

  checkAuth();
}, [router]);


const handleLogout=async()=>{
	try{
		const response = await fetch("http://localhost:5000/Logout",{
			method:"POST",
			credentials:"include"
		})
		if(!response.ok){
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		console.log("Logged out successfully")
		router.push("/Login")
	}
	catch(error){
		console.log("Error during logout:"+error)
	}
}

	  return(
		<div>
			<h1 className="text-center mb-2 text-xl">Auth App Base Page</h1>
		 {Success && (
          <div className={`transition-opacity duration-500 ${
    	Success ? "opacity-100" : "opacity-0"
		  } flex justify-center items-center
          bg-green-500 text-white text-lg
          px-2 py-2 rounded shadow-lg
          transition-opacity duration-300
        `}>
          {Success}
          </div>
    )}
			<nav>
        <ul className="flex gap-4 flex-row justify-center mt-2 mb-2">
          <li className="border border-black p-4 rounded-lg  text-3xl  bg-gray-200">
            <button onClick={handleLogout}>Log Out</button>
          </li>
        </ul>
      </nav>
		</div>
	  )
}