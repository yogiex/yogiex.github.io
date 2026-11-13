# AGENTS.md — Panduan Kerja untuk AI Coding Agent

Dokumen ini menjelaskan cara kerja repository **yogiex.github.io** dan aturan yang harus diikuti saat mengubahnya. Baca bagian **Aturan Teknis Penting** dan **Known Issues** sebelum menyentuh template.

---

## 1. Ringkasan Proyek

Blog statis pribadi **Priyagung Yogi** yang dibangun dengan **Jekyll** dan dipublikasikan melalui **GitHub Pages**.

- Live: <https://yogiex.github.io>
- Default branch: `master`
- Sumber deploy: branch `master` (GitHub Pages build native, **tanpa GitHub Actions**)
- CI: `.github/workflows/build.yml` hanya memvalidasi build, tidak melakukan deploy
- Basis tema: fork **Beautiful Jekyll** (Dean Attali) generasi 2016–2018, sudah banyak dimodifikasi
- Bahasa konten: Indonesia (informal)
- Komentar: **sengaja dihapus** — tidak ada Disqus, Staticman, atau Facebook Comments
- Lisensi tema: MIT — **jangan hapus kredit “Theme by beautiful-jekyll” di footer**

Konsekuensi penting: **setiap push ke `master` langsung menjadi situs produksi.** Tidak ada staging otomatis. Untuk perubahan berisiko, kerjakan di branch/PR dan preview lokal terlebih dahulu.

---

## 2. Peta File

```
_config.yml              Konfigurasi utama: nav, warna, analytics, permalink
index.html               Daftar post + paginator (5 post/halaman)
aboutme.md               Halaman profil
tags.html                Indeks tag
404.html                 Halaman 404
feed.xml                 RSS manual (bukan jekyll-feed)

_layouts/
  base.html              Kerangka HTML: head, nav, konten, footer, script
  page.html              Halaman umum (index, about, tags)
  post.html              Artikel + share + pager
  default.html           404 (memakai base)
  minimal.html           Tidak dipakai

_includes/
  head.html              Meta, SEO/OpenGraph, CSS, analytics
  nav.html               Navbar + avatar
  header.html            Header halaman/post + big image
  footer.html            Footer + tautan sosial
  footer-scripts.html    Pemuatan JS
  social-share.html      Tombol share
  analytics.html         GA4; hanya dimuat bila site.google_analytics terisi
  ext-css.html           Pemuatan CSS eksternal
  ext-js.html            Pemuatan JS eksternal
  navbarlink.html        Logika tautan internal vs eksternal
  tanggal.html           Format tanggal Indonesia
  footer-minimal.html    Footer untuk layout minimal (tidak dipakai)

_posts/                  Artikel Markdown, nama YYYY-MM-DD-slug.md
img/                     Gambar artikel, dikelompokkan per topik
css/main.css             CSS utama; diproses Liquid (warna dari _config.yml)
css/pygment_highlights.css  Diimpor dari main.css
js/main.js               Navbar, big image, interaksi kecil
_data/SocialNetworks.yml Mapping ikon sosial

Gemfile / Gemfile.lock   Pin github-pages ~> 233 (Jekyll 3.10) untuk build lokal
Dockerfile               Preview lokal: ruby:3.2 + jekyll serve di port 4000
.github/workflows/build.yml  CI build-only + 4 pemeriksaan HTML
diagrams/                Diagram arsitektur (HTML + PNG), di-exclude dari build
```

14 aset mati (Bootstrap non-min, `normalize.css`, beberapa gambar) sudah dihapus pada commit `d724895`. Sisa yang tidak terpakai: `css/main-minimal.css` dan `_includes/footer-minimal.html`, keduanya hanya dirujuk `_layouts/minimal.html` yang juga tidak dipakai.

---

## 3. Alur Build dan Deploy

