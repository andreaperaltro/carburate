class PatternAnimator {
    constructor() {
        this.svg = document.getElementById('animated-pattern');
        this.sensitivity = 2.0;
        this.falloffSize = 0.7;
        this.animationSpeed = 0.1;
        this.mouseX = 0;
        this.mouseY = 0;
        this.rectangles = [];
        
        // New pattern properties
        this.rectangleWidth = 10;
        this.tallHeight = 28;
        this.shortHeight = 16;
        this.horizontalGap = 9;
        this.verticalGap = 45;
        
        // Colors
        this.primaryColor = '#2e4b9c';
        this.secondaryColor = '#1e3a8a';
        this.backgroundColor = '#0f172a';
        
        this.init();
    }
    
    init() {
        this.setupDropdown();
        this.generatePattern();
        this.setupEventListeners();
        this.setupControls();
        this.animate();
    }
    
    setupDropdown() {
        const toggle = document.getElementById('dropdown-toggle');
        const content = document.getElementById('dropdown-content');
        
        toggle.addEventListener('click', () => {
            content.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !content.contains(e.target)) {
                content.classList.remove('show');
            }
        });
    }
    
    generatePattern() {
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Update SVG viewBox to match viewport
        this.svg.setAttribute('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`);
        
        // Calculate pattern dimensions
        const cellWidth = this.rectangleWidth + this.horizontalGap;
        const cellHeight = Math.max(this.tallHeight, this.shortHeight) + this.verticalGap;
        
        const cols = Math.ceil(viewportWidth / cellWidth) + 2; // Extra columns for smooth edges
        const rows = Math.ceil(viewportHeight / cellHeight) + 2; // Extra rows for smooth edges
        
        // Clear existing content
        this.svg.innerHTML = `
            <defs>
                <style>
                    .pattern-rect {
                        fill: ${this.primaryColor};
                        transition: all ${this.animationSpeed}s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .pattern-rect:hover {
                        fill: ${this.secondaryColor};
                    }
                </style>
            </defs>
        `;
        
        this.rectangles = [];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * cellWidth;
                const y = row * cellHeight;
                
                // Determine if this should be a tall or short rectangle
                const isTall = col % 3 === 0;
                const height = isTall ? this.tallHeight : this.shortHeight;
                
                // Calculate y position to align at bottom
                const yPos = y + (Math.max(this.tallHeight, this.shortHeight) - height);
                
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', yPos);
                rect.setAttribute('width', this.rectangleWidth);
                rect.setAttribute('height', height);
                rect.setAttribute('class', 'pattern-rect');
                rect.setAttribute('data-original-height', height);
                rect.setAttribute('data-original-y', yPos);
                
                this.svg.appendChild(rect);
                this.rectangles.push(rect);
            }
        }
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.generatePattern();
        });
    }
    
    setupControls() {
        // Animation controls
        const sensitivitySlider = document.getElementById('sensitivity');
        const sensitivityValue = document.getElementById('sensitivity-value');
        sensitivitySlider.addEventListener('input', (e) => {
            this.sensitivity = parseFloat(e.target.value);
            sensitivityValue.textContent = `${this.sensitivity.toFixed(1)}x`;
        });
        
        const falloffSlider = document.getElementById('falloff-size');
        const falloffValue = document.getElementById('falloff-size-value');
        falloffSlider.addEventListener('input', (e) => {
            this.falloffSize = parseFloat(e.target.value);
            falloffValue.textContent = this.falloffSize.toFixed(1);
        });
        
        const speedSlider = document.getElementById('animation-speed');
        const speedValue = document.getElementById('animation-speed-value');
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            speedValue.textContent = `${this.animationSpeed.toFixed(1)}s`;
            this.updateTransitionSpeed();
        });
        
        // Pattern controls
        const widthSlider = document.getElementById('rectangle-width');
        const widthValue = document.getElementById('rectangle-width-value');
        widthSlider.addEventListener('input', (e) => {
            this.rectangleWidth = parseInt(e.target.value);
            widthValue.textContent = `${this.rectangleWidth}px`;
            this.generatePattern();
        });
        
        const tallHeightSlider = document.getElementById('rectangle-height');
        const tallHeightValue = document.getElementById('rectangle-height-value');
        tallHeightSlider.addEventListener('input', (e) => {
            this.tallHeight = parseInt(e.target.value);
            tallHeightValue.textContent = `${this.tallHeight}px`;
            this.generatePattern();
        });
        
        const shortHeightSlider = document.getElementById('short-height');
        const shortHeightValue = document.getElementById('short-height-value');
        shortHeightSlider.addEventListener('input', (e) => {
            this.shortHeight = parseInt(e.target.value);
            shortHeightValue.textContent = `${this.shortHeight}px`;
            this.generatePattern();
        });
        
        const horizontalGapSlider = document.getElementById('horizontal-gap');
        const horizontalGapValue = document.getElementById('horizontal-gap-value');
        horizontalGapSlider.addEventListener('input', (e) => {
            this.horizontalGap = parseInt(e.target.value);
            horizontalGapValue.textContent = `${this.horizontalGap}px`;
            this.generatePattern();
        });
        
        const verticalGapSlider = document.getElementById('vertical-gap');
        const verticalGapValue = document.getElementById('vertical-gap-value');
        verticalGapSlider.addEventListener('input', (e) => {
            this.verticalGap = parseInt(e.target.value);
            verticalGapValue.textContent = `${this.verticalGap}px`;
            this.generatePattern();
        });
        
        // Color controls
        const primaryColorInput = document.getElementById('primary-color');
        primaryColorInput.addEventListener('input', (e) => {
            this.primaryColor = e.target.value;
            this.updateColors();
        });
        
        const secondaryColorInput = document.getElementById('secondary-color');
        secondaryColorInput.addEventListener('input', (e) => {
            this.secondaryColor = e.target.value;
            this.updateColors();
        });
        
        const backgroundColorInput = document.getElementById('background-color');
        backgroundColorInput.addEventListener('input', (e) => {
            this.backgroundColor = e.target.value;
            document.body.style.background = this.backgroundColor;
        });
    }
    
    updateTransitionSpeed() {
        const style = document.createElement('style');
        style.textContent = `
            .pattern-rect {
                transition: all ${this.animationSpeed}s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
        `;
        
        // Remove existing style if any
        const existingStyle = document.querySelector('style[data-transition-speed]');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.setAttribute('data-transition-speed', 'true');
        document.head.appendChild(style);
    }
    
    updateColors() {
        const style = document.createElement('style');
        style.textContent = `
            .pattern-rect {
                fill: ${this.primaryColor} !important;
            }
            .pattern-rect:hover {
                fill: ${this.secondaryColor} !important;
            }
        `;
        
        // Remove existing style if any
        const existingStyle = document.querySelector('style[data-colors]');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.setAttribute('data-colors', 'true');
        document.head.appendChild(style);
    }
    
    animate() {
        const maxDistance = Math.min(window.innerWidth, window.innerHeight) * this.falloffSize;
        
        this.rectangles.forEach(rect => {
            const rectX = parseFloat(rect.getAttribute('x')) + this.rectangleWidth / 2;
            const rectY = parseFloat(rect.getAttribute('y')) + parseFloat(rect.getAttribute('height')) / 2;
            
            const distance = Math.sqrt(
                Math.pow(this.mouseX - rectX, 2) + 
                Math.pow(this.mouseY - rectY, 2)
            );
            
            if (distance < maxDistance) {
                const influence = 1 - (distance / maxDistance);
                const effect = Math.pow(influence, 2) * this.sensitivity;
                
                const originalHeight = parseFloat(rect.getAttribute('data-original-height'));
                const originalY = parseFloat(rect.getAttribute('data-original-y'));
                
                const newHeight = originalHeight * (1 + effect);
                const newY = originalY - (newHeight - originalHeight);
                
                rect.setAttribute('height', newHeight);
                rect.setAttribute('y', newY);
            } else {
                // Reset to original size
                const originalHeight = parseFloat(rect.getAttribute('data-original-height'));
                const originalY = parseFloat(rect.getAttribute('data-original-y'));
                
                rect.setAttribute('height', originalHeight);
                rect.setAttribute('y', originalY);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PatternAnimator();
});
