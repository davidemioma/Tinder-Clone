import React from "react";
import Head from "next/head";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="relative w-screen h-screen">
      <Head>
        <title>Tinder-Clone</title>

        <link rel="icon" href="/favicon.webp" />
      </Head>

      <Image
        className="animate-pulse"
        src="/assets/loaderbg.png"
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default Loader;
