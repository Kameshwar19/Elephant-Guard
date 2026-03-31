// ── APP.JS ──
// Handles core animations, real-time logging, and sparklines without infinite height bugs.

document.addEventListener('DOMContentLoaded', () => {

  // 1. Alert Banner
  const alertBanner = document.getElementById('alert-banner');
  const alertText = document.getElementById('alert-text');
  
  function triggerAlert(msg, type='info') {
    alertText.textContent = msg;
    alertBanner.className = 'show ' + type;
    setTimeout(() => alertBanner.className = '', 5000);
  }

  document.getElementById('close-alert-btn').onclick = () => alertBanner.className = '';
  setTimeout(() => triggerAlert('System Initialised. 12 Nodes Online.', 'info'), 1500);

  // 2. Dash Metrics & Logs
  const feed = document.getElementById('alert-feed');
  const logs = [
    { m: 'Node C3 connection lost', t: 'warn' },
    { m: 'Herd movement detected Sector 4', t: 'crit' },
    { m: 'Signal stabilized on Edge Gateway', t: 'info' }
  ];
  let logIdx = 0;

  setInterval(() => {
    // Add log
    const l = logs[logIdx % logs.length];
    logIdx++;
    const el = document.createElement('div');
    el.className = 'alert-item';
    el.innerHTML = `<span class="a-badge ${l.t}">${l.t.toUpperCase()}</span> <span>${l.m}</span> <span class="a-time">${new Date().toLocaleTimeString()}</span>`;
    feed.insertBefore(el, feed.firstChild);
    if(feed.children.length > 5) feed.removeChild(feed.lastChild);

    // Update numbers
    document.getElementById('ir-val').textContent = (-60 - Math.random()*15).toFixed(1);
    document.getElementById('seismic-val').textContent = (0.2 + Math.random()*0.5).toFixed(2);
  }, 3000);

  // 3. Sparkline Charts (Bound inside fixed-height wrapper)
  function makeSpark(id, color) {
    const ctx = document.getElementById(id).getContext('2d');
    const d = Array.from({length:15}, () => Math.random()*50 + 20);
    return new Chart(ctx, {
      type: 'line',
      data: { labels: d.map((_,i)=>i), datasets: [{ data: d, borderColor: color, fill:true, backgroundColor: color.replace('1)', '0.1)'), tension: 0.4, pointRadius: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display:false } }, scales: { x:{display:false}, y:{display:false} }, animation: {duration: 0} }
    });
  }

  const irChart = makeSpark('ir-sparkline', 'rgba(0, 212, 255, 1)');
  const seChart = makeSpark('seismic-sparkline', 'rgba(127, 255, 0, 1)');

  setInterval(() => {
    [irChart, seChart].forEach(c => {
      c.data.datasets[0].data.shift();
      c.data.datasets[0].data.push(Math.random()*50 + 20);
      c.update();
    });
  }, 1000);

  // 4. Parallax Background
  const canvas = document.getElementById('three-canvas');
  if (canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(1000 * 3);
    for(let i=0; i<3000; i++) pos[i] = (Math.random()-0.5)*20;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.02, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);

    let mx=0, my=0;
    document.addEventListener('mousemove', e => {
      mx = (e.clientX/window.innerWidth - 0.5)*0.5;
      my = (e.clientY/window.innerHeight - 0.5)*0.5;
    });

    function render() {
      requestAnimationFrame(render);
      stars.rotation.y += 0.0005;
      camera.position.x += (mx - camera.position.x)*0.05;
      camera.position.y += (-my - camera.position.y)*0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    render();
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // 5. SMS / Push Notification Popups
  const smsContainer = document.getElementById('sms-container');
  const smsMessages = [
    { sender: 'Ranger Station 1', msg: 'Visual confirmation of matriarch near Sector 4 boundaries.', type: 'info' },
    { sender: 'Automated Drone', msg: 'Battery low (15%). Returning to base. Please dispatch Unit 2.', type: 'warn' },
    { sender: 'Geo-Fence System', msg: 'CRITICAL: Fence breached at coordinates 10.42, 77.08. Movement detected.', type: 'crit' },
    { sender: 'Acoustic Array', msg: 'Infrasound rumbles triangulated 2km North of Village border.', type: 'warn' }
  ];
  let smsIdx = 0;

  function triggerSMS() {
    const data = smsMessages[smsIdx % smsMessages.length];
    smsIdx++;
    
    const toast = document.createElement('div');
    toast.className = `sms-toast ${data.type}`;
    toast.innerHTML = `
      <div class="sms-header">
        <span class="sms-sender">👤 ${data.sender}</span>
        <span class="sms-time">${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="sms-body">${data.msg}</div>
    `;
    
    smsContainer.appendChild(toast);
    
    // Slighly delay the slide in for browser paint
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { if(toast.parentNode) toast.remove(); }, 500);
    }, 8000);
  }

  // Initial SMS after login, then periodically
  setTimeout(triggerSMS, 15000);
  setInterval(triggerSMS, 35000);

});
