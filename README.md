# Carburate Pattern Animation

An interactive web page featuring an animated SVG pattern that responds to mouse movement with smooth transitions.

## Features

- **Interactive Pattern**: The SVG pattern responds to mouse movement with smooth animations
- **Adjustable Controls**: 
  - Mouse sensitivity slider
  - Animation speed control
- **Smooth Transitions**: Uses CSS transitions and cubic-bezier easing for fluid animations
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, modern interface with gradient backgrounds and glassmorphism effects

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Project

Start the development server with hot reload:

```bash
npm run dev
```

Or simply:

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Alternative: Direct File Opening

If you don't want to use a server, you can also open `index.html` directly in your browser, though some features might be limited due to CORS policies.

## How to Use

1. **Move your mouse** over the pattern to see it respond
2. **Adjust sensitivity** using the slider to control how much the pattern reacts to mouse movement
3. **Change animation speed** to make transitions faster or slower
4. **Hover over individual rectangles** to see them highlight

## Technical Details

- **Pattern Generation**: The pattern is generated programmatically based on the original SVG structure
- **Animation System**: Uses requestAnimationFrame for smooth 60fps animations
- **Mouse Tracking**: Real-time mouse position tracking with distance-based influence
- **CSS Transitions**: Smooth color and transform transitions
- **Responsive SVG**: Scales properly on different screen sizes

## File Structure

```
carburate-pattern/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript animation logic
├── package.json        # Project configuration
├── README.md           # This file
└── Carburate pattern.svg # Original SVG pattern
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use and modify as needed.
