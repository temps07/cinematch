class EventService {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                const event = new CustomEvent('searchRequested', { detail: query });
                document.dispatchEvent(event);
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        // Filter toggle
        const filterToggle = document.getElementById('filter-toggle');
        const filtersPanel = document.getElementById('filters-panel');
        
        filterToggle.addEventListener('click', () => {
            const isVisible = filtersPanel.style.display === 'grid';
            filtersPanel.style.display = isVisible ? 'none' : 'grid';
            filterToggle.textContent = isVisible ? 'Filters' : 'Hide Filters';
        });

        // Modal close
        const closeBtn = document.querySelector('.close-btn');
        const modal = document.getElementById('movie-modal');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Dispatch navigation event
                const event = new CustomEvent('navigationChanged', { detail: page });
                document.dispatchEvent(event);
            });
        });
    }
}

const eventService = new EventService();