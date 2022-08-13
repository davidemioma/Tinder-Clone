import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { SiTinder } from "react-icons/si";
import { IoIosChatbubbles } from "react-icons/io";
import { signOut } from "@firebase/auth";
import { useRouter } from "next/router";

const Header = () => {
  const [user] = useAuthState(auth);

  const router = useRouter();

  return (
    <header className="bg-gradient-to-l from-[#fd267a] to-[#ff6036] py-3 px-6">
      <div className="flex items-center justify-between">
        <img
          className="w-10 h-10 rounded-full cursor-pointer hover:animate-bounce"
          onClick={() => router.push("/profile")}
          loading="lazy"
          src={`${user?.photoURL}`}
          alt=""
        />

        <SiTinder
          className="cursor-pointer"
          onClick={() => router.push("/")}
          size={32}
          color="white"
        />

        <div className="flex items-center space-x-3">
          <IoIosChatbubbles
            className="cursor-pointer hover:animate-pulse"
            onClick={() => router.push("/chat")}
            size={32}
            color="white"
          />

          <button
            className="text-white font-bold hover:animate-pulse"
            onClick={() => signOut(auth).then(() => router.push("/"))}
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
