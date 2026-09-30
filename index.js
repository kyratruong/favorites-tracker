const movieList = document.getElementById("movie-list");
const clearFavoritesButton = document.getElementById("clear-favorites");
const favoritesStorageKey = "favorites";
let movies = [];
let favorites = JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];

function saveFavorites() {
  localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
}

function renderMovies() {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const isFavorited = favorites.includes(movie.title);
    const card = document.createElement("div");
    card.className = `movie-card${isFavorited ? " favorited" : ""}`;
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Year: ${movie.year}</p>
      <p>Genre: ${movie.genre}</p>
      <button class="favorite-toggle" aria-pressed="${isFavorited}">
        ${isFavorited ? "★ Favorited" : "☆ Favorite"}
      </button>
    `;

    const toggleButton = card.querySelector(".favorite-toggle");
    toggleButton.addEventListener("click", () => {
      if (favorites.includes(movie.title)) {
        favorites = favorites.filter((title) => title !== movie.title);
      } else {
        favorites.push(movie.title);
      }

      const nowFavorited = favorites.includes(movie.title);
      card.classList.toggle("favorited", nowFavorited);
      toggleButton.setAttribute("aria-pressed", nowFavorited);
      toggleButton.textContent = nowFavorited ? "★ Favorited" : "☆ Favorite";
      saveFavorites();
    });

    movieList.appendChild(card);
  });
}

clearFavoritesButton.addEventListener("click", () => {
  favorites = [];
  localStorage.removeItem(favoritesStorageKey);
  renderMovies();
});

fetch("favorites-movies.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load movies: ${response.status}`);
    }
    return response.json();
  })
  .then((loadedMovies) => {
    movies = loadedMovies;
    renderMovies();
  })
  .catch((error) => {
    movieList.textContent = "Unable to load the movie list.";
    console.error(error);
  });