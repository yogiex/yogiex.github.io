---
layout: post
title: Installasi docker pada linux dan windows
image: http://i.ibb.co/By4z9BG/logo-kecil.png
bigimg: 
    - "http://i.ibb.co/jwk4m89/containers-truck-port-JPG.webp"
tags: [docker, container, cloud computing, linux, devops]
---
Hallo selamat pagi, pada postingan kali ini saya ingin sedikit memberi tahu untuk tahapan installasi docker engine, atau aplikasi docker untuk mengakses docker itu sendiri, dan mungkin kedepannya saya juga akan sedikit memberi tutorial tentang docker.
mungkin yang pertama saya akan memberi tahu instalasi docker desktop pada sistem operasi windows silahkan dibaca dan mencoba pahami langkah demi langkah sahabat.

**installasi docker desktop pada windows**<br>
pertama tama kunjungi website docker desktop kesini [docker desktop site](https://www.docker.com/products/docker-desktop)
![tampilanawal](https://i.ibb.co/TPsC0pG/fig1.png)

- lalu pilih versi stable karena yang versi stable bukan versi beta

![unduh](https://i.ibb.co/ckXCCVg/fig2.png)
![unduh](https://i.ibb.co/1K019np/fig3.png)

- setelah itu tunggu unduh hingga selesai

- klik 2 kali pada installer docker desktop

![install](https://i.ibb.co/FhMCQtJ/fig4.png)

- lalu lakukan instalasi sesuai dengan folder atau direktori teman teman

![install](https://i.ibb.co/gtsnwbm/fig5.png)

- tampilan ketika docker desktop diklik melalui GUI

![opening](https://i.ibb.co/VvmNk62/fig6.png)

- tunggu beberapa saat hingga status docker menjadi start


![awalan](https://i.ibb.co/PrbF1JJ/fig7.png)

- posisi pada saat docker desktop start

![pengaturan](https://i.ibb.co/f95PHQs/fig8.png)

pengaturan pada docker desktop, user bebas mengatur pengaturan docker sesuai keinginan dan resource yang tersedia pada laptop atau komputer masing masing

untuk mengecek docker sudah terinstall pada komputer atau laptop bisa menggunakan command prompt atau git bash dengan command 
```docker -v```

![dockervgitbash](https://i.ibb.co/7tvT3qG/fig8-5.png)

setelah keluar output dari gambar diatas terbukti bahwa docker sudah berhasil terinstall dengan baik pada laptop ataupun komputer

**Installasi Docker pada sistem operasi ubuntu 18.04 bionic beaver**

pada percobaan, saya menggunakan sistem operasi ubuntu 18.04

![ubuntu 18](https://i.ibb.co/L69Yc7G/fig9.png)

- pertama tama update repository pada sistem operasi ubuntunya dengan command 

```sudo apt update -y```

![apt update](https://i.ibb.co/F39bXbY/fig10.png)

- setelah itu lakukan installasi docker dengan command 

```sudo apt install docker.io```

![install dockerio](https://i.ibb.co/zb8rNGr/fig11.png)


docker lumayan memakan storage sekitar 300-mb sabar dan tunggu hingga instalasi selesai

apabila installasi docker sudah selesai bisa dicek melalui command 

`docker -v` 

seperti ini

![gambar](https://i.ibb.co/4df8FFT/fig12.png)

lanjut ke penggunaan basic docker pada postingan selanjutnya...