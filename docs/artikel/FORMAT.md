# Format Artikel

Kontrak teknis untuk artikel di `_posts/`. Baca file ini sebelum menulis; aturan gaya dan penilaian ada di [STANDAR.md](STANDAR.md).

**Ringkas:** salin `templates/post.md` → ganti isi → jalankan `node scripts/check-post.mjs _posts/<file>.md` sampai exit 0.

---

## 1. Nama file dan URL

```text
_posts/YYYY-MM-DD-slug.md
```

- Bulan dan tanggal **dua digit**: `2026-01-05-...`, bukan `2026-1-5-...`.
- Slug huruf kecil, tanda hubung, 3-7 kata, tanpa karakter khusus.
- Tanggal tidak boleh melewati hari ini; Jekyll tidak mem-publish post future-dated.
- URL mengikuti permalink `/:year-:month-:day-:title/`, jadi tanggal di nama file menjadi bagian URL dan tidak bisa diubah sembarangan.

Contoh valid: `_posts/2026-11-20-dns-amplification-ddos.md`.

## 2. Front matter

Urutan baku (jangan diacak, memudahkan diff dan review):

```yaml
layout: post
title: "Judul Spesifik dan Deskriptif"
subtitle: "Hasil yang didapat pembaca dalam satu kalimat"
image: /img/topik/thumbnail.jpg
bigimg:
  - /img/topik/header.jpg
share-img: /img/topik/social.jpg
tags: [linux, docker]
```

| Field | Wajib | Tipe | Aturan | ID |
|---|---|---|---|---|
| `layout` | ya | string | Selalu `post` | A2 |
| `title` | ya | string | 45-65 karakter, tanpa clickbait/ALL CAPS | A3 |
| `subtitle` | ya | string | 80-160 karakter; menjadi `<meta name="description">` | A4 |
| `image` | ya | path | File lokal `/img/<topik>/...`; thumbnail index + `og:image` | A5 |
| `bigimg` | tidak | array | **Hapus key** bila tidak ada gambar header; jangan `bigimg: ""` | A6 |
| `share-img` | tidak | path | Gambar 1200x630 untuk kartu sosial | - |
| `tags` | ya | array | Huruf kecil, dari `_data/tags.yml`, tanpa duplikat | A7 |

Field lanjutan yang didukung layout tetapi jarang dipakai: `meta-title`, `meta-description`, `updated`, `css`, `js`, `ext-css`, `ext-js`, `googlefonts`. Jangan gunakan tanpa alasan jelas.

## 3. Kerangka body

```markdown
> **Ringkasan:** satu paragraf (masalah, solusi, hasil)

## Prasyarat
## Langkah 1 - Nama langkah
## Verifikasi
## Troubleshooting
## Kesimpulan
## Referensi
```

Bagian menyesuaikan jenis artikel. Yang **wajib selalu**: `> **Ringkasan:**` dan minimal satu heading `##`.

| Jenis | Bagian yang dipakai |
|---|---|
| Tutorial / how-to | Prasyarat, langkah bernomor, output, verifikasi, troubleshooting, cleanup |
| Konsep / explainer | Definisi, analogi, cara kerja, trade-off, batasan |
| Lab notes | Environment & versi, topologi, konfigurasi, hasil uji, analisis, pelajaran |
| Review / opini | Tesis, bukti, kontra-argumen, kesimpulan |

Aturan heading:

- Body mulai dari `##`. `#` dilarang karena header halaman sudah menghasilkan `<h1>`.
- `#` di dalam code fence (komentar shell/kode) tetap boleh — validator mengabaikannya.
- Urutan heading tidak melompat (`##` lalu `###`, jangan `##` lalu `####`).

## 4. Gambar

- Path **absolut** `/img/<topik>/nama-file.ext`; jangan `../img/...` dan jangan `img/...`.
- Setiap gambar wajib punya `alt` bermakna: `![Topologi star](/img/jaringan-komputer/topologi.png)`.
- Jangan hotlink ke situs lain; unduh ke `img/<topik>/` lalu optimalkan.
- Lebar maksimal ±1600 px, ukuran <300 KB. Thumbnail sebaiknya mendekati 1200x630.
- Verifikasi sebelum commit: `node scripts/check-post.mjs` memeriksa keberadaan file.

## 5. Tag

Sumber tunggal: [`_data/tags.yml`](../../_data/tags.yml).

- Pakai tag yang sudah ada agar indeks `/tags/` tidak terfragmentasi.
- Huruf kecil, tanpa koma di akhir, tanpa elemen kosong, tanpa tag baru yang mirip tag lama (`networking` vs `jaringan komputer`).
- Menambah tag: ubah `_data/tags.yml` di commit yang sama, dan pastikan tag dipakai minimal dua artikel.

## 6. Definition of done

```bash
node scripts/check-post.mjs _posts/<file>.md   # wajib exit 0
docker build -t yogiex-preview . && docker run --rm -p 4000:4000 -v "$PWD:/srv/jekyll" yogiex-preview
```

Urutan pemeriksaan:

1. `check-post` exit 0 (tidak ada FAIL; WARN ditinjau satu per satu).
2. Judul dan subtitle sesuai rentang; subtitle terbaca sebagai kalimat utuh di hasil pencarian.
3. Semua gambar tampil di <http://localhost:4000>, tidak ada yang 404.
4. Satu `<h1>` per halaman, heading berurutan.
5. Tanggal ≤ hari ini.

## 7. Contoh kanonik

Meniru file nyata lebih akurat daripada mengikuti deskripsi:

- [`_posts/2026-11-20-dns-amplification-ddos.md`](../../_posts/2026-11-20-dns-amplification-ddos.md) — tutorial dengan bigimg, share-img, tabel, dan referensi.
- [`_posts/2026-11-15-memahami-openstack-anatomi-cloud-privat.md`](../../_posts/2026-11-15-memahami-openstack-anatomi-cloud-privat.md) — explainer tanpa bigimg.

## 8. Kesalahan yang paling sering terjadi

| Gejala | Penyebab | Perbaikan |
|---|---|---|
| Halaman tanpa meta description | `subtitle` kosong atau hilang | Isi 80-160 karakter |
| Header putih + request `/undefined` | `bigimg: - ""` | Hapus key `bigimg` |
| Gambar 404 hanya di produksi | Path `../img/...` | Ganti ke `/img/...` |
| `<h1>` ganda | `#` di body | Ganti ke `##` |
| Artikel tidak muncul | Tanggal di masa depan | Perbaiki tanggal di nama file |
| Link eksternal jadi domain sendiri | `replace: '//', '/'` pada URL eksternal | Lihat AGENTS.md §6.1 |

## 9. Aturan yang tidak dicek mesin

Validator hanya memeriksa bentuk. Penilaian isi — akurasi, alur, nada, kelengkapan bukti — ada di [STANDAR.md](STANDAR.md) dan tetap perlu dibaca manusia atau agen.
