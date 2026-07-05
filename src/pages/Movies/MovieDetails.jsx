import { Link, useSearchParams } from "react-router";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import {
  fetchMovieCredit,
  fetchMoviesDetails,
  fetchMovieTrailer,
  fetchSimilarMovies,
} from "../../util/API";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function MovieDetails() {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("q");
  const [movie, setMovie] = useState(null);
  const [credit, setCredit] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState(null);

  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchMovieDetails() {
      try {
        // await new Promise((resolve) => setTimeout(resolve, 5000000));
        //^^ for simulating long fetching
        const data = await fetchMoviesDetails(movieId);
        const cast = await fetchMovieCredit(movieId);
        const video = await fetchMovieTrailer(movieId);
        const videos = await fetchSimilarMovies(movieId);
        setCredit(cast);
        setMovie(data);
        setTrailer(video);
        setSimilar(videos);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
    fetchMovieDetails();
  }, [movieId]);

  if (!movie) {
    return (
      <>
        <div className="h-18 bg-gray-800 w-full"></div>
        <div className="h-full mt-8 p-8 flex border-2 border-indigo-400 mx-4 rounded-2xl overflow-y-hidden">
          <img
            src="/Movie-Suggestion/istockphoto-1147544807-612x612.jpg"
            className="rounded-lg shadow-lg w-120 h-160 animate-pulse"
          />
          <div className="flex w-screen flex-col items-start mx-8 gap-5 *:animate-pulse">
            <div className="h-12 w-48 bg-gray-500 mt-4"></div>
            <div className="h-6 w-24 bg-gray-500 mt-2"></div>
            <div className="h-8 w-72 bg-gray-500 mt-2"></div>
            <div className="h-8 w-68 bg-gray-500 mt-2"></div>
            <div className="h-8 w-112 bg-gray-500 mt-2"></div>
            <div className="h-8 w-92 bg-gray-500 mt-2"></div>
            <div className="h-48 w-full bg-gray-500 mt-4"></div>
            <div className="h-8 w-92 bg-gray-500 mt-2"></div>
          </div>
        </div>
      </>
    );
  }

  const posterURL = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : `/Movie-Suggestion/istockphoto-1147544807-612x612.jpg`;

  return (
    <>
      <Navbar />
      <div className="h-full mt-28 border-2 border-indigo-400 rounded-2xl m-4">
        <div className="p-4 flex flex-col md:flex-row items-center md:items-start gap-8 h-auto">
          <img
            src={posterURL}
            alt={movie.original_title}
            className="rounded-lg shadow-lg w-64 h-96 sm:w-80 sm:h-120 md:w-100 md:h-140 lg:w-110 lg:h-140 object-cover"
          />
          <div className="flex flex-col items-center md:items-start justify-between md:mx-8 gap-2 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center md:text-left">
              {movie.title}
            </h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl">
              <strong>Release Date : </strong> {movie.release_date}
            </p>
            <p className="text-white mt-2 text-lg sm:text-xl md:text-2xl">
              <strong>Language : </strong>
              {movie.original_language.toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                Genres :
              </p>
              {movie.genres.map((genre) => (
                <p
                  className="text-white bg-indigo-400 p-2 rounded-sm text-xs sm:text-sm md:text-base"
                  key={genre.id}
                >
                  {genre.name}
                </p>
              ))}
            </div>
            <p className="text-white text-left text-lg sm:text-xl md:text-2xl max-w-2xl line-clamp-9">
              <strong>Description: </strong>
              <br />
              {movie.overview || "No description available."}
            </p>
            <p className="text-white mt-2 text-lg sm:text-xl md:text-2xl">
              <strong>Rating : </strong>
              {movie.vote_average}/10 ({movie.vote_count} rating)
            </p>
          </div>
        </div>
        <div className="w-full mx-auto px-4">
          <p className="text-indigo-800 w-full bg-indigo-100 p-4 text-lg sm:text-xl md:text-4xl text-center rounded-xl hover:shadow-2xl hover:bg-indigo-200 cursor-pointer hover:text-indigo-600 transition duration-200 ease-in-out">
            <a href={movie.homepage}>
              <strong>Watch Now!</strong>
            </a>
          </p>
        </div>
        <div className="flex flex-col m-6 md:m-10">
          <h1 className="text-xl sm:text-2xl text-white font-bold">
            The Crew :
          </h1>
          <div className="flex gap-4 sm:gap-8 m-2 sm:m-4 overflow-x-auto whitespace-nowrap p-2 sm:p-4">
            {credit.cast.map((member) => (
              <Link
                to={`/ActorDetails?q=${member.id}`}
                key={member.id}
                className="cast-card flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg flex-shrink-0 w-48"
              >
                <img
                  src={
                    member.profile_path
                      ? `https://image.tmdb.org/t/p/w200/${member.profile_path}`
                      : `public/istockphoto-1147544807-612x612.jpg`
                  }
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h1 className="text-white text-lg font-bold mt-2 text-wrap">
                  {member.name}
                </h1>
                <h2 className="text-gray-400 text-sm text-wrap">{member.character}</h2>
              </Link>
            ))}
          </div>
        </div>
        {trailer.results.find((vid) => vid.type === "Trailer") ? (
          <div className="flex flex-col items-center gap-4 m-4 sm:m-8 aspect-video">
            <h1 className="font-bold text-2xl sm:text-4xl text-white my-4 sm:my-8 text-center">
              The Trailer :
            </h1>
            <iframe
              className="w-full h-full rounded-sm mx-auto"
              src={`https://www.youtube.com/embed/${
                trailer.results.find((vid) => vid.type === "Trailer").key
              }`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-400 text-lg text-center">
            No trailer available.
          </p>
        )}
        {/*Similar Movies section*/}
        <div className="flex flex-col m-4 sm:m-8">
          <h1 className="text-xl sm:text-2xl text-white font-bold">
            Similar Movies :
          </h1>
          <div className="flex gap-4 sm:gap-8 m-2 sm:m-4 overflow-x-auto whitespace-nowrap p-2 sm:p-4">
            {similar.results &&
            Array.isArray(similar.results) &&
            similar.results.some((c) => c.poster_path) ? (
              [...similar.results]
                .filter((movie) => movie.release_date)
                .sort(
                  (a, b) => new Date(b.release_date) - new Date(a.release_date),
                )
                .map((relatedMovie) => (
                  <a
                    key={relatedMovie.id}
                    href={`/#/moviedetails?q=${relatedMovie.id}`}
                  >
                    <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-xl flex-shrink-0 w-48 h-auto">
                      <img
                        src={
                          relatedMovie.poster_path
                            ? `https://image.tmdb.org/t/p/w200/${relatedMovie.poster_path}`
                            : `public/istockphoto-1147544807-612x612.jpg`
                        }
                        alt={relatedMovie.title}
                        className="w-32 h-48 rounded-lg object-cover"
                      />
                      <h1 className="text-white text-lg font-bold mt-2 text-center line-clamp-2 text-wrap">
                        {relatedMovie.title}
                      </h1>
                      <p className="text-gray-400 text-sm text-center">
                        {relatedMovie.release_date}
                      </p>
                    </div>
                  </a>
                ))
            ) : (
              <p className="text-gray-400 text-lg">No related movies found.</p>
            )}
          </div>
        </div>
        {/*Production companies section*/}
        <div className="flex flex-col m-4 sm:m-8">
          <h1 className="text-xl sm:text-2xl text-white font-bold my-2 sm:my-4">
            Production Companies :
          </h1>
          <div className="flex gap-4 sm:gap-6 justify-around p-2 sm:p-4 overflow-x-auto whitespace-nowrap">
            {movie.production_companies &&
            movie.production_companies.length > 0 ? (
              movie.production_companies.map((company) => (
                <div
                  key={company.id}
                  className="flex flex-col items-center text-center"
                >
                  {company.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                      alt={company.name}
                      className="w-42 h-full rounded-2xl object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto">
                      <span className="text-white text-xl font-bold">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="text-white text-sm sm:text-xl mt-2">
                    {company.name}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-lg">
                No production companies found.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MovieDetails;
