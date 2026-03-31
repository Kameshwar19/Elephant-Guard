// ── CNN_MODULE.JS ──
// Performs live object detection utilizing the laptop webcam and TensorFlow.js COCO-SSD model.

document.addEventListener('DOMContentLoaded', () => {

  const video = document.getElementById('cnn-video');
  const canvas = document.getElementById('cnn-canvas');
  const ctx = canvas.getContext('2d');
  const toggleBtn = document.getElementById('cnn-toggle-btn');
  const overlay = document.getElementById('det-overlay');
  
  let isRunning = false;
  let model = null;

  // Render Bar DOM
  const classes = ['Elephant', 'Human', 'Vehicle', 'Background'];
  const colors = ['#00d4ff', '#ff6b00', '#aa44ff', '#1a3a5c'];
  const barsContainer = document.getElementById('cnn-bars');
  
  classes.forEach((c, i) => {
    barsContainer.innerHTML += `
      <div class="cnn-bar-row">
        <div class="cnn-bar-label"><span>${c}</span><span id="conf-${i}">0%</span></div>
        <div class="cnn-bar-bg"><div class="cnn-bar-fill" id="fill-${i}" style="background:${colors[i]}"></div></div>
      </div>
    `;
  });

  // Load Model
  cocoSsd.load().then(loadedModel => {
    model = loadedModel;
    console.log("COCO-SSD loaded.");
  });

  toggleBtn.onclick = async () => {
    if(!isRunning) {
      if(!model) {
        overlay.textContent = 'LOADING NEURAL NET...';
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          isRunning = true;
          toggleBtn.textContent = '⏹ STOP INFERENCE';
          overlay.textContent = 'ANALYZING LIVE FEED...';
          runCNN();
        };
      } catch(err) {
        console.error("Webcam access denied", err);
        overlay.textContent = 'WEBCAM ACCESS DENIED';
        overlay.style.color = 'var(--danger)';
        overlay.style.borderColor = 'var(--danger)';
      }
    } else {
      isRunning = false;
      toggleBtn.textContent = '▶ START INFERENCE';
      overlay.textContent = 'STANDBY';
      if(video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
      }
      ctx.clearRect(0,0, canvas.width, canvas.height); // clear the screen on stop
    }
  };

  async function runCNN() {
    if(!isRunning) return;

    // Draw the actual webcam feed
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw cyber-grid overlay
    ctx.strokeStyle = 'rgba(0,212,255,0.05)';
    ctx.lineWidth = 1;
    for(let i=0; i<640; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,480); ctx.stroke(); }
    for(let i=0; i<480; i+=40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(640,i); ctx.stroke(); }

    const predictions = await model.detect(video);
    
    let stats = { Elephant: 0, Human: 0, Vehicle: 0, Background: 100 };

    predictions.forEach(p => {
      // Map COCO-SSD classes to our Dashboard semantic
      let color = '#1a3a5c';
      let cName = p.class;
      
      if (['person'].includes(p.class)) {
        color = '#ff6b00';
        stats.Human = Math.max(stats.Human, p.score * 100);
      } else if (['car', 'truck', 'bus', 'motorcycle', 'bicycle'].includes(p.class)) {
        color = '#aa44ff';
        stats.Vehicle = Math.max(stats.Vehicle, p.score * 100);
      } else if (['elephant', 'cow', 'horse', 'bear', 'sheep'].includes(p.class)) { 
        color = '#00d4ff'; // Since we probably won't find a real elephant in the laptop cam, any large mammal is fine for tests!
        stats.Elephant = Math.max(stats.Elephant, p.score * 100);
      }

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(p.bbox[0], p.bbox[1], p.bbox[2], p.bbox[3]);
      
      // Draw Label Background
      ctx.fillStyle = color;
      ctx.font = '12px Space Mono';
      const text = `${p.class.toUpperCase()} ${(p.score*100).toFixed(1)}%`;
      const tWidth = ctx.measureText(text).width;
      ctx.fillRect(p.bbox[0], p.bbox[1] - 18, tWidth + 8, 18);
      
      // Draw Label Text
      ctx.fillStyle = '#050d15';
      ctx.fillText(text, p.bbox[0] + 4, p.bbox[1] - 5);
      
      stats.Background -= Math.min(stats.Background, p.score*100);
    });

    const values = [stats.Elephant, stats.Human, stats.Vehicle, Math.max(0, stats.Background)];

    values.forEach((val, i) => {
      document.getElementById(`conf-${i}`).textContent = val.toFixed(1) + '%';
      document.getElementById(`fill-${i}`).style.width = val + '%';
    });

    // Loop
    requestAnimationFrame(runCNN);
  }

});
