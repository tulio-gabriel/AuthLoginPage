"use client"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation";
export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router=useRouter()
const handleLogin=async(e:React.FormEvent)=>{
  e.preventDefault()
  try{
    const response= await fetch("http://localhost:5000/Login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      credentials: "include",
      body:JSON.stringify({email,password})
    })
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data= await response.json()
    console.log(data)
   router.push("/Base")
  }catch(error){
    console.error("Error during login:"+error)
    setError("Wrong credentials. Please try again.");
    setEmail("")
    setPassword("")
  }
}

  return (
    <div className="flex flex-col text-black bg-black text-2xl items-center justify-center h-screen">
      <div className="flex flex-col gap-4 p-4 border-2 border-white rounded-lg"> 
        <h2 className="items-center justify-center text-center text-white">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col bg-gray-300 w-full border-black rounded-lg p-4 gap-4">
           <input className="p-2  pb-0"  type="text" name="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
          <hr />
          <input
            className="p-2  pb-0"
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={5}
            maxLength={15}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <hr />
          <button  type="submit" className="border-black rounded-lg bg-white p-3 hover:bg-gray-200 ">Login</button>
          {error && (
          <div className="
          bg-red-500 text-white text-md
          px-2 py-2 rounded shadow-lg
          transition-opacity duration-300
        ">
          {error}
          </div>
    )}
        </form>
      </div>
    </div>
  );
}
