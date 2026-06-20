/* redmoon.js
   Test implementation: red moon overlay effect with title.
   Guidelines:
   - To disable without deleting code, set `enabled` to false below.
   - To remove completely, delete this file and the <script> tag in index.html, and delete redmoon.css.

   This version attempts to load yoruaka_logo/yoru_aka_com.png and displays it
   with a title "夜の赤月～Today Once More～" below it.
*/

(function redMoonEffect(){
  const enabled = true; // set false to disable quickly
  if (!enabled) return;

  window.addEventListener('load', () => {
    // Start 1s after full page load
    setTimeout(() => {
      // Create overlay element
      const overlay = document.createElement('div');
      overlay.id = 'redmoon-overlay';
      overlay.className = 'redmoon-overlay';

      // Create container for moon and title (flexbox layout)
      const container = document.createElement('div');
      container.className = 'redmoon-container';

      // Create moon element
      const moon = document.createElement('div');
      moon.className = 'redmoon-moon';

      // Try to load provided image; if available, show it inside the moon element
      const imgPath = 'yoruaka_logo/yoru_aka_com.png';
      const probe = new Image();
      probe.src = imgPath;
      probe.onload = () => {
        // Insert img element and remove CSS gradient background
        const imgEl = document.createElement('img');
        imgEl.src = imgPath;
        imgEl.alt = '夜の赤月';
        imgEl.className = 'redmoon-image';
        moon.classList.add('has-img');
        moon.appendChild(imgEl);
      };
      probe.onerror = () => {
        // failed to load image — keep CSS gradient as fallback
        // no action needed
      };

      // Create title element (now an image instead of text)
      const title = document.createElement('img');
      title.className = 'redmoon-title';
      title.src = 'yoruaka_logo/title_logo.png';
      title.alt = '夜の赤月─Today Once More─';

      // Create subtitle element
      const subtitle = document.createElement('p');
      subtitle.className = 'redmoon-subtitle';
      subtitle.textContent = '新規連載開始予定！ 詳細は制作物一覧から！';

      container.appendChild(moon);
      container.appendChild(title);
      container.appendChild(subtitle);
      overlay.appendChild(container);
      document.body.appendChild(overlay);

      // Trigger fade-in in next frame
      requestAnimationFrame(() => {
        overlay.classList.add('active');
        // Stagger title animation: start ~400ms after moon begins fading in
        setTimeout(() => {
          title.classList.add('active');
          subtitle.classList.add('active');
        }, 400);
      });

      // Show length (milliseconds)
      const SHOW_MS = 3000;

      // After SHOW_MS, fade out and remove — all fade together
      setTimeout(() => {
        overlay.classList.remove('active');
        title.classList.remove('active');
        subtitle.classList.remove('active');
        // Wait for CSS transition to finish, then remove element
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 600);
      }, SHOW_MS);
    }, 1000);
  });
})();
