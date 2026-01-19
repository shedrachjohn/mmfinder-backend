
async function loadMovie() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");

  const box = document.getElementById("resultBox");

  if (!query) {
    box.innerHTML = "❌ No search query found.";
    return;
  }

  // Show loading
  box.innerHTML = `
    <div style="text-align:center;">
      <div class="spinner"></div>
      <p>Searching for the movie...</p>
    </div>
  `;

  try {
    const res = await fetch("https://mmfinder-backend.onrender.com/search?query=" + query);
    const data = await res.json();

    if (!data.title) {
      box.innerHTML = "❌ No movie found.";
      return;
    }

    box.innerHTML = `
      <div style="margin-top:30px;padding:20px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.15);max-width:400px;margin:auto;text-align:center;">

        <img src="${data.poster}" style="width:100%;border-radius:12px;" />

        <h3 style="margin-top:15px;">${data.title}</h3>

        <p style="font-size:14px;color:#666;">
          📅 ${data.year} &nbsp; ⭐ ${data.rating}
        </p>

        <p style="font-size:14px;color:#555;">${data.overview}</p>

        <div style="margin-top:15px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">

          <a href="${data.links.youtube}" target="_blank"
             style="padding:10px 16px;background:#ff0000;color:white;border-radius:8px;text-decoration:none;">
             ▶ YouTube
          </a>

          <a href="${data.links.netflix}" target="_blank"
             style="padding:10px 16px;background:#e50914;color:white;border-radius:8px;text-decoration:none;">
             🎬 Netflix
          </a>

          <a href="${data.links.prime}" target="_blank"
             style="padding:10px 16px;background:#00a8e1;color:white;border-radius:8px;text-decoration:none;">
             📺 Prime Video
          </a>

        </div>

        <div style="margin-top:20px;">
          <button onclick="window.location.href='/'"
            style="padding:10px 20px;background:#444;color:white;border:none;border-radius:8px;">
            🔁 Search another movie
          </button>
        </div>

      </div>
    `;

  } catch (e) {
    box.innerHTML = "⚠ Unable to load result. Try again.";
  }
}

document.addEventListener("DOMContentLoaded", loadMovie);



