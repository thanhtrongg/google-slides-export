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

      // Set kích thước (960x620 để chứa cả slide + notes)
      canvas.width = 960;
      canvas.height = 620;

      // Nền trắng
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lấy background image từ slide
      const bgStyle = slideContent.style.backgroundImage;
      const match = bgStyle.match(/url\(["']?(.*?)["']?\)/);

      if (match && match[1]) {
        // Load và vẽ background image
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
          bgImg.src = match[1];
        });

        ctx.drawImage(bgImg, 0, 0, 960, 540);
      }

      // Vẽ notes (đáp án) nếu có
      if (slideNotes) {
        const notesText = slideNotes.textContent.trim();
        if (notesText) {
          // Vẽ khung xám cho notes
          ctx.fillStyle = "#f5f5f5";
          ctx.fillRect(0, 540, 960, 80);

          // Vẽ viền xanh
          ctx.strokeStyle = "#4CAF50";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, 540);
          ctx.lineTo(960, 540);
          ctx.stroke();

          // Vẽ text đáp án
          ctx.fillStyle = "#333333";
          ctx.font = "bold 18px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`ANSWER: ${notesText}`, 480, 580);
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\nAll slides exported successfully!");
  console.log(`Total slides: ${slides.length}`);
})();
