// ── GESTURE.JS ──
// Emulates a gesture-control webcam interface.
// For the purpose of the engineering showcase, we capture the webcam 
// and randomly simulate recognized gestures mapping to UI controls.

document.addEventListener('DOMContentLoaded', () => {

  const video = document.getElementById('gesture-video');
  const canvas = document.getElementById('gesture-canvas');
  const ctx = canvas.getContext('2d');
  const toggleBtn = document.getElementById('gesture-toggle-btn');
  const emojiDisplay = document.getElementById('gesture-emoji');
  const nameDisplay = document.getElementById('gesture-name');
  
  let isRunning = false;
  let gestureTimer = 0;
  
  const gestures = [
    { e: '✋', n: 'OPEN PALM (NAV LEFT)', action: () => window.scrollBy(-100, 0) },
    { e: '✊', n: 'FIST (NAV RIGHT)', action: () => window.scrollBy(100, 0) },
    { e: '☝️', n: 'POINT UP (SCROLL HIGH)', action: () => window.scrollBy({top: -300, behavior:'smooth'}) },
    { e: '👇', n: 'POINT DOWN (SCROLL LOW)', action: () => window.scrollBy({top: 300, behavior:'smooth'}) },
    { e: '🤟', n: 'ROCK (TRIGGER ALERT)', action: () => {
        // Tie into SMS if possible, or just animate
        nameDisplay.style.color = '#ff2244';
        setTimeout(() => nameDisplay.style.color = '#00d4ff', 1000);
    }}
  ];

  toggleBtn.addEventListener('click', async () => {
    if(!isRunning) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          isRunning = true;
          toggleBtn.textContent = '⏹ STOP SENSOR';
          drawGestureCanvas();
          gestureLoop();
        };
      } catch(err) {
        console.error("Webcam denied", err);
        nameDisplay.textContent = 'CAMERA ACCESS DENIED';
        nameDisplay.style.color = 'var(--danger)';
      }
    } else {
      isRunning = false;
      toggleBtn.textContent = '📷 START SENSOR';
      if(video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
      }
      ctx.clearRect(0,0, canvas.width, canvas.height);
      emojiDisplay.textContent = '✋';
      nameDisplay.textContent = 'WAITING FOR GESTURE';
    }
  });

  function drawGestureCanvas() {
    if(!isRunning) return;
    
    // Fill background with feed
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply cyber overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    // Draw tracking reticle
    const t = gestureTimer * 0.05;
    const hx = 200 + Math.sin(t)*50;
    const hy = 150 + Math.cos(t*1.2)*30;

    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(hx, hy, 40, 0, Math.PI*2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(hx, hy - 50); ctx.lineTo(hx, hy + 50);
    ctx.moveTo(hx - 50, hy); ctx.lineTo(hx + 50, hy);
    ctx.stroke();
    
    ctx.fillStyle = '#00d4ff';
    ctx.font = '10px Space Mono';
    ctx.fillText(`Hand Pos: [${hx.toFixed(0)}, ${hy.toFixed(0)}]`, hx+45, hy-45);

    requestAnimationFrame(drawGestureCanvas);
  }

  function gestureLoop() {
    if(!isRunning) return;
    gestureTimer++;

    // Randomly pick a gesture every ~3 seconds (roughly 180 frames at 60fps)
    if(gestureTimer % 180 === 0) {
      const g = gestures[Math.floor(Math.random() * gestures.length)];
      emojiDisplay.textContent = g.e;
      nameDisplay.textContent = g.n;
      g.action();
    } else if (gestureTimer % 180 === 60) {
      // clear after 1 second
      emojiDisplay.textContent = '⏱';
      nameDisplay.textContent = 'TRACKING...';
    }

    requestAnimationFrame(gestureLoop);
  }

});
