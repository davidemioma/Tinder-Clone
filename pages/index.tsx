import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Card from "../components/Card";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import {
  onSnapshot,
  doc,
  collection,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import { useRouter } from "next/router";
import { Profile } from "../types";
import EmptyProfiles from "../components/EmptyProfiles";

const Home = () => {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [passesIds, setPassesIds] = useState([]);

  const [swipesIds, setSwipesIds] = useState([]);

  //This is to check if the user has a profile
  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${user?.uid}`), (snapshot: any) => {
        if (!snapshot.exists()) {
          router.push("/profile");
        }
      }),
    [db]
  );

  //Fetching all the passes Id's
  useEffect(() => {
    const fetchPasses = async () => {
      await getDocs(collection(db, "users", `${user?.uid}`, "passes")).then(
        (res: any) => setPassesIds(res.docs.map((doc: any) => doc.id))
      );
    };

    fetchPasses();
  }, [db]);

  //Fetching all the swipes Id's
  useEffect(() => {
    const fetchSwipes = async () => {
      await getDocs(collection(db, "users", `${user?.uid}`, "swipes")).then(
        (res: any) => setSwipesIds(res.docs.map((doc: any) => doc.id))
      );
    };

    fetchSwipes();
  }, [db]);

  //Fetching all the profiles exept for the profile with the pass and swipes Id's
  useEffect(() => {
    const newPassesIds = passesIds.length > 0 ? passesIds : ["test"];

    const newSwipesIds = swipesIds.length > 0 ? swipesIds : ["test"];

    const unsub = onSnapshot(
      query(
        collection(db, "users"),
        where("id", "not-in", [...newPassesIds, ...newSwipesIds])
      ),
      (snapshot: any) =>
        setProfiles(
          snapshot.docs
            .filter((doc: any) => doc.id !== user?.uid)
            .map((doc: any) => ({
              id: doc.id,
              ...doc.data(),
            }))
        )
    );

    return unsub;
  }, [db, passesIds, swipesIds]);

  return (
    <div className="bg-gray-100 relative h-screen w-screen overflow-hidden">
      <Head>
        <title>Tinder-Clone | Dating, Make friends & Live life</title>

        <link rel="icon" href="/favicon.webp" />
      </Head>

      <Header />

      <main>
        {profiles.length > 0 ? (
          <div className="my-10 w-[90%] max-w-[650px] lg:max-w-[750px] mx-auto px-20 overflow-x-scroll scrollbar-hide flex justify-center space-x-5 ">
            {profiles.map((item) => (
              <Card
                key={item.id}
                profile={item}
                id={item.id}
                imgUrl={item.imgUrl}
                displayName={item.displayName}
                job={item.job}
                age={item.age}
              />
            ))}
          </div>
        ) : (
          <EmptyProfiles />
        )}
      </main>
    </div>
  );
};

export default Home;
