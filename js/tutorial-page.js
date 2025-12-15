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

// Notes functionality (stored in memory during session)
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
    
    // Initialize theme and notes
    initTheme();
    initNotes(tutorialId);
    
    // Set up scroll listener for active chapter highlighting
    window.addEventListener('scroll', updateActiveChapter);
    window.addEventListener('load', updateActiveChapter);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}