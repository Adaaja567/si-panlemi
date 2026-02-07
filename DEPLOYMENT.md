# 🚀 Panduan Deployment SI Panlemi (Ngendok_Farm)

## 📋 Persiapan

### 1. Akun yang Dibutuhkan
- ✅ GitHub Account
- ✅ Vercel Account (bisa login dengan GitHub)
- ✅ MongoDB Atlas (sudah ada)

### 2. Repository GitHub

#### Inisialisasi Git (jika belum)
```bash
git init
git add .
git commit -m "Initial commit: SI Panlemi - Ngendok Farm"
```

#### Buat Repository di GitHub
1. Buka https://github.com/new
2. Nama repository: `si-panlemi` atau `ngendok-farm`
3. Pilih **Private** (jika tidak ingin publik)
4. Jangan centang "Initialize with README"
5. Klik "Create repository"

#### Push ke GitHub
```bash
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

---

## 🔧 Deploy Backend ke Vercel

### 1. Import Project
1. Buka https://vercel.com/new
2. Pilih repository GitHub yang baru dibuat
3. Pilih **Root Directory**: `backend`
4. Framework Preset: **Other**

### 2. Environment Variables
Tambahkan environment variables berikut di Vercel:

```
PORT=4000
NODE_ENV=production
FRONTEND_ORIGIN=https://your-frontend-url.vercel.app
MONGODB_URI=mongodb+srv://UIk7kzCvG6JuzKdn:UIk7kzCvG6JuzKdn@ngendok-farm-cluster.xe83c7w.mongodb.net/ngendok-farm?retryWrites=true&w=majority&appName=ngendok-farm-cluster
JWT_SECRET=e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67
STORE_LAT=-6.727475111
STORE_LNG=111.331513
MAX_FREE_DELIVERY_KM=3
MAX_FILE_SIZE=5242880
```

**Catatan:** Admin sudah ada di database MongoDB dengan:
- Username: `superadmin`
- Password: `SuperAdmin2026`

### 3. Deploy
- Klik **Deploy**
- Tunggu proses build selesai
- Copy URL backend (contoh: `https://si-panlemi-backend.vercel.app`)

---

## 🎨 Deploy Frontend ke Vercel

### 1. Import Project (Lagi)
1. Buka https://vercel.com/new
2. Pilih repository yang sama
3. Pilih **Root Directory**: `frontend`
4. Framework Preset: **Next.js**

### 2. Environment Variables
Tambahkan environment variable:

```
NEXT_PUBLIC_API_URL=https://si-panlemi-backend.vercel.app
```

**⚠️ PENTING:** Ganti URL dengan URL backend yang sudah di-deploy di langkah sebelumnya!

### 3. Deploy
- Klik **Deploy**
- Tunggu proses build selesai
- Copy URL frontend (contoh: `https://si-panlemi.vercel.app`)

---

## 🔄 Update Backend Environment

Setelah frontend berhasil di-deploy, update environment variable backend:

1. Buka project backend di Vercel Dashboard
2. Settings → Environment Variables
3. Edit `FRONTEND_ORIGIN`
4. Ganti dengan URL frontend yang baru (contoh: `https://si-panlemi.vercel.app`)
5. Klik **Save**
6. Redeploy backend (Deployments → ... → Redeploy)

---

## ✅ Testing Deployment

### 1. Test Backend
Buka: `https://your-backend-url.vercel.app/api/products`

Harus menampilkan list produk dalam format JSON.

### 2. Test Frontend
1. Buka: `https://your-frontend-url.vercel.app`
2. Cek apakah produk muncul
3. Test login admin: `https://your-frontend-url.vercel.app/admin-login`
   - Username: `superadmin`
   - Password: `SuperAdmin2026`

---

## 🔐 Keamanan Production

### Setelah Deploy, Ubah:

1. **JWT Secret** - Generate baru:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Admin Password** - Ubah di dashboard setelah login pertama

3. **MongoDB** - Buat user database khusus production (opsional)

---

## 📝 Update Code

Setiap kali ada perubahan code:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

Vercel akan otomatis re-deploy!

---

## 🆘 Troubleshooting

### Backend Error 500
- Cek Environment Variables sudah benar semua
- Cek MongoDB connection string
- Lihat logs di Vercel Dashboard → Deployments → View Function Logs

### Frontend Tidak Bisa Fetch Data
- Pastikan `NEXT_PUBLIC_API_URL` benar
- Pastikan backend `FRONTEND_ORIGIN` sudah diupdate dengan URL frontend
- Cek CORS settings

### Upload Gambar Tidak Berfungsi
- Vercel Serverless Functions punya limit 50MB
- Untuk production, sebaiknya gunakan cloud storage (Cloudinary, AWS S3, dll)

---

## 📞 Kontak

Jika ada masalah deployment, hubungi developer atau cek dokumentasi:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

**Selamat! SI Panlemi sudah online! 🎉**
