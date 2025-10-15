// API Configuration
const API_CONFIG = {
    tmdb: {
        baseUrl: 'https://api.themoviedb.org/3',
        apiKey: '243af5d207d7f0b2fd1537cf01d57b5e', // https://www.themoviedb.org/settings/api
        imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
    }
};

// Use mock data for now to test
class ApiService {
    constructor() {
        this.tmdbApiKey = API_CONFIG.tmdb.apiKey;
    }

    async fetchPopularMovies() {
        console.log('Using mock data for testing');
        return this.getMockMovies();
    }

    // Mock data for testing
    getMockMovies() {
        const mockMovies = [
            {
                id: 278,
                title: "The Shawshank Redemption",
                poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                release_date: "1994-09-23",
                vote_average: 9.3,
                genre_ids: [18, 80]
            },
            {
                id: 238, 
                title: "The Godfather",
                poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                release_date: "1972-03-14",
                vote_average: 9.2,
                genre_ids: [18, 80]
            },
            {
                id: 155,
                title: "The Dark Knight",
                poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                release_date: "2008-07-18",
                vote_average: 9.0,
                genre_ids: [28, 80, 18]
            }
        ];
        
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Mock movies loaded:', mockMovies.length);
                resolve(mockMovies);
            }, 1000);
        });
    }

    async searchMovies(query) {
        console.log('Search for:', query);
        return this.getMockMovies();
    }

    async getMovieDetails(movieId) {
        console.log('Getting details for movie:', movieId);
        return {
            id: movieId,
            title: "Sample Movie",
            overview: "This is a sample movie overview for testing purposes.",
            poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            release_date: "2023-01-01",
            runtime: 120,
            vote_average: 8.5,
            genres: [{id: 18, name: "Drama"}],
            videos: {
                results: [
                    {
                        key: "dQw4w9WgXcQ",
                        type: "Trailer",
                        site: "YouTube"
                    }
                ]
            }
        };
    }

    async getMovieGenres() {
        console.log('Getting genres...');
        return [
            {id: 28, name: "Action"},
            {id: 12, name: "Adventure"},
            {id: 35, name: "Comedy"},
            {id: 18, name: "Drama"},
            {id: 14, name: "Fantasy"}
        ];
    }

    async getStreamingAvailability(tmdbId) {
        console.log('Getting streaming for:', tmdbId);
        return [
            {name: "Netflix", type: "subscription"},
            {name: "Prime Video", type: "rent"}
        ];
    }

    getImageUrl(path, size = 'w500') {
        if (path && !path.startsWith('http')) {
            return `https://image.tmdb.org/t/p/${size}${path}`;
        }
        return path || './assets/images/placeholder-poster.jpg';
    }

    getTrailerKey(movieDetails) {
        if (movieDetails.videos && movieDetails.videos.results) {
            const trailer = movieDetails.videos.results.find(
                video => video.type === 'Trailer' && video.site === 'YouTube'
            );
            return trailer ? trailer.key : "dQw4w9WgXcQ";
        }
        return "dQw4w9WgXcQ";
    }
}
const apiService = new ApiService();