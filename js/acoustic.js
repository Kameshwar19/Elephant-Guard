// ── ACOUSTIC.JS ──
// Simulates infrasound elephant rumble acoustic waveform visualization.

document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('acoustic-canvas');
  if(!canvas) return;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const ctx = canvas.getContext('2d');
  let time = 0;
  // History for trailing waveform
  const waves = [];
  const maxWaves = 60;
  
  const peakEl = document.getElementById('ac-peak');
  const ampEl = document.getElementById('ac-amp');

  function renderAcoustic() {
    ctx.fillStyle = '#050d15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    time += 0.1;
    
    // Generate new wave data
    let rumbleActive = Math.sin(time * 0.05) > 0.7; // simulate an event periodically
    let baseFreq = rumbleActive ? 16 + Math.random()*4 : 22 + Math.random()*10; 
    let amplitude = rumbleActive ? 40 + Math.random()*20 : 10 + Math.random()*10;
    
    // Record to history
    waves.unshift({ f: baseFreq, a: amplitude, t: time });
    if(waves.length > maxWaves) waves.pop();

    // Draw the grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.height; i+=20) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Connect dots sequentially for smooth scrolling spectrogram pseudo-view
    const W = canvas.width;
    const H = canvas.height;
    const step = W / maxWaves;

    ctx.strokeStyle = rumbleActive ? '#ff2244' : '#00d4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for(let i=0; i<waves.length; i++) {
       const x = i * step;
       const w = waves[i];
       // Complex wave shape overlaying
       const yOffset = Math.sin(w.t * w.f * 0.1) * w.a;
       // Add some noise
       const noise = (Math.random()-0.5) * w.a * 0.5;
       const y = H/2 + yOffset + noise;
       
       if(i===0) ctx.moveTo(x, y);
       else ctx.lineTo(x, y);
       
       // Draw vertical mirrored fills for that classic spectrogram look
       ctx.fillStyle = rumbleActive ? 'rgba(255,34,68,0.05)' : 'rgba(0,212,255,0.05)';
       ctx.fillRect(x, H/2 - Math.abs(yOffset), step, Math.abs(yOffset)*2);
    }
    ctx.stroke();

    // UI Updates
    peakEl.textContent = baseFreq.toFixed(1) + ' Hz';
    peakEl.style.color = rumbleActive ? 'var(--danger)' : 'var(--accent)';
    ampEl.textContent = rumbleActive ? 'ELEVATED - RUMBLE DETECTED' : 'NOMINAL';
    ampEl.style.color = rumbleActive ? 'var(--danger)' : 'var(--accent2)';

    requestAnimationFrame(renderAcoustic);
  }

  // Delay start to sync with dashboard reveal
  setTimeout(() => {
    requestAnimationFrame(renderAcoustic);
  }, 1000);

});
