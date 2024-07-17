function getShowDetails() {
	if (localStorage.getItem('watch')) {
		return JSON.parse(localStorage.getItem('watch'));
	}
}

let urlQueries = getShowDetails();
const frame = document.querySelector('.watchArea__movie-stream');
const frame_name = document.querySelector('.block__heading');

if (urlQueries.type === 'movie') {
	frame.src = `https://multiembed.mov/?video_id=${urlQueries.id}&tmdb=1`;
	frame_name.textContent = `${urlQueries.name}`;
	document.title = `PlayCine - ${urlQueries.name}`;
} else if (urlQueries.type === 'tv') {
	frame.src = `https://multiembed.mov/directstream.php?video_id=${urlQueries.id}&tmdb=1&s=${urlQueries.s}&e=${urlQueries.e}`;
	frame_name.textContent = `${urlQueries.name} (S${urlQueries.s} - EP${urlQueries.e})`;
	document.title = `PlayCine - ${urlQueries.name} (S${urlQueries.s},EP${urlQueries.e})`;
}

// fill episods
if(urlQueries.type === 'tv'){
	// remove hidden section
	const episodsCont = document.querySelector('.episods');
	episodsCont.classList.remove('hide');
	
	// view episods
	const episodsArea = document.querySelector('.episods_cards');
	episodsArea.innerHTML = ``;
	urlQueries.all_episods.forEach((ep, index) => {
		let link = document.createElement('a');
		link.classList.add('episods_card');
		link.textContent = ep.episode_number;
		link.href = 'watch.html';

		if (urlQueries.e === ep.episode_number) {
			link.classList.add('active');
		}

		link.addEventListener('click', (_) => {
			localStorage.setItem(
				'watch',
				JSON.stringify({
					id: urlQueries.id,
					name: urlQueries.name,
					type: 'tv',
					all_episods: urlQueries.all_episods,
					e: index + 1,
					s: urlQueries.s,
				})
			);
		});

		episodsArea.append(link);
	});
}

// device oriantation 
if (window.innerWidth <= 576) {
	window.addEventListener('resize', (_) => {
		if (window.innerHeight < window.innerWidth) {
			frame.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	});
}

// message show and hide after 5 seconds
const message = document.querySelector('.message');
setTimeout(_=>{
	message.classList.add('hide');
},5000);