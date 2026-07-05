const movies = `https://api.themoviedb.org/3/movie/`;

const discoverMovies = "https://api.themoviedb.org/3/discover/movie";

const search = "https://api.themoviedb.org/3/search/";

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

const movieGenres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const blockedContentPattern =
  /\b(18\+|adult film|adult movie|adult video|erotic|erotica|hardcore|hentai|nude|nudity|porn|porno|pornographic|pornography|sexploitation|softcore|stripper|xxx)\b/i;

function hasBlockedContent(item) {
  if (!item || item.adult) {
    return true;
  }

  const searchableText = [
    item.title,
    item.original_title,
    item.name,
    item.original_name,
    item.overview,
    item.biography,
  ]
    .filter(Boolean)
    .join(" ");

  if (blockedContentPattern.test(searchableText)) {
    return true;
  }

  return item.known_for?.some((knownForItem) => hasBlockedContent(knownForItem));
}

function filterSafeResults(results = []) {
  return results.filter((item) => !hasBlockedContent(item));
}

function filterSafeResultGroup(data) {
  if (!data || !Array.isArray(data.results)) {
    return data;
  }

  return {
    ...data,
    results: filterSafeResults(data.results),
  };
}

function filterSafeCastGroup(data) {
  if (!data) {
    return data;
  }

  return {
    ...data,
    cast: Array.isArray(data.cast) ? filterSafeResults(data.cast) : data.cast,
  };
}

// Movies Section
async function fetchMovieCast(id) {
  try {
    const response = await fetch(
      ActorDetails + id + "/movie_credits?language=en-US",
      options,
    );
    const data = await response.json();
    return filterSafeCastGroup(data);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMovies(category, page) {
  try {
    const response = await fetch(
      movies + category + "?language=en-US&page=" + page,
      options,
    );
    const data = await response.json();
    return filterSafeResults(data.results);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMoviesByGenres(genreIds, page) {
  try {
    const params = new URLSearchParams({
      include_adult: "false",
      include_video: "false",
      language: "en-US",
      page,
      sort_by: "popularity.desc",
      with_genres: genreIds,
    });
    const response = await fetch(`${discoverMovies}?${params}`, options);
    const data = await response.json();
    return filterSafeResults(data.results);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchMovieSearch(query) {
  try {
    const params = new URLSearchParams({
      include_adult: "false",
      language: "en-US",
      page: "1",
      query,
    });
    const response = await fetch(`${search}movie?${params}`, options);
    const data = await response.json();
    return filterSafeResults(data.results);
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
    return filterSafeResultGroup(data);
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

// TvSeries Section
async function fetchTV(category, page) {
  try {
    const response = await fetch(
      tv + category + "?language=en-US&page=" + page,
      options,
    );
    const data = await response.json();
    return filterSafeResults(data.results);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTvDetails(tvId) {
  try {
    const response = await fetch(tv + tvId + "?language=en-US", options);
    const data = await response.json();
    return data; // <-- return the TV show object, not data.results
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTvFullDetails(tvId, season) {
  try {
    const response = await fetch(
      tv + tvId + "/season/" + season + "?language=en-US",
      options,
    );
    const data = await response.json();
    return data; // <-- return the TV show object, not data.results
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchSimilarTv(tvId) {
  try {
    const response = await fetch(tv + tvId + "/similar", options);
    const data = await response.json();
    return filterSafeResultGroup(data);
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

async function fetchTvCreditWithSeason(tvId, season) {
  try {
    const response = await fetch(
      tv + tvId + "/season/" + season + "/credits",
      options,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTvSearch(query) {
  try {
    const params = new URLSearchParams({
      include_adult: "false",
      language: "en-US",
      page: "1",
      query,
    });
    const response = await fetch(`${search}tv?${params}`, options);
    const data = await response.json();
    return filterSafeResults(data.results);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Actors Section
async function fetchActors(page) {
  try {
    const response = await fetch(Actors + page, options);
    const data = await response.json();
    return filterSafeResults(data.results);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchActorDetails(personId) {
  try {
    const response = await fetch(
      ActorDetails + personId + "?language=en-US",
      options,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchActorSearch(query) {
  try {
    const params = new URLSearchParams({
      include_adult: "false",
      language: "en-US",
      page: "1",
      query,
    });
    const response = await fetch(`${search}person?${params}`, options);
    const data = await response.json();
    return filterSafeResults(data.results);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export {
  movieGenres,
  fetchMovies,
  fetchMoviesByGenres,
  fetchMovieSearch,
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
  fetchTvFullDetails,
  fetchTvCreditWithSeason,
  fetchTvSearch,
  fetchActorSearch,
};
