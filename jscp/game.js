/**
 * Anniversary Memory Match Game
 */

class MemoryMatchGame {
    constructor() {
        this.board = document.getElementById('game-board');
        this.gameContainer = document.getElementById('anniversary-game');
        this.movesDisplay = document.getElementById('game-moves');
        this.matchesDisplay = document.getElementById('game-matches');
        this.winScreen = document.getElementById('game-win-screen');
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isProcessing = false;
        
        // We need 6 unique images for a 12 card grid (4x3)
        this.totalPairs = 6;
    }

    init() {
        // Prepare the images
        // We will try to use the ones from photoUrls (from settings/ui.js)
        let availableImages = [];
        if (typeof photoUrls !== 'undefined' && photoUrls.length > 0) {
            availableImages = [...photoUrls];
        } else {
            // Fallback in case photoUrls is empty or not loaded
            availableImages = [
                "image/WhatsApp Image 2026-05-28 at 17.22.20.jpeg",
                "image/WhatsApp Image 2026-05-28 at 17.22.21.jpeg",
                "image/WhatsApp Image 2026-05-28 at 17.22.22.jpeg",
                "image/WhatsApp Image 2026-05-28 at 17.22.23.jpeg",
                "image/WhatsApp Image 2026-05-28 at 17.22.24.jpeg",
                "image/WhatsApp Image 2026-05-28 at 17.22.25.jpeg",
                "image/WhatsApp Image 2026-05-28 at 17.22.26.jpeg",
                "image/WhatsApp Image 2026-05-28 at 17.22.27.jpeg"
            ];
        }

        // Shuffle and pick top 8
        this.shuffleArray(availableImages);
        let selectedImages = [];
        for (let i = 0; i < this.totalPairs; i++) {
            selectedImages.push(availableImages[i % availableImages.length]);
        }

        // Duplicate to make pairs
        let gameImages = [...selectedImages, ...selectedImages];
        this.shuffleArray(gameImages);

        // Reset stats
        this.moves = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.isProcessing = false;
        this.updateStats();

        // Clear board
        this.board.innerHTML = '';
        this.winScreen.style.display = 'none';

        // Create cards
        gameImages.forEach((src, index) => {
            const card = document.createElement('div');
            card.classList.add('game-card');
            card.dataset.index = index;
            card.dataset.src = src;

            const front = document.createElement('div');
            front.classList.add('game-card-front');

            const back = document.createElement('div');
            back.classList.add('game-card-back');
            const img = document.createElement('img');
            img.src = src;
            back.appendChild(img);

            card.appendChild(front);
            card.appendChild(back);

            card.addEventListener('click', () => this.flipCard(card));

            this.board.appendChild(card);
        });

        // Show the game container
        this.gameContainer.style.display = 'flex';
        // Small delay to allow display to apply before opacity transition
        setTimeout(() => {
            this.gameContainer.style.opacity = '1';
        }, 50);
    }

    flipCard(card) {
        if (this.isProcessing) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }

