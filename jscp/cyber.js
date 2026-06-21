/**
 * Cyber Romantic Section Logic
 * Scrolling Neon Pills and Photos from bottom to top, followed by Fireworks.
 */

class CyberRomanticSection {
    constructor() {
        this.section = document.getElementById('cyber-romantic-section');
        if (!this.section) return;

        this.scrollContainer = document.getElementById('cyber-scroll-container');
        this.closeBtn = document.getElementById('cyber-close-btn');
        this.fwCanvas = document.getElementById('cyber-fireworks-canvas');
        this.fwCtx = this.fwCanvas.getContext('2d');

        this.fireworks = [];
        this.particles = [];
        this.isFireworksActive = false;
        this.fireworksLoopInterval = null;

        this.messages = [
            "Happy Anniversary, my love... thankyou for everything ❤️",
            "Another year with you. Still my best decision ✨",
            "Loving you never gets old.",
            "Terima kasih sudah ada. You mean everything. ✨",
            "My favorite person . Sekarang dan seterusnya.",
            "Kamu, maybe in another life ❤️",
            "I love you so much!",
            "Semoga kita selalu bahagia bersama-sama.",
            "My one and only 💖"
        ];

        this.photos = [
            "image/WhatsApp Image 2026-05-28 at 17.22.20.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.21.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.22.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.23.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.24.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.25.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.26.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.27.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.28.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.29.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.30.jpeg",
            "image/WhatsApp Image 2026-05-28 at 17.22.31.jpeg"
        ];

        this.totalItems = 30; // Total floating items to spawn

        this.init();
    }

