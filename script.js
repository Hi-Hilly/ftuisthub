// ============================================================
//  KONFIGURASI SUPABASE — ISI BAGIAN INI DULU!
//  Cara dapat URL & KEY: Supabase → Settings → API
// ============================================================
const SUPABASE_URL = 'https://pwdiqckmrpvjwtbstiqx.supabase.co/rest/v1/'; // <-- ganti ini
const SUPABASE_KEY = 'sb_publishable_wCbv97L4jw0ufklFjJU9DA_ERLJYweY';                // <-- ganti ini
// ============================================================

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── LOAD DATA ───────────────────────────────────────────────

async function loadBeasiswa() {
  const container = document.getElementById('beasiswaContainer');
  container.innerHTML = '<p>Memuat data...</p>';

  const sortVal = document.getElementById('sortSelect')?.value || 'asc';
  const ascending = sortVal !== 'desc';

  const { data, error } = await db
    .from('beasiswa')
    .select('*')
    .order('deadline', { ascending });

  if (error) {
    container.innerHTML = '<p>Gagal memuat data beasiswa.</p>';
    console.error(error);
    return;
  }

  const keyword = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const filtered = (data || []).filter(item =>
    item.nama?.toLowerCase().includes(keyword) ||
    item.deskripsi?.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p>Belum ada data beasiswa.</p>';
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="card" onclick="openModal('${escHtml(item.nama)}', '${escHtml(item.deskripsi || '')}', '${item.deadline || ''}', '${item.image_url || ''}')">
      ${item.image_url ? `<img src="${item.image_url}" alt="${escHtml(item.nama)}" style="width:100%;border-radius:8px;margin-bottom:10px;object-fit:cover;max-height:160px;">` : ''}
      <h3>${escHtml(item.nama)}</h3>
      ${item.deadline ? `<p style="color:#888;font-size:0.85rem;">⏰ Deadline: ${formatTanggal(item.deadline)}</p>` : ''}
      <p>${escHtml((item.deskripsi || '').substring(0, 100))}${(item.deskripsi || '').length > 100 ? '...' : ''}</p>
    </div>
  `).join('');
}

async function loadEvents() {
  const container = document.getElementById('eventContainer');
  container.innerHTML = '<p>Memuat data...</p>';

  const sortVal = document.getElementById('sortSelect')?.value || 'asc';
  const ascending = sortVal !== 'desc';

  const { data, error } = await db
    .from('events')
    .select('*')
    .order('tanggal', { ascending });

  if (error) {
    container.innerHTML = '<p>Gagal memuat data event.</p>';
    console.error(error);
    return;
  }

  const keyword = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const filtered = (data || []).filter(item =>
    item.nama?.toLowerCase().includes(keyword) ||
    item.deskripsi?.toLowerCase().includes(keyword)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<p>Belum ada data event.</p>';
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="card" onclick="openModal('${escHtml(item.nama)}', '${escHtml(item.deskripsi || '')}', '${item.tanggal || ''}', '${item.image_url || ''}')">
      ${item.image_url ? `<img src="${item.image_url}" alt="${escHtml(item.nama)}" style="width:100%;border-radius:8px;margin-bottom:10px;object-fit:cover;max-height:160px;">` : ''}
      <h3>${escHtml(item.nama)}</h3>
      ${item.tanggal ? `<p style="color:#888;font-size:0.85rem;">📅 Tanggal: ${formatTanggal(item.tanggal)}</p>` : ''}
      <p>${escHtml((item.deskripsi || '').substring(0, 100))}${(item.deskripsi || '').length > 100 ? '...' : ''}</p>
    </div>
  `).join('');
}

// ─── SEARCH & SORT ───────────────────────────────────────────

function handleSearch() {
  loadBeasiswa();
  loadEvents();
}

function handleSort() {
  loadBeasiswa();
  loadEvents();
}

// ─── MODAL ───────────────────────────────────────────────────

function openModal(title, body, tanggal, imageUrl) {
  const modalTitle = document.getElementById('modal-title');
  const modalBody  = document.getElementById('modal-body');
  const modal      = document.getElementById('modal');

  modalTitle.textContent = title;

  let content = '';
  if (imageUrl) {
    content += `<img src="${imageUrl}" style="width:100%;border-radius:8px;margin-bottom:12px;object-fit:cover;max-height:200px;">`;
  }
  if (tanggal) {
    content += `<p style="color:#888;margin-bottom:8px;">📅 ${formatTanggal(tanggal)}</p>`;
  }
  content += `<p>${body || 'Tidak ada deskripsi.'}</p>`;
  modalBody.innerHTML = content;

  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Tutup modal kalau klik di luar kotak
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modal');
  if (e.target === modal) closeModal();
});

// ─── SOSIAL MEDIA ────────────────────────────────────────────

function openLink(url) {
  window.open(url, '_blank');
}

// ─── HELPERS ─────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTanggal(str) {
  if (!str) return '-';
  const d = new Date(str);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── INISIALISASI ─────────────────────────────────────────────

// Pasang event listener search & sort
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const sortSelect  = document.getElementById('sortSelect');

  if (searchInput) searchInput.addEventListener('input', handleSearch);
  if (sortSelect)  sortSelect.addEventListener('change', handleSort);

  loadBeasiswa();
  loadEvents();
});
