import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/Movies/MovieDetails.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import Error from "./pages/Error.jsx";
import Actors from "./pages/Actors/Actors.jsx";
import ActorDetails from "./pages/Actors/ActorDetails.jsx";
import Tv from "./pages/TV/Tv.jsx";
import TvDetails from "./pages/TV/TvDetails.jsx";

// const movieId = useSearchParams.get("q");
// const actorId = useSearchParams.get("q");

const router = new createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/movies/:category/:pageCount",
    element: <Movies />,
  },
  {
    path: `/moviedetails`,
    element: <MovieDetails />,
  },
  {
    path: "/actors/:pageCount",
    element: <Actors />,
  },
  {
    path: `/actorDetails`,
    element: <ActorDetails />,
  },
  {
    path: "/tv/:category/:pageCount",
    element: <Tv />,
  },
  {
    path: "/tvDetails",
    element: <TvDetails />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
