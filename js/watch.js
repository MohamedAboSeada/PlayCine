function getShowDetails() {
	if (localStorage.getItem('watch')) {
		return JSON.parse(localStorage.getItem('watch'));
	}
}

let urlQueries = getShowDetails();
const frame = document.querySelector('.watchArea__movie-stream');
const frame_name = document.querySelector('.block__heading');

console.log(urlQueries);

if (urlQueries.type === 'movie') {
	frame.src = `https://multiembed.mov/?video_id=${urlQueries.id}&tmdb=1`;
	frame_name.textContent = `${urlQueries.name}`;
} else if (urlQueries.type === 'tv') {
	frame.src = `https://multiembed.mov/directstream.php?video_id=${urlQueries.id}&tmdb=1&s=${urlQueries.s}&e=${urlQueries.e}`;
	frame_name.textContent = `${urlQueries.name}s${urlQueries.s}ep${urlQueries.e}`;
}

window.addEventListener('resize', (_) => {
	if (window.innerWidth > window.innerHeight) {
		frame.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
