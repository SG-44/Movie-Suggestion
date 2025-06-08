const movies = `https://api.themoviedb.org/3/movie/`;

const Actors =
  "https://api.themoviedb.org/3/person/popular?language=en-US&page=";

const tv = "https://api.themoviedb.org/3/tv/";

const ActorDetails = "https://api.themoviedb.org/3/person/";

const apiToken = import.meta.env.VITE_TMDB_TOKEN;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiToken}`,
  },
};

async function fetchMovieCast(id) {
  try {
    const response = await fetch(
      ActorDetails + id + "/movie_credits?language=en-US",
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMovies(category, page) {
  try {
    const response = await fetch(
      movies + category + "?language=en-US&page=" + page,
      options
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTV(category, page) {
  try {
    const response = await fetch(
      tv + category + "?language=en-US&page=" + page,
      options
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchActors(page) {
  try {
    const response = await fetch(Actors + page, options);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMoviesDetails(movieId) {
  try {
    const response = await fetch(movies + movieId, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTvDetails(TvSerieId) {
  try {
    const response = await fetch(tv + TvSerieId, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchActorDetails(personId) {
  try {
    const response = await fetch(
      ActorDetails + personId + "?language=en-US",
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMovieCredit(movieId) {
  try {
    const response = await fetch(movies + movieId + "/credits", options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTvCredit(tvId) {
  try {
    const response = await fetch(tv + tvId + "/credits", options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMovieTrailer(movieId) {
  try {
    const response = await fetch(movies + movieId + "/videos", options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchSimilarMovies(movieId) {
  try {
    const response = await fetch(movies + movieId + "/similar", options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchSimilarTv(tvId) {
  try {
    const response = await fetch(tv + tvId + "/similar", options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export {
  fetchMovies,
  fetchMoviesDetails,
  fetchMovieCredit,
  fetchMovieTrailer,
  fetchSimilarMovies,
  fetchActors,
  fetchActorDetails,
  fetchMovieCast,
  fetchTV,
  fetchTvDetails,
  fetchTvCredit,
  fetchSimilarTv,
};
