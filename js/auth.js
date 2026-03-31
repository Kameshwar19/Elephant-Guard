// ── AUTH.JS ──
// Handles the futuristic login sequence and unlocks the dashboard.

document.addEventListener('DOMContentLoaded', () => {

  const loginScreen = document.getElementById('login-overlay');
  const nav = document.getElementById('main-nav');
  const app = document.getElementById('app');
  const submitBtn = document.getElementById('login-submit');
  const inputCode = document.getElementById('auth-code');
  const statusMsg = document.getElementById('login-status');

  // Ensure login screen is visible
  loginScreen.classList.add('active');

  function authenticate() {
    const code = inputCode.value;
    statusMsg.style.color = 'var(--text-dim)';
    statusMsg.textContent = 'VERIFYING CREDENTIALS...';
    
    // Simulate network delay and decryption
    setTimeout(() => {
      // Mock logic: Any 4-digit code works for demonstration, or specifically '2024'
      if (code.length >= 0) { // Accept anything for demo
        statusMsg.style.color = 'var(--accent2)';
        statusMsg.textContent = 'ACCESS GRANTED. DECRYPTING FEED...';
        
        // Run glitch animation before hiding
        const glitchLayer = document.querySelector('.login-glitch-layer');
        glitchLayer.style.display = 'block';
        
        gsap.to('.login-box', { scale: 1.1, opacity: 0, duration: 0.6, delay: 0.5, ease: 'power2.in' });
        gsap.to(loginScreen, { opacity: 0, backdropFilter: 'blur(0px)', duration: 0.8, delay: 0.8, onComplete: () => {
          loginScreen.style.display = 'none';
          
          // Reveal Dashboard
          nav.style.display = 'flex';
          app.style.display = 'block';
          
          gsap.to([nav, app], { opacity: 1, duration: 1, ease: 'power2.out' });
          
          // Trigger entry animations from app.js if needed or let them run manually
          gsap.from('.dash-card, .sec-header', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
        }});
      } else {
        statusMsg.style.color = 'var(--danger)';
        statusMsg.textContent = 'ACCESS DENIED. INVALID CREDENTIALS.';
        inputCode.value = '';
        // Shake animation
        gsap.fromTo('.login-box', { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 5 });
      }
    }, 800);
  }

  submitBtn.addEventListener('click', authenticate);
  inputCode.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') authenticate();
  });

});
