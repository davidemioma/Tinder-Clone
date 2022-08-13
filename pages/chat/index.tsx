import React from "react";
import Head from "next/head";
import Image from "next/image";
import Header from "../../components/Header";
import ChatList from "../../components/ChatList";

const Chat = () => {
  return (
    <div className="bg-gray-100 w-screen h-screen overflow-hidden">
      <Head>
        <title>Tinder-Clone | Chat</title>

        <link rel="icon" href="/favicon.webp" />
      </Head>

      <Header />

      <main className="flex h-full">
        <ChatList />

        <div className="relative hidden sm:inline sm:flex-1">
          <Image src="/assets/chat-bg.jpeg" layout="fill" objectFit="cover" />
        </div>
      </main>
    </div>
  );
};

export default Chat;
