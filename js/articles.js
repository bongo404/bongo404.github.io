// Sample articles data
        const articles = [
            {
                id: 1,
                title: "Restoring a 1984 IBM PC",
                category: "hardware",
                date: "2025-09-15",
                excerpt: "Journey through the restoration of a classic IBM PC, from cleaning to getting it boot-ready. Discover the challenges and triumphs of bringing vintage tech back to life.",
                link: "#"
            },
            {
                id: 2,
                title: "Assembly Language Basics",
                category: "programming",
                date: "2025-09-01",
                excerpt: "Learn the fundamentals of x86 assembly programming. Understanding low-level operations helps appreciate modern abstractions.",
                link: "#"
            },
            {
                id: 3,
                title: "The DOS Gaming Golden Age",
                category: "gaming",
                date: "2025-08-20",
                excerpt: "Exploring the games that defined a generation. From Commander Keen to DOOM, DOS gaming pushed boundaries and created legends.",
                link: "#"
            },
            {
                id: 4,
                title: "Windows 95 Interface Design",
                category: "os",
                date: "2025-08-05",
                excerpt: "The revolutionary UI that changed computing forever. How Windows 95's design principles still influence modern interfaces.",
                link: "#"
            },
            {
                id: 5,
                title: "CRT Monitors: Beauty in Scanlines",
                category: "hardware",
                date: "2025-07-22",
                excerpt: "Why some gamers still prefer CRT displays. The technical advantages and nostalgic appeal of cathode ray tube technology.",
                link: "#"
            },
            {
                id: 6,
                title: "Writing a Text Editor in C",
                category: "programming",
                date: "2025-07-10",
                excerpt: "Building a terminal-based text editor from scratch. Learn about buffer management, terminal control, and efficient text manipulation.",
                link: "#"
            },
            {
                id: 7,
                title: "Pixel Art Techniques",
                category: "gaming",
                date: "2025-06-28",
                excerpt: "Master the art of pixel-perfect graphics. Techniques used by classic game developers to create stunning visuals within tight constraints.",
                link: "#"
            },
            {
                id: 8,
                title: "Linux Kernel 0.01 Analysis",
                category: "os",
                date: "2025-06-15",
                excerpt: "Reading through Linus Torvalds' original Linux kernel code. What can we learn from the humble beginnings of a OS revolution?",
                link: "#"
            }
        ];

        let currentFilter = 'all';
        let currentSort = 'newest';

        function renderArticles() {
            const grid = document.getElementById('articlesGrid');
            const noArticles = document.getElementById('noArticles');
            
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
                noArticles.style.display = 'block';
                return;
            } else {
                noArticles.style.display = 'none';
            }

            // Render articles
            filtered.forEach(article => {
                const card = document.createElement('div');
                card.className = 'article-card';
                card.innerHTML = `
                    <span class="article-category">[${article.category.toUpperCase()}]</span>
                    <h3>${article.title}</h3>
                    <div class="article-date">> ${formatDate(article.date)}</div>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <a href="${article.link}" class="read-more">[Read Article]</a>
                `;
                grid.appendChild(card);
            });
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        }

        // Filter button handlers
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-category');
                renderArticles();
            });
        });

        // Sort handler
        document.getElementById('sortSelect').addEventListener('change', function() {
            currentSort = this.value;
            renderArticles();
        });

        // Theme toggle (same as main page)
        let isLightMode = false;

        function toggleLightMode() {
            const body = document.body;
            const toggleBtn = document.querySelector('.dark-mode-toggle');
            
            if (isLightMode) {
                body.classList.remove('light-mode');
                toggleBtn.innerHTML = '[D]';
                toggleBtn.setAttribute('aria-label', 'Switch to light mode');
                isLightMode = false;
            } else {
                body.classList.add('light-mode');
                toggleBtn.innerHTML = '[L]';
                toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
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

        // Initialize on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initTheme();
                renderArticles();
            });
        } else {
            initTheme();
            renderArticles();
        }