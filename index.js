require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ Test route (THIS IS WHAT WORKED BEFORE) */
app.get("/", (req, res) => {
  res.json({ message: "MMFinder backend running 🚀" });
});

/* ✅ Movie search route (WORKING VERSION) */
app.get("/search/movie", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Movie name is required" });
  }

  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: query,
        },
      }
    );

    const movie = response.data.results[0];

if (!movie) {
  return res.status(404).json({ error: "No movie found" });
}

res.json({
  title: movie.title,
  release_date: movie.release_date,
  poster_path: movie.poster_path,
  overview: movie.overview,
});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "TMDB request failed" });
  }
});

/* ✅ START SERVER (MUST BE LAST) */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});
