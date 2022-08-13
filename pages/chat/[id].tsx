import React, { FormEvent, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatList from "../../components/ChatList";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { getMatchedUser } from "../../lib/functions";
import { MessageProps } from "../../types";
import Message from "../../components/Message";

const Messages = () => {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const { id } = router.query;

  const [matchdetails, setMatchDetails] = useState<any>(null);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<MessageProps[]>([]);

  const endOfMessageRef = useRef<any>();

  const sendMessagehandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setLoading(true);

    await addDoc(collection(db, "matches", `${id}`, "messages"), {
      timestamp: serverTimestamp(),
      userId: user?.uid,
      displayName: user?.displayName,
      photoUrl: matchdetails.users[`${user?.uid}`].imgUrl,
      message: input,
    }).then(() => {
      setLoading(false);
    });

    setInput("");
  };

  //Fetching Match Details
  useEffect(() => {
    const getMatchDetails = async () => {
      await getDoc(doc(db, "matches", `${id}`)).then((res: any) => {
        setMatchDetails({ id: res.id, ...res.data() });
      });
    };

    getMatchDetails();
  }, [id, db]);

  //Fetching Messages
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", `${id}`, "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db]
  );

  return (
    <div className="bg-gray-100 w-screen h-screen overflow-hidden ">
      <Head>
        <title>Tinder-Clone | Chat</title>

        <link rel="icon" href="/favicon.webp" />
      </Head>

      <div className="bg-white shadow-md border-b px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 bg-gradient-to-l from-[#fd267a] to-[#ff6036] rounded-full flex items-center justify-center"
          >
            <ChevronLeftIcon className="h-6 text-white" />
          </button>

          <p className="text-lg font-bold">Chat</p>
        </div>

        <img
          className="w-12 h-12 rounded-full object-cover"
          src={`${getMatchedUser(matchdetails?.users, user?.uid).imgUrl}`}
          alt=""
        />
      </div>

      <main className="flex">
        <div className="w-[300px] hidden md:inline">
          <ChatList />
        </div>

        <div className=" flex-1 flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
          <div className="flex-1 h-[calc(100vh-10rem)] overflow-y-scroll scrollbar-hide py-5 px-6 ">
            <div className="flex flex-col space-y-3">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  sender={message.userId === user?.uid}
                />
              ))}
            </div>
          </div>

          <form
            onSubmit={sendMessagehandler}
            className="bg-white w-full h-20 px-6 flex items-center space-x-4"
          >
            <input
              className="bg-gray-200 flex-1 py-2 px-4 rounded-lg outline-none"
              value={input}
              type="text"
              placeholder="Send message..."
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              className="py-2 w-2/6 sm:w-1/5 disabled:cursor-not-allowed bg-gradient-to-l from-[#fd267a] to-[#ff6036] text-white flex items-center justify-center rounded-full hover:animate-pulse"
              disabled={!input.trim()}
              type="submit"
            >
              {loading ? (
                <div className="w-7 h-7 rounded-full border-t border-l border-white animate-spin" />
              ) : (
                <p>Send</p>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Messages;
