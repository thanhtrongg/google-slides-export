# Google Slides Export

Export Google Slides presentations to PNG images with speaker notes.

## Usage

1. Open your Google Slides presentation in browser
2. Open DevTools (F12 → Console)
3. Paste the script and press Enter
4. Images will download automatically to your browser's download folder

## Output

Each slide is saved as `Slide_01.png`, `Slide_02.png`, etc. at 960×620 resolution. Speaker notes are rendered at the bottom of each image with a green divider.

## Notes

- Works with Google Slides HTML view (slides displayed as `div[role="group"]`)
- A 1-second delay between slides prevents browser throttling
- Background images and notes are captured from the rendered DOM

## License

[MIT](LICENSE)