```
_posts/*.md / *.html
        │
        ▼
Jekyll (GitHub Pages)
        │  _layouts/base.html
        │    ├── _includes/head.html
        │    ├── _includes/nav.html
        │    ├── _includes/header.html
        │    ├── konten halaman
        │    ├── _includes/footer.html
        │    └── _includes/footer-scripts.html
        ▼
_site/  →  https://yogiex.github.io
```

- `css/main.css` memiliki front matter `layout: null`, sehingga Liquid di dalamnya dieksekusi. **Warna diatur lewat `_config.yml`, bukan dengan mengedit nilai hex di CSS.**
- Permalink saat ini:

  ```yaml
  permalink: /:year-:month-:day-:title/
  ```

  Hasilnya URL **satu segmen**, contoh `/2025-12-25-etherchannel-networks/`.
  Jangan mengubah pola ini tanpa mengonversi semua path gambar relatif (`../img/...`, `img/...`) menjadi absolut `/img/...`, karena path relatif saat ini bekerja karena URL hanya satu segmen.
- `jekyll-paginate` dan `jekyll-sitemap` aktif. `feed.xml` dibuat manual; `jekyll-feed` tidak dipakai.
- Tidak ada test suite atau linter. CI ada: `.github/workflows/build.yml` menjalankan `bundle exec jekyll build --strict_front_matter` lalu 4 pemeriksaan HTML (URL satu-slash, `url(undefined)`, meta description, jumlah `<h1>`). Workflow ini **belum pernah hijau**; lihat §7.
- `AGENTS.md` di-exclude dari build agar tidak ikut terpublikasi sebagai file statis.

---

## 4. Setup dan Preview Lokal

### Kondisi saat ini

Build lokal sudah reproducible sejak commit `2b8e083` (per November 2026):

- `Gemfile` mem-pin `gem "github-pages", "~> 233"` -> Jekyll 3.10.0, kramdown 2.4.0, rouge 3.30.0.
- `Gemfile.lock` di-generate hanya untuk platform `x86_64-linux`.
- `Dockerfile` memakai image `ruby:3.2` dengan bundler 2.4.22, dan menjalankan `bundle exec jekyll serve` di port 4000.

**Jangan** menjalankan `bundle update` di repo tanpa diminta. Hasilnya mengubah `Gemfile.lock` dan bisa berbeda dari gem yang dipakai GitHub Pages.

### Preview lokal

Docker (disarankan, sama dengan CI):

```bash
docker build -t yogiex-preview .
docker run --rm -p 4000:4000 -v "$PWD:/srv/jekyll" yogiex-preview
```

Buka <http://localhost:4000>. Tanpa Docker, butuh Ruby 3.2 dan Bundler 2.4:

```bash
bundle install
bundle exec jekyll serve
```

Di macOS Apple Silicon, tambahkan platform ke lock lebih dulu:

```bash
bundle lock --add-platform arm64-darwin && bundle install
```

### Validasi build

```bash
bundle exec jekyll build --strict_front_matter --trace
```

Per November 2026 perintah ini **lulus** dari HEAD, baik memakai gem dari image maupun `bundle install` bersih. Kalau gagal, tersangka pertama adalah front matter YAML baru.

### Catatan CI

`.github/workflows/build.yml` sudah berjalan tetapi selalu gagal di langkah build. Kegagalan **tidak bisa direproduksi lokal**: HEAD lulus di `ruby:3.2`, dengan maupun tanpa gem dari cache. Log run butuh token untuk dibaca. Jangan menyimpulkan merahnya CI disebabkan perubahan Anda sebelum log diperiksa.

---

## 5. Konvensi Menulis Artikel

Buat file `_posts/YYYY-MM-DD-slug.md` dengan bulan dan tanggal **dua digit** (contoh: `2026-01-05-judul-artikel.md`, bukan `2026-1-5-...`).

Template front matter:

```yaml
---
layout: post
title: "Judul Artikel"
subtitle: "Ringkasan satu kalimat untuk meta description"
image: /img/topik/thumbnail.png
bigimg:
  - /img/topik/header.jpg
tags: [jaringan komputer, linux]
---
```

