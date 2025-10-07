class StorageService {
    constructor() {
        this.watchlistKey = 'cinematch_watchlist';
    }

    getWatchlist() {
        try {
            const watchlist = localStorage.getItem(this.watchlistKey);
            return watchlist ? JSON.parse(watchlist) : [];
        } catch (error) {
            console.error('Error getting watchlist from storage:', error);
            return [];
        }
    }

    addToWatchlist(movie) {
        try {
            const watchlist = this.getWatchlist();
            const existingMovie = watchlist.find(item => item.id === movie.id);
            
            if (!existingMovie) {
                watchlist.push({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average
                });
                localStorage.setItem(this.watchlistKey, JSON.stringify(watchlist));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            return false;
        }
    }

    removeFromWatchlist(movieId) {
        try {
            const watchlist = this.getWatchlist();
            const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
            localStorage.setItem(this.watchlistKey, JSON.stringify(updatedWatchlist));
            return true;
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            return false;
        }
    }

    isInWatchlist(movieId) {
        const watchlist = this.getWatchlist();
        return watchlist.some(movie => movie.id === movieId);
    }
}

const storageService = new StorageService();