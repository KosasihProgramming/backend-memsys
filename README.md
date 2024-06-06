# Back End Node JS - Memsys

## Deskripsi

Proyek ini adalah back end untuk aplikasi Memsys, dibangun menggunakan Node.js dan Express. Proyek ini menangani berbagai operasi back-end, termasuk autentikasi, manajemen data pengguna, dan pengelolaan dokumen.

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

## Dokumentasi API

### Mendapatkan Nama Akun

```bash
GET http://localhost:5000/accounts
```

### Mencari Balance

```bash
POST http://localhost:5000/cashflow
```

#### Request Body

```bash
{
  "totalKas": 100000,
  "tanggalAkhir": "YYYY/MM/DD",
  "accountId": "101.002"
}
```

### Mendapatkan Data Balance dan Data Cashflow

```bash
POST http://localhost:5000/cashflow
```

#### Request Body

```bash
{
  "tanggalAwal": "YYYY/MM/DD",
  "tanggalAkhir": "YYYY/MM/DD",
  "accountId": "101.002"
}
```

### Mendapatkan Data Arus Kas

```bash
POST http://localhost:5000/arus-kas
```

#### Request Body

```bash
{
  "tanggalAwal": "YYYY-MM-DD",
  "tanggalAkhir": "YYYY-MM-DD",
}
```

Copyright © 2024 klinikkosasih.com