Aturan:

- `subtitle` wajib (80–160 karakter). Tanpa subtitle, halaman tidak punya `<meta name="description">`.
- `image` dipakai sebagai thumbnail di index dan sebagai `og:image` saat post dibagikan. Avatar navbar memakai `site.avatar`, bukan `page.image`. Gunakan gambar kecil/menarik, bukan screenshot panjang.
- `bigimg` adalah array. Jika tidak punya gambar header, **hapus key `bigimg` sepenuhnya**. Jangan menulis `bigimg: - ""` — nilai kosong menyebabkan request `/undefined` dan header rusak.
- Path gambar **selalu absolut** dari root, contoh `/img/jaringan-komputer/topologi.png`. Hindari `../img/...` dan `img/...`.
- Jangan hotlink gambar dari situs lain. Banyak hotlink sudah mati (docker.com, ResearchGate, SDX Central, i.ibb.co). Unduh ke `img/<topik>/` dan optimalkan.
- Teks `alt` wajib diisi: `![Topologi star](/img/...png)`, jangan `![](...)`.
- Ukuran gambar: usahakan lebar maksimal ±1600 px dan ukuran <300 KB. Konversi screenshot ke WebP/JPEG bila memungkinkan. Jangan menambahkan gambar >1 MB tanpa alasan.
- Heading di dalam artikel mulai dari `##`, bukan `#`. Header halaman sudah menghasilkan `<h1>`; `#` di body menciptakan `<h1>` ganda.
- Tag: huruf kecil, tanpa koma di akhir, tanpa elemen kosong. Gunakan tag yang sudah ada agar indeks tag tidak makin terfragmentasi. Contoh tag yang dipakai: `jaringan komputer`, `linux`, `docker`, `container`, `devops`, `fundamental`, `basic`, `operating system`, `github`.
- **Jangan menambahkan komentar.** Fitur komentar sudah dihapus dari situs; jangan menambahkan field `comments` atau sistem komentar baru tanpa persetujuan.
- Tanggal di nama file tidak boleh melewati hari ini. Jekyll tidak mem-publish post yang tanggalnya future-dated.
- Slug: huruf kecil, tanda hubung, tanpa spasi/karakter khusus, idealnya 3–7 kata. Contoh: `2026-11-09-dasar-docker-compose.md`.
- Bahasa dan gaya mengikuti artikel yang ada (Indonesia informal). Untuk **postingan baru** atau saat diminta, terapkan **Standar Penulisan Profesional** di bawah. Untuk artikel lama, jangan menulis ulang suara/opini penulis tanpa izin.
- Jika menambah referensi, gunakan URL HTTPS dan cek statusnya. Jangan menyalin URL panjang tanpa kemungkinan wrap; gunakan teks link yang lebih pendek.

### Standar Penulisan Profesional

Postingan baru harus lolos standar ini. Profesional bukan berarti formal kaku: tetap personal dan mudah dibaca, tetapi akurat, terstruktur, dan bisa dipertanggungjawabkan.

#### Prinsip dasar

1. **Akurasi sebelum gaya.** Jangan mengorbankan kebenaran teknis demi kalimat yang terdengar bagus.
2. **Satu artikel, satu tujuan.** Tentukan di awal: mengajari, menjelaskan konsep, mencatat lab, atau memberi opini.
3. **Tulis untuk pembaca nyata.** Sebutkan siapa target pembaca, apa yang sudah harus diketahui, dan hasil yang didapat setelah membaca.
4. **Tunjukkan, jangan hanya mengklaim.** Sertakan perintah, konfigurasi, output, atau bukti pengujian.
5. **Bedakan fakta, pengalaman, dan opini.** Jangan menyamarkan opini sebagai fakta.
6. **Hormati keamanan dan privasi.** Sensor IP publik, token, email, dan data sensitif.

