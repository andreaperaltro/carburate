class HalftoneProcessor {
    constructor() {
        this.originalImage = null;
        this.processedCanvas = null;
        this.originalCanvas = null;
        this.ctx = null;
        this.originalCtx = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupControls();
        this.createCanvases();
    }

    setupEventListeners() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const downloadPng = document.getElementById('download-png');
        const downloadSvg = document.getElementById('download-svg');

        // File upload events
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Download events
        downloadPng.addEventListener('click', () => this.downloadPNG());
        downloadSvg.addEventListener('click', () => this.downloadSVG());
    }

    setupControls() {
        const controls = [
            'contrast', 'brightness',
            'dot-size', 'dot-spacing', 'dot-density', 'tall-ratio', 'min-height',
            'halftone-color', 'halftone-bg'
        ];

        controls.forEach(controlId => {
            const control = document.getElementById(controlId);
            if (control) {
                control.addEventListener('input', () => this.updateHalftone());
                this.updateValueDisplay(controlId);
            }
        });
    }

    updateValueDisplay(controlId) {
        const control = document.getElementById(controlId);
        const display = document.getElementById(`${controlId}-value`);
        
        if (control && display) {
            let value = control.value;
            let unit = '';
            
            switch (controlId) {
                case 'contrast':
                    unit = 'x';
                    break;
                case 'brightness':
                    unit = '';
                    break;
                case 'dot-size':
                    unit = 'px';
                    break;
                case 'dot-spacing':
                    unit = 'px';
                    break;
                case 'dot-density':
                    unit = 'x';
                    break;
                case 'min-height':
                    unit = 'px';
                    break;
            }
            
            display.textContent = value + unit;
        }
    }

    createCanvases() {
        this.originalCanvas = document.getElementById('original-canvas');
        this.processedCanvas = document.getElementById('halftone-canvas');
        this.originalCtx = this.originalCanvas.getContext('2d');
        this.ctx = this.processedCanvas.getContext('2d');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    loadImage(src) {
        this.originalImage = new Image();
        this.originalImage.onload = () => {
            this.displayOriginalImage();
            this.updateHalftone();
            this.showPreviewSection();
        };
        this.originalImage.src = src;
    }

    displayOriginalImage() {
        const canvas = this.originalCanvas;
        const ctx = this.originalCtx;
        
        // Set canvas size to fit the image while maintaining aspect ratio
        // Use larger size for better export quality
        const maxWidth = 800;
        const maxHeight = 600;
        const scale = Math.min(maxWidth / this.originalImage.width, maxHeight / this.originalImage.height);
        
        canvas.width = this.originalImage.width * scale;
        canvas.height = this.originalImage.height * scale;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.originalImage, 0, 0, canvas.width, canvas.height);
    }

    showPreviewSection() {
        document.getElementById('preview-section').style.display = 'grid';
    }

    updateHalftone() {
        if (!this.originalImage) return;

        const contrast = parseFloat(document.getElementById('contrast').value);
        const brightness = parseInt(document.getElementById('brightness').value);
        const dotSize = parseInt(document.getElementById('dot-size').value);
        const dotSpacing = parseInt(document.getElementById('dot-spacing').value);
        const dotDensity = parseFloat(document.getElementById('dot-density').value);
        const halftoneColor = document.getElementById('halftone-color').value;
        const bgColor = document.getElementById('halftone-bg').value;

        // Set canvas size
        this.processedCanvas.width = this.originalCanvas.width;
        this.processedCanvas.height = this.originalCanvas.height;

        // Clear canvas
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.processedCanvas.width, this.processedCanvas.height);

        // Get image data from original canvas
        const imageData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);
        const data = imageData.data;

        // Process image data
        const processedData = this.processImageData(data, contrast, brightness);

        // Create halftone pattern
        this.createHalftonePattern(processedData, dotSize, dotSpacing, dotDensity, halftoneColor);
    }

    processImageData(data, contrast, brightness) {
        const processed = new Uint8ClampedArray(data.length);
        
        for (let i = 0; i < data.length; i += 4) {
            // Convert to grayscale
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            
            // Apply contrast and brightness
            let adjusted = (gray - 128) * contrast + 128 + brightness;
            adjusted = Math.max(0, Math.min(255, adjusted));
            
            // Keep continuous values for true halftone effect (no threshold)
            processed[i] = adjusted;     // R
            processed[i + 1] = adjusted; // G
            processed[i + 2] = adjusted; // B
            processed[i + 3] = data[i + 3]; // A
        }
        
        return processed;
    }

    createHalftonePattern(processedData, dotSize, dotSpacing, dotDensity, halftoneColor) {
        const width = this.processedCanvas.width;
        const height = this.processedCanvas.height;
        
        this.ctx.fillStyle = halftoneColor;
        
        // Use much smaller spacing for higher resolution
        const cellWidth = Math.max(2, dotSize + dotSpacing);
        const cellHeight = Math.max(2, cellWidth); // Square cells for the pattern
        
        for (let y = 0; y < height; y += cellHeight) {
            for (let x = 0; x < width; x += cellWidth) {
                // Sample the center of each cell for better accuracy
                const sampleX = Math.round(x + cellWidth / 2);
                const sampleY = Math.round(y + cellHeight / 2);
                
                // Ensure we're within bounds
                if (sampleX < width && sampleY < height) {
                    const pixelIndex = (sampleY * width + sampleX) * 4;
                    if (pixelIndex < processedData.length) {
                        const intensity = processedData[pixelIndex] / 255;
                        
                        // Create continuous halftone effect based on brightness
                        // Darker areas = taller rectangles, lighter areas = shorter rectangles
                        const maxHeight = Math.max(1, cellHeight * dotDensity);
                        const rectangleHeight = maxHeight * (1 - intensity);
                        
                        // Only draw rectangles if they have meaningful height
                        const minHeight = Math.max(1, parseInt(document.getElementById('min-height').value));
                        if (rectangleHeight >= minHeight) {
                            // Draw rectangle similar to the main pattern
                            const rectWidth = Math.max(1, dotSize);
                            const rectX = x + (cellWidth - rectWidth) / 2;
                            const rectY = y + (cellHeight - rectangleHeight) / 2;
                            
                            // Alternate between tall and short rectangles like the main pattern
                            const isTall = Math.floor(x / cellWidth) % 3 === 0;
                            const tallRatio = Math.max(0.1, parseFloat(document.getElementById('tall-ratio').value));
                            const adjustedHeight = isTall ? rectangleHeight : rectangleHeight * tallRatio;
                            const adjustedY = y + (cellHeight - adjustedHeight) / 2;
                            
                            this.ctx.fillRect(rectX, adjustedY, rectWidth, adjustedHeight);
                        }
                    }
                }
            }
        }
    }

    downloadPNG() {
        if (!this.processedCanvas) return;
        
        const link = document.createElement('a');
        link.download = 'halftone-image.png';
        link.href = this.processedCanvas.toDataURL('image/png');
        link.click();
    }

    downloadSVG() {
        if (!this.processedCanvas) return;
        
        const width = this.processedCanvas.width;
        const height = this.processedCanvas.height;
        const dotSize = parseInt(document.getElementById('dot-size').value);
        const dotSpacing = parseInt(document.getElementById('dot-spacing').value);
        const dotDensity = parseFloat(document.getElementById('dot-density').value);
        const halftoneColor = document.getElementById('halftone-color').value;
        const bgColor = document.getElementById('halftone-bg').value;
        
        // Get the processed image data to recreate the pattern
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
        svgContent += `<rect width="${width}" height="${height}" fill="${bgColor}"/>`;
        
        // Recreate the halftone pattern as SVG rectangles
        const cellWidth = Math.max(2, dotSize + dotSpacing);
        const cellHeight = Math.max(2, cellWidth);
        
        for (let y = 0; y < height; y += cellHeight) {
            for (let x = 0; x < width; x += cellWidth) {
                // Sample the center of each cell for better accuracy
                const sampleX = Math.round(x + cellWidth / 2);
                const sampleY = Math.round(y + cellHeight / 2);
                
                // Ensure we're within bounds
                if (sampleX < width && sampleY < height) {
                    const pixelIndex = (sampleY * width + sampleX) * 4;
                    if (pixelIndex < data.length) {
                        const intensity = data[pixelIndex] / 255;
                        
                        // Create continuous halftone effect based on brightness
                        const maxHeight = Math.max(1, cellHeight * dotDensity);
                        const rectangleHeight = maxHeight * (1 - intensity);
                        
                        // Only draw rectangles if they have meaningful height
                        const minHeight = Math.max(1, parseInt(document.getElementById('min-height').value));
                        if (rectangleHeight >= minHeight) {
                            const rectWidth = Math.max(1, dotSize);
                            const rectX = x + (cellWidth - rectWidth) / 2;
                            const rectY = y + (cellHeight - rectangleHeight) / 2;
                            
                            // Alternate between tall and short rectangles like the main pattern
                            const isTall = Math.floor(x / cellWidth) % 3 === 0;
                            const tallRatio = Math.max(0.1, parseFloat(document.getElementById('tall-ratio').value));
                            const adjustedHeight = isTall ? rectangleHeight : rectangleHeight * tallRatio;
                            const adjustedY = y + (cellHeight - adjustedHeight) / 2;
                            
                            svgContent += `<rect x="${rectX}" y="${adjustedY}" width="${rectWidth}" height="${adjustedHeight}" fill="${halftoneColor}"/>`;
                        }
                    }
                }
            }
        }
        
        svgContent += '</svg>';
        
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'halftone-image.svg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the halftone processor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HalftoneProcessor();
    
    // Setup dropdown toggle for settings
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownContent = document.getElementById('dropdown-content');
    
    dropdownToggle.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownToggle.contains(e.target) && !dropdownContent.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});
