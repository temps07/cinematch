class UIService {
    constructor() {
        this.moviesGrid = document.getElementById('movies-grid');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.errorMessage = document.getElementById('error-message');
        this.movieModal = document.getElementById('movie-modal');
        this.modalBody = document.getElementById('modal-body');
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
                 onerror="this.src='./assets/images/placeholder-poster.jpg'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <span>${movie.release_date ? movie.release_date.substring(0, 4) : 'TBA'}</span>
                    <span>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            const event = new CustomEvent('movieSelected', { detail: movie.id });
            document.dispatchEvent(event);
        });

        return card;
    }

    async showMovieModal(movieId) {
        try {
            this.showModalLoading();
            
            // Fetch movie details and streaming availability concurrently
            const [movieDetails, streamingData] = await Promise.all([
                apiService.getMovieDetails(movieId),
                apiService.getStreamingAvailability(movieId)
            ]);

            this.renderMovieModal(movieDetails, streamingData);
            
        } catch (error) {
            console.error('Error loading movie details:', error);
            this.showModalError('Failed to load movie details. Please try again.');
        }
    }

    showModalLoading() {
        this.modalBody.innerHTML = `
            <div class="modal-loading">
                <div class="loading-spinner"></div>
                <p>Loading movie details...</p>
            </div>
        `;
        this.movieModal.style.display = 'flex';
    }

    showModalError(message) {
        this.modalBody.innerHTML = `
            <div class="modal-error">
                <p>${message}</p>
                <button class="close-modal-btn">Close</button>
            </div>
        `;
        this.movieModal.style.display = 'flex';
        
        // Add event listener to close button
        this.modalBody.querySelector('.close-modal-btn').addEventListener('click', () => {
            this.hideMovieModal();
        });
    }

    renderMovieModal(movieDetails, streamingData) {
        const trailerKey = apiService.getTrailerKey(movieDetails);
        const isInWatchlist = storageService.isInWatchlist(movieDetails.id);
        
        this.modalBody.innerHTML = `
            <div class="movie-detail">
                <div class="movie-detail-header">
                    <div class="movie-detail-poster">
                        <img src="${apiService.getImageUrl(movieDetails.poster_path, 'w400')}" 
                             alt="${movieDetails.title}"
                             onerror="this.src='./assets/images/placeholder-poster.jpg'">
                    </div>
                    <div class="movie-detail-info">
                        <h2>${movieDetails.title}</h2>
                        <div class="movie-meta">
                            <span>${movieDetails.release_date ? movieDetails.release_date.substring(0, 4) : 'TBA'}</span>
                            <span>•</span>
                            <span>${movieDetails.runtime || 'N/A'} min</span>
                            <span>•</span>
                            <span>⭐ ${movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : 'NR'}</span>
                        </div>
                        <div class="movie-genres">
                            ${movieDetails.genres ? movieDetails.genres.map(genre => 
                                `<span class="genre-tag">${genre.name}</span>`
                            ).join('') : ''}
                        </div>
                        <p class="movie-overview">${movieDetails.overview || 'No overview available.'}</p>
                        
                        <div class="movie-actions">
                            <button class="watchlist-btn ${isInWatchlist ? 'in-watchlist' : ''}" 
                                    data-movie-id="${movieDetails.id}">
                                ${isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
                            </button>
                        </div>
                    </div>
                </div>

                ${trailerKey ? `
                <div class="trailer-section">
                    <h3>Trailer</h3>
                    <div class="trailer-container">
                        <iframe width="100%" height="315" 
                                src="https://www.youtube.com/embed/${trailerKey}" 
                                frameborder="0" 
                                allowfullscreen>
                        </iframe>
                    </div>
                </div>
                ` : ''}

                <div class="streaming-section">
                    <h3>Where to Watch</h3>
                    <div class="streaming-services">
                        ${streamingData.length > 0 ? 
                            streamingData.map(service => `
                                <div class="streaming-service ${service.type}">
                                    <span class="service-name">${service.name}</span>
                                    <span class="service-type">${service.type}</span>
                                </div>
                            `).join('') : 
                            '<p>No streaming information available.</p>'
                        }
                    </div>
                </div>
            </div>
        `;

        this.movieModal.style.display = 'flex';

        // Add event listener to watchlist button
        const watchlistBtn = this.modalBody.querySelector('.watchlist-btn');
        watchlistBtn.addEventListener('click', (e) => {
            const movieId = parseInt(e.target.getAttribute('data-movie-id'));
            this.toggleWatchlist(movieId, movieDetails, e.target);
        });
    }

    toggleWatchlist(movieId, movieDetails, button) {
        if (storageService.isInWatchlist(movieId)) {
            storageService.removeFromWatchlist(movieId);
            button.textContent = '+ Add to Watchlist';
            button.classList.remove('in-watchlist');
        } else {
            storageService.addToWatchlist(movieDetails);
            button.textContent = '✓ In Watchlist';
            button.classList.add('in-watchlist');
        }
    }

    hideMovieModal() {
        this.movieModal.style.display = 'none';
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

    renderWatchlist() {
        const watchlist = storageService.getWatchlist();
        this.moviesGrid.innerHTML = '';
        
        if (watchlist.length === 0) {
            this.moviesGrid.innerHTML = `
                <div class="empty-watchlist">
                    <h3>Your watchlist is empty</h3>
                    <p>Add some movies to get started!</p>
                </div>
            `;
            return;
        }

        watchlist.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            this.moviesGrid.appendChild(movieCard);
        });
    }
}

const uiService = new UIService();