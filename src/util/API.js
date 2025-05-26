const movies = `https://api.themoviedb.org/3/movie/`;

const Actors = 'https://api.themoviedb.org/3/person/popular?language=en-US&page=';

const tv = "https://api.themoviedb.org/3/tv/"

const ActorDetails = "https://api.themoviedb.org/3/person/";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDk0MjEzYTE4NWNhNzQ1ZWE4Mzg1OWJiNGM5MmYyNSIsIm5iZiI6MTczOTcyNzA3NS4yMjUsInN1YiI6IjY3YjIyMGUzNTM2OTU4NjcyYjlmYjk4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bmZiZHvnPKiKHOOdMJ_13pu500oB7919TRZCzWvskEQ",
  },
};

async function fetchMovieCast(id) {
  try {
    const response = await fetch(ActorDetails + id + "/movie_credits?language=en-US", options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMovies(category, page) {
  try {
    const response = await fetch(movies + category + "?language=en-US&page=" + page, options);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTV(category, page) {
  try {
    const response = await fetch(tv + category + "?language=en-US&page=" + page, options);
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

async function fetchActorDetails(personId) {
  try {
    const response = await fetch(ActorDetails + personId + "?language=en-US", options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMovieCredit(movieId) {
  try {
    const response = await fetch(
      movies + movieId + "/credits",
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMovieTrailer(movieId) {
  try {
    const response = await fetch(
      movies + movieId + "/videos",
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchSimilarMovies(movieId) {
  try {
    const response = await fetch(
      movies + movieId + "/similar",
      options
    );
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
};
