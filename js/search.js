import { image_base_url, sizes, get, APP_LANG } from './api.js';

const searchBtn = document.querySelector('.nav__button-search');
const searchBox = document.querySelector('.searchBox');
const searchInput = document.querySelector('.searchBox__input');
const searchResults = document.querySelector('.searchBox__results');

searchBtn.addEventListener('click', (_) => {
	searchBox.classList.toggle('hide');
	if (!searchBox.classList.contains('hide')) {
		searchInput.focus();
	}
	searchBtn.innerHTML =
		searchBtn.innerHTML === '<i class="bx bx-search"></i>'
			? '<i class="bx bx-exit"></i>'
			: '<i class="bx bx-search"></i>';
});

searchInput.addEventListener(
	'input',
	debounce((e) => {
		const query = searchInput.value.trim();
		if (query.length > 0) {
			fetchResults(query);
		} else {
			searchResults.classList.add('hide');
		}
	}, 300)
);

function debounce(func, delay) {
	let debounceTimer;
	return function (...args) {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => func.apply(this, args), delay);
	};
}

function fetchResults(query) {
	let endpoint = `https://api.themoviedb.org/3/search/multi?language=${APP_LANG}&query=${query}`;
	get(endpoint, displayResults);
}

function displayResults(data) {
	searchResults.innerHTML = ``;

	let filteredSearch = data.results.filter(
		(x) => x.media_type === 'movie' || x.media_type === 'tv'
	);
	if (filteredSearch.length > 0) {
		searchResults.classList.remove('hide');
		filteredSearch.forEach((result) => {
			console.log(result);
			let resultLink = document.createElement('a');
			resultLink.classList.add('searchBox__result');
			resultLink.href = `details.html`;
			resultLink.addEventListener('click', (_) => {
				localStorage.setItem(
					'details',
					JSON.stringify({ id: result.id, type: result.media_type })
				);
			});
			let image_url = `${image_base_url}${sizes.poster_sizes[1]}${result.poster_path}`;
			let show_title = result.name ? result.name : result.title;
			let resultStrcuture = `<img class="show__image" async src="${image_url}">
                                <p class="show__name">${show_title}</p>`;
			resultLink.innerHTML = resultStrcuture;
			searchResults.append(resultLink);
		});
	} else {
		searchResults.classList.add('hide');
	}
}