#### Struktur wajib

- **Judul** 45–65 karakter, spesifik, tanpa clickbait/ALL CAPS. Sebut teknologi dan manfaatnya. Contoh: “Membuat Web Service NGINX dengan Docker”.
- **Subtitle** satu kalimat, 80–160 karakter, menjelaskan hasil yang didapat pembaca. Subtitle ini menjadi meta description.
- **Pembuka** 2–4 paragraf pendek: masalah/konteks, target pembaca, prasyarat, dan cakupan artikel. Tanpa basa-basi panjang.
- **Daftar isi** untuk artikel >800 kata atau >4 bagian utama.
- **Isi** memakai `##` dan `###`, satu ide per bagian, paragraf 2–5 kalimat.
- **Penutup** berisi ringkasan, batasan, dan langkah berikutnya.
- **Referensi** minimal satu sumber resmi (dokumentasi vendor, RFC, man page) untuk klaim teknis.

#### Sesuaikan dengan jenis artikel

| Jenis | Bagian yang wajib ada |
|---|---|
| **Tutorial / how-to** | Prasyarat, langkah bernomor, perintah, output yang diharapkan, verifikasi, troubleshooting, cleanup |
| **Konsep / explainer** | Definisi, analogi, cara kerja, trade-off, use case, batasan |
| **Lab notes** | Environment/versi, topologi, konfigurasi, hasil uji, analisis, pelajaran |
| **Review / opini** | Tesis, bukti, kontra-argumen, kesimpulan yang tidak berlebihan |

#### Bahasa dan gaya

- Gunakan bahasa Indonesia yang baku tetapi tidak kaku. Konsisten: “saya” untuk penulis, “Anda” untuk pembaca (atau “kita” jika memang mengajak bersama).
- Hindari slang berlebihan, “wkwk”, ALL CAPS, dan hiperbola. Istilah informal boleh, tetapi jangan sampai mengaburkan makna.
- Definisikan akronim saat pertama muncul: “Software Defined Network (SDN)”.
- Kapitalisasi nama merek secara konsisten: Docker, Linux, GitHub, NGINX, Cisco, Kubernetes.
- Gunakan *italic* untuk istilah asing pada kemunculan pertama bila perlu; jangan mencampur bahasa dalam satu kalimat tanpa alasan.
- Aktif dan langsung. Hindari kalimat bertele-tele dan terjemahan kaku (“di mana” untuk *where*).
- Satu paragraf satu gagasan. Pecah kalimat yang lebih dari ±25 kata.
- Bedakan “container” (konsep) dan `docker` (perintah) dengan format yang konsisten.
- Gunakan backtick untuk perintah, path, nama file, IP, port, dan nilai konfigurasi: `docker ps`, `/etc/nginx/nginx.conf`, `192.168.1.1/24`.
- Tulis satuan dengan benar: `100 Mbps`, `1 Gbps`, `300 MB`, `2 vCPU`.

#### Akurasi teknis

- Uji perintah di environment yang disebutkan. Tulis versi OS/tools bila relevan: “diuji pada Ubuntu 22.04, Docker 24”.
- Jangan mengarang output. Jika hanya ilustrasi, tandai “contoh output”.
- Periksa tabel, rumus, prefix, range IP, dan angka. Kesalahan kecil seperti `183.30.40.131` vs `183.30.4.131` merusak kredibilitas.
- Untuk perintah destruktif (`rm -rf`, `docker prune`, format disk), beri peringatan dan langkah backup.
- Jangan menampilkan password default tanpa peringatan untuk menggantinya. Jangan pernah menulis token/secret asli.
- Untuk klaim yang mudah berubah (harga, versi, fitur), sebutkan “per <bulan tahun>”.
- Prioritaskan sumber resmi: dokumentasi vendor, RFC/IETF, man page, repositori resmi.
- Jangan menyalin artikel orang lain. Kutip dan beri tautan; tulis ulang dengan pemahaman sendiri.

