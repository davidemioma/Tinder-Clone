import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatRow from "./ChatRow";

const ChatList = () => {
  const [user] = useAuthState(auth);

  const [matches, setMatches] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", `${user?.uid}`)
        ),
        (snapshot: any) =>
          setMatches(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db]
  );

  return (
    <div className="bg-white w-full sm:max-w-[320px] h-screen overflow-y-scroll scrollbar-hide">
      {matches.length > 0 ? (
        <div className="py-3 px-5 flex flex-col space-y-2">
          {matches?.map((match: any) => (
            <ChatRow key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="font-bold text-xl">No Chat Available</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
