import React from "react";
import Link from "next/link";
export function Header() {
  return (
    <header className="flex flex-col text-black bg-white text-2xl items-center justify-center w-full">
      <h1 className="font-bold text-black">Auth App</h1>

      <nav>
        <ul className="flex gap-4 flex-row justify-center mt-2 mb-2">
		  <li className="border border-black p-2 rounded-lg">
            <Link href="/">Home</Link>
          </li>
          <li className="border border-black p-2 rounded-lg">
            <Link href="/Login">Login</Link>
          </li>
          <li className="border border-black p-2 rounded-lg">
            <Link href="/SignUp">SignUp</Link>
          </li>
        </ul>
      </nav>

      <hr className="w-full border-black border-t-2 my-4" />
    </header>
  );
}
