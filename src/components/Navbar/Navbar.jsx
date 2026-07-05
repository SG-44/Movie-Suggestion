import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  fetchActorSearch,
  fetchMovieSearch,
  fetchTvSearch,
  movieGenres,
} from "@/util/API";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [MenuActive, setMenuActive] = useState(false);
  const [MovieActive, setMovieActive] = useState(false);
  const [TVActive, setTVActive] = useState(false);
  const [GenreActive, setGenreActive] = useState(false);
  const [SearchActive, setSearchActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);

  const searchType = location.pathname.startsWith("/actors") ||
    location.pathname.startsWith("/actorDetails")
    ? "actor"
    : location.pathname.startsWith("/tv") ||
        location.pathname.startsWith("/tvDetails")
      ? "tv"
      : "movie";

  const searchConfig = {
    actor: {
      placeholder: "Search actors...",
      emptyText: "No actors found.",
      loadingText: "Searching actors...",
    },
    movie: {
      placeholder: "Search movies...",
      emptyText: "No movies found.",
      loadingText: "Searching movies...",
    },
    tv: {
      placeholder: "Search TV shows...",
      emptyText: "No shows found.",
      loadingText: "Searching shows...",
    },
  };

  const toggleMenu = () => {
    setMenuActive(!MenuActive);
  };

  const toggleSearch = () => {
    setSearchActive(!SearchActive);
  };

  const toggleTV = () => {
    setTVActive(!TVActive);
  };

  const toggleGenre = () => {
    setGenreActive(!GenreActive);
  };

  const toggleMovie = () => {
    setMovieActive(!MovieActive);
  };

  const toggleGenreSelection = (genreId) => {
    setSelectedGenreIds((currentGenres) =>
      currentGenres.includes(genreId)
        ? currentGenres.filter((id) => id !== genreId)
        : [...currentGenres, genreId],
    );
  };

  const selectedGenrePath =
    selectedGenreIds.length > 0
      ? `/movies/genres/${selectedGenreIds.join(",")}/1`
      : "/movies/popular/1";

  const getSuggestionTitle = (suggestion) =>
    suggestion.title || suggestion.name || suggestion.original_title;

  const getSuggestionSubtitle = (suggestion) => {
    if (searchType === "actor") {
      return suggestion.known_for_department || "Actor";
    }

    return suggestion.release_date || suggestion.first_air_date || "";
  };

  const getSuggestionImage = (suggestion) => {
    const imagePath =
      searchType === "actor" ? suggestion.profile_path : suggestion.poster_path;

    return imagePath
      ? `https://image.tmdb.org/t/p/w92/${imagePath}`
      : "/Movie-Suggestion/istockphoto-1147544807-612x612.jpg";
  };

  const getSuggestionLink = (suggestion) => {
    if (searchType === "actor") {
      return `/actorDetails?q=${suggestion.id}`;
    }

    if (searchType === "tv") {
      return `/tvDetails/1/?q=${suggestion.id}`;
    }

    return `/moviedetails?q=${suggestion.id}`;
  };

  const closeSearch = () => {
    setSuggestions([]);
    setSearchInput("");
    setSearchActive(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (suggestions.length > 0) {
      navigate(getSuggestionLink(suggestions[0]));
      closeSearch();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setSearchActive(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const trimmedInput = searchInput.trim();

    if (trimmedInput.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);

      const searchResults =
        searchType === "actor"
          ? await fetchActorSearch(trimmedInput)
          : searchType === "tv"
            ? await fetchTvSearch(trimmedInput)
            : await fetchMovieSearch(trimmedInput);

      setSuggestions(searchResults.slice(0, 6));
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchType]);

  useEffect(() => {
    setSearchInput("");
    setSuggestions([]);
  }, [location.pathname]);

  useEffect(() => {
    if (MovieActive) {
      setTVActive(false);
      setGenreActive(false);
    }

    if (TVActive) {
      setMovieActive(false);
      setGenreActive(false);
    }

    if (GenreActive) {
      setMovieActive(false);
      setTVActive(false);
    }
  }, [GenreActive, MovieActive, TVActive]);

  return (
    <nav className="flex w-full bg-gray-800 fixed justify-start sm:justify-between items-center z-10 top-0">
      <h1 className="pt-4 px-2 text-white text-2xl sm:text-3xl animate-bounce font-bold">
        MoviesForU
      </h1>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          id="search"
          type="text"
          value={searchInput}
          placeholder={searchConfig[searchType].placeholder}
          className={`${
            SearchActive && window.innerWidth < 640
              ? "fixed w-full h-8 bg-white text-black focus-visible:outline-none border-2 rounded-sm pl-4 transition duration-300 ease-in-out -top-8 left-1/2 -translate-x-1/2 SearchBar translate-y-26"
              : "sm:block hidden border-indigo-300 md:w-100 max-w-100 md:min-w-70 h-10 rounded-sm border-2 sm:rounded-3xl pl-4 sm:placeholder:text-indigo-200 focus-within:outline-none focus-visible:border-indigo-500 text-white text-2xl sm:m-4 md:mx-8 shrink-0 sm:shrink-5 grow-0 sm:grow lg:grow-0"
          }`}
          onChange={(event) => setSearchInput(event.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="hidden">
          Search
        </button>
      </form>
      <div
        className={`left-0 top-26 sm:top-18 w-full bg-white text-black text-lg transition duration-300 ease-in-out shadow-xl ${
          searchInput.trim().length >= 2 ? "fixed" : "hidden"
        }`}
      >
        <ul className="flex flex-col w-full max-h-96 overflow-y-auto">
          {isSearching ? (
            <li className="border-b border-gray-200 p-4 text-gray-500">
              {searchConfig[searchType].loadingText}
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <Link
                key={suggestion.id}
                to={getSuggestionLink(suggestion)}
                className="hover:bg-gray-200"
                onClick={closeSearch}
              >
                <li className="border-b border-gray-200 p-3 flex items-center gap-3">
                  <img
                    src={getSuggestionImage(suggestion)}
                    alt={getSuggestionTitle(suggestion)}
                    className="h-16 w-12 rounded-sm object-cover bg-gray-200"
                  />
                  <div className="min-w-0">
                    <p className="font-bold truncate">
                      {getSuggestionTitle(suggestion)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getSuggestionSubtitle(suggestion)}
                    </p>
                  </div>
                </li>
              </Link>
            ))
          ) : (
            <li className="border-b border-gray-200 p-4 text-gray-500">
              {searchConfig[searchType].emptyText}
            </li>
          )}
        </ul>
      </div>
      <button
        className="bg-indigo-400 h-10 w-10 rounded-3xl m-4 relative sm:hidden flex justify-center items-center cursor-pointer"
        onClick={toggleSearch}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      <div
        className="h-12 w-12 relative lg:hidden cursor-pointer ml-auto m-2"
        onClick={toggleMenu}
      >
        <span className="top-1/4 h-1 w-full bg-indigo-400 rounded-sm absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition duration-300 ease-out"></span>
        <span className="top-1/2 h-1 w-full bg-indigo-400 rounded-sm absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition duration-300 ease-out"></span>
        <span className="top-3/4 h-1 w-full bg-indigo-400 rounded-sm absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition duration-300 ease-out"></span>
      </div>

      {/* navbar small screen */}
      <div
        className={`z-10 flex items-center gap-6 text-2xl absolute lg:hidden bg-gray-800 top-12 sm:top-16 right-0 sm:text-md p-4 text-indigo-200 flex-col justify-center transition duration-300 ease-out ${
          MenuActive ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul>
          <li className="transition duration-200 ease-in-out hover:text-indigo-300 hover:scale-110 hover:-translate-y-1 border-b-2 border-transparent hover:border-indigo-300">
            <Link to="/actors/1">Actors</Link>
          </li>

          <li
            className="text-indigo-200 transition duration-300 ease-out hover:-translate-y-1 hover:scale-110"
            onClick={toggleGenre}
          >
            <button className="cursor-pointer hover:text-indigo-300 transition duration-300 ease-out">
              Genres
            </button>
            <ul
              className={`absolute right-4 bg-gray-800 p-4 w-64 max-h-96 overflow-y-auto text-base ${
                GenreActive ? "block" : "hidden"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              {movieGenres.map((genre) => (
                <li key={genre.id} className="mb-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-300">
                    <input
                      type="checkbox"
                      checked={selectedGenreIds.includes(genre.id)}
                      onChange={() => toggleGenreSelection(genre.id)}
                      className="h-4 w-4 accent-indigo-400"
                    />
                    {genre.name}
                  </label>
                </li>
              ))}
              <li className="flex gap-2 pt-2">
                <Link
                  to={selectedGenrePath}
                  className="bg-indigo-400 text-gray-900 px-3 py-1 rounded-sm hover:bg-indigo-300"
                  onClick={() => {
                    setGenreActive(false);
                    setMenuActive(false);
                  }}
                >
                  Apply
                </Link>
                <button
                  className="border border-indigo-300 px-3 py-1 rounded-sm hover:text-indigo-300"
                  onClick={() => setSelectedGenreIds([])}
                >
                  Clear
                </button>
              </li>
            </ul>
          </li>

          <li
            className="text-indigo-200 transition duration-300 ease-out hover:-translate-y-1 hover:scale-110"
            onClick={toggleMovie}
          >
            <button className="cursor-pointer hover:text-indigo-300 transition duration-300 ease-out">
              Movies
            </button>
            <ul
              className={`absolute bg-gray-800 p-4 ${
                MovieActive ? "block" : "hidden"
              }`}
            >
              <Link
                to="/movies/now_playing/1"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>Playing</li>
              </Link>
              <Link
                to="/movies/top_rated/1"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>Top Rated</li>
              </Link>
              <Link
                to="/movies/popular/1"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>Popular</li>
              </Link>
              <Link
                to="/movies/upcoming/1"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1"
              >
                <li>Upcoming</li>
              </Link>
            </ul>
          </li>

          <li
            className="text-indigo-200 transition hover:-translate-y-1 hover:scale-110 duration-200 ease-in-out"
            onClick={toggleTV}
          >
            <button className="cursor-pointer hover:text-indigo-300 transition duration-300 ease-out ">
              TV Shows
            </button>
            <ul
              className={`absolute bg-gray-800 p-4 transition duration-200 ease-in-out ${
                TVActive ? "block" : "hidden"
              }`}
            >
              <Link
                to="/tv/airing_today/1"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>On TV</li>
              </Link>
              <Link
                to="/tv/top_rated/1"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>Top -Rated</li>
              </Link>
              <Link
                to="/tv/popular/1"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>Popular</li>
              </Link>
              <Link
                to="/tv/on_the_air/1"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1"
              >
                <li>Airing</li>
              </Link>
            </ul>
          </li>
        </ul>
      </div>

      {/* navbar large screen*/}
      <ul className="p-4 text-indigo-200 hidden lg:flex justify-between items-center gap-5 text-2xl z-10">
        <li className="transition duration-200 ease-in-out hover:text-indigo-300 hover:scale-110 hover:-translate-y-1 border-b-2 border-transparent hover:border-indigo-300">
          <Link to="/actors/1">Actors</Link>
        </li>

        <li className="text-indigo-200 hover:*:block transition duration-300 ease-out hover:-translate-y-1 hover:scale-110">
          <button className="cursor-pointer hover:text-indigo-300 transition duration-300 ease-out">
            Genres
          </button>
          <ul className="hidden *:block absolute bg-gray-800 p-4 w-64 max-h-96 overflow-y-auto text-base">
            {movieGenres.map((genre) => (
              <li key={genre.id} className="mb-2">
                <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-300">
                  <input
                    type="checkbox"
                    checked={selectedGenreIds.includes(genre.id)}
                    onChange={() => toggleGenreSelection(genre.id)}
                    className="h-4 w-4 accent-indigo-400"
                  />
                  {genre.name}
                </label>
              </li>
            ))}
            <li className="flex gap-2 pt-2">
              <Link
                to={selectedGenrePath}
                className="bg-indigo-400 text-gray-900 px-3 py-1 rounded-sm hover:bg-indigo-300"
              >
                Apply
              </Link>
              <button
                className="border border-indigo-300 px-3 py-1 rounded-sm hover:text-indigo-300 mx-2 cursor-pointer"
                onClick={() => setSelectedGenreIds([])}
              >
                Clear
              </button>
            </li>
          </ul>
        </li>

        <li className="text-indigo-200 hover:*:block transition duration-300 ease-out hover:-translate-y-1 hover:scale-110">
          <button className="cursor-pointer hover:text-indigo-300 transition duration-300 ease-out">
            Movies
          </button>
          <ul className="hidden *:block absolute bg-gray-800 p-4">
            <Link
              to="/movies/now_playing/1"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>Playing</li>
            </Link>
            <Link
              to="/movies/top_rated/1"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>Top Rated</li>
            </Link>
            <Link
              to="/movies/popular/1"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>Popular</li>
            </Link>
            <Link
              to="/movies/upcoming/1"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1"
            >
              <li>Upcoming</li>
            </Link>
          </ul>
        </li>
        <li className="text-indigo-200 hover:*:block transition duration-300 ease-out hover:-translate-y-1 hover:scale-110">
          <button className="cursor-pointer hover:text-indigo-300 transition duration-300 ease-out ">
            TV Shows
          </button>
          <ul className="hidden *:block absolute bg-gray-800 p-4">
            <Link
              to="/tv/airing_today/1"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>Airing Today</li>
            </Link>
            <Link
              to="/tv/top_rated/1"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>Top - Rated</li>
            </Link>
            <Link
              to="/tv/popular/1"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>Popular</li>
            </Link>
            <Link
              to="/tv/on_the_air/1"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1"
            >
              <li>On The Air</li>
            </Link>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
