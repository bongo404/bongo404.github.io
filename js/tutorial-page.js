// Tutorial page JavaScript - Dynamically loads and renders tutorial content

// Get tutorial ID from URL parameter
function getTutorialId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load tutorial data from JSON file
async function loadTutorialData(tutorialId) {
    try {
        const response = await fetch(`../data/${tutorialId}.json`);
        if (!response.ok) {
            throw new Error('Tutorial not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading tutorial:', error);
        return null;
    }
}

// Get the label (Chapter or Level) based on tutorial type
function getLabel(tutorial) {
    return tutorial.type === 'levels' ? 'Level' : 'Chapter';
}

// Get the plural label (Chapters or Levels)
function getPluralLabel(tutorial) {
    return tutorial.type === 'levels' ? 'Levels' : 'Chapters';
}

// Render tutorial metadata
function renderMetadata(tutorial) {
    const titleElement = document.getElementById('tutorialTitle');
    const metaElement = document.getElementById('tutorialMeta');
    const introElement = document.getElementById('tutorialIntro');
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');
    const pageTitle = document.getElementById('pageTitle');

    if (titleElement) titleElement.textContent = tutorial.title;
    if (breadcrumbTitle) breadcrumbTitle.textContent = tutorial.title;
    if (pageTitle) pageTitle.textContent = `${tutorial.title} - Bongo404`;

    if (metaElement) {
        const difficultyIcon = tutorial.difficulty === 'beginner' ? '📚' : 
                               tutorial.difficulty === 'intermediate' ? '📖' : '🎓';
        
        const pluralLabel = getPluralLabel(tutorial);
        
        metaElement.innerHTML = `
            <span>${difficultyIcon} ${tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}</span>
            <span>⏱️ ${tutorial.duration}</span>
            <span>📑 ${tutorial.totalChapters} ${pluralLabel}</span>
            <span>💻 ${tutorial.category}</span>
        `;
    }

    if (introElement) {
        introElement.textContent = tutorial.description;
    }
}

// Render chapter/level navigation in sidebar
function renderChapterNav(tutorial) {
    const navElement = document.getElementById('chapterNav');
    if (!navElement) return;

    const label = getLabel(tutorial);
    const chapters = tutorial.chapters;

    navElement.innerHTML = chapters.map(chapter => `
        <li>
            <a href="#${chapter.id}" class="chapter-link" data-chapter="${chapter.number}">
                ${label} ${chapter.number}: ${chapter.title}
            </a>
        </li>
    `).join('');

    // Add smooth scrolling to chapter links
    document.querySelectorAll('.chapter-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Render content block based on type
function renderContentBlock(block) {
    switch(block.type) {
        case 'paragraph':
        case 'text':
            return `<p>${block.text || block.content}</p>`;
        
        case 'code':
            return `
                <div class="code-block" data-lang="${block.language}">
                    <button class="copy-code-btn" onclick="copyCode(this)">COPY</button>
                    <code>${escapeHtml(block.code)}</code>
                </div>
            `;
        
        case 'info-box':
        case 'info':
            return `
                <div class="info-box">
                    <div class="info-box-title">${block.title}</div>
                    ${block.items.map(item => `<p>${item}</p>`).join('')}
                </div>
            `;
        
        case 'exercise':
            return `
                <div class="exercise-box">
                    <div class="exercise-title">${block.title}</div>
                    <p>${block.text || block.content}</p>
                </div>
            `;
        
        default:
            return '';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render all chapters/levels
function renderChapters(tutorial) {
    const container = document.getElementById('chaptersContainer');
    if (!container) return;

    const label = getLabel(tutorial);
    const chapters = tutorial.chapters;

    container.innerHTML = chapters.map(chapter => `
        <section class="chapter-section" id="${chapter.id}">
            <h3 class="chapter-title">${label} ${chapter.number}: ${chapter.title}</h3>
            <div class="chapter-content">
                ${chapter.content.map(block => renderContentBlock(block)).join('')}
            </div>
        </section>
    `).join('');
}

// Update active chapter in navigation based on scroll position
function updateActiveChapter() {
    const chapters = document.querySelectorAll('.chapter-section');
    const links = document.querySelectorAll('.chapter-link');
    
    let activeChapter = null;
    
    chapters.forEach(chapter => {
        const rect = chapter.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            activeChapter = chapter.id;
        }
    });
    
    links.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === activeChapter) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Copy code functionality
function copyCode(button) {
    const codeBlock = button.nextElementSibling;
    const codeText = codeBlock.textContent;
    
    const textarea = document.createElement('textarea');
    textarea.value = codeText;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        const originalText = button.textContent;
        button.textContent = 'COPIED!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        button.textContent = 'FAILED';
        setTimeout(() => {
            button.textContent = 'COPY';
        }, 2000);
    }
    
    document.body.removeChild(textarea);
}

// Sidebar toggle functionality
let isSidebarOpen = true;

function toggleSidebar() {
    const container = document.querySelector('.container');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    if (isSidebarOpen) {
        // Close sidebar
        container.classList.add('sidebar-closed');
        toggleBtn.innerHTML = '[☰]';
        toggleBtn.setAttribute('aria-label', 'Open sidebar');
        localStorage.setItem('sidebarState', 'closed');
        isSidebarOpen = false;
    } else {
        // Open sidebar
        container.classList.remove('sidebar-closed');
        toggleBtn.innerHTML = '[✕]';
        toggleBtn.setAttribute('aria-label', 'Close sidebar');
        localStorage.setItem('sidebarState', 'open');
        isSidebarOpen = true;
    }
}

// Initialize sidebar state
function initSidebarState() {
    const savedState = localStorage.getItem('sidebarState');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    
    if (savedState === 'closed') {
        toggleSidebar();
    } else {
        // Default to open, set button text accordingly
        if (toggleBtn) {
            toggleBtn.innerHTML = '[✕]';
        }
    }
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + D for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleLightMode();
    }
    
    // Ctrl/Cmd + B for sidebar toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
    }
});

