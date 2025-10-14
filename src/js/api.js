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

    async getStreamingAvailability(tmdbId) {
        if (!this.watchmodeApiKey || this.watchmodeApiKey === 'YOUR_WATCHMODE_API_KEY_HERE') {
            console.log('Watchmode API key not configured, returning mock streaming data');
            return this.getMockStreamingData();
        }

        try {
            const response = await fetch(
                `${API_CONFIG.watchmode.baseUrl}/title/${tmdbId}/sources/?apiKey=${this.watchmodeApiKey}`
            );
            if (!response.ok) throw new Error('Failed to fetch streaming data');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching streaming availability:', error);
            return this.getMockStreamingData(); // Fallback to mock data
        }
    }

    // Mock streaming data for demo purposes
    getMockStreamingData() {
        const services = ['Netflix', 'Disney+', 'HBO Max', 'Prime Video', 'Hulu'];
        const types = ['subscription', 'rent', 'buy'];
        const mockData = [];

        // Randomly select 2-3 streaming services
        const selectedServices = services
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 2) + 2);

        selectedServices.forEach(service => {
            mockData.push({
                name: service,
                type: types[Math.floor(Math.random() * types.length)]
            });
        });

        return mockData;
    }

    // Helper method to get full image URL
    getImageUrl(path, size = 'w500') {
        return path ? `https://image.tmdb.org/t/p/${size}${path}` : './assets/images/placeholder-poster.jpg';
    }

    // Helper to get YouTube trailer key
    getTrailerKey(movieDetails) {
        if (movieDetails.videos && movieDetails.videos.results) {
            const trailer = movieDetails.videos.results.find(
                video => video.type === 'Trailer' && video.site === 'YouTube'
            );
            return trailer ? trailer.key : null;
        }
        return null;
    }
}

// Create and export a singleton instance
const apiService = new ApiService();