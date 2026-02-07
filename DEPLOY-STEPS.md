# 🚀 Langkah Cepat Deploy ke Vercel

## ✅ Step 1: Deploy Backend

1. Buka https://vercel.com/new
2. Import repository: `Adaaja567/si-panlemi`
3. **Root Directory**: Pilih `backend`
4. **Framework Preset**: Other
5. Tambahkan Environment Variables (copy paste semua):

```
PORT=4000
NODE_ENV=production
FRONTEND_ORIGIN=https://NANTI-DIISI-SETELAH-FRONTEND-DEPLOY.vercel.app
MONGODB_URI=mongodb+srv://UIk7kzCvG6JuzKdn:UIk7kzCvG6JuzKdn@ngendok-farm-cluster.xe83c7w.mongodb.net/ngendok-farm?retryWrites=true&w=majority&appName=ngendok-farm-cluster
JWT_SECRET=e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67
STORE_LAT=-6.727475111
STORE_LNG=111.331513
MAX_FREE_DELIVERY_KM=3
MAX_FILE_SIZE=5242880
```

6. Klik **Deploy**
7. **COPY URL BACKEND** (contoh: `https://si-panlemi-backend.vercel.app`)

---

## ✅ Step 2: Deploy Frontend

1. Buka https://vercel.com/new (lagi)
2. Import repository yang sama: `Adaaja567/si-panlemi`
3. **Root Directory**: Pilih `frontend`
4. **Framework Preset**: Next.js
5. Tambahkan Environment Variable:

```
NEXT_PUBLIC_API_URL=https://PASTE-URL-BACKEND-DISINI
```

**⚠️ GANTI** `https://PASTE-URL-BACKEND-DISINI` dengan URL backend dari Step 1!

6. Klik **Deploy**
7. **COPY URL FRONTEND** (contoh: `https://si-panlemi.vercel.app`)

---

## ✅ Step 3: Update Backend CORS

1. Buka Vercel Dashboard → Project Backend
2. Settings → Environment Variables
3. Edit `FRONTEND_ORIGIN`
4. Ganti dengan URL frontend dari Step 2
5. Save
6. Deployments → Latest → ... → Redeploy

---

## ✅ Step 4: Test Website

1. Buka URL frontend
2. Test halaman beranda - produk harus muncul
3. Test login admin: `/admin-login`
   - Username: `superadmin`
   - Password: `SuperAdmin2026`

---

## 🎉 SELESAI!

Website sudah online di:
- **Frontend**: https://your-frontend.vercel.app
- **Backend**: https://your-backend.vercel.app

---

## 📝 Update Code Nanti

Setiap kali ada perubahan:

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

Vercel akan otomatis re-deploy! ✨

---

## ⚠️ PENTING: Setelah Deploy

1. **Ubah JWT Secret** untuk keamanan
2. **Ubah Password Admin** setelah login pertama
3. **Backup Database** secara berkala

---

## 🆘 Jika Ada Masalah

### Backend Error
- Cek logs: Vercel Dashboard → Backend Project → Deployments → View Function Logs
- Pastikan semua Environment Variables sudah benar

### Frontend Tidak Bisa Fetch
- Pastikan `NEXT_PUBLIC_API_URL` benar (harus ada https://)
- Pastikan backend `FRONTEND_ORIGIN` sudah diupdate
- Cek browser console (F12) untuk error

### Upload Gambar Gagal
- Vercel Serverless punya limit 50MB
- Untuk production, gunakan Cloudinary atau AWS S3

---

**Good luck! 🚀**
