import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Form, Link } from "react-router";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [MenuActive, setMenuActive] = useState(false);
  const [MovieActive, setMovieActive] = useState(false);
  const [TVActive, setTVActive] = useState(false);
  const [SearchActive, setSearchActive] = useState(false);
  const [Options, setOptions] = useState(false);
  const [input, setInput] = useState("");

  let li = document.getElementById("li");
  // let search = document.getElementById("search").value.length;

  const toggleMenu = () => {
    setMenuActive(!MenuActive);
  };

  const toggleSearch = () => {
    setSearchActive(!SearchActive);
  };

  const toggleTV = () => {
    setTVActive(!TVActive);
  };

  const toggleMovie = () => {
    setMovieActive(!MovieActive);
  };

  const toggleOptions = (e) => {
    setOptions(e.target.value.length > 0);
    li.innerText = e.target.value;
    setInput(li.innerText);
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
    if (MovieActive) {
      setTVActive(false);
    }

    if (TVActive) {
      setMovieActive(false);
    }
  }, [MovieActive, TVActive]);

  return (
    <nav className="flex w-full bg-gray-800 fixed justify-start sm:justify-between items-center z-10 top-0">
      <h1 className="pt-4 px-2 text-white text-2xl sm:text-3xl animate-bounce font-bold">
        MoviesForU
      </h1>
      <Form action="/moviedetails">
        <input
          id="search"
          name="q"
          type="text"
          placeholder="Search..."
          className={`${
            SearchActive && window.innerWidth < 640
              ? "fixed w-full h-8 bg-white text-black focus-visible:outline-none border-2 rounded-sm pl-4 transition duration-300 ease-in-out -top-8 left-1/2 -translate-x-1/2 SearchBar translate-y-26"
              : "sm:block hidden border-indigo-300 md:w-100 max-w-100 md:min-w-70 h-10 rounded-sm border-2 sm:rounded-3xl pl-4 sm:placeholder:text-indigo-200 focus-within:outline-none focus-visible:border-indigo-500 text-white text-2xl sm:m-4 md:mx-8 shrink-0 sm:shrink-5 grow-0 sm:grow lg:grow-0"
          }`}
          onChange={toggleOptions}
        />
        <button type="submit" className="hidden">
          Search
        </button>
      </Form>
      <div
        className={`gap-4 left-0 top-26 sm:top-18 w-full bg-white text-black text-lg transition duration-300 ease-in-out ${
          Options ? "fixed" : "hidden"
        }`}
      >
        <ul className="flex flex-col w-full">
          <Link to={`/moviedetails?q=${input}`} className="hover:bg-gray-200">
            <li
              className="border-1 w-full pl-4"
              id="li"
              onClick={toggleOptions}
            >
              text
            </li>
          </Link>
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

          <li className="transition duration-200 ease-in-out hover:text-indigo-300 hover:scale-110 hover:-translate-y-1 border-b-2 border-transparent hover:border-indigo-300">
            <Link to="/actors/1">Genres</Link>
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
                to="/movies"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>On TV</li>
              </Link>
              <Link
                to="/movies"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>Top -Rated</li>
              </Link>
              <Link
                to="/movies"
                className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
              >
                <li>Popular</li>
              </Link>
              <Link
                to="/movies"
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

        <li className="transition duration-200 ease-in-out hover:text-indigo-300 hover:scale-110 hover:-translate-y-1 border-b-2 border-transparent hover:border-indigo-300">
          <Link to="/actors/1">Genres</Link>
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
              to="/movies"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>On TV</li>
            </Link>
            <Link
              to="/movies"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>Top -Rated</li>
            </Link>
            <Link
              to="/movies"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1 mb-2"
            >
              <li>Popular</li>
            </Link>
            <Link
              to="/movies"
              className="hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-400 duration-200 ease-in-out hover:scale-110 hover:-translate-y-1"
            >
              <li>Airing</li>
            </Link>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
