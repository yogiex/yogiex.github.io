---
layout: post
title: docker? container?
image: http://i.ibb.co/By4z9BG/logo-kecil.png
bigimg: 
    - "http://i.ibb.co/jwk4m89/containers-truck-port-JPG.webp"
tags: [docker, container, cloud computing, linux, devops]
---
Selamat pagi!! pada postingan saya kali ini, saya ingin sedikit memperkenalkan teknologi container yang terkenal pada pengembangan software tools dan software, jadi sebelum memasuki topik bahasan mengenai docker saya ingin menjelaskan terlebih dahulu tentang container tersebut.

**Container**

Container adalah unit standar perangkat lunak yang mengemas kode dan semua dependensinya sehingga aplikasi berjalan dengan cepat dan andal dari satu lingkungan komputasi ke lingkungan komputasi lainnya. Docker container images adalah paket perangkat lunak ringan, mandiri dan dapat dieksekusi yang mencakup semua yang diperlukan untuk menjalankan aplikasi atau perangkat lunak:kode, waktu proses, system tools, pustaka, dan setting.
dengan docker juga apabila mengalami kerusakan pada salah satu container tidak akan berpengaruh terhadap OS host atau antar container yang lain, karena itulah disebut container, membungkus program dan mengisolasinya agar tidak terjadi single-failure yang berakibat fatal terhadap sistem atau layanan yang lain.
![GambarContainer](https://www.docker.com/sites/default/files/d8/styles/large/public/2018-11/container-what-is-container.png?itok=vle7kjDj)

``Docker adalah platform perangkat lunak yang memungkinankan untuk menguji, membuat, dan menerapkan perangkat lunak dengan cepat dengan standar yang disebut kontainer.``

**Cara kerja docker**

teknologi docker container ini bekerja dengan konsep dengan standar seperti container yang membungkus program atau kode yang akan diterapkan atau diuji, kontainer juga mirip mesin virtual dengan memvirtualisasi(meminimalisis sumber daya) pada server.
docker diinstal pada server atau komputer lokal dengan memberi perintah sederhana ketika akan menjalankan kontainer seperti memulai, menghentikan atau membuat kontainer.

![containervsvm](https://d1.awsstatic.com/Developer%20Marketing/containers/monolith_2-VM-vs-Containers.78f841efba175556d82f64d1779eb8b725de398d.png)

**Kenapa sih harus menggunakan docker container?**

menggunakan docker container sebagai platform deployment bisa dibilang ada beberapa benefit atau keuntungannya diantara lain seperti:

![rocket](https://d1.awsstatic.com/icons/benefit-icons/100x100_benefit_deployment1.ac1f1acaaffa93eedfa279a72b4cb9693a8f3b69.png)
**cepat**

karena dengan menggunakan docker container sebagai penggunaan deployment atau penerapan aplikasi perangkat lunak dapat mempercepat pekerjaan apabila terdapat banyaknya aplikasi atau perangkat lunak yang berbeda fitur sekalipun

![tools](https://d1.awsstatic.com/icons/benefit-icons/100x100_benefit_tools.6828dcc44b574230d84659102b2cf9fcb5f4ed3b.png)
**pengoperasian**

menggunakan docker juga dapat mempermudah pengoperasian terhadap apabila pada saat developer atau pengembang tidak mau menginstall program pada OS host, dan akan menginstall pada docker container didalamnya beserta kode yang akan dicoba, sekaligus manajemen terhadap pustaka pada OS hostnya.

**Kapan harus menggunakan docker container?**

mungkin bisa dibilang saat yang tepat menggunakan teknologi docker ini saat ingin menggunakan layanan mikro atau microservices yang tidak bersifat arsitektur monolith, yang setiap layanan menjadi satu karena "mono", pada microservice membagi layanannya pada bagian yang terpisah dan menggabungnya antar layanan, jadi para pengembang bisa fokus pada 1 layanan yang akan dikembangkan dan tidak berpengaruh terhadap layanan yang lain, justru dengan mudah menggabungkan layanan dengan teknologi container ini.

sebelum menggunakan docker, kita haruslah paham terhadap arsitektur docker yang didalamnya terdapat beberapa aspek penting

**ARSITEKTUR DOCKER**   

![arsi](https://i.ibb.co/ZTVNj01/docker-architecture.png)

arsitektur docker diatas terdapat ada docker daemon, docker registry, docker container, docker iamges, dan docker clients

**Docker Daemon**<br>
Docker daemon adalah layanan docker yang menjalankan perintah docker diatas sistem operasi, seperti linux, windows hingga MacOS.

**Docker registry**<br>
docker registry adalah penyimpanan yang bersifat content delivery system yang disimpan pada penyimpanan online berupa docker images

**Docker Images**<br>
docker images adalah template yang bersifat read-only yand disediakan pada registry untuk dikonsumsi agar mempermudah pengembangan perangkat lunak

**docker clients**<br>
docker clients adalah pengguna dan docker saling berinteraksi dengan menglola docker itu sendiri pada terminal linux ataupun git bash.
yang pada akhirnya sisi pengguna dapat menggunakan docker.


**FAQ:**

Q:Apakah docker gratis?<br>
A:iya gratis.

Q:perbedaan container dan virtual machine?<br>
A:sangat berbeda karena pada virtual machine seolah olah mesin yang sebenarnya dan apabila menjalankan virtual machine harus menginstall OS terlebih dahulu, sedangkan container bisa berjalan pada OS host yang asli melalui docker engine, lebih ringan, dan fleksibel terhadap penggunaan.

mungkin untuk penjelasan terhadap docker container cukup sekian kedepannya saya akan membahas tutorial docker, apabila ada pertanyaan lain bisa menghubungi media sosial yang tertera pada dibawah atau dikolom komentar terimakasihhhhhh....

referensi:<br>
<https://www.docker.com/resources/what-container><br>
<https://aws.amazon.com/id/docker/><br>
<https://dockerlabs.collabnix.com/beginners/components/daemon/><br>