"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error,setError]=useState<string | null>(null);
  const router=useRouter()
  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/SignUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      router.push("/Base"); 
    } catch (err) {
      console.error("Error during sign up:", err);
      setError("Invalid Credentials. Please try again.");
      setUsername("")
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex flex-col text-black text-2xl items-center justify-center h-screen">
      <div className="flex flex-col gap-4 p-4 border-2 border-black rounded-lg">
        <h2 className="items-center justify-center text-center">Sign In</h2>
        <form
          onSubmit={handleSign}
          className="flex flex-col bg-gray-300  border-black rounded-lg p-4 gap-4"
        >
          <input
            className="p-2 pb-0"
            type="text"
            name="username"
            placeholder="Username"
            required
            minLength={3}
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <hr />
          <input
            className="p-2  pb-0"
            type="text"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <hr />
          <button
            type="submit"
            className="border-black rounded-lg bg-white p-3 hover:bg-gray-200"
          >
            Sign In
          </button>
          {error && (
    <div className=" bg-red-500 text-white px-4 py-2 rounded shadow-lg">
    {error}
    </div>
    )}
        </form>
      </div>
    </div>
  );
}
