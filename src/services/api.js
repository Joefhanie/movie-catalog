const API_KEY= "5649e7720b5a66638279ae616b253a12";
const BASE_URL = "https://api.themoviedb.org/3"

export const movieGenres = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    horror: 27,
    mystery: 9648,
    romance: 10749,
    "science fiction": 878,
    thriller: 53,
    war: 10752,
    western: 37
};

export const getPopularMovies = async (page = 1) => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    const data = await response.json()
    return { results: data.results || [], hasMore: page < data.total_pages }
};

export const getMovieDetails = async (movieId) => {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
    const data = await response.json();
    return data;
};

export const searchMovies = async (query = "", sortOption = "popular", genreFilter = "", page = 1) => {
    const searchText = query.trim();
    const searchTypeMatch = searchText.match(/^(actor|director|genre):\s*/i);
    let searchType = searchTypeMatch?.[1].toLowerCase() || "movie";
    const typedSearch = searchText.replace(searchTypeMatch?.[0] || "", "");
    const dateMatch = typedSearch.match(/\b\d{4}(?:-\d{2}-\d{2})?\b/);
    const releaseDate = dateMatch?.[0] || "";
    const movieQuery = typedSearch.replace(releaseDate, "").trim();
    const isYearSearch = releaseDate.length === 4;
    const params = new URLSearchParams({ api_key: API_KEY, page });
    const today = new Date().toISOString().split("T")[0];
    const sortBy = {
        recent: "primary_release_date.desc",
        popular: "popularity.desc",
        ascending: "primary_release_date.asc",
        descending: "primary_release_date.desc"
    }[sortOption] || "popularity.desc";

    if (searchType === "movie" && movieGenres[movieQuery.toLowerCase()]) {
        searchType = "genre";
    }

    if (searchType === "genre") {
        const genreId = movieGenres[movieQuery.toLowerCase()];
        if (!genreId) return { results: [], hasMore: false };
        params.set("with_genres", genreId);
    } else if (genreFilter && movieGenres[genreFilter]) {
        params.set("with_genres", movieGenres[genreFilter]);
    }

    if (searchType === "movie" && movieQuery) params.set("query", movieQuery);
    if (searchType === "movie" && movieQuery && releaseDate) {
        params.set("primary_release_year", releaseDate.slice(0, 4));
    } else if (releaseDate) {
        const startDate = isYearSearch ? `${releaseDate}-01-01` : releaseDate;
        const endDate = isYearSearch ? `${releaseDate}-12-31` : releaseDate;
        params.set("primary_release_date.gte", startDate);
        params.set("primary_release_date.lte", endDate);
        params.set("sort_by", sortBy);
    }

    if (!movieQuery && !releaseDate) {
        params.set("sort_by", sortBy);
    }

    if (sortOption === "recent") {
        params.set("primary_release_date.lte", today);
    }

    if (searchType === "actor" || searchType === "director") {
        const personResponse = await fetch(`${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(movieQuery)}`);
        const personData = await personResponse.json();
        const personId = personData.results?.[0]?.id;
               if (!personId) return { results: [], hasMore: false };

        params.delete("query");
        params.set(searchType === "actor" ? "with_cast" : "with_crew", personId);
        params.set("sort_by", sortBy);
    }

    const endpoint = searchType === "movie" && movieQuery
        ? "search/movie"
        : "discover/movie";
    const response = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`);
    const data = await response.json();
    const results = data.results || [];

    if (searchType === "movie" && movieQuery && results.length === 0) {
        const personResponse = await fetch(`${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(movieQuery)}`);
        const personData = await personResponse.json();
        const person = personData.results?.[0];

        if (person) {
            params.delete("query");
            params.set(person.known_for_department === "Directing" ? "with_crew" : "with_cast", person.id);
            params.set("sort_by", sortBy);

            const personMoviesResponse = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`);
            const personMoviesData = await personMoviesResponse.json();
            return personMoviesData.results || [];
                    return {
                        results: personMoviesData.results || [],
                        hasMore: page < personMoviesData.total_pages
                    };
            const results = data.results || [];
            const hasMore = page < data.total_pages;
                    return {
                        results: personMoviesData.results || [],
                        hasMore: page < personMoviesData.total_pages
                    };
        }
    }

    if (searchType !== "movie") {
        return results;
        return { results, hasMore };
    }

    const filteredResults = results.filter((movie) => {
        if (sortOption === "recent" && (!movie.release_date || movie.release_date > today)) {
            return false;
        }

        if (genreFilter && !movie.genre_ids?.includes(movieGenres[genreFilter])) {
            return false;
        }

        if (!releaseDate) return true;

        return isYearSearch
            ? movie.release_date?.startsWith(releaseDate)
            : movie.release_date === releaseDate;
    });

    if (sortOption === "popular") return filteredResults;
    if (sortOption === "popular") return { results: filteredResults, hasMore };

    return filteredResults.sort((firstMovie, secondMovie) => {
            const sortedResults = filteredResults.sort((firstMovie, secondMovie) => {
        const firstDate = firstMovie.release_date || "9999-12-31";
        const secondDate = secondMovie.release_date || "9999-12-31";
        return sortOption === "recent" || sortOption === "descending"
            ? secondDate.localeCompare(firstDate)
            : firstDate.localeCompare(secondDate);
    });
    });

    return { results: sortedResults, hasMore };
};