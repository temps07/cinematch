// API Configuration
const API_CONFIG = {
    tmdb: {
        baseUrl: 'https://api.themoviedb.org/3',
        apiKey: '243af5d207d7f0b2fd1537cf01d57b5e', // https://www.themoviedb.org/settings/api
        imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
    },
    watchmode: {
        baseUrl: 'https://api.watchmode.com/v1',
        apiKey: 'a3k9UMuvLz2jeFw0zsWpJ5ohWn053ez6LotoUYpL' // https://www.watchmode.com/
    }
};

class ApiService {
    constructor() {
        this.tmdbApiKey = API_CONFIG.tmdb.apiKey;
        this.watchmodeApiKey = API_CONFIG.watchmode.apiKey;
    }

    // TMDB API calls
    async fetchPopularMovies() {
        try {
            const response = await fetch(
                `${API_CONFIG.tmdb.baseUrl}/movie/popular?api_key=${this.tmdbApiKey}&language=en-US&page=1`
            );
            if (!response.ok) throw new Error('Failed to fetch popular movies');
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            throw error;
        }
    }

    async searchMovies(query) {
        try {
            const response = await fetch(
                `${API_CONFIG.tmdb.baseUrl}/search/movie?api_key=${this.tmdbApiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`
            );
            if (!response.ok) throw new Error('Failed to search movies');
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    }

    async getMovieDetails(movieId) {
        try {
            const response = await fetch(
                `${API_CONFIG.tmdb.baseUrl}/movie/${movieId}?api_key=${this.tmdbApiKey}&language=en-US&append_to_response=videos`
            );
            if (!response.ok) throw new Error('Failed to fetch movie details');
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error;
        }
    }

    async getMovieGenres() {
        try {
            const response = await fetch(
                `${API_CONFIG.tmdb.baseUrl}/genre/movie/list?api_key=${this.tmdbApiKey}&language=en-US`
            );
            if (!response.ok) throw new Error('Failed to fetch genres');
            const data = await response.json();
            return data.genres;
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    }

    // Watchmode API call for streaming availability
    async getStreamingAvailability(tmdbId) {
        try {
            const response = await fetch(
                `${API_CONFIG.watchmode.baseUrl}/title/${tmdbId}/sources/?apiKey=${this.watchmodeApiKey}`
            );
            if (!response.ok) throw new Error('Failed to fetch streaming data');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching streaming availability:', error);
            return []; // Return empty array if failed
        }
    }

    // Helper method to get full image URL
    getImageUrl(path, size = 'w500') {
        return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/assets/images/placeholder-poster.jpg';
    }
}

// Create and export a singleton instance
const apiService = new ApiService();