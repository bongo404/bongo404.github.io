// Sample posts data
        const posts = [
            {
                id: 1,
                title: "The Godot Engine",
                category: "Hardware",
                date: "2025-09-28",
                excerpt: "Godot is completely free and open source under the MIT license.",
                link: "godotarticle.html",
                views: 2847,
                hot: true
            },
            {
                id: 2,
                title: "Writing Games in Assembly",
                category: "Programming",
                date: "2025-09-25",
                excerpt: "Learn how classic games were built with limited resources and pure assembly code.",
                link: "#",
                views: 3521,
                hot: true
            },
            {
                id: 3,
                title: "The Beauty of CRT Monitors",
                category: "Hardware",
                date: "2025-09-20",
                excerpt: "Why some gamers and enthusiasts still prefer cathode ray tube displays in 2025.",
                link: "#",
                views: 1923,
                hot: false
            },
            {
                id: 4,
                title: "DOS Command Line Tricks",
                category: "Operating Systems",
                date: "2025-09-18",
                excerpt: "Hidden DOS commands and techniques that still have relevance today.",
                link: "#",
                views: 4102,
                hot: true
            },
            {
                id: 5,
                title: "Pixel Art Animation Guide",
                category: "Gaming",
                date: "2025-09-15",
                excerpt: "Master the techniques used in classic 16-bit game animations.",
                link: "#",
                views: 1654,
                hot: false
            },
            {
                id: 6,
                title: "Building a Retro Web Terminal",
                category: "Programming",
                date: "2025-09-10",
                excerpt: "Create a browser-based terminal emulator with authentic retro styling.",
                link: "#",
                views: 2234,
                hot: false
            }
        ];

        function formatDate(dateString) {
            const date = new Date(dateString);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        }

        function createPostCard(post, showBadge = false) {
            return `
                <div class="post-card">
                    ${showBadge ? '<span class="post-badge">🔥 HOT</span>' : ''}
                    <h3>${post.title}</h3>
                    <div class="post-meta">${post.category} • ${formatDate(post.date)}</div>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="${post.link}" class="post-link">[Read More]</a>
                </div>
            `;
        }

        function renderPosts() {
            // Get hot posts (sorted by views)
            const hotPosts = posts
                .filter(p => p.hot)
                .sort((a, b) => b.views - a.views)
                .slice(0, 3);

            // Get latest posts (sorted by date)
            const latestPosts = posts
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);

            // Render hot posts
            document.getElementById('hotPosts').innerHTML = hotPosts
                .map(post => createPostCard(post, true))
                .join('');

            // Render latest posts
            document.getElementById('latestPosts').innerHTML = latestPosts
                .map(post => createPostCard(post, false))
                .join('');
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

        // Initialize on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initTheme();
                renderPosts();
            });
        } else {
            initTheme();
            renderPosts();
        }