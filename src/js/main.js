class CineMatchApp {
    constructor() {
        this.currentPage = 'home';
        this.currentMovies = [];
        this.init();
    }

    async init() {
        try {
            // Set up event listeners for custom events
            this.setupEventListeners();
            
            // Load initial data
            await this.loadInitialData();
            
            console.log('CineMatch app initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            uiService.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Search event
        document.addEventListener('searchRequested', (e) => {
            this.handleSearch(e.detail);
        });

        // Movie selection event
        document.addEventListener('movieSelected', (e) => {
            this.handleMovieSelection(e.detail);
        });

        // Navigation event
        document.addEventListener('navigationChanged', (e) => {
            this.handleNavigation(e.detail);
        });
    }

    async loadInitialData() {
        uiService.showLoading();
        
        try {
            // Load popular movies
            const movies = await apiService.fetchPopularMovies();
            this.currentMovies = movies;
            uiService.renderMovies(movies);

            // Load and populate genres
            const genres = await apiService.getMovieGenres();
            uiService.populateGenreFilter(genres);

            // Populate year filter
            uiService.populateYearFilter();

        } catch (error) {
            uiService.showError('Failed to load movies. Please check your internet connection and try again.');
        }
    }

    async handleSearch(query) {
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
        // This will be implemented in Week 6
        console.log('Movie selected:', movieId);
        alert(`Movie detail view for ID: ${movieId} will be implemented in Week 6!`);
    }

    handleNavigation(page) {
        this.currentPage = page;
        
        if (page === 'home') {
            this.loadInitialData();
        } else if (page === 'watchlist') {
            // This will be implemented in Week 7
            alert('Watchlist view will be implemented in Week 7!');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CineMatchApp();
});