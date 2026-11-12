---
layout: post
title: software defined network
subtitle: penjelasan singkat mengenai software defined network
image: https://octodex.github.com/images/class-act.png
tags: [linux, operating system, jaringan komputer,]
---

hallo sahabat, postingan kali ini tentang salah satu teknologi jaringan yang lagi naik naiknya pada beberapa tahun terakhir,
software defined network(SDN) merubah bagaimana network control(otak) dan forwarding(otot) untuk berinteraksi agar memperbaiki otomasi dan orchestration, membuat salah satu terobosan teknologi jaringan dalam beberapa dekade.

software defined network, pemisahan antara controller dan data plane pada infrastruktur jaringan agar dapat mempermudah administrator untuk mengelola jaringan, berbeda dengan jaringan traditional atau konventional yang mengharuskan konfigurasi setiap perangkat yang terhubung

software defined network juga bisa dikatakan paham atau paradigma layaknya pemrograman OOP, sofware defined network teknologi dalam mendesain, mengelola dan implementasikan jaringan. 

# abstraksi jaringan
software defined network bukan hanya sebatas pemisahan control plane dan data plane untuk meneruskan packet, tetapi membawa sisi pemrograman dan otomasi dalam hal jaringan

# mengapa SDN?
- virtualization dan cloud computing
- orchestration dan scalability
- programmability 
- visibility
- performance

# arsitektur SDN
![sdn vs convectional](https://www.researchgate.net/profile/Dengpan_Wang/publication/338116049/figure/fig1/AS:839113909473281@1577071754274/Simple-overview-of-SDN-architecture.jpg)

pada arsitektur jaringan yang konventional contorl plane dan data plane masih digabungkan menjadi satu dalam node jaringan, setiap flow harus didefinisikan pada setiap device atau perangkat jaringan

didalam arsitektur software defined network bisa dibilang mempermudah pengerjaan dalam melakukan konfigurasi pada tiap control plane, karena salah satu sifat software defined network ialah terpusat atau centralized, setiap paket akan diteruskan kedalam controller atau otak yang akan meneruskan paket ke paket tujuan pengirim

![sdn architecture](https://www.sdxcentral.com/cdn-cgi/image/w=748,h=884,fit=scale-down,f=auto,q=85/https://www.sdxcentral.com/wp-content/uploads/2019/10/sdn-architecture-img.jpg)


# sdn challenges 
beberapa tantangan atau masalah dalam industri software 
defined network
- security 
- sdn controller bottleneck
- scaling

referensi:
- <https://www.sdxcentral.com/networking/sdn/>
- <https://www.sdxcentral.com/networking/sdn/definitions/inside-sdn-architecture/>
- S. Sezer et al., "Are we ready for SDN? Implementation challenges for software-defined networks," in IEEE Communications Magazine, vol. 51, no. 7, pp. 36-43, July 2013, doi: 10.1109/MCOM.2013.6553676.