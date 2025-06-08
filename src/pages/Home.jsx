import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { Link } from "react-router";

function Home() {
  return (
    <>
      <Navbar />
      <div
        className="h-screen flex flex-col gap-8 w-full items-center justify-around p-8 pt-28 sm:flex-row sm:items-center sm:justify-around sm:gap-4"
      >
        <Link className="w-70 h-80 bg-indigo-400 rounded-lg flex justify-center hover:*:scale-110 hover:bg-transparent hover:*:opacity-100 ease-out duration-175 hover:*:text-transparent relative" to="/actors/1">
          <img src="/Jason-Statham-007.jpg" alt="Actors" className="object-cover rounded-lg opacity-50 ease-out duration-150"/>
          <h1 className="text-white text-6xl text-center m-auto font-bold absolute top-50 -translate-y-35 sm:top-50 sm:-translate-y-20">Actors</h1>
        </Link>
        <Link className="w-70 h-80 bg-indigo-400 rounded-lg flex justify-center hover:*:scale-110 hover:bg-transparent hover:*:opacity-100 ease-out duration-175 hover:*:text-transparent relative" to="/movies/now_playing/1">
          <img src="/movies.jpg" alt="Movies" className="object-cover rounded-lg opacity-50 ease-out duration-150" />
          <h1 className="text-white text-6xl text-center m-auto font-bold absolute top-50 -translate-y-35 sm:top-50 sm:-translate-y-20 ease-in-out duration-150">Movies</h1>
        </Link>
        <Link className="w-70 h-80 bg-indigo-400 rounded-lg flex justify-center hover:*:scale-110 hover:bg-transparent hover:*:opacity-100 ease-out duration-175 hover:*:text-transparent relative" to="/tv/airing_today/1">
          <img src="/brown-retro-electronic-tv-device.jpg" alt="TV Series" className="object-cover rounded-lg opacity-50 ease-out duration-150" />
          <h1 className="text-white text-6xl text-center m-auto font-bold absolute top-50 -translate-y-35 sm:top-50 sm:-translate-y-20">TV Series</h1>
        </Link>
      </div>
      <Footer />
    </>
  );
}

export default Home;
