// Keep track of which element is being dragged and offset inside it
let draggingEl = null;
let grabOffsetX = 0;
let grabOffsetY = 0;

document.addEventListener('DOMContentLoaded', () => {
  const sheet = document.getElementById('stickersheet');

  // Delegate dragstart for ANY .sticker (works for many images)
  document.addEventListener('dragstart', (ev) => {
    const t = ev.target;
    if (!(t instanceof HTMLElement) || !t.classList.contains('sticker')) return;

    // Ensure each sticker has a unique id (auto-assign if missing)
    if (!t.id) t.id = 'sticker-' + Math.random().toString(36).slice(2, 9);

    draggingEl = t;

    const r = t.getBoundingClientRect();
    grabOffsetX = ev.clientX - r.left;
    grabOffsetY = ev.clientY - r.top;

    ev.dataTransfer.setData('text/plain', t.id);
    ev.dataTransfer.effectAllowed = 'move';
    if (ev.dataTransfer.setDragImage) {
      ev.dataTransfer.setDragImage(t, grabOffsetX, grabOffsetY);
    }
  }, true);

  sheet.addEventListener('dragover', (ev) => {
    ev.preventDefault();                  // allow drop
    ev.dataTransfer.dropEffect = 'move';
  });

  sheet.addEventListener('drop', (ev) => {
    ev.preventDefault();

    const id = ev.dataTransfer.getData('text/plain');
    const el = document.getElementById(id) || draggingEl;
    if (!el) return;

    const sheetRect = sheet.getBoundingClientRect();

    // Cursor position relative to the sheet, minus where you grabbed the sticker
    let x = ev.clientX - sheetRect.left - grabOffsetX;
    let y = ev.clientY  - sheetRect.top  - grabOffsetY;

    // Move into the sheet on first drop; subsequent drops just reposition
    if (el.parentElement !== sheet) {
      sheet.appendChild(el);
      el.classList.add('placed');
      el.setAttribute('draggable', 'true');
      el.style.position = 'absolute';
    }

    // Clamp within bounds
    const w = el.offsetWidth  || 100;
    const h = el.offsetHeight || 100;
    x = Math.max(0, Math.min(x, sheet.clientWidth  - w));
    y = Math.max(0, Math.min(y, sheet.clientHeight - h));

    el.style.left = x + 'px';
    el.style.top  = y + 'px';

    // reset
    draggingEl = null;
    grabOffsetX = grabOffsetY = 0;
  });
});

