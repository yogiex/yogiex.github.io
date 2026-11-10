---
layout: post
title: command dasar docker
image: https://i.ibb.co/By4z9BG/logo-kecil.png
bigimg: 
    - "http://i.ibb.co/jwk4m89/containers-truck-port-JPG.webp"
tags: [docker, container, cloud computing, linux, devops]
---
![alert](https://i.ibb.co/r2qQJYm/png-clipart-triangular-black-warning-signage-warning-sign-computer-icons-symbol-alert-icon-gallery-m.png)
**DITUJUKAN UNTUK YANG BARU BELAJAR DOCKER**

postingan kali ini saya ingin menulis tentang beberapa command dasar yang ada pada docker
**COMMAND**
- ``docker images``
- ``docker pull <nama images``
- ``docker run <nama images``
    - ``--publish`` port mappings
    - ``--name`` penamaan
    - ``--detach`` background
    - ``--volume`` volume
- ``docker ps``
- ``docker stop``
- ``docker rmi``


### **docker images**
akan menampilkan docker images yang ada pada repository local laptop masing masing, yang berisi nama, tag,ukuran images,repository

![fig21](https://i.ibb.co/TTGZGcG/fig21.png)
diatas merupakan daftar images pada komputer saya, karena masih kosong kita lanjut ke command berikutnya

### **docker pull**

docker pull untuk mendapatkan docker images pada registry, saya akan mencoba pull dari docker hub

saya mendemokan docker pull untuk web server nginx

gunakan 

``docker pull nginx``
tetapi apabila seperti itu maka kita akan mendapatkan nginx versi latest

![fig22](https://i.ibb.co/Hp7SnJy/fig22.png)
tunggu hingga pull selesai

kita cek lagi apakah images nginx sudah ada pada komputer local kita dengan command yang sebelumnya 

``docker images``
![fig23](https://i.ibb.co/4f94dZn/fig23.png)

images nginx sudah ada pada komputer saya dengan berisi nama nginx tagnya latest dengan size 133mb<br>
saya akan menggunakan docker pull dengan versi tag yang berbeda<br>
``docker pull nginx:alpine``<br>
gunakan titik dua untuk pull dengan versi tertentu, contoh diatas saya mencoba pull dengan versi alpine
tunggu hingga pull selesai
![fig24](https://i.ibb.co/Byz1jGp/fig24.png)

lalu gunakan cek lagi dengan 
``docker images``
![fig25](https://i.ibb.co/sWjt2TJ/fig25.png)
bisa dicek pada kolom tag memiliki versi yang berbeda walaupun sama sama images yang sama

### **docker run**
untuk menjalankan images tidak perlu menginstall OS terlebih dahulu, memudahkan pengembangan aplikasi dan perangkat lunak
gunakan command 
``docker run namaImages``
![figx](https://i.ibb.co/vwgX8Fw/fig223.png)

seperti itu
setelah itu dicek pada web browser, karena saya menjalankan docker melalui vm, saya menuliskan ip vm pada web browser
![figx](https://i.ibb.co/Sr80sTg/fig26.png)
nginx sudah berhasil dijalankan 

**docker run --publish xx:yy namaImages**

``docker run --publish 88:80 nginx``

88 merupakan port yang akan kita akses nantinya, terus 80 merupakan port pada web server,

jadi port 80 pada nginx akan kita akses padap port 88 komputer local saya, angka 88 bisa diganti sesuai kebutuhan

![figxx](https://i.ibb.co/rGg1MM5/fig27.png)

docker container sudah berjalan, lalu cek melalui web browser http://<ip:port>, dalam contoh saya http://192.168.100.24:88
88 yang port diakses, bisa diganti sesuai kebutuhan
tekan ``ctrl+c`` untuk menghentikan runningnya

![figxx](https://i.ibb.co/c28hNnd/fig28.png)
seperti itu tampilan web server yang di publish melalui port 88

bisa juga menggunakan ``-p xx:80``

**docker run --name nginx1 nginx**
--name bertujuan menamai container yang dijalankan apabila tidak diberi argumen --name maka akan random penamaan

``docker run --name nginx1 -p 8080:80 nginx``

![figxx](https://i.ibb.co/857RFnH/fig29.png)

coba akses lagi melalui browser
![figxx](https://i.ibb.co/b12RqhS/fig30.png)

- **docker run -d namImages**
--detach atau -d digunakan untuk menjalankan container secara background diluar layar
``docker run -d --name nginx2 -p 8080:80 nginx``
apabila terdapat error maka --name diganti menjadi bebas
![figx](https://i.ibb.co/y5WwZqp/fig31.png)
![figx](https://i.ibb.co/Cn1yr19/fig32.png)
seperti itu tampilan ketika menjalankan docker container pada background

**docker ps**

docker ps merupakan command untuk melihat container docker yang sedang jalan secara background

``docker ps``
![figx](https://i.ibb.co/Cn1yr19/fig32.png)
``docker ps -a`` 
untuk melihat container yang pernah dibuat

![figx](https://i.ibb.co/4sSrXB6/fig34.png)

**docker stop**
docker stop merupakan command untuk menghentikan container yang sedang jalan, container yang sedang jalan bisa dicek melalui command ``docker ps``
docker stop command

``docker stop namaContainer`` atau ``docker stop containerID``


pada percobaan diatas saya menggunakan --name nginx2 berarti command yang digunakan


``docker stop nginx2`` atau ``docker stop 213123124``

![figx](https://i.ibb.co/mrsZ6cf/fig33.png)

**docker volume**
command volume untuk seperti copy atau generate data kedalam container 
-v posisiFolderkita:tujuanfolderContainer
    
``docker run --name nginx3 -p 8080:80 -v ~/content/html/::/usr/share/nginx/html nginx``
![figx](https://i.ibb.co/tXBz56C/fig36.png)

![figx](https://i.ibb.co/mSx3ZVz/fig37.png)

**docker rmi**
command untuk menghapus images pada komputer local

``docker rmi nginx``
![figx](https://i.ibb.co/H2g6x5n/fig38.png)

untuk selanjut kemungkinan akan membuat images custom dengan Dockerfile
referensi :
<https://hub.docker.com/>
<https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-docker/>