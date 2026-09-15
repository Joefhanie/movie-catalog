const API_KEY= "5649e7720b5a66638279ae616b253a12";
const BASE_URL = "https://api.themoviedb.org/3"

const movieGenres = {
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

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json()
    return data.results
};

export const searchMovies = async (query = "", sortOption = "popular") => {
    const searchText = query.trim();
    const searchTypeMatch = searchText.match(/^(actor|director|genre):\s*/i);
    let searchType = searchTypeMatch?.[1].toLowerCase() || "movie";
    const typedSearch = searchText.replace(searchTypeMatch?.[0] || "", "");
    const dateMatch = typedSearch.match(/\b\d{4}(?:-\d{2}-\d{2})?\b/);
    const releaseDate = dateMatch?.[0] || "";
    const movieQuery = typedSearch.replace(releaseDate, "").trim();
    const isYearSearch = releaseDate.length === 4;
    const params = new URLSearchParams({ api_key: API_KEY });
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
        if (!genreId) return [];
        params.set("with_genres", genreId);
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

    if (searchType === "actor" || searchType === "director") {
        const personResponse = await fetch(`${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(movieQuery)}`);
        const personData = await personResponse.json();
        const personId = personData.results?.[0]?.id;
        if (!personId) return [];

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
        }
    }

    if (searchType !== "movie") {
        return results;
    }

    const filteredResults = !releaseDate ? results : results.filter((movie) => isYearSearch
        ? movie.release_date?.startsWith(releaseDate)
        : movie.release_date === releaseDate);

    if (sortOption === "popular") return filteredResults;

    return filteredResults.sort((firstMovie, secondMovie) => {
        const firstDate = firstMovie.release_date || "9999-12-31";
        const secondDate = secondMovie.release_date || "9999-12-31";
        return sortOption === "recent" || sortOption === "descending"
            ? secondDate.localeCompare(firstDate)
            : firstDate.localeCompare(secondDate);
    });
};