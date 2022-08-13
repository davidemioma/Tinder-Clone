import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { SiTinder } from "react-icons/si";
import { ImCancelCircle } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "../firebase";
import { useRouter } from "next/router";

const Login = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Head>
        <title>Tinder-Clone | Login</title>

        <link rel="icon" href="/favicon.webp" />
      </Head>

      <Image src="/assets/bg.jpeg" layout="fill" objectFit="cover" />

      <div className="absolute top-0 h-screen w-screen bg-black/40" />

      <div className="absolute top-0 w-screen bg-gradient-to-t shadow-xl from-black/10 to-black flex items-center justify-between py-4 px-6">
        <div className="flex items-center cursor-pointer">
          <SiTinder className="md:hidden" color="white" size={23} />

          <SiTinder className="hidden md:inline" color="white" size={40} />

          <p className="text-3xl md:text-5xl font-semibold text-white">
            tinder
          </p>
        </div>

        <button
          className="bg-white text-black text-lg md:text-xl font-semibold rounded-full px-8 py-1.5 md:py-2 hover:opacity-90"
          onClick={() => setModalOpen(true)}
        >
          Log In
        </button>
      </div>

      <div className="absolute top-72 w-screen flex flex-col items-center space-y-7">
        <h1 className="text-white relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wide font-bold">
          Swipe Right
          <span className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-semibold absolute top-0">
            TM
          </span>
        </h1>

        <button
          className="bg-gradient-to-l from-[#fd267a] to-[#ff6036] text-white tracking-wide py-3 w-[280px] rounded-full"
          onClick={() => setModalOpen(true)}
        >
          Create Account
        </button>
      </div>

      {modalOpen && (
        <div className="absolute top-0 w-screen h-screen z-40 bg-black/70 flex justify-center">
          <div className="bg-white w-full md:max-w-[450px] md:my-10 z-50 md:rounded-xl py-6 px-8">
            <ImCancelCircle
              className="ml-auto cursor-pointer text-gray-300 hover:text-gray-500 hover:animate-spin"
              size={30}
              onClick={() => setModalOpen(false)}
            />

            <SiTinder className="mx-auto" color="#fd267a" size={30} />

            <h2 className="text-center font-bold text-2xl uppercase tracking-wide my-6">
              Get Started
            </h2>

            <p className="text-sm font-light mb-6">
              By clicking Log In, You have agreed to our{" "}
              <span className="underline cursor-pointer hover:no-underline">
                Terms
              </span>
              . Learn how we process your data in our{" "}
              <span className="underline cursor-pointer hover:no-underline">
                Privacy policy
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:no-underline">
                Cookie Policy
              </span>
            </p>

            <button
              className="border-2 border-gray-300 py-2.5 px-4 rounded-full w-full flex items-center"
              onClick={() => signInWithGoogle().then(() => router.push("/"))}
            >
              <FcGoogle size={25} />

              <p className="flex-1 text-center uppercase tracking-wide">
                Log In with Google
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
