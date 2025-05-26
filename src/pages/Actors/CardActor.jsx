import { Link } from "react-router";
import PropTypes from "prop-types";

export const CardActor = ({ data }) => {
  const posterURL = data.profile_path
    ? `https://image.tmdb.org/t/p/w200/${data.profile_path}`
    : null;

  const getActorId = () => {
    console.log(data.id);
    console.log(data);
    return data.id;
  };

  if (!data) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-gray-500">No actor data available</p>
      </div>
    );
  }

  return (
    <Link to={`/ActorDetails?q=${data.id}`} onClick={getActorId}>
      <div className="md:w-60 md:h-80 sm:w-48 sm:h-64 lg:w-66 lg:h-108 rounded-2xl flex flex-col justify-evenly items-center hover:shadow-lg transition duration-300 ease-in-out cursor-pointer p-4 bg-indigo-300">
        <img
          src={posterURL}
          alt={data.original_name}
          className="rounded-t-2xl shadow-2xl overflow-hidden w-full h-3/4 object-cover"
        />
        <h1 className="font-bold text-center m-2 w-full text-base sm:text-lg md:text-xl lg:text-2xl line-clamp-2">
          {data.name}
        </h1>
      </div>
    </Link>
  );
};

CardActor.propTypes = {
  data: PropTypes.shape({
    profile_path: PropTypes.string,
    name: PropTypes.string.isRequired,
    original_name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default CardActor;
