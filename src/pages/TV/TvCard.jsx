import { Link } from "react-router";
import PropTypes from "prop-types";

const TvCard = ({ tv }) => {
  const posterURL = tv.poster_path
    ? `https://image.tmdb.org/t/p/w200/${tv.poster_path}`
    : `/istockphoto-1147544807-612x612.jpg`;

  console.log(tv);

  return (
    <Link to={`/tvDetails?q=${tv.id}`}>
      <div className="md:w-60 md:h-80 sm:w-48 sm:h-64 lg:w-66 lg:h-108 rounded-2xl flex flex-col justify-evenly items-center hover:shadow-lg transition duration-300 ease-in-out cursor-pointer p-4 bg-indigo-300">
        <img
          src={posterURL}
          alt={tv.original_title}
          className="rounded-t-2xl shadow-2xl overflow-hidden w-full h-5/6 object-contain"
        />
        <h1 className="font-bold text-center m-2 w-full text-base sm:text-lg md:text-xl lg:text-2xl line-clamp-2">
          {tv.name}
        </h1>
      </div>
    </Link>
  );
};

TvCard.propTypes = {
  tv: PropTypes.shape({
    poster_path: PropTypes.string,
    backdrop_path: PropTypes.string,
    original_title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default TvCard;
