import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Profile } from "../types";
import { useRouter } from "next/router";
import { XIcon } from "@heroicons/react/solid";

interface Props {
  loggedInUser: any;
  profile: Profile;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const MatchCard = ({ loggedInUser, profile, setModalOpen }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    setModalOpen(false);

    router.push("/chat");
  };

  return (
    <div className="fixed flex items-center justify-center left-0 top-0 w-screen h-screen overflow-hidden z-50">
      <div className="bg-gradient-to-l mr-10 from-[#fd267a] to-[#ff6036] w-full max-w-[420px] rounded-lg">
        <div className="p-5 text-white">
          <button
            onClick={() => setModalOpen(false)}
            className="bg-white ml-auto h-8 w-8 rounded-full flex items-center justify-center hover:scale-105 transition transform duration-200"
          >
            <XIcon className="h-5 w-5 text-black" />
          </button>

          <div className="relative w-full h-20 my-3">
            <Image src="https://links.papareact.com/mg9" layout="fill" />
          </div>

          <p className="my-3 text-center text-sm font-light">
            You and {profile.displayName} have liked each other
          </p>

          <div className="mt-5 mb-10 flex items-center justify-center space-x-10">
            <img
              className="w-24 h-24 rounded-full"
              src={loggedInUser?.imgUrl}
              alt=""
            />

            <img
              className="w-24 h-24 rounded-full"
              src={profile?.imgUrl}
              alt=""
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleClick}
              className="bg-white p-2.5 rounded-full text-black w-3/4 text-center hover:scale-105 transition transform duration-200"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
