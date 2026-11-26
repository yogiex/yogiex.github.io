---
layout: post
title: "Zero Trust Network Architecture (ZTNA): Prinsip dan Komponen"
subtitle: "Panduan konsep ZTNA: cara kerja zero trust architecture menurut NIST, komponen PDP/PEP, tabel ZTNA vs VPN, dan batasannya."
image: /img/ztna/ztna-alur-akses.webp
share-img: https://yogiex.github.io/img/ztna/ztna-alur-akses.webp
tags: [security, jaringan komputer, cloud computing]
---

> **Ringkasan:** VPN lama memberi kepercayaan penuh begitu satu autentikasi lolos. ZTNA memecah kepercayaan itu menjadi keputusan per permintaan: identitas, postur perangkat, dan konteks dinilai ulang sebelum satu aplikasi dibuka. Artikel ini membedah teorinya menurut NIST SP 800-207, dari tujuh prinsip sampai batasannya.

Selama bertahun-tahun, keamanan jaringan dibangun di atas satu asumsi sederhana: siapa pun yang sudah berada di dalam jaringan perusahaan boleh dipercaya. Karyawan datang ke kantor, terhubung ke LAN, lalu mendapat akses luas ke server internal. VPN memperpanjang asumsi itu ke luar kantor. Begitu tunnel terbentuk, pengguna seolah berdiri di ruang server yang sama dengan semua orang.

Masalahnya, asumsi itu sudah tidak cocok dengan cara kerja hari ini. Aplikasi pindah ke cloud, perangkat dibawa ke kafe, dan kontraktor mengakses sistem dari jaringan yang tidak kita kendalikan. Penyerang yang berhasil mencuri satu kredensial otomatis mendapat posisi nyaman untuk bergerak ke samping, mencari basis data, lalu keluar tanpa terdeteksi. Batas jaringan berhenti menjadi batas kepercayaan.

Artikel ini menjelaskan ZTNA sebagai konsep, bukan panduan konfigurasi produk tertentu. Anda perlu paham dasar TCP/IP, firewall, dan VPN, tetapi tidak perlu pernah memegang lisensi vendor. Setelah membaca, Anda dapat membedakan zero trust, zero trust architecture, dan ZTNA, menjelaskan komponennya, serta menilai kapan pendekatan ini masuk akal. Konfigurasi perangkat dan perbandingan harga vendor sengaja tidak dibahas.

## Daftar isi

