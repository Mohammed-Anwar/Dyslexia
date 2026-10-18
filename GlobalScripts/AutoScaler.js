class GameAutoScaler {
    constructor() {
        this.gameStage = document.getElementById('game-stage');
        this.gameContainer = document.getElementById('game-container');
        this.currentScale = 1;
        this.observer = null;
        this.resizeTimeout = null;
        
        this.init();
    }
    
    init() {
        // Watch for DOM changes in game stage
        this.observer = new MutationObserver(() => {
            this.debounceScale();
        });
        
        this.observer.observe(this.gameStage, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.debounceScale();
        });
        
        // Initial scale after a short delay
        setTimeout(() => this.scaleToFit(), 100);
    }
    
    debounceScale() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            this.scaleToFit();
        }, 150);
    }
    
        scaleToFit() {
        if (!this.gameStage || !this.gameContainer) return;
        
        const gameContent = this.gameStage.querySelector('.game-content, .activity-container, .game-wrapper') 
                          || this.gameStage.firstElementChild;
        
        if (!gameContent) return;
        
        gameContent.style.transform = 'scale(1)';
        gameContent.style.transformOrigin = 'top center'; // Changed to top center for better scrolling
        
        const naturalWidth = gameContent.scrollWidth;
        const naturalHeight = gameContent.scrollHeight;
        
        const availableWidth = this.gameContainer.clientWidth - 40;
        const availableHeight = this.gameContainer.clientHeight - 40;
        
        if (naturalWidth === 0 || naturalHeight === 0) return;
        
        // ONLY scale based on WIDTH. Let the height scroll if it's too tall.
        // This prevents text from becoming tiny on long games like "Invitation"
        const scaleX = availableWidth / naturalWidth;
        
        // Only scale down if it's wider than the screen. Never scale up.
        if (scaleX < 0.95) {
            gameContent.style.transform = `scale(${scaleX * 0.98})`;
            gameContent.style.transformOrigin = 'top center';
            this.currentScale = scaleX * 0.98;
        } else {
            gameContent.style.transform = 'scale(1)';
            this.currentScale = 1;
        }
    }
    
    // Manual trigger for specific games
    forceRescale() {
        this.scaleToFit();
    }
}

// Initialize the auto-scaler
let gameAutoScaler;
document.addEventListener('DOMContentLoaded', () => {
    gameAutoScaler = new GameAutoScaler();
});

// Expose globally for game scripts to call if needed
window.GameAutoScaler = gameAutoScaler;