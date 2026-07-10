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
import { useEffect, useRef, useState } from "react";
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
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const similarTvRef = useRef(null);

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
    window.scrollTo(0, 0);
    similarTvRef.current?.scrollTo({ left: 0 });
    setTv(null);
    setFullData(null);
    setCredit(null);
    setSimilar(null);
    setShowAllEpisodes(false);

    async function fetchTvDetailsData() {
      try {
        const data = await fetchTvDetails(tvId);
        const videos = await fetchSimilarTv(tvId);
        setTv(data);
        setSimilar(videos);
      } catch (error) {
        console.error("Error fetching TV details:", error);
      }
    }
    fetchTvDetailsData();
  }, [tvId]);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const bigData = await fetchTvFullDetails(tvId, season);
        const cast = await fetchTvCreditWithSeason(tvId, season);
        setFullData(bigData);
        setCredit(cast);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
    fetchMovieDetails();
  }, [tvId, season, episode]);

  if (!tv || !fullData || !credit || !similar) {
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

  const posterURL = tv.poster_path
    ? `https://image.tmdb.org/t/p/w500/${tv.poster_path}`
    : `/Movie-Suggestion/istockphoto-1147544807-612x612.jpg`;

  const visibleEpisodes = showAllEpisodes
    ? fullData.episodes
    : fullData.episodes.slice(0, 10);

  return (
    <>
      <Navbar />
      <div className="h-full mt-28 border-2 border-indigo-400 rounded-2xl m-4">
        <div className="p-4 flex flex-col md:flex-row items-center md:items-start gap-8 h-auto">
          <img
            src={posterURL}
            alt={tv.name}
            className="rounded-lg shadow-lg w-64 h-96 sm:w-80 sm:h-120 md:w-100 md:h-140 lg:w-110 lg:h-140 object-cover"
          />
          <div className="flex flex-col items-center md:items-start justify-between md:mx-8 gap-2 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center md:text-left">
              {tv.name}
            </h1>
            <p className="text-white text-lg sm:text-xl md:text-2xl">
              <strong>Release Date : </strong> {tv.first_air_date}
            </p>
            <p className="text-white mt-2 text-lg sm:text-xl md:text-2xl">
              <strong>Language : </strong>
              {tv.original_language.toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
              <p className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                Genres :
              </p>
              {tv.genres.map((genre) => (
                <p
                  className="text-white bg-indigo-400 p-2 rounded-sm text-xs sm:text-sm md:text-base"
                  key={genre.id}
                >
                  {genre.name}
                </p>
              ))}
            </div>
            <p className="text-white text-left text-lg sm:text-xl md:text-2xl max-w-2xl">
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
                "No description available."
              )}
            </p>
            <p className="text-white mt-2 text-lg sm:text-xl md:text-2xl">
              <strong>Rating : </strong>
              {tv.vote_average}/10 ({tv.vote_count} rating)
            </p>
          </div>
        </div>
        <div className="w-full mx-auto px-4">
          <p className="text-indigo-800 w-full bg-indigo-100 p-4 text-lg sm:text-xl md:text-4xl text-center rounded-xl hover:shadow-2xl hover:bg-indigo-200 cursor-pointer hover:text-indigo-600 transition duration-200 ease-in-out">
            <a href={tv.homepage} target="_blank" rel="noreferrer">
              <strong>Watch Now!</strong>
            </a>
          </p>
        </div>
        {/* Seasons / Episodes Section */}
        <div className="flex flex-col m-4 sm:m-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2 sm:my-4">
            <div>
              <h1 className="text-xl sm:text-2xl text-white font-bold">
                Episodes :
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Season {season} - {fullData.episodes.length} episodes
              </p>
            </div>
            <select
              value={season}
              onChange={(e) => {
                setSeason(Number(e.target.value));
                setShowAllEpisodes(false);
              }}
              className="p-3 rounded bg-gray-800 text-white text-base sm:text-xl text-center font-bold border border-gray-700"
            >
              {tv.seasons.map((s) => (
                <option key={s.id || s.season_number} value={s.season_number}>
                  Season {s.season_number}
                </option>
              ))}
            </select>
          </div>
          {fullData.episodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleEpisodes.map((s) => (
                <div
                  key={s.id || s.episode_number}
                  className="bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col sm:flex-row xl:flex-col"
                >
                  <img
                    src={
                      s.still_path
                        ? `https://image.tmdb.org/t/p/w300/${s.still_path}`
                        : `/Movie-Suggestion/istockphoto-1147544807-612x612.jpg`
                    }
                    alt={s.name}
                    className="w-full sm:w-40 xl:w-full h-44 sm:h-auto xl:h-44 object-cover"
                  />
                  <div className="flex flex-col justify-between gap-3 p-4 min-w-0">
                    <div>
                      <p className="text-indigo-300 text-sm font-bold">
                        Episode {s.episode_number}
                      </p>
                      <h2 className="text-white text-lg sm:text-xl font-bold line-clamp-2">
                        {s.name || "Untitled episode"}
                      </h2>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {s.overview || "No episode description available."}
                    </p>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <p className="text-gray-400">{s.air_date || "TBA"}</p>
                      {s.vote_average > 0 && (
                        <p className="text-white bg-indigo-500 px-2 py-1 rounded-sm font-bold">
                          {s.vote_average.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-lg">No episodes available.</p>
          )}
          {fullData.episodes.length > 10 && (
            <button
              className="text-white text-lg sm:text-xl text-center text-nowrap bg-gray-800 p-4 rounded-lg shadow-lg mt-6 w-full sm:w-fit cursor-pointer hover:bg-gray-700 transition"
              onClick={() =>
                setShowAllEpisodes((showEpisodes) => !showEpisodes)
              }
            >
              {showAllEpisodes ? "Show Less" : "See More"}
            </button>
          )}
        </div>
        {/* Crew Members Section */}
        <div className="flex flex-col m-6 md:m-10">
          <h1 className="text-xl sm:text-2xl text-white font-bold">
            The Crew :
          </h1>
          <div
            id="scroll"
            className="flex gap-4 sm:gap-8 m-2 sm:m-4 overflow-x-auto whitespace-nowrap p-2 sm:p-4"
          >
            {credit.crew ? (
              [...credit.crew]
                .filter(
                  (d) => d.job === "Director" || d.department === "Directing",
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
                          : `/Movie-Suggestion/istockphoto-1147544807-612x612.jpg`
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
                      : `/Movie-Suggestion/istockphoto-1147544807-612x612.jpg`
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
          {fullData &&
            fullData.episodes &&
            fullData.episodes.flatMap((ep) => ep.guest_stars || []).length !==
              0 && (
              <div className="mt-8">
                <h2 className="text-xl sm:text-2xl text-white font-bold">
                  Guest Stars :
                </h2>
                <div className="flex gap-4 sm:gap-8 m-2 sm:m-4 overflow-x-auto whitespace-nowrap p-2 sm:p-4">
                  {Array.from(
                    new Map(
                      fullData.episodes
                        .flatMap((ep) => ep.guest_stars || [])
                        .filter((gs) => gs.id && gs.profile_path)
                        .map((gs) => [gs.id, gs]),
                    ).values(),
                  ).map((guest) => (
                    <Link
                      to={`/ActorDetails?q=${guest.id}`}
                      key={guest.id}
                      className="cast-card flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg flex-shrink-0 w-48"
                    >
                      <img
                        src={
                          guest.profile_path
                            ? `https://image.tmdb.org/t/p/w200/${guest.profile_path}`
                            : `/Movie-Suggestion/istockphoto-1147544807-612x612.jpg`
                        }
                        alt={guest.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <h1 className="text-white text-lg font-bold mt-2 text-wrap text-center">
                        {guest.name}
                      </h1>
                      <h2 className="text-gray-400 text-sm">
                        {guest.character}
                      </h2>
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
        {/* Similar TvSeries Section */}
        <div className="flex flex-col m-4 sm:m-8">
          <h1 className="text-xl sm:text-2xl text-white font-bold">
            Similar TvSeries :
          </h1>
          <div
            ref={similarTvRef}
            className="flex gap-4 sm:gap-8 m-2 sm:m-4 overflow-x-auto whitespace-nowrap p-2 sm:p-4"
          >
            {similar.results &&
            Array.isArray(similar.results) &&
            similar.results.some((c) => c.poster_path) ? (
              [...similar.results]
                .filter((tv) => tv.first_air_date)
                .sort(
                  (a, b) =>
                    new Date(b.first_air_date) - new Date(a.first_air_date),
                )
                .map((relatedTv) => (
                  <a
                    key={relatedTv.id}
                    href={`/#/tvDetails/1/?q=${relatedTv.id}`}
                  >
                    <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-xl flex-shrink-0 w-48 h-auto">
                      <img
                        src={
                          relatedTv.poster_path
                            ? `https://image.tmdb.org/t/p/w200/${relatedTv.poster_path}`
                            : `/Movie-Suggestion/istockphoto-1147544807-612x612.jpg`
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
              <p className="text-gray-400 text-lg">No related TV shows found.</p>
            )}
          </div>
        </div>
        {/* Production Companies Section */}
        <div className="flex flex-col m-4 sm:m-8">
          <h1 className="text-xl sm:text-2xl text-white font-bold my-2 sm:my-4">
            Production Companies :{" "}
          </h1>
          <div className="flex gap-4 sm:gap-6 justify-around p-2 sm:p-4 overflow-x-auto whitespace-nowrap">
            {tv.production_companies &&
            tv.production_companies.length > 0 ? (
              [...tv.production_companies].map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center text-center"
                >
                  {p.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${p.logo_path}`}
                      alt={p.name}
                      className="w-42 h-full rounded-2xl object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto">
                      <span className="text-white text-xl font-bold">
                        {p.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h1 className="text-white text-sm sm:text-xl mt-2 text-wrap">
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
