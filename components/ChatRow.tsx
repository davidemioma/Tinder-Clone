import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { getMatchedUser } from "./../lib/functions";
import { Profile } from "../types";
import { useRouter } from "next/router";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";

interface Props {
  match: any;
}

const ChatRow = ({ match }: Props) => {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const [matchInfo, setMatchInfo] = useState<Profile>();

  const [lastMessage, setlastMessage] = useState("");

  useEffect(() => {
    const docs = getMatchedUser(match.users, user?.uid);

    setMatchInfo(docs);
  }, [match]);

  //Fetching Messages
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", `${match.id}`, "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) =>
          setlastMessage(
            snapshot?.docs[snapshot.docs.length - 1]?.data()?.message
          )
      ),
    [db]
  );

  return (
    <div
      onClick={() => router.push(`/chat/${match?.id}`)}
      className="border-b pb-2 flex items-center space-x-3 cursor-pointer hover:scale-105 transition transform duration-200"
    >
      <img
        className="w-14 h-14 rounded-full object-cover"
        loading="lazy"
        src={matchInfo?.imgUrl}
        alt=""
      />

      <div>
        <p className="font-semibold">{matchInfo?.displayName}</p>

        <p className="text-sm font-light">{lastMessage || "Say Hi!"}</p>
      </div>
    </div>
  );
};

export default ChatRow;
