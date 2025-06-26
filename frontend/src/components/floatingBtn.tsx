import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const FloatingBtn = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/notes/create")}
      className="fixed bottom-6 right-6 z-50 cursor-pointer bg-green-400 text-white rounded-full p-4 shadow-lg transition hover:bg-green-300 focus:outline-none sm:hidden"
      aria-label="Add Note"
    >
      <FiPlus size={28} />
    </button>
  );
};

export default FloatingBtn;