import React from "react";

interface NoteCardProps {
  title: string;
  content: string;
  date: string;
  onClick?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, content, date, onClick }) => (
  <div
    className="w-full h-64 flex flex-col justify-between bg-white  rounded-lg border border-gray-400 mb-6 py-5 px-4 cursor-pointer hover:shadow-lg transition"
    onClick={onClick}
  >
    <div>
      <h4 className="text-gray-800  font-bold mb-3 line-clamp-1 text-2xl">{title}</h4>
      <p className="text-gray-800  text-xl break-words whitespace-pre-line line-clamp-3">
        {content}
      </p>
    </div>
    <div>
      <div className="flex items-center justify-between text-gray-800 ">
        <p className="text-sm">{date}</p>
      </div>
    </div>
  </div>
);

export default NoteCard;