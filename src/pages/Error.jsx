import { useNavigate } from "react-router";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="w-4/5 gap-4 p-8 border-2 border-gray-400 h-auto bg-white flex flex-col justify-evenly items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-4xl">
      <h1 className="sm:text-6xl md:text-8xl text-4xl text-nowrap">
        Error 404 ❌
      </h1>
      <p className="text-2xl text-center">This page does not exist</p>
      <button
        onClick={() => navigate(-1)}
        className="text-2xl text-gray-800 bg-indigo-400 rounded-2xl hover:text-gray-950 p-2"
      >
        Return
      </button>
    </div>
  );
};

export default Error;
