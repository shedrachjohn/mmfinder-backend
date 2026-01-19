const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// 🔹 Root route (test if backend is alive)
app.get("/", (req, res) => {
  res.send("MMFinder backend is running ✅");
});

// 🔹 MAIN SEARCH ROUTE
app.get("/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.json({ error: "No query provided" });
  }

  try {
    // 🔍 TMDB SEARCH (Hollywood + international)
    const tmdbKey = "675ba63f3db201974af6975f9e8e0a3c";
    const tmdbUrl = https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(query)};

    const tmdbRes = await fetch(tmdbUrl);
    const tmdbData = await tmdbRes.json();

    if (tmdbData.results && tmdbData.results.length > 0) {
      const movie = tmdbData.results[0];

      return res.json({
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        url: https://www.google.com/search?q=${encodeURIComponent(movie.title + " movie watch")}
      });
    }

    // 🔁 NO TMDB RESULT → NOLLYWOOD FALLBACK
    return res.json({
      results: [
        {
          title: query,
          url: https://www.youtube.com/results?search_query=${encodeURIComponent(query + " nollywood movie")}
        }
      ]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 START SERVER
app.listen(PORT, () => {
  console.log("MMFinder backend running on port " + PORT);
});
