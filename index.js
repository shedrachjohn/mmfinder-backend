const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Root test route
app.get("/", (req, res) => {
  res.send("MMFinder backend is running ✅");
});

// MAIN SEARCH ROUTE
app.get("/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.json({ error: "No query provided" });
  }

  try {
    const tmdbKey = "675ba63f3db201974af6975f9e8e0a3c";
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(query)}`;

    const fetch = (await import("node-fetch")).default;
    const tmdbRes = await fetch(tmdbUrl);
    const tmdbData = await tmdbRes.json();

    if (tmdbData.results && tmdbData.results.length > 0) {
      const movie = tmdbData.results[0];

      return res.json({
        title: movie.title,
        overview: movie.overview,
        poster: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
        rating: movie.vote_average || "N/A",
        links: {
          youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " full movie")}`,
          netflix: `https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`,
          prime: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(movie.title)}`
        }
      });
    }

    return res.json({ error: "No movie found" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("MMFinder backend running...");
});



