class UIService {
    constructor() {
        this.moviesGrid = document.getElementById('movies-grid');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.errorMessage = document.getElementById('error-message');
        this.movieModal = document.getElementById('movie-modal');
    }

    showLoading() {
        this.loadingSpinner.style.display = 'block';
        this.errorMessage.style.display = 'none';
        this.moviesGrid.innerHTML = '';
    }

    hideLoading() {
        this.loadingSpinner.style.display = 'none';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.moviesGrid.innerHTML = '';
        this.hideLoading();
    }

    renderMovies(movies) {
        this.moviesGrid.innerHTML = '';
        
        if (movies.length === 0) {
            this.showError('No movies found. Try a different search.');
            return;
        }

        movies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            this.moviesGrid.appendChild(movieCard);
        });
        
        this.hideLoading();
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${apiService.getImageUrl(movie.poster_path)}" 
                 alt="${movie.title}" 
                 class="movie-poster"
                 onerror="this.src='/assets/images/placeholder-poster.jpg'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <span>${movie.release_date ? movie.release_date.substring(0, 4) : 'TBA'}</span>
                    <span>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            // This will be connected in events.js
            const event = new CustomEvent('movieSelected', { detail: movie.id });
            document.dispatchEvent(event);
        });

        return card;
    }

    populateGenreFilter(genres) {
        const genreFilter = document.getElementById('genre-filter');
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    }

    populateYearFilter() {
        const yearFilter = document.getElementById('year-filter');
        const currentYear = new Date().getFullYear();
        
        for (let year = currentYear; year >= 1980; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        }
    }
}

const uiService = new UIService();