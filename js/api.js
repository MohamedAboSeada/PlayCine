// setting up api configs
const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization:
			'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDljMzQ3YTE4Y2U4ODBkNzkwZTgwYjk1MmFmMGM0MCIsIm5iZiI6MTcyMDg1OTMwNy45MjA4NTEsInN1YiI6IjY0ZTViODkwYzNjODkxMDBjNjgxNzYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bkvpsQxEuPgx-e5xERhSM5kPxRIM_lewXipZ2A24qs0',
	},
};

const image_base_url = 'https://image.tmdb.org/t/p/';

// image sizes
const sizes = {
	backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
	logo_sizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
	poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
	profile_sizes: ['w45', 'w185', 'h632', 'original'],
	still_sizes: ['w92', 'w185', 'w300', 'original'],
};
const APP_LANG = 'en-UK';

// function to get data from TMDB
const get = async function (endpoint, callback, optional = null) {
	if (optional !== 'upcoming') {
		endpoint = addLang(endpoint);
	}
	let response = await fetch(endpoint, options);
	let data = await response.json();
	callback(data, optional);
};

function addLang(url) {
	let urlOBJ = new URL(url);
	if (urlOBJ.searchParams.size === 0) {
		return url + `?language=${APP_LANG}`;
	}
	return url + `&language=${APP_LANG}`;
}

export { image_base_url, sizes, get, APP_LANG };
