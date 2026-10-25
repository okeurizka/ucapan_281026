const stage = document.getElementById('stage');
const envelope = document.getElementById('envelope');
const blank = document.getElementById('blank');
const intro = document.getElementById('intro');
const hint = document.getElementById('hint');
const main = document.getElementById('main');

function zoomIn() {
  const r = blank.getBoundingClientRect();   // posisi polaroid sekarang di layar
  const s = stage.getBoundingClientRect();

  // titik pusat zoom = tengah polaroid (relatif terhadap stage)
  const ox = r.left + r.width / 2 - s.left;
  const oy = r.top + r.height / 2 - s.top;
  stage.style.transformOrigin = `${ox}px ${oy}px`;

  // geser pusat polaroid ke tengah layar, lalu perbesar sampai menutup layar
  const dx = innerWidth / 2 - (r.left + r.width / 2);
  const dy = innerHeight / 2 - (r.top + r.height / 2);
  const scale = Math.max(innerWidth / r.width, innerHeight / r.height) * 1.2;
  stage.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
}

function reveal() {
  main.hidden = false;
  intro.classList.add('hide');
  setTimeout(() => { intro.style.display = 'none'; }, 1000);  // dulu: intro.remove()
}

envelope.addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;  // cegah ketuk dua kali
  hint.style.visibility = 'hidden';
  envelope.classList.add('open');                   // 0s    flap terbuka
  setTimeout(() => stage.classList.add('out'), 700);// 0,7s  polaroid & strip keluar
  setTimeout(zoomIn, 1900);                         // 1,9s  zoom masuk
  setTimeout(reveal, 3400);                         // 3,4s  isi muncul
});

document.querySelectorAll('.polaroid').forEach(p => {
  p.addEventListener('click', () => p.classList.toggle('flipped'));
});

const closeBtn = document.getElementById('close-btn');

function closeEnvelope() {
  closeBtn.disabled = true;

  // 1. munculkan lagi intro (masih transparan) dan reset zoom tanpa animasi
  intro.style.display = '';
  stage.style.transition = 'none';
  stage.style.transform = '';
  stage.style.transformOrigin = '';
  void intro.offsetWidth;          // paksa browser menerapkan perubahan di atas dulu
  stage.style.transition = '';

  // 2. intro memudar masuk (amplop masih terbuka, polaroid & strip masih keluar)
  intro.classList.remove('hide');

  // 3. polaroid & strip masuk lagi, lalu flap menutup
  setTimeout(() => stage.classList.remove('out'), 1100);
  setTimeout(() => envelope.classList.remove('open'), 2000);

  // 4. rapikan supaya amplop bisa dibuka lagi
  setTimeout(() => {
    main.hidden = true;
    window.scrollTo(0, 0);
    hint.style.visibility = 'visible';
    closeBtn.disabled = false;
  }, 2800);
}

closeBtn.addEventListener('click', closeEnvelope);

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      io.unobserve(e.target);        // cukup sekali, tidak diulang
    }
  });
}, { threshold: 0.2 });               // muncul saat 20% terlihat

document.querySelectorAll('.reveal').forEach(el => io.observe(el));