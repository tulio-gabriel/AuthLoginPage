import Link from "next/link";
export default function Home(){
	  return(
		<div>
			<h1 className="text-center mb-2 text-xl">Auth App Home Page</h1>
			<h2 className="text-center mb-8">Please login or sign up to continue.</h2>
			<nav>
        <ul className="flex gap-4 flex-row justify-center mt-2 mb-2">
          <li className="border border-black p-4 rounded-lg text-3xl bg-gray-200">
            <Link href="/Login">Login</Link>
          </li>
          <li className="border border-black p-4 rounded-lg  text-3xl  bg-gray-200">
            <Link href="/SignUp">SignUp</Link>
          </li>
        </ul>
      </nav>
		</div>
	  )
}