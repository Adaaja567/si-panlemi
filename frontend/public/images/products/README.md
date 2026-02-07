# Panduan Upload Foto Produk

## Foto yang Perlu Ditambahkan

Berdasarkan foto yang Anda berikan, silakan simpan file dengan nama berikut:

### 1. Ayam Ungkep (Foto ayam kuning)
- `ayam-ungkep-1kg.jpg` - Foto ayam ungkep bumbu kuning
- `ayam-ungkep-05kg.jpg` - Foto ayam ungkep bumbu kuning

### 2. Lele Fresh (Foto lele segar)
- `lele-fresh-1kg.jpg` - Foto lele segar dari kolam
- `lele-fresh-05kg.jpg` - Foto lele segar dari kolam

### 3. Lele Marinasi (Foto lele bumbu kuning)
- `lele-marinasi-1kg.jpg` - Foto lele marinasi bumbu kuning
- `lele-marinasi-05kg.jpg` - Foto lele marinasi bumbu kuning

### 4. Telur (Foto telur campuran)
- `telur-1kg.jpg` - Foto telur ayam campuran putih dan coklat

### 5. Minyak Goreng (Foto minyak botol)
- `minyak-1liter.jpg` - Foto minyak goreng kemasan botol

## Cara Upload:

1. **Simpan foto** ke folder ini (`frontend/public/images/products/`)
2. **Pastikan nama file** sesuai dengan daftar di atas
3. **Format yang disarankan**: JPG atau PNG
4. **Ukuran optimal**: 800x800px atau rasio 1:1
5. **Jalankan script** untuk update database:
   ```bash
   cd backend
   node src/scripts/seedProducts.js
   ```

## Setelah Upload:

- Foto akan otomatis muncul di website
- Bisa dikelola melalui dashboard admin
- Tersimpan di MongoDB Atlas
- Bisa diedit melalui halaman `/dashboard/products`

## Catatan:

- Jika foto tidak muncul, periksa nama file harus persis sama
- Gunakan huruf kecil dan tanda hubung (-)
- Jangan ada spasi dalam nama file
- Format file: .jpg, .jpeg, atau .png