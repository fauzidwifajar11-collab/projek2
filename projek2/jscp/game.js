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
        
        // We need 8 unique images for a 16 card grid (4x4)
        this.totalPairs = 8;
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
        });
    }
});
