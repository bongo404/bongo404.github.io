// individual-article.js - Loads and displays individual articles

let currentArticle = null;
let allArticles = [];

// Get article slug from URL
function getArticleSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
}

// Load all articles index for related articles
async function loadArticlesIndex() {
    try {
        const response = await fetch('../data/articles-index.json');
        if (!response.ok) throw new Error('Failed to load articles index');
        const data = await response.json();
        allArticles = data.articles;
    } catch (error) {
        console.error('Error loading articles index:', error);
    }
}

// Load individual article
async function loadArticle(slug) {
    try {
        const response = await fetch(`../data/articles/${slug}.json`);
        if (!response.ok) {
            throw new Error('Article not found');
        }
        const data = await response.json();
        currentArticle = data.article;
        
        // Update page title
        document.title = `${currentArticle.title} - Bongo404`;
        
        renderArticle();
        generateTableOfContents();
        loadRelatedArticles();
        
    } catch (error) {
        console.error('Error loading article:', error);
        showError();
    }
}

// Render the article
function renderArticle() {
    const container = document.getElementById('articleContainer');
    const loadingState = document.getElementById('loadingState');
    
    if (!currentArticle) return;
    
    // Hide loading, show article
    loadingState.style.display = 'none';
    container.style.display = 'block';
    
    // Set header information
    document.getElementById('categoryBadge').innerHTML = `[${currentArticle.category.toUpperCase()}]`;
    document.getElementById('articleTitle').textContent = currentArticle.title;
    document.getElementById('articleDate').innerHTML = `> ${formatDate(currentArticle.date)}`;
    document.getElementById('articleAuthor').innerHTML = `✍️ ${currentArticle.author}`;
    document.getElementById('articleReadTime').innerHTML = `📖 ${currentArticle.readTime}`;
    
    // Set tags
    const tagsContainer = document.getElementById('articleTags');
    tagsContainer.innerHTML = currentArticle.tags.map(tag => 
        `<span class="tag">${tag}</span>`
    ).join('');
    
    // Set featured image if exists
    if (currentArticle.featuredImage) {
        const imgContainer = document.getElementById('featuredImageContainer');
        const img = document.getElementById('featuredImage');
        img.src = currentArticle.featuredImage;
        img.alt = currentArticle.title;
        imgContainer.style.display = 'block';
    }
    
    // Render content
    renderContent();
}

// Render article content blocks
function renderContent() {
    const body = document.getElementById('articleBody');
    body.innerHTML = '';
    
    currentArticle.content.forEach((block, index) => {
        const element = createContentBlock(block, index);
        if (element) {
            body.appendChild(element);
        }
    });
}

// Create content block based on type
function createContentBlock(block, index) {
    let element;
    
    switch (block.type) {
        case 'paragraph':
            element = document.createElement('p');
            element.textContent = block.text;
            break;
            
        case 'heading':
            element = document.createElement(`h${block.level}`);
            element.textContent = block.text;
            element.id = `heading-${index}`;
            break;
            
        case 'list':
            element = document.createElement('ul');
            block.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                element.appendChild(li);
            });
            break;
            
        case 'image':
            element = document.createElement('figure');
            element.className = 'article-image';
            const img = document.createElement('img');
            img.src = block.src;
            img.alt = block.alt;
            element.appendChild(img);
            if (block.caption) {
                const caption = document.createElement('figcaption');
                caption.textContent = block.caption;
                element.appendChild(caption);
            }
            break;
            
        case 'code':
            element = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${block.language || 'text'}`;
            code.textContent = block.code;
            element.appendChild(code);
            break;
            
        default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
    }
    
    return element;
}

// Generate table of contents from headings
function generateTableOfContents() {
    const tocList = document.getElementById('tocList');
    const tocContainer = document.getElementById('tocContainer');
    
    const headings = currentArticle.content.filter(block => block.type === 'heading');
    
    if (headings.length === 0) return;
    
    tocList.innerHTML = '';
    
    headings.forEach((heading, index) => {
        const li = document.createElement('li');
        li.className = `toc-level-${heading.level}`;
        const link = document.createElement('a');
        link.href = `#heading-${currentArticle.content.indexOf(heading)}`;
        link.textContent = heading.text;
        li.appendChild(link);
        tocList.appendChild(li);
    });
    
    tocContainer.style.display = 'block';
}

// Load and display related articles
async function loadRelatedArticles() {
    if (!currentArticle.relatedArticles || currentArticle.relatedArticles.length === 0) {
        return;
    }
    
    const relatedContainer = document.getElementById('relatedArticles');
    const relatedGrid = document.getElementById('relatedArticlesGrid');
    
    const relatedArticlesData = allArticles.filter(article => 
        currentArticle.relatedArticles.includes(article.id)
    );
    
    if (relatedArticlesData.length === 0) return;
    
    relatedGrid.innerHTML = '';
    
    relatedArticlesData.forEach(article => {
        const card = document.createElement('div');
        card.className = 'related-article-card';
        card.innerHTML = `
            <span class="article-category">[${article.category.toUpperCase()}]</span>
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <a href="individual-article.html?slug=${article.slug}" class="read-more">[Read Article]</a>
        `;
        relatedGrid.appendChild(card);
    });
    
    relatedContainer.style.display = 'block';
}

// Show error state
function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

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

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    initTheme();
    
    const slug = getArticleSlug();
    
    if (!slug) {
        showError();
        return;
    }
    
    await loadArticlesIndex();
    await loadArticle(slug);
});