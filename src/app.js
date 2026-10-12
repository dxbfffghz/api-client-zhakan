/**
 * Lab 6 — API client with fetch, async/await, and Promise.all.
 * API: PokeAPI (https://pokeapi.co/api/v2) — no key required.
 */

const BASE = 'https://pokeapi.co/api/v2';
const SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const listEl = document.getElementById('list');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resetBtn = document.getElementById('reset-btn');
const detailsEl = document.getElementById('details');
const detailsContent = document.getElementById('details-content');
const closeBtn = document.getElementById('close-details');
const popCountryEl = document.getElementById('pop-country');
const totalEl = document.getElementById('total-countries');

function showLoading() { loadingEl.hidden = false; errorEl.hidden = true; errorEl.textContent = ''; }
function hideLoading() { loadingEl.hidden = true; }
function showError(msg) { errorEl.hidden = false; errorEl.textContent = msg; }
function clearList() { listEl.innerHTML = ''; }

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) throw new Error('No results found.');
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function idFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

async function loadAll() {
  showLoading(); clearList();
  try {
    const data = await fetchJson(`${BASE}/pokemon?limit=50`);
    renderList(data.results);
  } catch (err) {
    showError(`Could not load Pokémon. ${err.message}`);
  } finally {
    hideLoading();
  }
}

async function searchPokemon(query) {
  showLoading(); clearList();
  try {
    const data = await fetchJson(`${BASE}/pokemon/${encodeURIComponent(query.toLowerCase())}`);
    renderList([{ name: data.name, url: `${BASE}/pokemon/${data.id}/` }]);
  } catch (err) {
    if (err.message === 'No results found.') showError(`No Pokémon found for “${query}”.`);
    else showError(`Search failed. ${err.message}`);
  } finally {
    hideLoading();
  }
}

async function loadDetails(id) {
  showLoading(); detailsEl.hidden = true;
  try {
    const p = await fetchJson(`${BASE}/pokemon/${id}`);
    renderDetails(p);
    detailsEl.hidden = false;
    detailsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    showError(`Could not load details. ${err.message}`);
  } finally {
    hideLoading();
  }
}

async function loadQuickFacts() {
  try {
    const [list, types] = await Promise.all([
      fetchJson(`${BASE}/pokemon?limit=1`),
      fetchJson(`${BASE}/type`),
    ]);
    popCountryEl.textContent = list.count.toLocaleString('en-US');
    totalEl.textContent = types.count.toLocaleString('en-US');
  } catch (err) {
    popCountryEl.textContent = 'unavailable';
    totalEl.textContent = 'unavailable';
  }
}

function renderList(pokemons) {
  clearList();
  if (!pokemons.length) { showError('Nothing to show.'); return; }
  const fragment = document.createDocumentFragment();
  for (const p of pokemons) {
    const id = idFromUrl(p.url);
    const card = document.createElement('article');
    card.className = 'country';
    card.dataset.code = id;
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${SPRITE}/${id}.png" alt="Sprite of ${escapeHtml(p.name)}" loading="lazy">
      <h3>${escapeHtml(p.name)}</h3>
      <p>#${id}</p>
    `;
    fragment.appendChild(card);
  }
  listEl.appendChild(fragment);
}

function renderDetails(p) {
  detailsContent.innerHTML = `
    <img src="${SPRITE}/other/official-artwork/${p.id}.png" alt="Artwork of ${escapeHtml(p.name)}">
    <h3>${escapeHtml(p.name)}</h3>
    <p><span class="label">ID:</span> ${p.id}</p>
    <p><span class="label">Height:</span> ${p.height}</p>
    <p><span class="label">Weight:</span> ${p.weight}</p>
    <p><span class="label">Types:</span> ${p.types.map(t => t.type.name).join(', ')}</p>
    <p><span class="label">Abilities:</span> ${p.abilities.map(a => a.ability.name).join(', ')}</p>
  `;
}

listEl.addEventListener('click', (event) => {
  const card = event.target.closest('.country');
  if (!card) return;
  loadDetails(card.dataset.code);
});

listEl.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('.country');
  if (!card) return;
  event.preventDefault();
  loadDetails(card.dataset.code);
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  searchPokemon(query);
});

resetBtn.addEventListener('click', () => { searchInput.value = ''; loadAll(); });
closeBtn.addEventListener('click', () => { detailsEl.hidden = true; });

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

loadAll();
loadQuickFacts();