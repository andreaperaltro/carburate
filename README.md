# Carburate Pattern Animation

An interactive SVG pattern generator with animated effects and advanced halftone image processing capabilities.

## ✨ Features

### 🎭 Pattern Animation
- **Interactive SVG Pattern**: Creates a dynamic pattern of rectangles that responds to mouse movement
- **Real-time Controls**: Adjustable settings for animation sensitivity, pattern dimensions, and colors
- **Smooth Animations**: Fluid transitions with customizable speed and falloff effects
- **Responsive Design**: Adapts to different screen sizes and orientations

### 🖼️ Advanced Halftone Effect
- **Image Upload**: Drag & drop or click to upload images
- **True Halftone Processing**: Converts images to halftone patterns using continuous brightness values (not binary threshold)
- **Rectangular Pattern Structure**: Uses the same rectangular pattern style as the main animation
- **High Resolution**: Configurable down to 1px spacing for extremely detailed patterns
- **Real-time Processing**: See changes instantly as you adjust controls
- **Export Options**: Download results as high-quality PNG or scalable SVG files

## 📱 Pages

1. **Pattern Animation** (`/`) - Interactive animated pattern with mouse tracking
2. **Halftone Effect** (`/halftone.html`) - Advanced image to halftone conversion

## 🎛️ Controls

### Pattern Animation Settings
- **Animation**: Mouse sensitivity, falloff size, animation speed
- **Pattern**: Rectangle dimensions, gaps, spacing
- **Colors**: Primary, secondary, and background colors

### Halftone Settings
- **Image Processing**: 
  - Contrast (0.1x - 5x)
  - Brightness (-200 to +200)
- **Halftone Pattern**: 
  - Rectangle Width (1-20px)
  - Cell Spacing (1-50px) 
  - Height Multiplier (0.1x - 5x)
  - Tall/Short Ratio (0.1x - 2x)
  - Minimum Height (1-20px)
- **Colors**: Halftone color and background color

## 🚀 How It Works

### Pattern Animation
1. **Move your mouse** to see the pattern respond in real-time
2. **Adjust settings** to customize the animation behavior
3. **Hover over rectangles** to see individual highlights

### Halftone Effect
1. **Upload an image** by dragging and dropping or clicking the upload area
2. **Adjust processing settings** to enhance contrast and brightness
3. **Fine-tune the pattern** with spacing, size, and height controls
4. **Download the result** as PNG or SVG with high resolution

## 🔧 Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **Image Processing**: Canvas-based image manipulation with continuous brightness mapping
- **SVG Generation**: Dynamic SVG creation for both patterns and halftone effects
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **High Performance**: Optimized rendering with efficient pixel sampling
- **Export Quality**: Large canvas sizes (800x600) for high-quality downloads

## 🎨 Halftone Algorithm

The halftone effect uses a sophisticated algorithm that:
- **Samples pixels precisely** from the center of each pattern cell
- **Maps brightness continuously** to rectangle heights (darker = taller, lighter = shorter)
- **Maintains pattern consistency** with alternating tall/short rectangles
- **Prevents blurring** through accurate pixel sampling and cell positioning
- **Ensures stability** with safety checks and minimum value constraints

## 📁 Development

To run the app locally:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## 📂 File Structure

```
├── index.html          # Pattern animation page
├── halftone.html       # Halftone effect page
├── styles.css          # Shared styles and responsive design
├── script.js           # Pattern animation logic
├── halftone.js         # Advanced halftone processing logic
├── package.json        # Dependencies and scripts
└── README.md           # This documentation
```

## 🌟 Recent Improvements

- **Enhanced Control Ranges**: Much wider ranges for all controls
- **Improved Pixel Sampling**: Crisp, clear patterns with no blurring
- **Better Layout**: Vertical stacking for improved mobile experience
- **Stable Rendering**: No more disappearing patterns at extreme values
- **Higher Export Quality**: Larger canvas sizes for better downloads
- **Continuous Halftone**: True brightness-based patterns, not binary threshold

## 🎯 Use Cases

- **Design Inspiration**: Create unique patterns for graphic design projects
- **Image Processing**: Convert photos to artistic halftone effects
- **Educational**: Learn about halftone printing and image processing
- **Creative Projects**: Generate patterns for textiles, wallpapers, or digital art
- **Prototyping**: Test different pattern variations quickly

## 🔮 Future Enhancements

- **Pattern Library**: Save and share custom patterns
- **Batch Processing**: Convert multiple images at once
- **Advanced Filters**: More image processing options
- **Animation Export**: Create animated halftone patterns
- **Social Features**: Share patterns with the community
