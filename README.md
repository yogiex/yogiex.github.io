# yogiex.github.io

Blog pribadi **Priyagung Yogi** — catatan digital forensics, jaringan komputer, Linux, container, dan CTF. Situs statis yang dibangun dengan Jekyll dan dipublikasikan langsung dari branch `master` melalui GitHub Pages.

- Situs: <https://yogiex.github.io>
- Bahasa konten: Indonesia
- Tanpa komentar, tanpa database, tanpa server aplikasi

## Tech stack

| Lapisan | Teknologi | Keterangan |
|---|---|---|
| Konten | Markdown + YAML front matter | Satu file per artikel di `_posts/`, nama `YYYY-MM-DD-slug.md` |
| Generator | Jekyll 3.10.0 | Versi yang dipakai build GitHub Pages, dikunci lewat gem `github-pages` 233 |
| Templating | Liquid | Layout di `_layouts/`, komponen di `_includes/` |
| Tema | Fork Beautiful Jekyll | Generasi 2016–2018, dimodifikasi; lisensi MIT, kredit footer dipertahankan |
| Styling | Bootstrap 3 + CSS kustom | `css/main.css` diproses Liquid (warna dari `_config.yml`); Font Awesome 4.6 dan Google Fonts dari CDN |
| Interaksi | jQuery 1.11.2 + Bootstrap 3 JS | `js/main.js` untuk navbar dan header image; tanpa bundler JS |
| Plugin | `jekyll-paginate`, `jekyll-sitemap` | 5 artikel per halaman; RSS dibuat manual di `feed.xml` |
| Build & hosting | GitHub Pages | Build native dari branch `master`, tanpa staging |
| CI | GitHub Actions | Build-only: `jekyll build --strict_front_matter` plus 4 pemeriksaan HTML. Run terakhir masih merah dan sedang ditelusuri |
| Preview lokal | Bundler + Docker | Image `ruby:3.2`, gem yang sama dengan produksi |
| Analytics | Google Analytics 4 | `gtag.js` di `_includes/analytics.html`, dimuat dari `head.html` |
| Permalink | `/:year-:month-:day-:title/` | URL satu segmen, contoh `/2025-12-25-etherchannel-networks/` |

## Arsitektur dan alur publikasi

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="diagrams/yogiex-stack-dark.png">
  <img src="diagrams/yogiex-stack.png" alt="Diagram arsitektur yogiex.github.io: penulis menulis Markdown lalu commit ke repo GitHub, GitHub Pages mem-build dengan Jekyll 3.10 menjadi situs statis HTML/CSS yang dibaca browser; build lokal dan GitHub Actions sebagai jalur pengembangan, Google Analytics 4 mengumpulkan metrik." width="100%">
</picture>

Garis biru adalah alur publikasi, garis putus-putus adalah jalur pengembangan dan pengukuran. Sumber diagram ada di `diagrams/yogiex-stack.html` (self-contained, punya toggle tema gelap).

Push ke `master` langsung menjadi produksi. Tidak ada environment staging, jadi perubahan berisiko sebaiknya dipreview lokal lebih dulu.

## Menjalankan secara lokal

Prasyarat: Docker (disarankan), atau Ruby 3.x dengan Bundler.

```bash
docker build -t yogiex-preview .
docker run --rm -p 4000:4000 -v "$PWD:/srv/jekyll" yogiex-preview
```

Buka <http://localhost:4000>. Tanpa Docker:

```bash
bundle install
bundle exec jekyll serve
```

`Gemfile.lock` hanya memuat platform `x86_64-linux`. Di macOS Apple Silicon jalankan `bundle lock --add-platform arm64-darwin` lebih dulu, atau pakai Docker saja.

## Struktur repositori

```text
_config.yml        Konfigurasi situs: navigasi, warna, analytics, permalink
index.html         Halaman daftar artikel + paginator
aboutme.md         Halaman profil
tags.html          Indeks tag
404.html           Halaman 404
feed.xml           RSS manual
_layouts/          Kerangka HTML (base, page, post, default)
_includes/         Potongan template (head, nav, header, footer, analytics)
_posts/            Artikel Markdown
img/               Gambar artikel, dikelompokkan per topik
css/ js/           Aset tampilan dan interaksi
diagrams/          Diagram arsitektur (sumber HTML + PNG)
.github/workflows/ CI build-only
```

## Menulis artikel

Aturan singkat yang wajib diikuti:

- `subtitle` 80–160 karakter — menjadi `<meta name="description">`.
- Gambar memakai path absolut `/img/<topik>/nama-file.png`, bukan hotlink.
- Heading di body mulai dari `##`; header halaman sudah menghasilkan `<h1>`.
- `bigimg` berupa array; hapus key-nya bila tidak ada gambar header, jangan diisi string kosong.
- Tanggal di nama file tidak boleh melewati hari ini.

Panduan lengkap ada di [AGENTS.md](AGENTS.md).

## Lisensi

Dua cakupan yang berbeda:

- **Kode dan tema** — [Beautiful Jekyll](https://github.com/daattali/beautiful-jekyll) karya Dean Attali, lisensi MIT, berlaku untuk layout, include, CSS, dan JavaScript. Teks lisensi lengkap ada di [LICENSE](LICENSE).
- **Tulisan** — seluruh teks artikel di `_posts/` dan halaman profil adalah hak cipta Priyagung Yogi. Tidak ikut lisensi MIT; hubungi penulis bila ingin mengutip ulang dalam jumlah besar. Kutipan pendek dengan tautan balik tidak masalah.
