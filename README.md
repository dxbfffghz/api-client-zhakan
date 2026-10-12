# api-client-zhakan

**Lab 6 — async, Promise, Fetch, REST**
Author: Akerke Zhakan
Live: https://dxbfffghz.github.io/api-client-zhakan/

A small client for the **PokeAPI** built with pure JavaScript — `fetch`,
`async/await` and `Promise.all`. No frameworks, no axios.

---

## API

- **Name:** PokeAPI
- **Base URL:** `https://pokeapi.co/api/v2`
- **API key:** not required
- **CORS:** enabled
- **Docs:** https://pokeapi.co/docs/v2

Endpoints used:

| Endpoint | Purpose |
|---|---|
| `GET /pokemon?limit=50` | First 50 Pokémon for the initial list |
| `GET /pokemon/{name}` | Search by name (query parameter in the URL) |
| `GET /pokemon/{id}` | One Pokémon by id — details view (second request) |
| `GET /pokemon?limit=1` + `GET /type` | Two parallel requests with `Promise.all` |

> Note: I originally planned to use REST Countries, but the v3.1 API was
> deprecated by the provider during the lab. PokeAPI is one of the APIs
> listed as allowed in the assignment, so I switched to it. The architecture
> (fetch → render, loading/error states, search, details, Promise.all) stayed
> the same.

---

## How to open

The project uses ES modules (`<script type="module">` in `index.html`), so it
must be served over HTTP — opening it as `file://` will not work.

**Option 1 — Live Server (VS Code):**
1. Install the **Live Server** extension.
2. Right-click `index.html` → **Open with Live Server**.

**Option 2 — Python:**
```bash
python -m http.server 8000