    checkMatch() {
        this.isProcessing = true;
        const [card1, card2] = this.flippedCards;

        if (card1.dataset.src === card2.dataset.src) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedPairs++;
                this.updateStats();
                this.flippedCards = [];
                this.isProcessing = false;

                if (this.matchedPairs === this.totalPairs) {
                    this.winGame();
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
                this.isProcessing = false;
            }, 1000);
        }
    }

    updateStats() {
        this.movesDisplay.textContent = `Moves: ${this.moves}`;
        this.matchesDisplay.textContent = `Matches: ${this.matchedPairs} / ${this.totalPairs}`;
    }

    winGame() {
        setTimeout(() => {
            this.winScreen.style.display = 'block';
            if (typeof showFirework === 'function') {
                showFirework();
            }
            if (typeof showConfetti === 'function') {
                showConfetti();
            }
        }, 500);
    }

    closeGame() {
        this.gameContainer.style.opacity = '0';
        setTimeout(() => {
            this.gameContainer.style.display = 'none';
        }, 1000);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

function showFinalHDFireworks() {
    // Create HD canvas on body
    const canvas = document.createElement('canvas');
    canvas.id = 'hd-final-fireworks';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999990'; 
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let fireworks = [];
    let particles = [];
    let isFireworksActive = true;

    const launchFirework = () => {
        if (!isFireworksActive) return;
        const startX = canvas.width * 0.2 + Math.random() * (canvas.width * 0.6);
        const startY = canvas.height;
        const targetX = startX + (Math.random() - 0.5) * 300;
        const targetY = canvas.height * 0.1 + Math.random() * (canvas.height * 0.4);

        fireworks.push({
            x: startX, y: startY, tx: targetX, ty: targetY,
            speed: 6 + Math.random() * 4,
            color: `hsl(${Math.random() * 360}, 100%, 60%)` // Multi-color HD fireworks
        });
    };

    const explodeFirework = (x, y, color) => {
        const particleCount = 120 + Math.random() * 80; 
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 9 + 3;
            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                color: Math.random() > 0.3 ? color : '#ffffff',
                size: Math.random() * 3 + 1
            });
        }
    };

    const animate = () => {
        if (!isFireworksActive && fireworks.length === 0 && particles.length === 0) {
            return;
        }
        requestAnimationFrame(animate);

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            const dx = fw.tx - fw.x;
            const dy = fw.ty - fw.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < fw.speed) {
                explodeFirework(fw.tx, fw.ty, fw.color);
                fireworks.splice(i, 1);
                continue;
            }

            fw.x += (dx / dist) * fw.speed;
            fw.y += (dy / dist) * fw.speed;

            ctx.beginPath();
            ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = fw.color;
            ctx.fill();

            if (Math.random() > 0.1) {
                particles.push({
                    x: fw.x, y: fw.y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: Math.random() * 3 + 1,
                    life: 1, decay: 0.05,
                    color: fw.color, size: 2
                });
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; 
            p.life -= p.decay;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    };

    animate();

    setTimeout(launchFirework, 100);
    setTimeout(launchFirework, 400);
    setTimeout(launchFirework, 700);

    let fwInterval = setInterval(launchFirework, 800);

    // Create the Happy Anniversary Text Overlay
    setTimeout(() => {
        const textOverlay = document.createElement('div');
        textOverlay.style.position = 'fixed';
        textOverlay.style.top = '50%';
        textOverlay.style.left = '50%';
        textOverlay.style.transform = 'translate(-50%, -50%)';
        textOverlay.style.zIndex = '999991';
        textOverlay.style.fontFamily = "'Dancing Script', cursive";
        textOverlay.style.fontSize = window.innerWidth < 600 ? '48px' : '72px';
        textOverlay.style.color = '#ff69b4';
        textOverlay.style.textAlign = 'center';
        textOverlay.style.textShadow = '0 0 20px rgba(255, 105, 180, 0.8), 0 0 40px rgba(255, 105, 180, 0.5)';
        textOverlay.style.opacity = '0';
        textOverlay.style.transition = 'opacity 2s ease, transform 2s ease';
        textOverlay.style.pointerEvents = 'none';
        textOverlay.innerHTML = 'Happy Anniversary!<br><span style="font-size: 0.5em; color: white;">I Love You ❤️</span>';
        
        document.body.appendChild(textOverlay);

        setTimeout(() => {
            textOverlay.style.opacity = '1';
            textOverlay.style.transform = 'translate(-50%, -50%) scale(1.1)';
        }, 100);
        
        // Keep launching fireworks indefinitely for a beautiful background
    }, 2500); // text appears after 2.5 seconds
}

// Initialization and bindings
let anniversaryGame;

document.addEventListener('DOMContentLoaded', () => {
    anniversaryGame = new MemoryMatchGame();

    const btnPlay = document.getElementById('btn-play-game');
    const btnClose = document.getElementById('btn-close-game');

    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            btnPlay.style.display = 'none';
            // Hide the heart photos if they are on screen
            const photos = document.querySelectorAll('.photo');
            photos.forEach(p => p.style.opacity = '0');
            
            anniversaryGame.init();
        });
    }

    if (btnClose) {
        btnClose.addEventListener('click', () => {
            anniversaryGame.closeGame();
            if (typeof aniPlaylist !== 'undefined') {
                aniPlaylist.openPlaylist();
            }
            
            // Trigger final HD fireworks on the main page
            setTimeout(() => {
                showFinalHDFireworks();
            }, 1000);
        });
    }
});
