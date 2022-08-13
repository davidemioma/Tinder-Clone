import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { CameraIcon, ArrowLeftIcon, TrashIcon } from "@heroicons/react/outline";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useRouter } from "next/router";
import { Profile } from "../types";

const Profile = () => {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    const getProfile = async () => {
      await getDoc(doc(db, "users", `${user?.uid}`)).then((res: any) =>
        setProfile({ id: res.id, ...res.data() })
      );
    };

    getProfile();
  }, [db]);

  const [loadng, setIsLoading] = useState(false);

  const [job, setJob] = useState(profile?.job || "");

  const [age, setAge] = useState(profile?.age || 18);

  const filePickerRef = useRef<HTMLInputElement>(null);

  const [seletedFile, setSeletedFile] = useState<
    string | ArrayBuffer | null | undefined
  >(null);

  const uploadImage = (e: React.FormEvent) => {
    const reader = new FileReader();

    const file = (e.target as HTMLFormElement).files[0];

    reader.readAsDataURL(file);

    reader.onload = (readerEvent) => {
      setSeletedFile(readerEvent.target?.result);
    };
  };

  const uploadProfile = async () => {
    setIsLoading(true);

    await setDoc(
      doc(db, "users", `${user?.uid}`),
      {
        id: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        photoUrl: user?.photoURL,
        job,
        age,
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );

    if (seletedFile) {
      const imageRef = ref(storage, `users/${user?.uid}/images`);

      await uploadString(imageRef, `${seletedFile}`, "data_url").then(
        async (snapshot) => {
          const downloadUrl = await getDownloadURL(imageRef);

          setSeletedFile(null);

          await updateDoc(doc(db, "users", `${user?.uid}`), {
            imgUrl: downloadUrl,
          })
            .then(() => {
              setIsLoading(false);

              router.push("/");
            })
            .catch((err) => alert(err.message));
        }
      );
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center">
      <Head>
        <title>Tinder-Clone | Dating, Make friends & Live life</title>

        <link rel="icon" href="/favicon.webp" />
      </Head>

      <div className="bg-white w-full max-w-[550px] mx-auto rounded-xl p-6 pb-10">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-400 h-10 w-10 rounded-full flex items-center justify-center hover:animate-pulse"
        >
          <ArrowLeftIcon className="h-5 w-5 text-white" />
        </button>

        <div className="relative w-40 h-20 mx-auto">
          <Image
            src="https://links.papareact.com/2pf"
            layout="fill"
            objectFit="contain"
          />
        </div>

        {profile?.imgUrl && (
          <img
            className="w-20 h-20 rounded-full mx-auto"
            src={profile.imgUrl}
            alt=""
          />
        )}

        <p className="text-xl font-bold text-center text-gray-500 p-2">
          Welcome {user?.displayName}
        </p>

        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-[#ff6036] font-bold mb-2">
              Step 1: The Profile Picture
            </label>

            <div className="flex space-x-2">
              <CameraIcon
                className="h-7 text-gray-400 cursor-pointer"
                onClick={() => filePickerRef?.current?.click()}
              />

              <input
                ref={filePickerRef}
                type="file"
                accept="image/*"
                hidden
                onChange={uploadImage}
              />

              {seletedFile && (
                <div className="flex items-end space-x-2">
                  <img
                    className="w-[100px] h-[100px] object-cover rounded-lg"
                    src={`${seletedFile}`}
                    alt=""
                  />

                  <TrashIcon
                    className="w-6 h-6 text-red-400 cursor-pointer"
                    onClick={() => setSeletedFile(null)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[#ff6036] font-bold">Step 2: The Job</label>

            <input
              className="outline-none border-b border-gray-300 py-2"
              value={job}
              type="text"
              placeholder="Enter your occupation.."
              onChange={(e) => setJob(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#ff6036] font-bold">Step 3: The Age</label>

            <input
              className="outline-none border-b border-gray-300 py-2"
              value={age}
              min={18}
              type="number"
              placeholder="Enter your Age.."
              onChange={(e) => setAge(e.target.valueAsNumber)}
              maxLength={2}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={uploadProfile}
            className="flex items-center justify-center w-6/12 sm:w-4/12 bg-gradient-to-l from-[#fd267a] to-[#ff6036] text-white text-center font-bold tracking-wide py-2 rounded-xl hover:animate-pulse disabled:cursor-not-allowed disabled:bg-gradient-to-l disabled:from-gray-500 disabled:to-gray-400"
            disabled={!seletedFile || !job.trim() || !age}
          >
            {loadng ? (
              <div className="w-6 h-6 rounded-full border-t border-l border-white animate-spin" />
            ) : (
              <p>{profile ? "Update Profile" : "Upload Profile"}</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
