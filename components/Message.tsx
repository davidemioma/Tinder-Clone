import React from "react";

interface Props {
  message: any;
  sender: boolean;
}

const Message = ({ message, sender }: Props) => {
  return (
    <div className="w-full flex">
      {!sender && (
        <img
          className="w-12 h-12 rounded-full mr-2"
          loading="lazy"
          src={`${message.photoUrl}`}
          alt=""
        />
      )}

      <div
        className={`${
          sender
            ? "bg-purple-600 rounded-tr-none ml-auto"
            : "bg-red-400 rounded-tl-none"
        }  rounded-lg px-5 py-3 overflow-hidden`}
      >
        <p className="text-white max-w-[300px] break-all">{message.message}</p>
      </div>
    </div>
  );
};

export default Message;