#### Kode dan perintah

- Selalu gunakan fenced code block dengan bahasa: `bash`, `yaml`, `dockerfile`, `nginx`, `text`.
- Buat perintah siap copy-paste. Jangan menulis prompt `$` kecuali memang sedang menunjukkan prompt.
- Pisahkan perintah dan output ke blok berbeda. Jangan mencampur output ke dalam blok perintah.
- Jelaskan placeholder: `<nama-container>`, `<IP-server>`, `<path-file>`.
- Satu blok kode untuk satu tugas. Jangan menempel 50 baris tanpa penjelasan.
- Jangan hardcode kredensial; gunakan environment variable atau placeholder.
- Setelah langkah yang mengubah sistem, sertakan cara verifikasi dan cara rollback/cleanup.

#### Gambar dan tabel

- Crop screenshot ke area penting, bukan seluruh desktop. Tambahkan anotasi bila membantu.
- Jangan tampilkan data sensitif pada screenshot.
- `alt` harus menjelaskan isi gambar, bukan “gambar1”.
- Beri caption singkat jika gambar butuh konteks: `*Gambar 1. Topologi lab.*`
- Tabel hanya untuk perbandingan/data tabular. Maksimal 5 kolom agar tidak overflow di mobile.
- Selalu tulis header tabel dan satuan pada kolom.

#### SEO dan aksesibilitas

- Subtitle harus mengandung inti topik; jangan keyword stuffing.
- Slug pendek dan deskriptif.
- Tautkan 1–3 artikel internal yang relevan dan 1–3 referensi eksternal otoritatif.
- Gunakan teks link deskriptif: “dokumentasi resmi Docker”, bukan “klik di sini”.
- Jangan memakai warna sebagai satu-satunya pembeda makna.
- Pastikan heading berurutan dan tidak ada gambar tanpa `alt`.

#### Alur editorial

1. Tentukan tujuan, target pembaca, dan satu kalimat *takeaway*.
2. Buat outline sebelum menulis.
3. Tulis draft tanpa terlalu banyak mengedit.
4. Uji semua perintah dan tangkap output asli.
5. Fact-check angka, versi, nama produk, dan tautan.
6. Edit: hapus kalimat redundan, pecah paragraf panjang, konsistenkan istilah.
7. Baca ulang dengan keras; perbaiki kalimat yang membingungkan.
8. Cek front matter, gambar, `alt`, tag, dan tanggal.
9. Preview lokal dan cek tampilan mobile.
10. Baru publikasikan.

#### Rubrik kualitas

| Kriteria | Lulus jika |
|---|---|
| **Akurasi** | Perintah berjalan, angka benar, tidak ada klaim tanpa dasar |
| **Struktur** | Pembaca bisa menemukan langkah/konsep dengan cepat |
| **Kelengkapan** | Prasyarat, verifikasi, dan batasan dijelaskan |
| **Kejelasan** | Kalimat pendek, istilah didefinisikan, tidak ada jargon menggantung |
| **Bukti** | Ada perintah/output/contoh dan referensi |
| **Format** | Heading rapi, kode berlabel, gambar beralt, tabel terbaca |
| **Etika** | Tidak ada secret, data pribadi, atau plagiarisme |

#### Template artikel profesional

Sesuaikan bagian dengan jenis artikel; tidak semua bagian wajib untuk artikel pendek.

````markdown
---
layout: post
title: "Judul Spesifik dan Deskriptif"
subtitle: "Hasil yang didapat pembaca dalam satu kalimat"
image: /img/topik/thumbnail.png
bigimg:
  - /img/topik/header.jpg
tags: [jaringan komputer, linux]
---

> **Ringkasan:** Satu paragraf tentang masalah, solusi, dan hasil.

## Prasyarat

- OS/tools dan versinya
- Akses/permission yang dibutuhkan
- Pengetahuan dasar yang diasumsikan

