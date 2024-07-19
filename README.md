# Dokumentasi Installasi - Backend Cashflow

## Dokumentasi API

### Clone repository di github

clone repository dari github

```bash
    git clone https://github.com/KosasihProgramming/backend-memsys.git
```

### Lakukan installasi library

```bash
    npm install
```

### Konfigurasi Database

```bash
    const dbConfig = {
      host: "localhost",
      user: "root",
      password: "",
      database: "nama_database",
    };

    const dbAuth = {
      host: "localhost",
      user: "root",
      password: "",
      database: "nama_database",
    };
```

copy kode dari project lama (Backend Cashflow pertama) untuk mengganti kode diatas

### Analisis pendapatan klinik (Klinik, Lab, Gigi)

Lihat di dokumentasi pdf yang sudah disiapkan

### Siapkan id akun yang dibutuhkan

```bash
1. ID Akun insert jurnal
    ID Piutang Karyawan
    ID Pendapatan Lain-lain
2. ID AKun QRIS
    ID QRIS
    ID Akun Debit
3. ID Akun Pendapatan (Sesuaikan dengan klinik)
    ID Pendapatan barang klinik,
    ID Pendapatan jasa klinik,
    ID Pendapatan barang lab,
    ID Pendapatan jasa lab,
    ID Pendapatan barang gigi,
    ID Pendapatan jasa gigi,
```

jika sudah disiapkan, lanjutkan ke tahap

### Table Migration

Buka file dengan nama <b>CreateTableController.js</b> kemudan edit kode bagian

```bash
    // await connection.query(createTableRiwayatCheck);
    // await connection.query(createTableRiwayat);
    // await connection.query(createTableAkunJurnal);
    // await connection.query(createTableAkunQris);
    // await connection.query(createTableAkunPendapatan);
```

uncoment semua kode di atas, kemudian jalankan di browser

```bash
    localhost:5000/table-migration
```

### Table Seeding

Masih di file <b>CreateTableController.js</b> kemudian edit kode bagian

```bash
    const insertAkunJurnal;
    const insertAkunQris;
    const insertAkunPendapatan
```

ganti value nya sesuai dengan id yang sudah disiapkan, gantilah id_akun dan nama_akun saja.

setelah itu, lanjutkan ke kode

```bash
    // await connection.query(insertAkunJurnal);
    // await connection.query(insertAkunQris);
    // await connection.query(insertAkunPendapatan);
```

uncoment pada kode tersebut, kemudian jalankan

```bash
    localhost:5000/table-seeding
```

jika sudah berhasil, lanjut ke tahap

### Memperbaiki Query Divisi

cari kode yang berisikan kata kunci divison, kemudian ganti value nya sesuai dengan division di klinik

list file yang harus di perbaiki query divisi

```bash
    1. JournalController.js
    2. PendapatanController.js
```

### Memperbaiki QRIS Check

buka file dengan nama <b>QrisCheckController.js</b>

kemudian edit pada kode

```bash
    const accountId = "102.002";
    const accountId2 = "102.003";
```

isi value nya dengan id yang sudah kita siapkan

## Selesai

Installasi berhasil dilakukan dengan benar, jika ada kendala, silahkan hubungi saya

```bash
    Komang Chandra Winata
    Telegram: @komang_chandra
```

kenapa?
tdi ada yg bayar cash mana aku ngga dandan sama sekali kay gembel

gembel aku,

tetep cantik kok

wait ya