// Add these functions to tutorial-page.js

// Bookmarks system
let bookmarks = [];
const MAX_BOOKMARKS = 10;
const BOOKMARKS_KEY = 'tutorial-bookmarks-';

// Toggle bookmarks panel
function toggleBookmarksPanel() {
    const panel = document.getElementById('bookmarksPanel');
    panel.classList.toggle('active');
}

// Load bookmarks from localStorage
function loadBookmarks(tutorialId) {
    const saved = localStorage.getItem(BOOKMARKS_KEY + tutorialId);
    if (saved) {
        bookmarks = JSON.parse(saved);
        updateBookmarksUI();
    }
}

// Save bookmarks to localStorage
function saveBookmarks(tutorialId) {
    localStorage.setItem(BOOKMARKS_KEY + tutorialId, JSON.stringify(bookmarks));
}

// Add bookmark
function addBookmark(chapterId, chapterTitle) {
    const tutorialId = getTutorialId();
    
    // Check if already bookmarked
    const existingIndex = bookmarks.findIndex(b => b.id === chapterId);
    if (existingIndex !== -1) {
        // Remove bookmark
        bookmarks.splice(existingIndex, 1);
        saveBookmarks(tutorialId);
        updateBookmarksUI();
        return;
    }
    
    // Check max bookmarks
    if (bookmarks.length >= MAX_BOOKMARKS) {
        alert(`Maximum ${MAX_BOOKMARKS} bookmarks reached. Please delete a bookmark first.`);
        return;
    }
    
    // Add new bookmark
    bookmarks.push({
        id: chapterId,
        title: chapterTitle,
        timestamp: Date.now()
    });
    
    saveBookmarks(tutorialId);
    updateBookmarksUI();
}

// Delete bookmark
function deleteBookmark(chapterId) {
    const tutorialId = getTutorialId();
    bookmarks = bookmarks.filter(b => b.id !== chapterId);
    saveBookmarks(tutorialId);
    updateBookmarksUI();
}

// Go to bookmark
function goToBookmark(chapterId) {
    const element = document.getElementById(chapterId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toggleBookmarksPanel(); // Close panel after navigation
    }
}

// Update bookmarks UI
function updateBookmarksUI() {
    const list = document.getElementById('bookmarksList');
    const count = document.getElementById('bookmarksCount');
    
    // Update count
    count.textContent = `${bookmarks.length} / ${MAX_BOOKMARKS} bookmarks`;
    
    // Update list
    if (bookmarks.length === 0) {
        list.innerHTML = '<p class="no-bookmarks">No bookmarks yet. Click "Add Bookmark" button next to any section to save your place!</p>';
    } else {
        list.innerHTML = bookmarks.map(bookmark => `
            <div class="bookmark-item">
                <div class="bookmark-title" onclick="goToBookmark('${bookmark.id}')">${bookmark.title}</div>
                <button class="bookmark-delete" onclick="deleteBookmark('${bookmark.id}')">[X]</button>
            </div>
        `).join('');
    }
    
    // Update add bookmark buttons
    updateBookmarkButtons();
}

