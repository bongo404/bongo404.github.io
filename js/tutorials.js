// Updated tutorials.js - Loads tutorials from tutorials-index.json

let tutorials = [];
let currentFilter = 'all';
let searchQuery = '';

// Load tutorials from JSON file
async function loadTutorials() {
    try {
        const response = await fetch('../data/tutorials-index.json');
        if (!response.ok) {
            throw new Error('Failed to load tutorials');
        }
        const data = await response.json();
        tutorials = data.tutorials.filter(t => t.published); // Only show published tutorials
        renderTutorials();
    } catch (error) {
        console.error('Error loading tutorials:', error);
        document.getElementById('tutorialsList').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <h3>Error Loading Tutorials</h3>
                <p>Could not load tutorials. Please check that tutorials-index.json exists in the data folder.</p>
            </div>
        `;
    }
}

// Get the plural label based on tutorial type
function getPluralLabel(tutorial) {
    return tutorial.type === 'levels' ? 'Levels' : 'Chapters';
}

function renderTutorials() {
    const list = document.getElementById('tutorialsList');
    const noTutorials = document.getElementById('noTutorials');
    
    if (!list) return;
    
    // Filter tutorials by difficulty
    let filtered = tutorials.filter(tutorial => 
        currentFilter === 'all' || tutorial.difficulty === currentFilter
    );

    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(tutorial => 
            tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    // Clear list
    list.innerHTML = '';

    if (filtered.length === 0) {
        if (noTutorials) noTutorials.style.display = 'block';
        return;
    } else {
        if (noTutorials) noTutorials.style.display = 'none';
    }

    // Render tutorials
    filtered.forEach(tutorial => {
        const card = document.createElement('div');
        card.className = 'tutorial-card';
        
        const chaptersHTML = generateChaptersList(tutorial);
        const pluralLabel = getPluralLabel(tutorial);

        card.innerHTML = `
            <div class="tutorial-info">
                <div class="tutorial-header">
                    <h3 class="tutorial-title">${tutorial.title}</h3>
                    <span class="tutorial-difficulty ${tutorial.difficulty}">[${tutorial.difficulty.toUpperCase()}]</span>
                </div>
                <div class="tutorial-meta">
                    <span>📁 ${tutorial.category}</span>
                    <span>⏱️ ${tutorial.duration}</span>
                    <span>📚 ${tutorial.totalChapters} ${pluralLabel}</span>
                </div>
                <p class="tutorial-description">${tutorial.description}</p>
                <div class="tutorial-tags">
                    ${tutorial.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="tutorial.html?id=${tutorial.id}" class="tutorial-btn">[Start Tutorial]</a>
            </div>
            ${chaptersHTML}
        `;
        list.appendChild(card);
    });
}

// Generate chapters/levels list
// Generate chapters/levels list with max 8 items
function generateChaptersList(tutorial) {
    const label = tutorial.type === 'levels' ? 'Level' : 'Chapter';
    const pluralLabel = getPluralLabel(tutorial);
    const maxDisplay = 8;
    
    // Generate chapter/level numbers
    const chapters = [];
    const totalToGenerate = Math.min(tutorial.totalChapters, maxDisplay);
    
    for (let i = (tutorial.type === 'levels' ? 0 : 1); i < (tutorial.type === 'levels' ? totalToGenerate : totalToGenerate + 1); i++) {
        chapters.push(`${label} ${i}`);
    }
    
    const chaptersHTML = chapters.map((chapter, index) => {
        const num = tutorial.type === 'levels' ? index : index + 1;
        return `<li class="chapter-item"><span class="chapter-number">${num}.</span>${chapter}</li>`;
    }).join('');

    // Add ellipsis if there are more chapters
    const ellipsisHTML = tutorial.totalChapters > maxDisplay 
        ? '<li class="chapter-item chapter-ellipsis">...</li>' 
        : '';

    return `
        <div class="tutorial-chapters">
            <div class="chapters-header">${pluralLabel}</div>
            <ul class="chapters-list">
                ${chaptersHTML}
                ${ellipsisHTML}
            </ul>
        </div>
    `;
}

// Filter button handlers
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderTutorials();
        });
    });

    // Search input handler
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value;
            renderTutorials();
        });
    }

    // Load tutorials on page load
    loadTutorials();
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

// Initialize theme on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}