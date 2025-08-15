// format rupiah
function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

// Simpan & ambil cart sederhana via localStorage
const CART_KEY = "mlbb_cart_v1";
function setCart(obj) {
  localStorage.setItem(CART_KEY, JSON.stringify(obj));
}
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function clearCart() {
  localStorage.removeItem(CART_KEY);
}

// untuk di halaman produk
function beliPaket(id, nama, diamonds, harga) {
  setCart({ id, nama, diamonds, harga, qty: 1, ts: Date.now() });
  window.location.href = "transaksi.html";
}

// untuk di halaman transaksi
function loadRingkasTransaksi() {
  const c = getCart();
  if (!c.nama) {
    document.getElementById("ringkas").innerHTML =
      "<em>Belum ada paket dipilih. Silakan kembali ke halaman Produk.</em>";
    return;
  }
  document.getElementById("rNama").textContent = c.nama;
  document.getElementById("rDiamonds").textContent = c.diamonds + " DM";
  document.getElementById("rHarga").textContent = rupiah(c.harga);
  document.getElementById("subtotal").textContent = rupiah(c.harga * c.qty);
}

function kirimTransaksi(ev) {
  ev.preventDefault();
  const c = getCart();
  if (!c.nama) {
    return alert("Pilih paket terlebih dahulu.");
  }
  const f = ev.target;
  const data = {
    paket: c,
    idml: f.idml.value.trim(),
    server: f.server.value.trim(),
    nick: f.nick.value.trim(),
    email: f.email.value.trim(),
    metode: f.metode.value,
    catatan: f.catatan.value.trim(),
    alamat: f.alamat.value.trim(),
    ts: Date.now(),
    inv: "INV" + Math.floor(100000 + Math.random() * 899999),
  };
  localStorage.setItem("mlbb_invoice_v1", JSON.stringify(data));
  window.location.href = "invoice.html";
}

// untuk di halaman invoice
function renderInvoice() {
  const d = JSON.parse(localStorage.getItem("mlbb_invoice_v1") || "null");
  if (!d) {
    document.getElementById("invoiceWrap").innerHTML =
      "<p>Invoice tidak ditemukan. Silakan lakukan transaksi dari halaman Produk.</p>";
    return;
  }
  const t = new Date(d.ts);
  document.getElementById("invNo").textContent = d.inv;
  document.getElementById("invDate").textContent = t.toLocaleString("id-ID");
  document.getElementById("invNama").textContent = d.nick || "-";
  document.getElementById("invID").textContent = d.idml + " (" + d.server + ")";
  document.getElementById("invEmail").textContent = d.email || "-";
  document.getElementById("invMetode").textContent = d.metode;
  document.getElementById("invItem").textContent =
    d.paket.nama + " – " + d.paket.diamonds + " DM";
  document.getElementById("invHarga").textContent = rupiah(d.paket.harga);
  document.getElementById("invSubtotal").textContent = rupiah(
    d.paket.harga * d.paket.qty
  );
  document.getElementById("invTotal").textContent = rupiah(
    d.paket.harga * d.paket.qty
  );
}

function cetak() {
  window.print();
}
