import { apiService } from './api.js';
import { storageService } from './storage.js';
import { uiService } from './ui.js';
import { eventService } from './events.js';

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

        // Filter events
        document.getElementById('genre-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('year-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('rating-filter').addEventListener('change', () => {
            this.applyFilters();
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
        
        // Update active nav link
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
        const genreFilter = document.getElementById('genre-filter').value;
        const yearFilter = document.getElementById('year-filter').value;
        const ratingFilter = document.getElementById('rating-filter').value;

        let filteredMovies = [...this.currentMovies];

        if (genreFilter) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.genre_ids.includes(parseInt(genreFilter))
            );
        }

        if (yearFilter) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.release_date && movie.release_date.startsWith(yearFilter)
            );
        }

        if (ratingFilter) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.vote_average >= parseFloat(ratingFilter)
            );
        }

        uiService.renderMovies(filteredMovies);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CineMatchApp();
});