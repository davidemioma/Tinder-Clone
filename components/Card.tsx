import React, { useEffect, useState } from "react";
import { XIcon, HeartIcon } from "@heroicons/react/solid";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, getDoc, serverTimestamp } from "@firebase/firestore";
import { Profile } from "../types";
import { generateId } from "../lib/functions";
import MatchCard from "./MatchCard";

interface Props {
  id: string;
  imgUrl: string;
  displayName: string;
  job: string;
  age: number;
  profile: Profile;
}

const Card = ({ id, imgUrl, displayName, job, age, profile }: Props) => {
  const [user] = useAuthState(auth);

  const [hide, setHide] = useState(false);

  const [cancelBtnPressed, setCancelBtnPressed] = useState(false);

  const [likeBtnPressed, setLikeBtnPressed] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState<Profile>();

  const [modalOpen, setModalOpen] = useState(false);

  setTimeout(() => {
    if (cancelBtnPressed || likeBtnPressed) {
      setHide(true);
    } else {
      setHide(false);
    }
  }, 1000);

  useEffect(() => {
    const getUser = async () => {
      await getDoc(doc(db, "users", `${user?.uid}`)).then((res: any) =>
        setLoggedInUser({ id: res.id, ...res.data() })
      );
    };

    getUser();
  }, [db]);

  const passedHandler = async () => {
    setCancelBtnPressed(true);

    await setDoc(doc(db, "users", `${user?.uid}`, "passes", id), {
      id,
      imgUrl,
      displayName,
      job,
      age,
    });
  };

  const swipedHandler = async () => {
    setLikeBtnPressed(true);

    const addToSwipes = async () => {
      await setDoc(doc(db, "users", `${user?.uid}`, "swipes", id), {
        id,
        imgUrl,
        displayName,
        job,
        age,
      });
    };

    //Checking to see if the profile has already swiped you.
    await getDoc(doc(db, "users", id, "swipes", `${user?.uid}`)).then(
      async (res) => {
        if (res.exists()) {
          addToSwipes();

          //Create A Match
          await setDoc(doc(db, "matches", generateId(user?.uid, id)), {
            users: {
              [`${user?.uid}`]: loggedInUser,
              [id]: profile,
            },
            usersMatched: [user?.uid, id],
            timestamp: serverTimestamp(),
          }).then(() => setModalOpen(true));
        } else {
          addToSwipes();
        }
      }
    );
  };

  return (
    <>
      <div
        className={`${
          cancelBtnPressed
            ? "opacity-0 transition-opacity duration-150"
            : "inline opacity-100"
        } ${
          likeBtnPressed
            ? "opacity-0 transition-opacity duration-150"
            : "inline opacity-100"
        } ${hide ? "hidden" : "inline"}`}
      >
        <div className="relative shadow-xl min-w-[310px] sm:min-w-[600px] lg:min-w-[700px] h-[70vh] rounded-xl overflow-hidden">
          <img
            className="absolute top-0 w-full h-full object-cover"
            loading="lazy"
            src={imgUrl}
            alt=""
          />

          <div className="bg-white absolute bottom-0 w-full px-6 py-3 flex justify-between">
            <div>
              <p className="text-xl font-bold">{displayName}</p>

              <p>{job}</p>
            </div>

            <p className="text-xl font-bold">{age}</p>
          </div>
        </div>

        <div className="w-[50%] mt-10 mx-auto flex items-center justify-between">
          <button className="btn bg-red-300 " onClick={passedHandler}>
            <XIcon className="h-5 w-5" />
          </button>

          <button className="btn bg-green-300 " onClick={swipedHandler}>
            <HeartIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {modalOpen && (
        <MatchCard
          loggedInUser={loggedInUser}
          profile={profile}
          setModalOpen={setModalOpen}
        />
      )}
    </>
  );
};

export default Card;
