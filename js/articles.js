// Updated articles.js - Loads articles from articles-index.json

let articles = [];
let currentFilter = 'all';
let currentSort = 'newest';

// Load articles from JSON file
async function loadArticles() {
    try {
        const response = await fetch('../data/articles-index.json');
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        const data = await response.json();
        articles = data.articles.filter(a => a.published); // Only show published articles
        renderArticles();
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articlesGrid').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c; grid-column: 1 / -1;">
                <h3>Error Loading Articles</h3>
                <p>Could not load articles. Please check that articles-index.json exists in the data folder.</p>
            </div>
        `;
    }
}

function renderArticles() {
    const grid = document.getElementById('articlesGrid');
    const noArticles = document.getElementById('noArticles');
    
    if (!grid) return;
    
    // Filter articles
    let filtered = articles.filter(article => 
        currentFilter === 'all' || article.category === currentFilter
    );

    // Sort articles
    filtered.sort((a, b) => {
        if (currentSort === 'newest') {
            return new Date(b.date) - new Date(a.date);
        } else if (currentSort === 'oldest') {
            return new Date(a.date) - new Date(b.date);
        } else if (currentSort === 'title') {
            return a.title.localeCompare(b.title);
        }
    });

    // Clear grid
    grid.innerHTML = '';

    if (filtered.length === 0) {
        if (noArticles) noArticles.style.display = 'block';
        return;
    } else {
        if (noArticles) noArticles.style.display = 'none';
    }

    // Render articles
    filtered.forEach(article => {
        const card = document.createElement('div');
        card.className = 'article-card';
        
        // Generate article link
        const articleLink = article.slug ? `individual-article.html?slug=${article.slug}` : '#';
        
        card.innerHTML = `
            <span class="article-category">[${article.category.toUpperCase()}]</span>
            <h3>${article.title}</h3>
            <div class="article-date">> ${formatDate(article.date)}</div>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-meta">
                ${article.readTime ? `<span class="read-time">📖 ${article.readTime}</span>` : ''}
            </div>
            <a href="${articleLink}" class="read-more">[Read Article]</a>
        `;
        grid.appendChild(card);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Filter button handlers
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-category');
            renderArticles();
        });
    });

    // Sort handler
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            renderArticles();
        });
    }

    // Load articles on page load
    loadArticles();
    
    // Initialize theme
    initTheme();
});

// Theme toggle
let isLightMode = false;

function toggleLightMode() {
    const body = document.body;
    const toggleBtn = document.querySelector('.dark-mode-toggle');
    
    if (isLightMode) {
        body.classList.remove('light-mode');
        toggleBtn.innerHTML = '[D]';
        toggleBtn.setAttribute('aria-label', 'Switch to light mode');
        localStorage.setItem('theme', 'dark');
        isLightMode = false;
    } else {
        body.classList.add('light-mode');
        toggleBtn.innerHTML = '[L]';
        toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        localStorage.setItem('theme', 'light');
        isLightMode = true;
    }
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        toggleLightMode();
    }
}

// Keyboard shortcut (Ctrl/Cmd + D)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleLightMode();
    }
});

// Initialize theme on load if DOM already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}