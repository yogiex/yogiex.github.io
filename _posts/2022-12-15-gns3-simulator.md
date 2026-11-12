---
layout: post
title: GNS3
subtitle: Mengenal simulator jaringan selain cisco packet tracer
image: 
tags: [jaringan komputer, fundamental, basic]
---

teman teman semua pasti sudah mengenal cisco packet tracer yang sering digunakan untuk mensimulasikan suatu jaringan, postingan ini aku akan mengenalkan simulator jaringan selain cisco packet tracer, cisco packet tracer dapat mensimulasikan suatu jaringan hingga level WAN atau jaringan yang custom sesuai yang kita inginkan. akan tetapi cisco packet tracer hanya dapat mensimulasikan dari vendor penyedia perangkat jaringan berbasis cisco saja. untuk mensimulasikan jaringan yang tidak berpedoman hanya pada satu vendor jaringan, GNS3 menyediakan fitur tersebut dan bahkan tidak hanya itu saja, GNS3 juga menyediakan dari perangkat end user, router, switch, bahkan firewall yang memiliki fitur yang lebih canggih.

GNS3 simulator open source yang dapat diunduh di [GNS3 website](https://gns3.com/). GNS3 dapat membantu kita untuk belajar cisco certification seperti CCNA atau deployment real world. selain simulasi jaringan GNS3 dapat mensimulasikan jaringan Software defined network (SDN), Network Function Virtualization (NFV), docker.

## Keuntungan GNS3
- keuntungan menggunakan GNS3 adalah belajar suatu perangkat jaringan yang tervirtualisasi lebih mudah, hemat biaya untuk belajar perangkat tanpa harus membeli perangkat jaringan yang sebenarnya.
- tidak hanya terdiri dari satu vendor perangkat jaringan, ada juga selain cisco, yaitu mikrotik, fortinet, juniper.
- lebih fleksibel custom perangkat end user dan topologi.
- perangkat jaringan seperti perangkat yang sebenarnya.

## Fitur GNS3
Ketika tahap awal setelah installasi GNS3 kosong, tidak ada router ataupun aplikasi didalamnya, yang berarti kita harus mencari sendiri diluar itu, entah itu diblog, forum, atau internet.
GNS3 menyediakan GNS3 academy untuk belajar GNS3 dari basic sampai semuanya tentang network yang menggunakan GNS3.

### Dynamips Router
GNS3 memiliki tujuan untuk mensimulasikan jaringan, GNS3 memanfaatkan emulator dynamips berdasarkan images router (OS router) dari cisco atau perangkat lain. akan tetapi pada IOS switch GNS3 sangat terbatas , ada fitur yang tidak bisa berjalan.

### QEMU, VMware, dan VirtualBox
perangkat high end yang ingin kita simulasikan seperti fortigate, palo alto, F5, juniper. Hampir semua bisa disimulasikan oleh GNS3 akan tetapi kita perlu konfigurasi setting di awal terlebih dahulu, template awal banyak sudah banyak disediakan oleh developer GNS3, kita hanya perlu memasukkan images dari perangkat atau appliance yang akan digunakan. 

perangkat perangkat yang diatas nanti bisa dihubungkan dengan lingkungan environment yang berbeda-beda.

## tahap awal belajar GNS3
tahapan awal belajar atau menggunakan GNS3 adalah, iya sudah install perangkat lunak tersebut.
perangkat lunak tersebut dapat diunduh di https://www.gns3.com/software/download
![halaman unduh gns3](../img/Screenshot_20221213_224031.png)

dan mengunduh gns3 VM pada https://www.gns3.com/software/download-vm
![halaman unduh GNS3 vm](/img/Screenshot_20221213_224155.png)
GNS3 terdiri dari dua komponen, yaitu: 
- GNS3-all-in-one-software (GUI)
- GNS3 virtual machine (VM)

GNS3 gui merupakan dari sisi client untuk membuat jaringan, kita bisa menginstall software ini pada local komputer kita(windows,linux, mac) dan membuat topologi yang kita desain sesua hati.
berikut ini tampilan dari GNS3 GUI
![contoh gns3 gui](../img/jaringan-komputer/gns3-example-topologi.png)
credit: https://docs.gns3.com/docs/


ada juga dari sisi server, ketika kita membuat topologi pada client, perangkat yang kita buat dan desain perlu untuk di hosted dan dijalankan dari server process, pada GNS3 memiliki beberapa opsi pilihan antara lain:
- local GNS3 VM
- remote GNS3 server
- remote GNS3 VM

GNS3 mensupport untuk emulation dan simulation
emulation merupakan membuat perangkat jaringan yang berbeda platform pada virtual device GNS3
simulation merupakan simulasi perangkat jaringan seolah olah seperti perangkat yang asli, berbeda dengan emulasi yang merupakan contoh asli yang dijalankan pada perangkat virtual device.



# Courses
GNS3 menyediakan course yang gratis dan berbayar untuk pengguna untuk belajar GNS3 pada website berikut http://academy.gns3.com


# Referensi
- <https://ngonfig.net/gns3.html>
- <https://docs.gns3.com/docs/>