# Google Slides Export

Export Google Slides to PNG images when downloading is disabled (view-only mode).

## How it works

Google Slides' HTML view (`/htmlpresent`) renders each slide as a DOM element, making it possible to capture them as images via canvas — even when the original document has download/export restrictions.

## Usage

1. Open the restricted presentation
2. Change the URL from:
   ```
   https://docs.google.com/presentation/d/.../edit
   ```
   to:
   ```
   https://docs.google.com/presentation/d/.../htmlpresent
   ```
3. Press Enter to load the HTML view
4. Open DevTools (F12 → Console)
5. Paste the script and press Enter
6. Each slide downloads automatically as PNG with notes rendered at the bottom

## Example

```
Before: https://docs.google.com/presentation/d/REPLACE_WITH_YOUR_DOC_ID/edit
After:  https://docs.google.com/presentation/d/REPLACE_WITH_YOUR_DOC_ID/htmlpresent
```

## Output

Slides are saved as `Slide_01.png`, `Slide_02.png`, etc. at 960×620 resolution. Speaker notes (if any) appear below a green divider.

## Notes

- A 1-second delay between downloads prevents browser throttling
- Works in any Chromium-based browser (Chrome, Edge, Brave)

## Before running

To let the script save files automatically without a save dialog for each slide:

| Browser | Settings page |
|---------|---------------|
| Chrome | [`chrome://settings/downloads`](chrome://settings/downloads) |
| Brave | [`brave://settings/downloads`](brave://settings/downloads) |
| Edge | [`edge://settings/downloads`](edge://settings/downloads) |

Then:

1. Set a fixed **Location** for downloads
2. Turn **off** "Ask where to save each file before downloading"

## License

[MIT](LICENSE)
