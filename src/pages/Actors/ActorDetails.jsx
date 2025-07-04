import Navbar from "@/components/Navbar/Navbar";
import { fetchActorDetails, fetchMovieCast } from "@/util/API";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const ActorDetails = () => {
  const [searchParams] = useSearchParams();
  const actorId = searchParams.get("q");
  const [data, setData] = useState(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [cast, setCast] = useState({ results: [] });

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchMovieDetails() {
      try {
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // for simulating long fetching
        const data = await fetchActorDetails(actorId);
        const cast = await fetchMovieCast(actorId);
        setData(data);
        setCast(cast);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
    fetchMovieDetails();
  }, [actorId]);

  if (!data) {
    return (
      <>
        <div className="h-18 bg-gray-800 w-full"></div>
        <div className="h-full mt-8 p-8 flex border-2 border-indigo-400 mx-4 rounded-2xl overflow-y-hidden">
          <img
            src="/istockphoto-1147544807-612x612.jpg"
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

  const profileURL = data.profile_path
    ? `https://image.tmdb.org/t/p/w500/${data.profile_path}`
    : `/istockphoto-1147544807-612x612.jpg`;

  console.log(data);
  
  return (
    <>
      <Navbar />
      <div className="p-8 flex-col border-2 border-indigo-400 mx-4 rounded-2xl overflow-y-hidden m-26">
        <div className="flex items-start">
          <img
            src={profileURL}
            alt={data.original_title}
            className="rounded-lg shadow-lg w-120 h-160"
          />
          <div className="flex flex-col items-start mx-8 gap-6">
            <h1 className="text-6xl font-bold text-white">{data.name}</h1>
            <p className="text-white text-2xl">
              <strong>Birth Date : </strong> {data.birthday}
            </p>
            <p className="text-white text-2xl">
              <strong>Date of death : </strong> {data.deathday || "Still Standing"}
            </p>
            <p className="text-white mt-2 text-2xl">
              <strong>Place of Birth : </strong>
              {data.place_of_birth || "No place of birth available."}
            </p>
            <p className="text-white mt-2 text-2xl">
              <strong>Gender : </strong>
              {data.gender === 1 ? "Female" : "Male"}
            </p>
            <p className="text-white my-4 text-left text-2xl">
              <strong>Biography: </strong>
              <br />
              {data.biography ? (
                data.biography.length > 700 && !isBioExpanded ? (
                  <>
                    {data.biography.slice(0, 700)}
                    ...{" "}
                    <button
                      className="text-purple-300 underline cursor-pointer"
                      onClick={() => setIsBioExpanded(true)}
                    >
                      Show more
                    </button>
                  </>
                ) : (
                  <>
                    {data.biography}
                    {data.biography.length > 700 && (
                      <>
                        {" "}
                        <button
                          className="text-indigo-400 underline cursor-pointer"
                          onClick={() => setIsBioExpanded(false)}
                        >
                          Show less
                        </button>
                      </>
                    )}
                  </>
                )
              ) : (
                "No bio available."
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col my-8">
          <h1 className="text-2xl text-white font-bold">Related Movies :</h1>
          <div className="flex gap-8 m-4 overflow-x-auto whitespace-nowrap p-4">
            {cast && Array.isArray(cast.cast) && cast.cast.some(c => c.poster_path) ? (
              [...cast.cast]
                .filter(movie => movie.release_date)
                .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                .map((relatedMovie) => (
                  <a
                    key={relatedMovie.id}
                    href={`/moviedetails?q=${relatedMovie.id}`}
                  >
                    <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-xl flex-shrink-0 w-48 h-auto">
                      <img
                        src={
                          relatedMovie.poster_path
                            ? `https://image.tmdb.org/t/p/w200/${relatedMovie.poster_path}`
                            : `/istockphoto-1147544807-612x612.jpg`
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
      </div>
    </>
  );
};

export default ActorDetails;