// Update bookmark buttons state
function updateBookmarkButtons() {
    document.querySelectorAll('.add-bookmark-btn').forEach(btn => {
        const chapterId = btn.getAttribute('data-chapter-id');
        const isBookmarked = bookmarks.some(b => b.id === chapterId);
        
        if (isBookmarked) {
            btn.classList.add('bookmarked');
            btn.textContent = '[★ Bookmarked]';
        } else {
            btn.classList.remove('bookmarked');
            btn.textContent = '[+ Bookmark]';
        }
    });
}

// Add bookmark buttons to chapters
function addBookmarkButtons() {
    const chapters = document.querySelectorAll('.chapter-section');
    
    chapters.forEach(chapter => {
        const title = chapter.querySelector('.chapter-title');
        const chapterId = chapter.id;
        const chapterText = title.textContent;
        
        // Check if button already exists
        if (title.querySelector('.add-bookmark-btn')) return;
        
        // Create bookmark button
        const btn = document.createElement('button');
        btn.className = 'add-bookmark-btn';
        btn.setAttribute('data-chapter-id', chapterId);
        btn.textContent = '[+ Bookmark]';
        btn.onclick = () => addBookmark(chapterId, chapterText);
        
        title.appendChild(btn);
    });
    
    updateBookmarkButtons();
}

// Keyboard shortcut (Ctrl/Cmd + M) to toggle bookmarks panel
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        toggleBookmarksPanel();
    }
});

// Notes functionality (stored in localStorage per tutorial)
let notesContent = '';
const notesKey = 'tutorial-notes-';

function initNotes(tutorialId) {
    const notesTextarea = document.getElementById('tutorialNotes');
    
    if (notesTextarea) {
        // Try to load notes for this specific tutorial
        const savedNotes = localStorage.getItem(notesKey + tutorialId);
        if (savedNotes) {
            notesContent = savedNotes;
            notesTextarea.value = savedNotes;
        }

        // Save notes as user types
        notesTextarea.addEventListener('input', function(e) {
            notesContent = e.target.value;
            localStorage.setItem(notesKey + tutorialId, notesContent);
        });
    }
}

function clearNotes() {
    if (confirm('Are you sure you want to clear all notes?')) {
        const tutorialId = getTutorialId();
        notesContent = '';
        document.getElementById('tutorialNotes').value = '';
        localStorage.removeItem(notesKey + tutorialId);
    }
}

