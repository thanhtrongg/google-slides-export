(async function () {
  console.log("Starting slide export...");

  // Lấy tất cả slides
  const slides = document.querySelectorAll('div[role="group"]');
  console.log(`Found ${slides.length} slides`);

  if (slides.length === 0) {
    console.error("No slides found!");
    return;
  }

  console.log("Processing slides...");

  for (let i = 0; i < slides.length; i++) {
    const slideGroup = slides[i];
    const slideContent = slideGroup.querySelector(".slide-content");
    const slideNotes = slideGroup.querySelector(".slide-notes");

    if (!slideContent) continue;

    console.log(`Slide ${i + 1}/${slides.length}`);

    try {
      // Tạo canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Kích thước slide (16:9) + notes
      const SLIDE_W = 1280;
      const SLIDE_H = 720;
      const NOTES_H = 280;
      const PADDING = 20;
      const LINE_HEIGHT = 24;
      const TEXT_SIZE = 16;
      const canvasW = SLIDE_W;
      const canvasH = SLIDE_H + NOTES_H;
      canvas.width = canvasW;
      canvas.height = canvasH;

      // Nền trắng
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Lấy background image từ slide
      const bgStyle = slideContent.style.backgroundImage;
      const match = bgStyle.match(/url\(["']?(.*?)["']?\)/);

      if (match && match[1]) {
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
          bgImg.src = match[1];
        });

        ctx.drawImage(bgImg, 0, 0, SLIDE_W, SLIDE_H);
      }

      // Vẽ notes (đáp án) nếu có
      if (slideNotes) {
        const notesText = slideNotes.textContent.trim();
        if (notesText) {
          const notesY = SLIDE_H;

          // Vẽ khung xám cho notes
          ctx.fillStyle = "#f5f5f5";
          ctx.fillRect(0, notesY, canvasW, NOTES_H);

          // Vẽ viền xanh
          ctx.strokeStyle = "#4CAF50";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, notesY);
          ctx.lineTo(canvasW, notesY);
          ctx.stroke();

          // Word-wrap text
          ctx.fillStyle = "#333333";
          ctx.font = `bold ${TEXT_SIZE}px Arial`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";

          const prefix = "ANSWER: ";
          const fullText = prefix + notesText;
          const maxWidth = canvasW - PADDING * 2;
          const words = fullText.split(" ");
          let line = "";
          let lineY = notesY + PADDING;

          for (const word of words) {
            const testLine = line ? line + " " + word : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line) {
              ctx.fillText(line, PADDING, lineY);
              line = word;
              lineY += LINE_HEIGHT;
            } else {
              line = testLine;
            }
          }
          if (line) {
            ctx.fillText(line, PADDING, lineY);
          }
        }
      }

      // Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Slide_${String(i + 1).padStart(2, "0")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`Downloaded: Slide_${String(i + 1).padStart(2, "0")}.png`);
    } catch (error) {
      console.error(`Error slide ${i + 1}:`, error);
    }

    // Delay để tránh browser block
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\nAll slides exported successfully!");
  console.log(`Total slides: ${slides.length}`);
})();
