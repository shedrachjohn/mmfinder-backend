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

      // 🔍 GET WATCH PROVIDERS (Netflix, Prime, etc.)
const providersUrl = https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${tmdbKey};
const providersRes = await fetch(providersUrl);
const providersData = await providersRes.json();

let watchLinks = {
  youtube: https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " full movie")},
  netflix: null,
  prime: null
};

if (providersData.results && providersData.results.US) {
  const flatrate = providersData.results.US.flatrate || [];

  flatrate.forEach(p => {
    if (p.provider_name.toLowerCase().includes("netflix")) {
      watchLinks.netflix = "https://www.netflix.com/search?q=" + encodeURIComponent(movie.title);
    }
    if (p.provider_name.toLowerCase().includes("amazon")) {
      watchLinks.prime = "https://www.amazon.com/s?k=" + encodeURIComponent(movie.title);
    }
  });
}

return res.json({
  title: movie.title,
  overview: movie.overview,
  poster: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
  year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
  rating: movie.vote_average,
  links: watchLinks
});
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


