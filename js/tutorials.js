// Sample tutorials data
        const tutorials = [
            {
                id: 1,
                title: "C Language for Beginners",
                difficulty: "beginner",
                category: "Programming",
                duration: "4 hours",
                description: "Learn the basics of C programming. No prior experience needed.",
                tags: ["C", "Programming", "Low-level"],
                chapters: [
                    "Introduction to C",
                    "Variables & Data types",
                    "Input & Output",
                    "Loops",
                    "Functions",
                    "Arrays",
                    "Pointers"
                ],
                link: "c_tutorial.html"
            },
            {
                id: 2,
                title: "Building a Retro Game in Godot",
                difficulty: "intermediate",
                category: "Game Development",
                duration: "6 hours",
                description: "Create a complete 8-bit style platformer using Godot Engine. Covers pixel art integration, retro physics, sound design, and shader effects.",
                tags: ["Godot", "Game Dev", "Pixel Art"],
                chapters: [
                    "Project Setup",
                    "Character Controller",
                    "Level Design",
                    "Enemy AI",
                    "Sound & Music",
                    "Polish & Export"
                ],
                link: "#"
            },
            {
                id: 3,
                title: "DOS Programming Fundamentals",
                difficulty: "intermediate",
                category: "Operating Systems",
                duration: "5 hours",
                description: "Explore MS-DOS programming with Turbo C. Learn to create text-based applications, work with files, and understand DOS internals.",
                tags: ["DOS", "C Programming", "Retro"],
                chapters: [
                    "DOS Environment Setup",
                    "Text Mode Graphics",
                    "File Operations",
                    "Memory Management",
                    "Building a DOS App"
                ],
                link: "#"
            },
            {
                id: 4,
                title: "CRT Monitor Restoration Guide",
                difficulty: "advanced",
                category: "Hardware",
                duration: "8 hours",
                description: "Complete guide to safely restoring vintage CRT monitors. Covers disassembly, component testing, calibration, and safety procedures. WARNING: High voltage involved.",
                tags: ["Hardware", "CRT", "Restoration"],
                chapters: [
                    "Safety First",
                    "Tools & Equipment",
                    "Disassembly Process",
                    "Component Testing",
                    "Calibration",
                    "Reassembly & Testing"
                ],
                link: "#"
            },
            {
                id: 5,
                title: "Creating Pixel Art Animations",
                difficulty: "beginner",
                category: "Art & Design",
                duration: "3 hours",
                description: "Master the art of pixel animation. Learn techniques used in classic 16-bit games to bring characters and environments to life.",
                tags: ["Pixel Art", "Animation", "Design"],
                chapters: [
                    "Pixel Art Basics",
                    "Color Theory",
                    "Animation Principles",
                    "Character Sprites",
                    "Practice Projects"
                ],
                link: "#"
            },
            {
                id: 6,
                title: "Z80 CPU Architecture Deep Dive",
                difficulty: "advanced",
                category: "Hardware",
                duration: "10 hours",
                description: "Comprehensive exploration of the Z80 microprocessor. Understand instruction sets, timing, and build a working emulator from scratch.",
                tags: ["Z80", "CPU", "Emulation"],
                chapters: [
                    "Z80 Architecture",
                    "Instruction Set",
                    "Timing & Cycles",
                    "Memory Interface",
                    "Building an Emulator",
                    "Testing & Debugging"
                ],
                link: "#"
            },
            {
                id: 7,
                title: "Retro Web Design with CSS",
                difficulty: "beginner",
                category: "Web Development",
                duration: "4 hours",
                description: "Create nostalgic web interfaces using modern CSS. Learn to implement CRT effects, scanlines, and authentic retro styling.",
                tags: ["CSS", "Web Design", "Retro"],
                chapters: [
                    "Retro Color Palettes",
                    "Typography Choices",
                    "CRT Effects",
                    "Pixel Perfect Layouts",
                    "Complete Project"
                ],
                link: "#"
            },
            {
                id: 8,
                title: "6502 Assembly Programming",
                difficulty: "intermediate",
                category: "Programming",
                duration: "7 hours",
                description: "Program the legendary 6502 processor used in the Apple II, Commodore 64, and NES. Write games and demos for vintage hardware.",
                tags: ["6502", "Assembly", "Retro"],
                chapters: [
                    "6502 Basics",
                    "Addressing Modes",
                    "Graphics & Sprites",
                    "Sound Programming",
                    "Creating a Game",
                    "Hardware Integration"
                ],
                link: "#"
            }
        ];

        let currentFilter = 'all';
        let searchQuery = '';

        function renderTutorials() {
            const list = document.getElementById('tutorialsList');
            const noTutorials = document.getElementById('noTutorials');
            
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
                noTutorials.style.display = 'block';
                return;
            } else {
                noTutorials.style.display = 'none';
            }

            // Render tutorials
            filtered.forEach(tutorial => {
                const card = document.createElement('div');
                card.className = 'tutorial-card';
                
                const chaptersHTML = tutorial.chapters.map((chapter, index) => 
                    `<li class="chapter-item"><span class="chapter-number">${index + 1}.</span>${chapter}</li>`
                ).join('');

                card.innerHTML = `
                    <div class="tutorial-info">
                        <div class="tutorial-header">
                            <h3 class="tutorial-title">${tutorial.title}</h3>
                            <span class="tutorial-difficulty ${tutorial.difficulty}">[${tutorial.difficulty.toUpperCase()}]</span>
                        </div>
                        <div class="tutorial-meta">
                            <span>📁 ${tutorial.category}</span>
                            <span>⏱️ ${tutorial.duration}</span>
                            <span>📚 ${tutorial.chapters.length} Chapters</span>
                        </div>
                        <p class="tutorial-description">${tutorial.description}</p>
                        <div class="tutorial-tags">
                            ${tutorial.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <a href="${tutorial.link}" class="tutorial-btn">[Start Tutorial]</a>
                    </div>
                    <div class="tutorial-chapters">
                        <div class="chapters-header">Chapters</div>
                        <ul class="chapters-list">
                            ${chaptersHTML}
                        </ul>
                    </div>
                `;
                list.appendChild(card);
            });
        }

        // Filter button handlers
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                renderTutorials();
            });
        });

        // Search input handler
        document.getElementById('searchInput').addEventListener('input', function(e) {
            searchQuery = e.target.value;
            renderTutorials();
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

        // Initialize on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initTheme();
                renderTutorials();
            });
        } else {
            initTheme();
            renderTutorials();
        }