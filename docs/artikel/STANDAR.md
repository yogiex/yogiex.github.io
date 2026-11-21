# Standar Penulisan

Dipakai saat **menilai** artikel (review, rewrite, atau sebelum publikasi), bukan saat membuat kerangka. Kerangka teknis ada di [FORMAT.md](FORMAT.md).

Profesional bukan berarti kaku: tetap personal dan mudah dibaca, tetapi akurat, terstruktur, dan bisa dipertanggungjawabkan.

## Prinsip

1. **Akurasi sebelum gaya.** Jangan mengorbankan kebenaran teknis demi kalimat yang terdengar bagus.
2. **Satu artikel, satu tujuan.** Tentukan di awal: mengajari, menjelaskan konsep, mencatat lab, atau berpendapat.
3. **Tulis untuk pembaca nyata.** Sebutkan target pembaca, prasyarat pengetahuan, dan hasil setelah membaca.
4. **Tunjukkan, jangan hanya mengklaim.** Sertakan perintah, konfigurasi, output, atau bukti uji.
5. **Bedakan fakta, pengalaman, dan opini.** Jangan menyamarkan opini sebagai fakta.
6. **Hormati privasi.** Sensor IP publik, token, email, dan data sensitif pada teks maupun screenshot.

## Bahasa dan gaya

- Indonesia yang baku tetapi tidak kaku. Konsisten: "saya" untuk penulis, "Anda" untuk pembaca, "kita" hanya bila memang mengajak bersama.
- Hindari slang berlebihan, "wkwk", ALL CAPS, dan hiperbola.
- Definisikan akronim saat pertama muncul: "Software Defined Network (SDN)".
- Kapitalisasi merek secara konsisten: Docker, Linux, GitHub, NGINX, Cisco, Kubernetes.
- Satu paragraf satu gagasan; pecah kalimat di atas ±25 kata.
- Backtick untuk perintah, path, nama file, IP, port, dan nilai konfigurasi: `docker ps`, `/etc/nginx/nginx.conf`, `192.168.1.1/24`.
- Satuan ditulis benar: `100 Mbps`, `1 Gbps`, `300 MB`, `2 vCPU`.

## Akurasi teknis

- Uji perintah di environment yang disebutkan; tulis versi: "diuji pada Ubuntu 22.04, Docker 24".
- Jangan mengarang output. Jika hanya ilustrasi, tandai "contoh output".
- Periksa tabel, rumus, prefix, rentang IP, dan angka. Salah satu digit merusak kredibilitas.
- Perintah destruktif (`rm -rf`, `docker prune`, format disk) diberi peringatan dan langkah backup.
- Jangan menampilkan password default tanpa peringatan; jangan pernah menulis token asli.
- Klaim yang mudah berubah (harga, versi, fitur) diberi penanda waktu: "per November 2026".
- Prioritaskan sumber resmi: dokumentasi vendor, RFC/IETF, man page, repositori resmi.
- Jangan menyalin artikel orang lain; kutip, tautkan, dan tulis ulang dengan pemahaman sendiri.

## Kode dan perintah

- Selalu fenced code block dengan bahasa: `bash`, `yaml`, `dockerfile`, `nginx`, `text`.
- Siap copy-paste; jangan menulis prompt `$` kecuali memang menunjukkan prompt.
- Pisahkan perintah dan output ke blok berbeda.
- Jelaskan placeholder: `<nama-container>`, `<IP-server>`, `<path-file>`.
- Satu blok untuk satu tugas; jangan menempel 50 baris tanpa penjelasan.
- Jangan hardcode kredensial; gunakan environment variable atau placeholder.
- Setelah langkah yang mengubah sistem, sertakan verifikasi dan rollback/cleanup.

## Gambar dan tabel

- Crop screenshot ke area penting; tambahkan anotasi bila membantu.
- Jangan tampilkan data sensitif pada screenshot.
- `alt` menjelaskan isi gambar, bukan "gambar1".
- Beri caption bila perlu konteks: `*Gambar 1. Topologi lab.*`
- Tabel untuk data tabular saja, maksimal 5 kolom agar tidak overflow di mobile.
- Selalu tulis header tabel dan satuan pada kolom.

## SEO dan aksesibilitas

- Subtitle memuat inti topik tanpa keyword stuffing.
- Slug pendek dan deskriptif.
- Tautkan 1-3 artikel internal yang relevan dan 1-3 referensi eksternal otoritatif.
- Teks link deskriptif: "dokumentasi resmi Docker", bukan "klik di sini".
- Jangan memakai warna sebagai satu-satunya pembeda makna.
- Heading berurutan, tidak ada gambar tanpa `alt`.

## Alur editorial

1. Tentukan tujuan, target pembaca, dan satu kalimat *takeaway*.
2. Buat outline sebelum menulis.
3. Tulis draft tanpa terlalu banyak mengedit.
4. Uji semua perintah dan tangkap output asli.
5. Fact-check angka, versi, nama produk, dan tautan.
6. Edit: hapus kalimat redundan, pecah paragraf panjang, konsistenkan istilah.
7. Baca ulang dengan keras; perbaiki kalimat yang membingungkan.
8. Cek front matter, gambar, `alt`, tag, dan tanggal.
9. Preview lokal, lalu cek tampilan mobile.
10. Baru publikasikan.

## Rubrik penilaian

| Kriteria | Lulus jika |
|---|---|
| Akurasi | Perintah berjalan, angka benar, tidak ada klaim tanpa dasar |
| Struktur | Pembaca bisa menemukan langkah atau konsep dengan cepat |
| Kelengkapan | Prasyarat, verifikasi, dan batasan dijelaskan |
| Kejelasan | Kalimat pendek, istilah didefinisikan, tidak ada jargon menggantung |
| Bukti | Ada perintah/output/contoh dan referensi |
| Format | Heading rapi, kode berlabel, gambar beralt, tabel terbaca |
| Etika | Tidak ada secret, data pribadi, atau plagiarisme |

## Artikel lama

Artikel sebelum 2026 mengikuti aturan yang berbeda: path gambar relatif, beberapa tanpa `image`, judul pendek. Itu utang teknis yang dicatat di [AGENTS.md](../../AGENTS.md) §7, bukan teladan.

Saat menyentuh artikel lama: jangan menulis ulang suara penulis. Perbaiki hanya kesalahan teknis yang diminta, dan benahi aturan FORMAT yang murah diperbaiki pada saat itu (path gambar absolut, `alt`, tag).
