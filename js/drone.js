// ── DRONE.JS ──
// Simulates an aerial UAV thermal drone dispatch radar feed.

document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('drone-canvas');
  if(!canvas) return; // Wait for layout
  
  const ctx = canvas.getContext('2d');
  let droneLaunched = false;
  const launchBtn = document.getElementById('launch-drone-btn');
  let angle = 0;
  
  // Drone state
  const altEl = document.getElementById('drone-alt');
  const spdEl = document.getElementById('drone-spd');

  // Manual Control State
  let manualOverride = false;
  let droneX = 0;
  let droneY = 0;
  let keys = { w: false, a: false, s: false, d: false };

  // Key listeners
  window.addEventListener('keydown', (e) => {
    if(!droneLaunched) return;
    const key = e.key.toLowerCase();
    if(['w', 'a', 's', 'd'].includes(key)) {
      if(!manualOverride) {
        manualOverride = true;
        document.querySelector('.drone-radar-box .detection-overlay').innerHTML = '<span style="color:var(--danger)">MANUAL OVERRIDE (WASD)</span>';
      }
      keys[key] = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if(keys.hasOwnProperty(key)) keys[key] = false;
  });

  launchBtn.addEventListener('click', () => {
    droneLaunched = !droneLaunched;
    launchBtn.textContent = droneLaunched ? 'RECALL DRONE' : 'DEPLOY DRONE';
    if(droneLaunched) renderDroneRadar();
  });

  function renderDroneRadar() {
    if(!droneLaunched) {
      // Clear out
      ctx.clearRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0,0, canvas.width, canvas.height);
      return;
    }
    
    // Background thermal grid
    ctx.fillStyle = '#050d15';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
    for(let i=0; i<canvas.height; i+=40) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); ctx.stroke(); }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Radar circles
    ctx.strokeStyle = 'rgba(127, 255, 0, 0.2)';
    for(let r=50; r<=250; r+=50) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
    }

    // Radar sweep
    angle += 0.05;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 300, angle, angle + 0.2);
    ctx.lineTo(cx, cy);
    ctx.fillStyle = 'rgba(127, 255, 0, 0.3)';
    ctx.fill();

    // Drone flight path trail
    ctx.strokeStyle = manualOverride ? '#ff2244' : '#ffcc00'; // Red if manual
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    
    // Calculate position
    if(!manualOverride) {
      droneX = cx + Math.sin(angle*0.3)*120;
      droneY = cy + Math.cos(angle*0.4)*80;
    } else {
      const speed = 2.5;
      if(keys.w) droneY -= speed;
      if(keys.s) droneY += speed;
      if(keys.a) droneX -= speed;
      if(keys.d) droneX += speed;
      
      // Clamp to radar bounds
      droneX = Math.max(cx - 300, Math.min(cx + 300, droneX));
      droneY = Math.max(cy - 300, Math.min(cy + 300, droneY));
    }

    ctx.lineTo(droneX, droneY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Actual Drone crosshair
    ctx.strokeStyle = '#00d4ff';
    ctx.beginPath();
    ctx.rect(droneX - 10, droneY - 10, 20, 20);
    ctx.moveTo(droneX-15, droneY); ctx.lineTo(droneX+15, droneY);
    ctx.moveTo(droneX, droneY-15); ctx.lineTo(droneX, droneY+15);
    ctx.stroke();
    
    ctx.fillStyle = '#00d4ff';
    ctx.font = '10px Space Mono';
    ctx.fillText('UAV-01', droneX+15, droneY-15);

    // Occasional thermal blob
    if(Math.random() > 0.98) {
      ctx.fillStyle = 'rgba(255, 34, 68, 0.6)';
      ctx.beginPath(); ctx.arc(cx + Math.random()*200 - 100, cy + Math.random()*150 - 75, 8, 0, Math.PI*2); ctx.fill();
    }

    // Simulate metrics
    altEl.textContent = (120 + Math.sin(angle)*10).toFixed(1) + 'm';
    spdEl.textContent = (45 + Math.cos(angle*2)*5).toFixed(1) + 'km/h';

    requestAnimationFrame(renderDroneRadar);
  }

});
