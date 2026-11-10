---
layout: post
title: pengenalan git dan github
image: https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png
bigimg: 
    - "https://git-scm.com/images/logos/downloads/Git-Logo-2Color.png"
tags: [github, gitlab, version control system,]
---

seperti judul postingan saya ingin mengenalkan salah satu teknologi control version system git,
jadi version control system adalah sebuah sistem yang merekan perubahan perubahan dari sebuah file atau folder dari timeline yang ditentukan hingga dapat melakukan rollback terhadap perubahan yang tidak ingin dilakukan. seperti programmer ingin membuat fitur tetapi pada fitur tersebut terjadi kesalahan pada saat production, jadi mau tidak mau sang programmer melakukan rollback dan balik ke fitur yang sebelumnya. mari berkenalan dengan git dan github dengan beberapa command line dasar



## Tujuan git
- speed
- simple design
- strong support dari berbagai macam orang
- terdistribusi penuh 

## git tidak terhapus
- secara konsep git tidaklah menghapus tetapi melakukan penambahan
- pada saat melakukan kesalahan bisa melakukan recovery atau pemulihan
- pemulihan agak sedikit tricky wkwkw

## git branch
![git branch](https://www.nobledesktop.com/image/gitresources/git-branches-merge.png)
merupakan cabang atau percabangan pada saat pengembangan software atau hal yang lain, contoh, branch master secara default akan terbuat pada git, biasanya branch master akan digunakan sebagai branch yang versi stablenya
biasanya branch dinamai sesuai fitur atau nama yang kontributor, yang nantinya akan di merge atau digabungkan dengan fitur yang lainnya.
## configurasi dasar
```javascript
$ git config --global user.name "yogiex"
$ git config --global user.email "yogiex@contoh.com"
```
## membuat inisiasi repository

```javascript
$ mkdir new-repo
$ cd new-repo
$ git init
```

## mengcopy repository dari github ke komputer local kita

```javascript
$ git clone https://github.com/yogiex/example
$ cd example/
```
## command dasar pada git
git add digunakan pada saat setelah melakukan perubahan pada suatu file atau folder digunakan untuk menambahkan file atau content pada index status
```javascript
$ git add file.py
```

git status merupakan command untuk melakukan pengecekan pekerjaan tree status
```javascript
$ git status
```
## github workflow
![github workflow](https://i2.wp.com/build5nines.com/wp-content/uploads/2018/01/GitHub-Flow.png?fit=900%2C310&ssl=1)
- pertama kita buat branch baru agar branch master tidak terganggu pada saat pengembangan
- lakukan perubahan terhadap pekerjaan yang dilakukan
- commit changes agar ditambahkan pada branch yang sesuai
- pull request untuk memberi informasi terhadap repository yang teman teman kontribusikan
- testing fitur
- apabila fitur diterima maka akan dimerge atau digabungkan pada branch master


<!---
belajar github
github command
command dasar git

-->