## Langkah 1 — Nama langkah

Penjelasan singkat mengapa langkah ini dilakukan.

```bash
perintah --flag nilai
```

Output yang diharapkan:

```text
...
```

## Verifikasi

Cara memastikan langkah berhasil.

## Troubleshooting

| Gejala | Penyebab | Solusi |
|---|---|---|
| ... | ... | ... |

## Kesimpulan

Ringkasan, batasan, dan langkah berikutnya.

## Referensi

- [Dokumentasi resmi](https://example.com)
````

### Menambah gambar

1. Simpan di `img/<topik>/nama-deskriptif.ext`.
2. Rujuk dengan `/img/<topik>/nama-deskriptif.ext`.
3. Pastikan `alt` bermakna.
4. Cek tidak ada nama file yang bentrok atau karakter aneh.
5. Jangan menghapus gambar lama sebelum memastikan tidak dirujuk:

```bash
grep -R "nama-gambar" _posts *.md _includes _layouts _config.yml
```

---

## 6. Aturan Teknis Penting (Jebakan yang Sudah Terverifikasi)

### 6.1 Jangan memakai `replace: '//', '/'` untuk URL

`header.html` sudah diperbaiki: memakai `relative_url` dan hanya memproses path internal. Pola lama **masih ada** di [nav.html](_includes/nav.html#L44) untuk avatar:

```liquid
{{ site.avatar | prepend: site.baseurl | replace: '//', '/' }}
```

Pola tersebut merusak URL eksternal:

- `https://git-scm.com/...` → `https:/git-scm.com/...`
- Browser lalu memperlakukannya sebagai path relatif ke domain sendiri → 404.
- `http://i.ibb.co/...` kadang selamat karena browser menormalkan dan menaikkan ke HTTPS, sehingga bug ini tidak terlihat konsisten.

Gunakan filter yang tepat:

- URL internal: `relative_url` atau `prepend: site.baseurl`
- URL eksternal: biarkan apa adanya
- Jika perlu mendeteksi internal/eksternal, gunakan logika seperti `navbarlink.html`, bukan replace buta.

### 6.2 `bigimg` kosong bukan “tidak ada gambar”

Liquid menganggap string kosong sebagai truthy. `bigimg: - ""` tetap membuat elemen header dan JavaScript mengisi `background-image: url(.../undefined)`, yang menghasilkan request 404 ±10,6 KB dan header putih kosong.

Saat memperbaiki, normalisasi `bigimg` menjadi array dan buang nilai kosong sebelum dirender. Jangan hanya mengandalkan `{% if page.bigimg %}`.

### 6.3 Komentar sengaja dihapus

Situs ini tidak memakai sistem komentar. Layout `post.html` dan `page.html` tidak lagi merender blok komentar; konfigurasi Disqus/Staticman dan file terkait sudah dihapus.

Jangan menambahkan Disqus, Staticman, Facebook Comments, atau layanan komentar lain tanpa persetujuan eksplisit. Jika suatu saat diminta, buat fitur baru dari awal dan jangan mengaktifkan kembali file lama.

### 6.4 YAML `aboutme.md` pernah invalid

Dokumen ini dulu mencatat `subtitle: - ` (tanda hubung menggantung) yang membuat seluruh front matter diabaikan: judul jadi "Home", tanpa `<h1>`, meta description berisi markdown mentah. Sekarang sudah diperbaiki menjadi `subtitle: "..."` yang valid dan build `--strict_front_matter` lulus.

Jangan mengembalikan nilai kosong atau tanda hubung menggantung di front matter mana pun.

### 6.5 Analytics hanya satu implementasi

Situs memakai GA4 lewat `_includes/analytics.html`, dimuat tanpa syarat dari `head.html`, dengan guard di dalamnya:

```liquid
{% if site.google_analytics and site.google_analytics != "" %}
```

`gtag`, `gtm`, `google_analytics.html` (analytics.js lama), dan `matomo.html` sudah dihapus. Jangan menambahkan implementasi kedua; nilai kosong pada key analytics harus tetap dijaga agar tidak menghasilkan request `?id=`.

### 6.6 `image` punya dua fungsi

`page.image` dipakai sebagai thumbnail di index dan sebagai `og:image` saat post dibagikan. Avatar navbar memakai `site.avatar`, bukan `page.image`.

Konsekuensinya, gambar thumbnail sebaiknya mendekati 1200x630 agar enak tampil saat dibagikan, dan jangan diisi URL eksternal yang bisa mati.

### 6.7 Tag dengan spasi membuat fragment tidak valid

`tags.html` dan `index.html` menghasilkan `href="/tags#jaringan komputer"`. Spasi dalam fragment tidak valid menurut HTML (W3C). Jika menyentuh bagian tag, gunakan `slugify` untuk ID dan href, misalnya:

```liquid
{{ tag | slugify }}
```

### 6.8 Tautan internal memakai `relative_url`

`tags.html`, `index.html`, dan `_layouts/post.html` sudah memakai `relative_url`, sehingga preview lokal tidak melompat ke produksi. Jangan mengembalikan `site.url` untuk tautan internal.

### 6.9 Jangan mengubah permalink tanpa migrasi gambar

Banyak artikel memakai `../img/...`. Pola itu bekerja karena URL post hanya satu segmen. Jika permalink diubah menjadi `/tahun/bulan/hari/judul/`, semua gambar relatif tersebut akan 404. Konversi dulu semua path gambar ke `/img/...`.

### 6.10 Fitur yang tidak dipakai

- Fitur komentar sudah dihapus sepenuhnya; jangan menambahkannya kembali tanpa persetujuan.
- Layout `minimal.html` beserta `main-minimal.css` dan `footer-minimal.html` tidak dipakai. `analytics.html` **dipakai** untuk GA4.
- Jangan menambahkan dependensi atau layanan baru tanpa persetujuan.

### 6.11 CSS adalah Liquid

`css/main.css` diawali front matter dan berisi variabel seperti `{{ site.page-col }}`. Jangan menghapus front matter atau mengganti nilai warna langsung di CSS; ubah `_config.yml`.

### 6.12 Tema tidak dipakai

`theme: jekyll-theme-minimal` di `_config.yml` praktis tidak berpengaruh karena semua layout ada di `_layouts/`. Jangan menambahkan theme baru; cukup edit layout/include yang ada.

---

## 7. Status dan Known Issues

Diperbarui November 2026. Verifikasi ulang sebelum mengklaim sesuatu sudah beres.

### Sudah diperbaiki (jangan dikembalikan)

- Header `bigimg` kosong dan URL eksternal ter-mangle; `header.html` kini menormalkan array dan memakai `relative_url`.
- YAML `aboutme.md` invalid; `lang="en"` menjadi `lang="id"`.
- Meta description kosong, `og:type` selalu `website`, `maximum-scale=1.0` dimatikan.
- Fragment tag berspasi dan tautan tag absolut (`site.url`).
- Overflow horizontal: `overflow-wrap` global dan `pre` yang bisa di-scroll.
- 14 aset mati dihapus; avatar punya `alt`; gambar about sudah 1400x1400 (198 KB).
- Build lokal reproducible, `timezone: Asia/Jakarta`, README ditulis ulang, `AGENTS.md` di-exclude.

### Sisa masalah

| Prioritas | Masalah | Lokasi |
|---|---|---|
| P1 | CI `.github/workflows/build.yml` selalu gagal di langkah build; penyebab belum diketahui karena log butuh token | `.github/workflows/` |
| P2 | +/-55 gambar masih hotlink ke situs lain (docker.com, i.ibb.co, ResearchGate, SDX Central) | `_posts/*` |
| P2 | Tidak ada `og:image` 1200x630; fallback ke avatar | `_includes/head.html` |
| P2 | Kontras tautan `#008AFF` sekitar 3,45:1, di bawah WCAG AA 4,5:1 | `_config.yml`, `css/main.css` |
| P3 | 8 subtitle di bawah 80 karakter | `_posts/*` |
| P3 | jQuery 1.11.2 + Bootstrap 3.3 (2014-2015) | `_layouts/base.html`, `js/` |
| P3 | Branch remote `dev`, `gem`, `gh-pages` masih ada | branch |
| P3 | `CHANGELOG.md` masih warisan upstream | root |
| P3 | Viewport 390px belum diverifikasi ulang setelah perbaikan overflow | manual |

---

## 8. Checklist Verifikasi Sebelum Selesai

Untuk perubahan template/layout:

- [ ] Build berhasil tanpa warning YAML baru.
- [ ] Tidak ada request ke `.../undefined` di HTML/CSS yang dihasilkan.
- [ ] Tidak ada URL `https:/` atau `http:/` (satu slash) di `_site`.
- [ ] `grep -R "undefined" _site` tidak menemukan hasil yang tidak disengaja.
- [ ] Halaman post tetap menampilkan judul dan header dengan benar.
- [ ] Avatar navbar tidak rusak bila `site.avatar` diganti (jalur ini masih memakai `replace: '//'`).
- [ ] Semua gambar yang dirujuk ada di `_site/img/...`.
- [ ] Tidak ada error JavaScript baru di console.
- [ ] Cek viewport 390px: `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- [ ] `git diff` hanya berisi perubahan yang diminta.

Untuk penambahan/penghapusan gambar:

- [ ] `grep -R "nama-file"` memastikan referensi lengkap.
- [ ] Ukuran dan dimensi wajar.
- [ ] `alt` terisi.

Untuk perubahan konten:

- [ ] YAML valid (`bundle exec jekyll build --strict_front_matter`).
- [ ] Tanggal di nama file benar dan tidak future-dated.
- [ ] Tag tidak kosong/duplikat.
- [ ] Path gambar absolut.
- [ ] URL referensi baru dicek statusnya.

Untuk deploy:

- [ ] Perubahan sudah dipreview lokal.
- [ ] Tidak ada file rahasia baru yang ikut ter-build.
- [ ] Push ke `master` hanya setelah yakin, karena langsung live.

---

## 9. Gaya Perubahan

- Lakukan **diff kecil dan terarah**. Jangan merapikan seluruh file atau mengganti format massal tanpa diminta.
- Ikuti gaya sekitarnya: indentasi 2 spasi untuk YAML/HTML, 4 spasi untuk JS yang sudah ada, kutip ganda pada YAML.
- Pertahankan atribusi dan lisensi Beautiful Jekyll.
- Jangan menghapus artikel, gambar, atau branch tanpa instruksi eksplisit.
- Jangan menulis ulang gaya bahasa penulis; perbaiki hanya kesalahan teknis/faktual yang diminta.
- Jika menemukan bug di luar scope, catat di ringkasan/PR, jangan langsung memperbaiki semuanya.
- Jangan melakukan `git push`, force push, atau mengubah riwayat Git kecuali diminta.

---

## 10. Prioritas Berikutnya

Fase 1-3 sudah dijalankan: perbaikan P1, SEO/aksesibilitas, build reproducible, dan CI build-only. Urutan yang tersisa:

1. Hijaukan CI: baca log run, perbaiki penyebabnya, baru pasang badge di README.
2. Ganti +/-55 hotlink gambar dengan salinan lokal di `img/<topik>/`.
3. Tambah `og:image` 1200x630 dan perbaiki kontras tautan.
4. Evaluasi jQuery/Bootstrap 3 menuju JS modern, satu paket per perubahan.
5. Baru pertimbangkan redesign atau migrasi ke upstream Beautiful Jekyll v6+.

Jangan mencampur refactor besar dengan perbaikan konten dalam satu perubahan.
