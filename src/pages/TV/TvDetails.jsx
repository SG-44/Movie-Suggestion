import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import {
  fetchSimilarTv,
  fetchTvCreditWithSeason,
  fetchTvDetails,
  fetchTvFullDetails,
} from "@/util/API";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";

const TvDetails = () => {
  const [searchParams] = useSearchParams();
  const tvId = searchParams.get("q");
  const { seasonParam, episodeParam } = useParams();
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [tv, setTv] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [credit, setCredit] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    if (seasonParam) {
      setSeason(Number(seasonParam));
    }
    if (episodeParam) {
      setEpisode(Number(episodeParam));
    }
  }, [seasonParam, episodeParam]);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const data = await fetchTvDetails(tvId);
        const bigData = await fetchTvFullDetails(tvId, season);
        const cast = await fetchTvCreditWithSeason(tvId, season);
        const videos = await fetchSimilarTv(tvId);
        setTv(data);
        setFullData(bigData);
        setCredit(cast);
        setSimilar(videos);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
    fetchMovieDetails();
  }, [tvId, season, episode]);

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
              {tv.overview ? (
                  tv.overview.length > 700 && !isBioExpanded ? (
                    <>
                      {tv.overview.slice(0, 700)}
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
                      {tv.overview}
                      {tv.overview.length > 700 && (
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
            <p className="text-white mt-2 text-xl">
              <strong>Rating : </strong>
              {tv.vote_average}/10 ({tv.vote_count} rating)
            </p>
            <p className="text-indigo-800 w-full bg-indigo-100 p-4 mt-2 text-2xl text-center rounded-xl hover:shadow-2xl hover:bg-indigo-200 cursor-pointer hover:text-indigo-600 transition duration-200 ease-in-out">
              <a href={tv.homepage} target="_blank">
                <strong>Watch Now!</strong>
              </a>
            </p>
          </div>
        </div>
        <div>
          <div>
            <select
              value={season}
              onChange={e => setSeason(Number(e.target.value))}
              className="p-3 rounded bg-gray-800 text-white mx-8 text-xl"
            >
              {tv.seasons.map((s) => (
                <option key={s.id || s.season_number} value={s.season_number}>
                  Season {s.season_number + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-5 m-4 overflow-x-auto whitespace-nowrap gap-x-2">
          {fullData.episodes.map((s) => (
            <div key={s.id || s.episode_number} className="flex flex-col items-center justify-between bg-gray-800 p-2 rounded-lg shadow-2xl flex-shrink-0 w-48 h-auto m-4">
              <h1 className="text-white text-2xl font-bold text-center line-clamp-2 text-wrap">Episode {s.episode_number}</h1>
              <img
                src={
                  s.still_path
                    ? `https://image.tmdb.org/t/p/w200/${s.still_path}`
                    : `/istockphoto-1147544807-612x612.jpg`
                }
                alt={s.name}
                className="w-36 rounded-sm object-fill"
              />
              <h1 className="text-white text-xl font-bold text-center line-clamp-3 text-wrap">
                {s.name}
              </h1>
              <p className="text-gray-400 text-sm text-center">
                {s.air_date}
              </p>
            </div>
          ))}
          </div>
        </div>
        {/* Crew Members Section */}
        <div className="flex flex-col m-10">
          <h1 className="text-2xl text-white font-bold">The Crew :</h1>
          <div
            id="scroll"
            className="flex gap-8 overflow-x-auto whitespace-nowrap p-4"
          >
            {credit.crew ? (
              [...credit.crew]
                .filter(
                  (d) => d.job === "Director" || d.department === "Directing"
                )
                .splice(0, 2)
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
                      {d.original_name}
                    </h1>
                    <h2 className="text-gray-400 text-sm">
                      Director {index + 1}
                    </h2>
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
          {/* Guest Stars Section */}
          {fullData && fullData.episodes && fullData.episodes.flatMap(ep => ep.guest_stars || []).length !== 0 && (
            <div className="mt-8">
              <h2 className="text-2xl text-white font-bold">Guest Stars :</h2>
              <div className="flex gap-8 overflow-x-auto whitespace-nowrap p-4">
                {Array.from(
                  new Map(
                    fullData.episodes
                      .flatMap(ep => ep.guest_stars || [])
                      .filter(gs => gs.id && gs.profile_path)
                      .map(gs => [gs.id, gs])
                  ).values()
                ).map(guest => (
                  <Link
                    to={`/ActorDetails?q=${guest.id}`}
                    key={guest.id}
                    className="cast-card flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg flex-shrink-0 w-48"
                  >
                    <img
                      src={
                        guest.profile_path
                          ? `https://image.tmdb.org/t/p/w200/${guest.profile_path}`
                          : `/istockphoto-1147544807-612x612.jpg`
                      }
                      alt={guest.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <h1 className="text-white text-lg font-bold mt-2 text-wrap text-center">
                      {guest.name}
                    </h1>
                    <h2 className="text-gray-400 text-sm">{guest.character}</h2>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Similar TvSeries Section */}
        <div className="flex flex-col m-8">
          <h1 className="text-2xl text-white font-bold">Similar TvSeries :</h1>
          <div className="flex gap-8 m-4 overflow-x-auto whitespace-nowrap p-4">
            {similar.results &&
            Array.isArray(similar.results) &&
            similar.results.some((c) => c.poster_path) ? (
              [...similar.results]
                .filter((tv) => tv.first_air_date)
                .sort(
                  (a, b) =>
                    new Date(b.first_air_date) - new Date(a.first_air_date)
                )
                .map((relatedTv) => (
                  <a key={relatedTv.id} href={`/tvDetails?q=${relatedTv.id}`}>
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
          <h1 className="text-2xl text-white font-bold my-4">
            Production Companies :{" "}
          </h1>
          <div className="flex gap-6 overflow-x-auto whitespace-nowrap justify-around p-4">
            {tv.production_companies &&
            Array.isArray(tv.production_companies) ? (
              [...tv.production_companies].map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center justify-around bg-indigo-500 p-4 rounded-lg shadow-xl flex-shrink-1"
                >
                  <img
                    src={
                      p.logo_path
                        ? `https://image.tmdb.org/t/p/w200/${p.logo_path}`
                        : `/istockphoto-1147544807-612x612.jpg`
                    }
                    className="max-w-56 max-h-56 object-contain"
                  ></img>
                  <h1 className="text-white text-xl text-center text-wrap">
                    {p.name}
                  </h1>
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
  );
};

export default TvDetails;
