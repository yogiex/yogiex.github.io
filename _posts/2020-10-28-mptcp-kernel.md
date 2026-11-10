---
layout: post
title: mptcp kernel
image: 
bigimg: 
    - ""
tags: [linux, kernel, operating system, jaringan komputer]
---

sobat github, mari berkenalan dengan varian kernel linux yang tidak biasa digunakan untuk keseharian, mungkin ada beberapa yang tidak familiar dengan kernel, 

# defini sedikit tentang kernel

jadi kernel itu adalah komponen utama dari suatu sistem operasi(SO) dan inti dari penghubung antara perangkat keras komputer dan proses. keduanya berkomunikasi dengan memanejemen sumber daya se efisien mungkin

# kernel itu ngapain aja sih?
- memory management
- process management
- device drivers
- system call and security

# dimana kernel itu yang cocok dengan OS?
- hardware atau perangkat keras
- linux kernel
- user processes

![](https://i.ibb.co/dJ8Yd91/MPTCPdiagram.png)
# MPTCP kernel 
multipath Transmission Control Protocols(MP-TCP) adalah jenis kernel yang memungkinkan pengguna menggunakan beberapa interfaces atau Internet Protocol(IP) dengan memodifikasi Transmission Control Protocols(TCP) dengan mengirimkan packet transfer ke beberapa interface yang terhubung, istilah untuk MPTCP ialah sub-flow pada tiap interfaces yang terhubung. 

# terminologi mptcp
- path merupakan jalur diantara pengirim dan penerima pada setiap interfaces yang terhubung
- subflow merupakan interfaces yang terhubung pada host atau komputer yang menggunakan MPTCP kernel
- host adalah implementasi dari MPTCP kernel atau pengguna MPTCP client

# kenapa harus menggunakan MPTCP kernel
keuntungan menggunakan MPTCP kernel adalah pemanfaatan daya yang lebih baik dibandingkan single path TCP(SPTCP) atau TCP yang biasa, dengan trhougput yang lebih baik juga, lebih halus tanpa mengganggu interfaces pada saat pengiriman data

# tujuan mptcp
- improve througput, nilai througput >= TCP koneksi karena seharusnya memang multipath tcp menggunakan flow membagi TCP pada setiap interfaces yang terhubung
- do no harm, multipath flow tidak harus memenuhi kapatitas dari suatu subflow interfaces daripada singlepath TCP 
- balance congestion, multipath flow harus berpindah sebanyak flow interface yang ada


# algoritma yang didukung mptcp
- lia (linked increase algorithm)
- olia (Opportunistic Linked-Increases algorithm)
- balia (balance linked increase algorithm)
- wVegas

# rekor
rekor tercepat koneksi yang pernah tercatat ialah 50gb, tepatnya 51.8 Gbit/s dengan mptcp

# versi
veri terbaru sejak postingan ini dipost adalah v.095 rilis versi stable, dengan penambahan fitur seperti
- algoritma congestion control desynchronized multipath-tcp
- netlink-based path-manager yang berguna untuk steering
- BLocking ESTimation-based(BLEST) scheduler

referensi :
- <https://multipath-tcp.org>
- <https://datatracker.ietf.org/meeting/90/materials/slides-90-mptcp-0>
- <https://tools.ietf.org/html/rfc6356>
- <https://tools.ietf.org/html/rfc8684>
- <http://multipath-tcp.org/pmwiki.php?n=Main.50Gbps>