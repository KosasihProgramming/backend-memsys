# Back End Node JS - Memsys

## Deskripsi

Proyek ini adalah back end untuk aplikasi Memsys, dibangun menggunakan Node.js dan Express. Proyek ini menangani berbagai operasi back-end, termasuk autentikasi, manajemen data pengguna, dan pengelolaan dokumen.

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

## Dokumentasi API

### API Login

```bash
POST http://localhost:5000/login
```

#### Request Body

```bash
{
  "username": "HG001.Hg",
  "password": "1234",
}
```

### Mendapatkan Nama Akun

```bash
GET http://localhost:5000/accounts
```

### Mencari Cashflow (Arus kas)

```bash
POST http://localhost:5000/arus-kas
```

#### Request Body

```bash
{
  "tanggalAwal": "YYYY/MM/DD",
  "tanggalAkhir": "YYYY/MM/DD",
  "accountId": "101.002",
  "username": "HG001.Hg"
}
```

Copyright © 2024 klinikkosasih.com