    init() {
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.stopSequence());
        }
    }

    resizeCanvas() {
        this.fwCanvas.width = window.innerWidth;
        this.fwCanvas.height = window.innerHeight;
    }

    startSequence() {
        this.section.style.display = 'block';
        this.scrollContainer.innerHTML = '';
        this.isFireworksActive = false;
        this.fireworks = [];
        this.particles = [];
        if (this.closeBtn) this.closeBtn.classList.remove('show');

        // Play music if available
        const audio = document.getElementById('birthdayAudio');
        if (audio && audio.paused) {
            audio.play().catch(e => console.log('Autoplay prevented'));
        }

        // Generate floating items over time
        let maxDelay = 0;

        for (let i = 0; i < this.totalItems; i++) {
            const delay = Math.random() * 15000; // Spread over 15 seconds
            const duration = 6000 + Math.random() * 6000; // 6 to 12 seconds float time

            if (delay + duration > maxDelay) {
                maxDelay = delay + duration;
            }

            setTimeout(() => {
                this.spawnFloatingItem(duration);
            }, delay);
        }

        // After all items have floated up, start fireworks
        setTimeout(() => {
            this.startFireworks();
        }, maxDelay - 2000); // Start a bit before the last item disappears
    }

    spawnFloatingItem(durationMs) {
        const item = document.createElement('div');
        item.className = 'cyber-floating-item cyber-float-up';
        item.style.setProperty('--duration', `${durationMs}ms`);

        // Center items instead of overflowing right edge
        item.style.left = `50%`;
        item.style.transform = `translateX(-50%)`;

        // Slightly random scale with centering
        const scale = 0.8 + Math.random() * 0.4;
        item.style.transform = `translateX(-50%) scale(${scale})`;

        // Randomly choose text or photo (80% text, 20% photo)
        const isPhoto = Math.random() > 0.8 && this.photos.length > 0;

        if (isPhoto) {
            const photoSrc = this.photos[Math.floor(Math.random() * this.photos.length)];
            const photoEl = document.createElement('div');
            photoEl.className = 'cyber-neon-photo';
            const img = document.createElement('img');
            img.src = photoSrc;
            // Random size for photo
            const w = 100 + Math.random() * 80;
            const h = w * (0.8 + Math.random() * 0.4);
            img.style.width = `${w}px`;
            img.style.height = `${h}px`;
            photoEl.appendChild(img);
            item.appendChild(photoEl);
        } else {
            const msg = this.messages[Math.floor(Math.random() * this.messages.length)];
            const textEl = document.createElement('div');
            textEl.className = 'cyber-neon-pill';
            textEl.textContent = msg;
            item.appendChild(textEl);
        }

        this.scrollContainer.appendChild(item);

        // Cleanup DOM after animation
        setTimeout(() => {
            if (item && item.parentNode) {
                item.parentNode.removeChild(item);
            }
        }, durationMs + 500);
    }

    startFireworks() {
        this.isFireworksActive = true;
        this.animateFireworks();

        // Launch a firework periodically
        this.fireworksLoopInterval = setInterval(() => {
            this.launchFirework();
        }, 1500);

        // Launch initial burst
        setTimeout(() => this.launchFirework(), 100);
        setTimeout(() => this.launchFirework(), 500);
        setTimeout(() => this.launchFirework(), 900);

        // Show close button after 4 seconds of fireworks
        setTimeout(() => {
            if (this.closeBtn) this.closeBtn.classList.add('show');
        }, 4000);
    }

    launchFirework() {
        if (!this.isFireworksActive) return;

        const startX = this.fwCanvas.width * 0.2 + Math.random() * (this.fwCanvas.width * 0.6);
        const startY = this.fwCanvas.height;
        const targetX = startX + (Math.random() - 0.5) * 200;
        const targetY = this.fwCanvas.height * 0.1 + Math.random() * (this.fwCanvas.height * 0.4);

        this.fireworks.push({
            x: startX,
            y: startY,
            tx: targetX,
            ty: targetY,
            speed: 5 + Math.random() * 3,
            color: `hsl(${300 + Math.random() * 60}, 100%, 60%)` // Pink/Purple hues
        });
    }

    explodeFirework(x, y, color) {
        const particleCount = 60 + Math.random() * 40;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.015 + Math.random() * 0.015,
                color: Math.random() > 0.5 ? color : '#ffffff'
            });
        }
    }

    animateFireworks() {
        if (!this.isFireworksActive && this.fireworks.length === 0 && this.particles.length === 0) return;

        requestAnimationFrame(() => this.animateFireworks());

        // Trail effect
        this.fwCtx.globalCompositeOperation = 'destination-out';
        this.fwCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.fwCtx.fillRect(0, 0, this.fwCanvas.width, this.fwCanvas.height);
        this.fwCtx.globalCompositeOperation = 'lighter';

        // Update & Draw Fireworks (Rockets)
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];
            const dx = fw.tx - fw.x;
            const dy = fw.ty - fw.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < fw.speed) {
                // Explode
                this.explodeFirework(fw.tx, fw.ty, fw.color);
                this.fireworks.splice(i, 1);
                continue;
            }

            const velX = (dx / dist) * fw.speed;
            const velY = (dy / dist) * fw.speed;
            fw.x += velX;
            fw.y += velY;

            this.fwCtx.beginPath();
            this.fwCtx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
            this.fwCtx.fillStyle = fw.color;
            this.fwCtx.fill();

            // Rocket trail particle
            if (Math.random() > 0.2) {
                this.particles.push({
                    x: fw.x,
                    y: fw.y,
                    vx: (Math.random() - 0.5) * 1,
                    vy: Math.random() * 2,
                    life: 1,
                    decay: 0.05,
                    color: fw.color
                });
            }
        }

        // Update & Draw Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.life -= p.decay;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.fwCtx.beginPath();
            this.fwCtx.arc(p.x, p.y, Math.random() * 2 + 1, 0, Math.PI * 2);
            this.fwCtx.fillStyle = p.color;
            this.fwCtx.globalAlpha = p.life;
            this.fwCtx.fill();
            this.fwCtx.globalAlpha = 1;
        }
    }

    stopSequence() {
        this.isFireworksActive = false;
        clearInterval(this.fireworksLoopInterval);

        // Hide UI immediately
        this.section.style.opacity = '0';
        this.section.style.transition = 'opacity 1s ease';

        setTimeout(() => {
            this.section.style.display = 'none';
            this.section.style.opacity = '1';
            this.scrollContainer.innerHTML = '';
            this.fwCtx.clearRect(0, 0, this.fwCanvas.width, this.fwCanvas.height);

            // Trigger the love photo page after closing
            if (typeof spawnHeartPhotosCentered === 'function') {
                spawnHeartPhotosCentered();
            }
        }, 1000);
    }
}

// Global instance
window.cyberRomantic = new CyberRomanticSection();
