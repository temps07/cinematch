class CineMatchApp {
    constructor() {
        this.currentPage = 'home';
        this.currentMovies = [];
        this.init();
    }

    async init() {
        try {
            this.setupEventListeners();
            await this.loadInitialData();
            console.log('CineMatch app initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            uiService.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    setupEventListeners() {
        document.addEventListener('searchRequested', (e) => {
            this.handleSearch(e.detail);
        });

        document.addEventListener('movieSelected', (e) => {
            this.handleMovieSelection(e.detail);
        });

        document.addEventListener('navigationChanged', (e) => {
            this.handleNavigation(e.detail);
        });

        const genreFilter = document.getElementById('genre-filter');
        const yearFilter = document.getElementById('year-filter');
        const ratingFilter = document.getElementById('rating-filter');

        if (genreFilter) {
            genreFilter.addEventListener('change', () => this.applyFilters());
        }
        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.applyFilters());
        }
        if (ratingFilter) {
            ratingFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    async loadInitialData() {
        uiService.showLoading();
        
        try {
            const movies = await apiService.fetchPopularMovies();
            this.currentMovies = movies;
            uiService.renderMovies(movies);

            const genres = await apiService.getMovieGenres();
            uiService.populateGenreFilter(genres);

            uiService.populateYearFilter();

        } catch (error) {
            uiService.showError('Failed to load movies. Please check your internet connection and try again.');
        }
    }

    async handleSearch(query) {
        if (!query.trim()) {
            await this.loadInitialData();
            return;
        }

        uiService.showLoading();
        
        try {
            const movies = await apiService.searchMovies(query);
            this.currentMovies = movies;
            uiService.renderMovies(movies);
        } catch (error) {
            uiService.showError('Search failed. Please try again.');
        }
    }

    async handleMovieSelection(movieId) {
        await uiService.showMovieModal(movieId);
    }

    handleNavigation(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        if (page === 'home') {
            this.loadInitialData();
        } else if (page === 'watchlist') {
            uiService.renderWatchlist();
        }
    }

    applyFilters() {
        const genreFilter = document.getElementById('genre-filter');
        const yearFilter = document.getElementById('year-filter');
        const ratingFilter = document.getElementById('rating-filter');
        if (!genreFilter || !yearFilter || !ratingFilter) return;

        const genreValue = genreFilter.value;
        const yearValue = yearFilter.value;
        const ratingValue = ratingFilter.value;

        let filteredMovies = [...this.currentMovies];

        if (genreValue) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.genre_ids && movie.genre_ids.includes(parseInt(genreValue))
            );
        }

        if (yearValue) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.release_date && movie.release_date.startsWith(yearValue)
            );
        }

        if (ratingValue) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.vote_average >= parseFloat(ratingValue)
            );
        }

        uiService.renderMovies(filteredMovies);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new CineMatchApp();
});