- [Definisi: zero trust, ZTA, dan ZTNA](#definisi-zero-trust-zta-dan-ztna)
- [Tujuh prinsip dasar](#tujuh-prinsip-dasar)
- [Dari perimeter ke identitas](#dari-perimeter-ke-identitas)
- [Cara kerja ZTNA](#cara-kerja-ztna)
- [Komponen utama](#komponen-utama)
- [Tiga pendekatan arsitektur](#tiga-pendekatan-arsitektur)
- [ZTNA versus VPN](#ztna-versus-vpn)
- [Contoh penerapan ringan](#contoh-penerapan-ringan)
- [Trade-off](#trade-off)
- [Batasan dan kesalahpahaman umum](#batasan-dan-kesalahpahaman-umum)
- [Pertanyaan umum](#pertanyaan-umum)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Definisi: zero trust, ZTA, dan ZTNA

Tiga istilah ini sering dipakai bergantian padahal levelnya berbeda. Perbedaan ini bukan soal semantik, karena salah memahaminya membuat orang membeli alat untuk masalah yang sebenarnya bukan masalah alat.

*Zero trust* (ZT) adalah paradigma. NIST SP 800-207 menyebutnya sebagai kumpulan prinsip untuk merancang alur kerja, sistem, dan operasi, dan menegaskan bahwa ZT bukan satu arsitektur tunggal. Zero trust juga bukan produk yang bisa dibeli, melainkan cara memutuskan siapa boleh mengakses apa.

*Zero trust architecture* (ZTA) adalah arsitektur perusahaan yang menerapkan prinsip tadi. Di dalamnya ada komponen logis untuk memutuskan akses, menegakkan keputusan, dan mengevaluasi ulang saat sesi berjalan.

*ZTNA* atau *zero trust network access* adalah kategori akses jaringan. Ia menggantikan akses level-jaringan ala VPN dengan akses per aplikasi yang dibroker berdasarkan identitas dan postur perangkat. Istilah ini populer di industri sejak sekitar 2019 dan kerap dikaitkan dengan Gartner, tetapi ZTNA bukan standar resmi. Ia adalah salah satu cara paling praktis mewujudkan ZTA.

### Apa itu ZTNA?

ZTNA adalah lapisan perantara yang berdiri di antara pengguna dan aplikasi. Pengguna tidak lagi mendapat alamat IP di jaringan internal. Ia mengautentikasi ke identity provider, perangkatnya diperiksa, lalu broker memutuskan apakah permintaan ke satu aplikasi tertentu boleh diteruskan. Aplikasi tidak diekspos ke internet, dan pengguna tidak bisa melihat atau menghubungi server lain yang tidak diizinkan.

Analogi yang cukup akurat: VPN seperti satu gerbang utama dengan satu satpam. Setelah Anda masuk, Anda bebas berkeliling gedung. ZTNA seperti satpam di setiap pintu ruangan yang memeriksa kartu, wajah, dan jam kunjungan Anda setiap kali Anda mau masuk. Rumusnya memang lebih merepotkan, tetapi kerusakan akibat satu kartu hilang jauh lebih terbatas.

## Tujuh prinsip dasar

NIST merumuskan tujuh tenet yang menjadi kompas desain. Saya menulisnya ulang dengan implikasi praktisnya.

1. **Semua data dan layanan adalah resource.** Bukan hanya server, tetapi juga bucket penyimpanan, API, dan akun layanan. Konsekuensinya, inventaris aset menjadi pekerjaan pertama, bukan pekerjaan terakhir.
2. **Semua komunikasi diamankan tanpa memandang lokasi.** Trafik dari LAN tidak boleh diperlakukan lebih longgar daripada trafik dari internet. Idealnya semua koneksi terenkripsi dan saling terautentikasi.
3. **Akses diberikan per sesi dengan hak minimum.** Izin ke satu aplikasi tidak otomatis membuka aplikasi lain. Sesi juga punya batas waktu, bukan berlaku selamanya.
4. **Keputusan akses memakai kebijakan dinamis.** Identitas, status perangkat, perilaku, waktu, dan lokasi ikut dihitung. Kebijakan statis berbasis subnet tidak cukup.
5. **Postur semua aset dipantau terus-menerus.** Perangkat yang belum dipatch atau kehilangan agen keamanan harus diperlakukan berbeda, termasuk ditolak.
6. **Autentikasi dan otorisasi dinamis serta ditegakkan ketat.** Evaluasi tidak berhenti saat login. Sesi bisa ditinjau ulang ketika ada perubahan risiko.
7. **Telemetri dikumpulkan dan dipakai memperbaiki kebijakan.** Log akses, sinyal ancaman, dan perilaku pengguna menjadi umpan balik, bukan sekadar arsip.

Yang sering terlewat adalah tenet kelima dan ketujuh. Banyak organisasi membeli broker ZTNA, tetapi tidak punya data postur perangkat maupun log yang rapi. Akibatnya keputusan akses tetap biner: kredensial benar berarti lolos.

## Dari perimeter ke identitas

VPN bekerja di lapisan jaringan. Setelah autentikasi, klien mendapat alamat di subnet internal dan bisa mencoba menghubungi apa pun yang tidak diblokir firewall. Model ini nyaman, tetapi menyisakan dua masalah: jangkauan terlalu luas dan kepercayaan terlalu lama.

ZTNA memindahkan titik kontrol ke lapisan aplikasi dan identitas. Tiga pergeseran utamanya:

- **Cakupan.** Dari seluruh subnet menjadi satu aplikasi atau satu rute tertentu.
- **Durasi kepercayaan.** Dari sesi panjang yang jarang dievaluasi menjadi sesi pendek yang dievaluasi ulang.
- **Dasar keputusan.** Dari "dari mana koneksinya" menjadi "siapa, dengan perangkat apa, dalam kondisi apa".

Perubahan ini menjelaskan mengapa ZTNA lebih efektif menahan pergerakan lateral. Penyerang yang mencuri sesi satu aplikasi tidak otomatis mendapat akses ke aplikasi lain, karena setiap permintaan melewati pemeriksaan yang sama.

## Cara kerja ZTNA

Secara konseptual, satu permintaan melewati alur berikut:

1. Pengguna membuka aplikasi dan diarahkan ke broker, bukan langsung ke server aplikasi.
2. Identity provider memverifikasi identitas, umumnya dengan MFA.
3. Agen di perangkat mengirim sinyal postur: versi OS, status enkripsi disk, keberadaan agen keamanan, dan patch terakhir.
4. Policy engine mengevaluasi permintaan bersama atribut identitas, postur, dan sinyal ancaman, lalu memberi keputusan izin, tolak, atau izin terbatas.
5. Policy administrator menerjemahkan keputusan itu menjadi instruksi ke titik penegakan, misalnya membuka jalur ke konektor aplikasi dan menerbitkan token sesi.
6. Konektor di depan aplikasi meneruskan trafik, sementara broker terus memantau. Jika risiko berubah atau sesi kedaluwarsa, jalur ditutup.

Perhatikan pemisahan *control plane* dan *data plane*. Keputusan akses berjalan di jalur kontrol, sedangkan data aplikasi mengalir di jalur data. Pemisahan ini yang membuat pencabutan akses bisa dilakukan tanpa menyentuh jaringan fisik.

Diagram berikut merangkum alur itu. Nomor 1 sampai 4 menandai titik pemeriksaan: login, postur perangkat, keputusan izin, lalu pembukaan koneksi keluar. Perhatikan bahwa keputusan kebijakan dan telemetri berjalan di jalur terpisah dari data aplikasi.

![Diagram alur ZTNA: perangkat pengguna mengautentikasi ke identity provider, broker ZTNA menilai izin bersama policy engine, konektor membuka koneksi keluar ke aplikasi internal, dan log dikirim ke SIEM](/img/ztna/ztna-alur-akses.webp)

*Gambar 1. Satu permintaan di ZTNA: identitas dan postur perangkat menentukan akses ke satu aplikasi, bukan seluruh jaringan. Diagram dibuat sendiri untuk artikel ini.*

## Komponen utama

| Komponen | Peran | Padanan NIST | Catatan |
|---|---|---|---|
| Identity provider | Autentikasi pengguna dan MFA | ID management system | Menjadi titik kegagalan tunggal bila mati |
| Policy engine dan administrator | Menilai permintaan dan mengatur jalur sesi | Policy decision point | Biasanya menyatu di produk komersial |
| Broker atau PEP | Menegakkan keputusan, sering sebagai gerbang aplikasi | Policy enforcement point | Bisa terbelah menjadi agen klien dan gateway |
| Konektor aplikasi | Menghubungkan broker ke aplikasi internal | Bagian dari PEP | Umumnya koneksi keluar, tanpa buka port masuk |
| Telemetri dan SIEM | Menyimpan log akses dan sinyal risiko | Log dan SIEM | Tanpa ini, kebijakan tidak pernah membaik |

## Tiga pendekatan arsitektur

NIST membagi cara mewujudkan ZTA menjadi tiga pendekatan yang sering digabung dalam praktik.

**Enhanced identity governance.** Identitas menjadi penggerak utama kebijakan. Pendekatan ini cocok untuk aplikasi SaaS yang tidak bisa dipasangi komponen milik kita, karena keputusan tetap bisa diambil dari atribut akun dan perangkat.

**Micro-segmentation.** Resource dikelompokkan ke segmen kecil yang dijaga gateway, firewall generasi baru, atau agen di host. Efektif menahan pergerakan lateral, tetapi mahal bila perangkat penjaganya tidak terkelola dengan baik.

**Software defined perimeter.** Jalur akses dibentuk oleh controller melalui overlay, biasanya di lapisan aplikasi, dengan kanal terenkripsi antara klien dan gateway. Inilah model yang paling dekat dengan arsitektur produk ZTNA yang dijual hari ini.

Tidak ada satu pendekatan yang menang. Organisasi yang matang biasanya memakai identitas sebagai basis kebijakan, micro-segmentation untuk beban kerja sensitif, dan SDP untuk akses pengguna ke aplikasi internal.

## ZTNA versus VPN

| Aspek | VPN | ZTNA |
|---|---|---|
| Cakupan akses | Seluruh subnet internal | Satu aplikasi atau rute tertentu |
| Autentikasi | Sekali di awal sesi | Per sesi, dapat dievaluasi ulang |
| Postur perangkat | Jarang diperiksa | Menjadi input keputusan |
| Pergerakan lateral | Mudah setelah tunnel terbentuk | Terbatas pada aplikasi yang diizinkan |
| Pengalaman pengguna | Satu klien, akses luas | Klien atau browser, akses terarah |
| Kompleksitas operasional | Relatif rendah | Lebih tinggi, butuh IdP dan inventaris |

## Contoh penerapan ringan

Bayangkan sebuah tim operasi jaringan perlu membuka dasbor internal di `203.0.113.10` dari rumah. Dengan VPN, mereka masuk ke subnet manajemen dan bisa mencoba alamat lain di subnet itu. Dengan ZTNA, broker hanya meneruskan permintaan ke satu aplikasi, dan keputusan bergantung pada identitas, perangkat, dan jam akses.

Contoh kebijakan konseptual berikut bukan format produk tertentu, hanya ilustrasi cara berpikirnya:

```yaml
# contoh kebijakan konseptual, bukan konfigurasi produk
application: "dashboard-jaringan"
allowed_groups: ["netops"]
require_mfa: true
require_posture:
  disk_encryption: true
  edr_running: true
  max_patch_age_days: 30
session:
  max_minutes: 30
  revoke_on_risk_change: true
```

Yang penting bukan sintaksnya, melainkan bahwa setiap baris mewakili sinyal yang harus benar-benar tersedia di organisasi Anda. Jika data postur perangkat tidak ada, dua baris terakhir hanya jadi hiasan.

## Trade-off

| Kelebihan | Kekurangan |
|---|---|
| Akses menyempit ke satu aplikasi, menekan pergerakan lateral | Biaya lisensi dan upaya integrasi lebih tinggi dari VPN sederhana |
| Keputusan memakai identitas dan postur, bukan lokasi | Sangat bergantung pada kematangan identity provider |
| Sesi bisa dicabut tanpa menyentuh jaringan | Menambah hop dan latensi, terutama untuk aplikasi berat |
| Log akses jadi terpusat dan lebih kaya | Visibilitas trafik di jaringan menyusut bila broker menjadi satu-satunya jalur |

Dua hal yang jarang dihitung di awal: biaya perubahan proses, dan beban tim yang kini harus mengurus kebijakan, bukan hanya aturan firewall. ZTNA memindahkan kompleksitas, tidak menghilangkannya.

## Batasan dan kesalahpahaman umum

Beberapa anggapan yang perlu diluruskan sebelum Anda mengajukan anggaran.

**ZTNA bukan produk tunggal.** Ia butuh identity provider, inventaris perangkat, dan konektor aplikasi yang dikelola. Membeli broker tanpa tiga hal itu biasanya berakhir dengan kebijakan longgar agar pengguna tidak mengeluh.

**Mode hybrid itu normal.** NIST sendiri mengakui mayoritas organisasi akan beroperasi sebagian dengan perimeter lama sambil bertransisi. Menunggu sempurna sebelum mulai justru memperlambat perbaikan.

**ZTNA tidak menggantikan kontrol lain.** Patching, endpoint detection, segmentasi data center, dan manajemen akses tetap diperlukan. Zero trust mengatur siapa boleh lewat, bukan menjamin aplikasinya bebas celah.

**Perangkat lama dan OT menyulitkan.** Sistem yang tidak bisa menjalankan agen atau konektor sering harus diakses lewat enclave khusus dengan pengawasan tambahan. Ini kebutuhan nyata, bukan alasan menunda semuanya.

**Risiko baru muncul di titik pusat.** NIST mencatat bahwa policy engine dan policy administrator menjadi target bernilai tinggi. Jika penyerang menguasai keduanya, seluruh kebijakan bisa dibengkokkan. Ketersediaan broker juga menjadi risiko: matinya broker berarti matinya akses.

## Pertanyaan umum

**Apa itu ZTNA dalam satu kalimat?** ZTNA adalah cara memberi akses ke aplikasi berdasarkan identitas dan konteks perangkat, tanpa menempatkan pengguna di dalam jaringan internal.

**Apa beda ZTNA dan VPN?** VPN memberi akses ke jaringan, ZTNA memberi akses ke aplikasi. VPN memercayai tunnel, ZTNA mengevaluasi setiap permintaan.

**Apakah zero trust itu produk?** Bukan. Zero trust adalah kumpulan prinsip. Produk hanya membantu menerapkannya, dan tidak otomatis membuat organisasi menjadi zero trust.

**Apakah jaringan kecil perlu ZTNA?** Tidak selalu. Jika semua pengguna ada di satu kantor dengan aplikasi internal terbatas, MFA dan segmentasi sederhana bisa lebih dulu memberi manfaat. ZTNA masuk akal ketika ada akses jarak jauh, banyak perangkat, dan beberapa aplikasi sensitif.

## Kesimpulan

ZTNA bukan alat ajaib, melainkan konsekuensi logis dari prinsip yang sudah lama diketahui: lokasi jaringan bukan bukti kepercayaan. Dengan memindahkan keputusan ke identitas dan konteks, akses menyempit, sesi menjadi pendek, dan pergerakan lateral kehilangan jalur mudah.

Yang perlu diingat, ZTNA hanya satu bagian dari ZTA. Ia tidak berarti apa-apa tanpa identity provider yang rapi, inventaris perangkat, dan telemetri yang benar-benar dibaca. Urutan yang lebih realistis adalah membenahi identitas dan MFA, memetakan aplikasi, baru memilih mekanisme akses.

Artikel ini bersifat konseptual dan tidak memuat hasil pengujian lab. Untuk implementasi, mulailah dari satu use case kecil, ukur dampaknya, lalu perluas.

## Referensi

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), standar acuan utama artikel ini.
- [NIST SP 800-207A: ZTA untuk aplikasi cloud-native multi-cloud](https://csrc.nist.gov/pubs/sp/800/207/a/final), relevan untuk beban kerja Kubernetes dan service mesh.
- [CISA Zero Trust Maturity Model v2.0](https://www.cisa.gov/zero-trust-maturity-model), kerangka lima pilar dan tahap kematangan.
- [Google BeyondCorp: A New Approach to Enterprise Security](https://research.google/pubs/beyondcorp-a-new-approach-to-enterprise-security/), preseden praktis akses tanpa VPN.
- [NCSC UK: Zero Trust Architecture](https://www.ncsc.gov.uk/collection/zero-trust-architecture), panduan pemerintah Inggris yang menekankan perencanaan bertahap.
- [Fortinet: What Is ZTNA?](https://www.fortinet.com/resources/cyberglossary/what-is-ztna), contoh cara vendor memposisikan ZTNA. Berguna sebagai pembanding, bukan sebagai rujukan standar.

Bacaan internal yang berkaitan: [pengenalan Software Defined Network](/2020-11-10-pengenalan-sdn/) untuk konteks control plane, [anatomi cloud privat dengan OpenStack](/2026-11-15-memahami-openstack-anatomi-cloud-privat/) untuk resource yang berada di luar jaringan sendiri, dan [DNS amplification DDoS](/2026-11-20-dns-amplification-ddos/) untuk gambaran ancaman yang mendasari asumsi "anggap jaringan sudah disusupi".