// Scroll to top function
function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show error message
function showError(message) {
    const container = document.getElementById('chaptersContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${message}
                <br><br>
                <a href="tutorials.html" class="nav-btn">[← Back to Tutorials]</a>
            </div>
        `;
    }
}

// Show loading message
function showLoading() {
    const container = document.getElementById('chaptersContainer');
    if (container) {
        container.innerHTML = '<div class="loading-message">Loading tutorial...</div>';
    }
}

// Main initialization
// Replace the init() function in tutorial-page.js with this:

// Replace the init() function in tutorial-page.js with this:

async function init() {
    const tutorialId = getTutorialId();
    
    if (!tutorialId) {
        showError('No tutorial ID specified in URL. Please select a tutorial from the tutorials page.');
        return;
    }

    showLoading();
    
    const tutorialData = await loadTutorialData(tutorialId);
    
    if (!tutorialData) {
        showError('Tutorial not found. The tutorial may have been moved or deleted.');
        return;
    }

    // Render all components
    renderMetadata(tutorialData);
    renderChapterNav(tutorialData);
    renderChapters(tutorialData);
    
    // Initialize features
    initTheme();
    initNotes(tutorialId);
    initSidebarState();
    
    // Initialize bookmarks system
    addBookmarkButtons();
    loadBookmarks(tutorialId);
    
    // Initialize highlighter system
    loadHighlights(tutorialId);
    
    // Set up scroll listener for active chapter highlighting
    window.addEventListener('scroll', updateActiveChapter);
    window.addEventListener('load', updateActiveChapter);
}

// Highlighter system
let isHighlighterActive = false;
let highlights = [];
const HIGHLIGHTS_KEY = 'tutorial-highlights-';

// Toggle highlighter mode
function toggleHighlighter() {
    isHighlighterActive = !isHighlighterActive;
    const btn = document.querySelector('.highlighter-toggle');
    
    if (isHighlighterActive) {
        document.body.classList.add('highlighter-active');
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Disable highlighter');
        enableHighlighting();
    } else {
        document.body.classList.remove('highlighter-active');
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Enable highlighter');
        disableHighlighting();
    }
}

// Enable text highlighting
function enableHighlighting() {
    document.addEventListener('mouseup', handleTextSelection);
}

// Disable text highlighting
function disableHighlighting() {
    document.removeEventListener('mouseup', handleTextSelection);
}

// Handle text selection
function handleTextSelection(e) {
    if (!isHighlighterActive) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length === 0) return;
    
    // Get the range
    const range = selection.getRangeAt(0);
    
    // Check if selection is within allowed content areas
    const container = range.commonAncestorContainer;
    const parentElement = container.nodeType === 3 ? container.parentNode : container;
    
    const allowedContainers = [
        '.chapter-content',
        '.tutorial-intro',
        '.info-box',
        '.exercise-box'
    ];
    
    let isAllowed = false;
    for (const selector of allowedContainers) {
        if (parentElement.closest(selector)) {
            isAllowed = true;
            break;
        }
    }
    
    if (!isAllowed) return;
    
    // Don't highlight if already highlighted
    if (parentElement.classList.contains('highlighted-text')) return;
    
    // Create highlight
    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'highlighted-text';
    highlightSpan.setAttribute('data-highlight-id', Date.now());
    
    try {
        range.surroundContents(highlightSpan);
        
        // Save highlight
        const tutorialId = getTutorialId();
        saveHighlight(tutorialId, {
            id: highlightSpan.getAttribute('data-highlight-id'),
            text: selectedText,
            timestamp: Date.now()
        });
        
        // Add click to remove
        highlightSpan.addEventListener('click', function(event) {
            if (event.target === this) {
                removeHighlight(this);
            }
        });
        
        // Clear selection
        selection.removeAllRanges();
    } catch (err) {
        console.warn('Could not highlight complex selection:', err);
    }
}

// Save highlight to localStorage
function saveHighlight(tutorialId, highlight) {
    highlights.push(highlight);
    localStorage.setItem(HIGHLIGHTS_KEY + tutorialId, JSON.stringify(highlights));
}

// Load highlights from localStorage
function loadHighlights(tutorialId) {
    const saved = localStorage.getItem(HIGHLIGHTS_KEY + tutorialId);
    if (saved) {
        highlights = JSON.parse(saved);
        restoreHighlights();
    }
}

// Restore highlights (basic restoration - works for simple text)
function restoreHighlights() {
    // Note: This is a simplified restoration that works for most cases
    // For complex selections, highlights may not restore perfectly
    const contentAreas = document.querySelectorAll('.chapter-content, .tutorial-intro, .info-box, .exercise-box');
    
    highlights.forEach(highlight => {
        contentAreas.forEach(area => {
            if (area.textContent.includes(highlight.text)) {
                // Mark that we've attempted to restore this
                // In a production app, you'd want more sophisticated text matching
            }
        });
    });
}

// Remove highlight
function removeHighlight(element) {
    const highlightId = element.getAttribute('data-highlight-id');
    const tutorialId = getTutorialId();
    
    // Remove from array
    highlights = highlights.filter(h => h.id !== highlightId);
    localStorage.setItem(HIGHLIGHTS_KEY + tutorialId, JSON.stringify(highlights));
    
    // Remove highlight span, keep text
    const parent = element.parentNode;
    while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
    
    // Normalize text nodes
    parent.normalize();
}

// Clear all highlights
function clearAllHighlights() {
    if (!confirm('Are you sure you want to clear all highlights?')) return;
    
    const tutorialId = getTutorialId();
    highlights = [];
    localStorage.removeItem(HIGHLIGHTS_KEY + tutorialId);
    
    // Remove all highlight spans
    document.querySelectorAll('.highlighted-text').forEach(el => {
        const parent = el.parentNode;
        while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
        parent.normalize();
    });
}

// Keyboard shortcut (Ctrl/Cmd + H) to toggle highlighter
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        toggleHighlighter();
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}