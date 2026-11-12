---
layout: post
title: Menghitung Subnetting VLSM
subtitle: "Cara menghitung subnetting VLSM untuk lima jaringan berbeda agar alokasi alamat IP tidak banyak terbuang."
image:
tags: [fundamental, basic]
---

VLSM atau Variable Length subnet mask adalah jenis subnetting atau membagi suatu jaringan yang lebih kecil sesuai dengan panjang atau jumlah host pada setiap subnetnya. Oleh karena itu jumlah ip yang terbuang tidak terlalu banyak dan mencukupi

langsung saja ke perhitungannya \
contoh kita diberikan ip dengan 183.30.10.3/16 dan ada 5 network yang memiliki segment yang berbeda

| nama      | jumlah host   |
|-----------|---------------|
| ruangan A |  400          |
|ruangan B  | 300           |
| ruangan C | 100           |
|network A  | 2             |
|network B  | 2             |


## Tahapan proses
1. menentukan network ID untuk jaringan yang pertama, jaringan yang pertama ialah diurutkan dengan jumlah host terbanyak 
2. mengubah network ke dalam biner 
3. operasi AND dengan angka prefix
4. didapatkanlah network ID

prefix dengan angka 1 berjumlah prefix, contoh prefix 16 maka buat angka 1 berjumlah 16 digit \
183.30.10.3 -> 10110111.00011110.00001010.00000011 \
/16         -> 11111111.11111111.00000000.00000000 \
               ___________________________________ AND \
               10110111.00011110.00000000.00000000 \
               183.30.0.0

maka network ID yang didapatkan adalah 183.30.0.0/16 \
cara menentukan allocated host atau host yang dapat digunakan adalah 2^n \
contoh jumlah host ruangan A adalah 400 maka 2^n dengan hasil lebih dari jumlah host ruangan A \
jika 400 maka 2^9 mendapatkan hasil 512, apakah boleh 2^10? \
jawabannya kurang tepat karena hasil yang mendekati 400 adalah 512, apabila menggunakan pangkat 10 terlalu banyak alokasi ip yang terbuang. \
tips untuk network ID pasti genap \
tips untuk broadcast ID adalah ganjil.

sebenarnya untuk alokasi host ip yang dapat digunakan ialah allocated host - 2 \
kenapa dikurangi 2 karena 1 digunakan untuk network ID dan broadcast ID \
oleh sebab itu range ip tidak benar benar sesuai dengan 2^n.


table 

| nama      | allocated host |   Network    |   range ip                  |   broadcast 
|-----------|----------------|--------------|-----------------------------|------------- 
| ruangan A |  512           |   183.30.0.0 | 183.30.0.1 - 183.30.1.254   |   183.30.1.255 
| ruangan B |  512           |  183.30.2.0  | 183.30.2.1 - 183.30.3.254   | 183.30.3.255 
| ruangan c | 128            | 183.30.4.0   | 183.30.4.1 - 183.30.4.126   | 183.30.4.127 
| network A | 4              | 183.30.4.128 | 183.30.4.129 - 183.30.4.130 | 183.30.40.131 
| network B | 4              | 183.30.4.132 | 183.30.4.133 - 183.30.4.134 | 183.30.40.135 



## Referensi
- <https://ngonfig.net/vlsm.html>