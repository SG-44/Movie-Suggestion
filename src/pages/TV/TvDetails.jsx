import Footer from "@/components/Footer/Footer"
import Navbar from "@/components/Navbar/Navbar"
import { fetchSimilarTv, fetchTvCredit, fetchTvDetails } from "@/util/API";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

const TvDetails = () => {
  const [searchParams] = useSearchParams();
  const tvId = searchParams.get("q");
  const [tv, setTv] = useState(null);
  const [credit, setCredit] = useState(null);
  const [similar, setSimilar] = useState(null);

  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchMovieDetails() {
      try {
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        //^^ for simulating long fetching
        const data = await fetchTvDetails(tvId);
        const cast = await fetchTvCredit(tvId);
        const videos = await fetchSimilarTv(tvId);
        setTv(data);
        setCredit(cast);
        setSimilar(videos);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
    fetchMovieDetails();
  }, [tvId]);

  if (!tv) {
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

  const posterURL = tv.poster_path
    ? `https://image.tmdb.org/t/p/w500/${tv.poster_path}`
    : `/istockphoto-1147544807-612x612.jpg`;

  console.log(similar.results);

  return (
    <>
      <Navbar />
      <div className="h-full mt-28 border-2 border-indigo-400 rounded-2xl m-4">
        <div className="p-8 flex">
          <img
            src={posterURL}
            alt={tv.original_title}
            className="rounded-lg shadow-lg w-120 h-160"
          />
          <div className="flex flex-col items-start justify-between mx-8 h-160">
            <h1 className="text-6xl font-bold text-white">{tv.name}</h1>
            <p className="text-white text-xl">
              <strong>Release Date : </strong> {tv.first_air_date}
            </p>
            <p className="text-white mt-2 text-xl">
              <strong>Original Language : </strong>
              {tv.original_language.toUpperCase()}
            </p>
            <p className="text-white mt-2 text-xl">
              <strong>In Production : </strong> {tv.in_production ? "Yes" : "No"}
            </p>
            <div className="flex gap-4 items-center">
              <p className="text-white font-bold text-2xl">Genres : </p>
              {tv.genres.map((genre) => (
                <p
                  className="text-white bg-indigo-400 p-2 rounded-sm"
                  key={genre.id}
                >
                  {genre.name}
                </p>
              ))}
            </div>
            <p className="text-white my-4 text-left text-2xl">
              <strong>Description: </strong>
              <br />
              {tv.overview || "No description available."}
            </p>
            <p className="text-white mt-2 text-xl">
              <strong>Rating : </strong>
              {tv.vote_average}/10 ({tv.vote_count} rating)
            </p>
            <p className="text-indigo-800 w-full bg-indigo-100 p-4 mt-2 text-2xl text-center rounded-xl hover:shadow-2xl hover:bg-indigo-200 cursor-pointer hover:text-indigo-600 transition duration-200 ease-in-out">
              <a href={tv.homepage}>
                <strong>Watch Now!</strong>
              </a>
            </p>
          </div>
        </div>
        {/* Crew Members Section */}
        <div className="flex flex-col m-10">
          <h1 className="text-2xl text-white font-bold">The Crew :</h1>
          <div className="flex gap-8 m-4 overflow-x-auto whitespace-nowrap p-4">
            {credit.crew ? (
              [...credit.crew]
              .filter((d) => d.job === "Director")
              .map((d, index) => (
                <Link
                  to={`/ActorDetails?q=${d.id}`}
                  key={d.id}
                  className="cast-card flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg flex-shrink-0 w-48"
                >
                  <img
                  src={
                    d.profile_path
                      ? `https://image.tmdb.org/t/p/w200/${d.profile_path}`
                      : `/istockphoto-1147544807-612x612.jpg`
                  }
                  alt={d.name}
                  className="w-24 h-24 rounded-full object-cover"
                  />
                  <h1 className="text-white text-lg font-bold mt-2 text-wrap text-center">
                    {d.name}
                  </h1>
                  <h2 className="text-gray-400 text-sm">Director {index + 1}</h2>
                </Link>
              ))
            ) : (
              <p>No Director</p>
            )}
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
                      : `/istockphoto-1147544807-612x612.jpg`
                  }
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h1 className="text-white text-lg font-bold mt-2 text-wrap text-center">
                  {member.name}
                </h1>
                <h2 className="text-gray-400 text-sm">{member.character}</h2>
              </Link>
            ))}
          </div>
        </div>
        {/* Similar TvSeries Section */}
        <div className="flex flex-col m-8">
          <h1 className="text-2xl text-white font-bold">Similar TvSeries :</h1>
          <div className="flex gap-8 m-4 overflow-x-auto whitespace-nowrap p-4">
            {similar.results && Array.isArray(similar.results) && similar.results.some(c => c.poster_path) ? (
              [...similar.results]
              .filter(tv => tv.first_air_date)
              .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date))
              .map((relatedTv) => (
                <a
                  key={relatedTv.id}
                  href={`/tvDetails?q=${relatedTv.id}`}
                >
                  <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-xl flex-shrink-0 w-48 h-auto">
                    <img
                      src={
                        relatedTv.poster_path
                          ? `https://image.tmdb.org/t/p/w200/${relatedTv.poster_path}`
                          : `/istockphoto-1147544807-612x612.jpg`
                      }
                      alt={relatedTv.name}
                      className="w-32 h-48 rounded-lg object-cover"
                    />
                    <h1 className="text-white text-lg font-bold mt-2 text-center line-clamp-2 text-wrap">
                      {relatedTv.name}
                    </h1>
                    <p className="text-gray-400 text-sm text-center">
                      {relatedTv.first_air_date}
                    </p>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-gray-400 text-lg">No related movies found.</p>
            )}
          </div>
        </div>
        {/* Production Companies Section */}
        <div className="flex flex-col m-8">
          <h1 className="text-2xl text-white font-bold my-4">Production Companies : </h1>
          <div className="flex gap-6 justify-around p-4">
            {tv.production_companies && Array.isArray(tv.production_companies) ? (
              [...tv.production_companies]
              .map((p) => (
                <div key={p.id} className="flex flex-col items-center justify-around bg-indigo-500 p-4 rounded-lg shadow-xl flex-shrink-0 w-48 h-60">
                  <img 
                    src={
                      p.logo_path
                        ? `https://image.tmdb.org/t/p/w200/${p.logo_path}`
                        : `/istockphoto-1147544807-612x612.jpg`
                    }
                  ></img>
                  <h1 className="text-white text-xl text-center">{p.name}</h1>
                </div>
              ))
            ) : (
                <p>No Production Companies found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default TvDetails