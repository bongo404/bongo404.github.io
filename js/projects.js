 // Sample projects data
        const projects = [
            {
                id: 1,
                title: "Retro Terminal Emulator",
                status: "completed",
                category: "Web Development",
                year: "2025",
                description: "A browser-based terminal emulator with authentic CRT effects, scanlines, and phosphor glow. Built with vanilla JavaScript and CSS animations for maximum nostalgia.",
                tech: ["JavaScript", "CSS3", "Canvas API"],
                image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop",
                github: "#",
                demo: "#"
            },
            {
                id: 2,
                title: "8-Bit Sprite Editor",
                status: "in-progress",
                category: "Game Dev Tools",
                year: "2025",
                description: "Pixel art editor designed for creating retro game sprites. Features include onion skinning, animation preview, palette management, and export to multiple formats.",
                tech: ["React", "TypeScript", "Canvas"],
                image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
                github: "#",
                demo: null
            },
            {
                id: 3,
                title: "DOS Game Collection",
                status: "completed",
                category: "Gaming",
                year: "2024",
                description: "Curated collection of classic DOS games running in browser via DOSBox. Includes save states, keyboard remapping, and mobile touch controls.",
                tech: ["DOSBox", "JavaScript", "WebAssembly"],
                image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
                github: "#",
                demo: "#"
            },
            {
                id: 4,
                title: "Assembly Language Tutorial Series",
                status: "in-progress",
                category: "Education",
                year: "2025",
                description: "Interactive tutorial series teaching x86 assembly programming from scratch. Features a built-in assembler and step-by-step debugger for learning.",
                tech: ["x86 Assembly", "C++", "Web Components"],
                image: null,
                github: "#",
                demo: "#"
            },
            {
                id: 5,
                title: "Godot Retro Shader Pack",
                status: "completed",
                category: "Game Development",
                year: "2024",
                description: "Collection of retro visual effects for Godot Engine including CRT filters, dithering, color reduction, and scanline effects. Free and open source.",
                tech: ["GDScript", "GLSL", "Godot 4.x"],
                image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop",
                github: "#",
                demo: "#"
            },
            {
                id: 6,
                title: "Z80 CPU Emulator",
                status: "archived",
                category: "Emulation",
                year: "2023",
                description: "Cycle-accurate Z80 processor emulator written in Rust. Initially built for running Sega Master System games, now archived in favor of more complete solutions.",
                tech: ["Rust", "Assembly"],
                image: null,
                github: "#",
                demo: null
            }
        ];

        let currentFilter = 'all';

        function renderProjects() {
            const list = document.getElementById('projectsList');
            const noProjects = document.getElementById('noProjects');
            
            // Filter projects
            let filtered = projects.filter(project => 
                currentFilter === 'all' || project.status === currentFilter
            );

            // Clear list
            list.innerHTML = '';

            if (filtered.length === 0) {
                noProjects.style.display = 'block';
                return;
            } else {
                noProjects.style.display = 'none';
            }

            // Render projects
            filtered.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                
                const imageHTML = project.image 
                    ? `<img src="${project.image}" alt="${project.title}">`
                    : '[NO IMAGE]';
                
                const demoButton = project.demo 
                    ? `<a href="${project.demo}" class="project-btn">[View Demo]</a>`
                    : '';

                card.innerHTML = `
                    <div class="project-info">
                        <div class="project-header">
                            <h3 class="project-title">${project.title}</h3>
                            <span class="project-status ${project.status}">[${project.status.toUpperCase().replace('-', ' ')}]</span>
                        </div>
                        <div class="project-meta">
                            <span>📁 ${project.category}</span>
                            <span>📅 ${project.year}</span>
                        </div>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">
                            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${project.github}" class="project-btn">[GitHub]</a>
                            ${demoButton}
                        </div>
                    </div>
                    <div class="project-image ${!project.image ? 'placeholder' : ''}">
                        ${imageHTML}
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
                renderProjects();
            });
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
                renderProjects();
            });
        } else {
            initTheme();
            renderProjects();
        }