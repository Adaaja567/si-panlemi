// Utility functions untuk menghitung jarak dan ongkir

// Koordinat Ngendok Farm (dari Google Maps)
export const NGENDOK_FARM_LOCATION = {
  lat: -6.7275268,
  lng: 111.3228453,
  address: "Jl. Lkr. Rembang, Ngrandu, Pulo, Kec. Rembang, Kabupaten Rembang, Jawa Tengah"
};

// Fungsi untuk menghitung jarak antara dua koordinat (Haversine formula)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Fungsi untuk menghitung ongkir berdasarkan jarak
export function calculateShippingFee(distanceKm: number): number {
  if (distanceKm <= 5) {
    return 0; // Gratis ongkir dalam radius 5km
  } else if (distanceKm <= 10) {
    return 15000; // Rp 15.000 untuk 5-10km
  } else if (distanceKm <= 15) {
    return 20000; // Rp 20.000 untuk 10-15km
  } else if (distanceKm <= 20) {
    return 25000; // Rp 25.000 untuk 15-20km
  } else {
    return 30000; // Rp 30.000 untuk >20km
  }
}

// Daftar area yang dikenal di Rembang dan sekitarnya
export const KNOWN_AREAS = [
  // ZONA GRATIS ONGKIR - 22 desa (19 Kec. Rembang + 3 Kec. Kaliori)
  
  // Kecamatan Rembang - GRATIS ONGKIR
  { name: "Pulo", keywords: ["pulo", "desa pulo"], distance: 0, fee: 0 }, // Lokasi farm
  { name: "Weton", keywords: ["weton", "desa weton"], distance: 3, fee: 0 },
  { name: "Ngotet", keywords: ["ngotet", "desa ngotet"], distance: 4, fee: 0 },
  { name: "Mondoteko", keywords: ["mondoteko", "desa mondoteko"], distance: 4, fee: 0 },
  { name: "Ngadem", keywords: ["ngadem", "desa ngadem"], distance: 4, fee: 0 },
  { name: "Ketanggi", keywords: ["ketanggi", "desa ketanggi"], distance: 4, fee: 0 },
  { name: "Waru", keywords: ["waru", "desa waru"], distance: 4, fee: 0 },
  { name: "Magersari", keywords: ["magersari", "desa magersari"], distance: 3.5, fee: 0 },
  { name: "Gegunung Kulon", keywords: ["gegunung kulon", "desa gegunung kulon"], distance: 4.5, fee: 0 },
  { name: "Gegunung Wetan", keywords: ["gegunung wetan", "desa gegunung wetan"], distance: 5, fee: 0 },
  { name: "Pacar", keywords: ["pacar", "desa pacar"], distance: 4, fee: 0 },
  { name: "Tanjungsari", keywords: ["tanjungsari", "desa tanjungsari"], distance: 4, fee: 0 },
  { name: "Sumberjo", keywords: ["sumberjo", "desa sumberjo"], distance: 4, fee: 0 },
  { name: "Tasik Agung", keywords: ["tasik agung", "desa tasik agung", "tasikagung"], distance: 4, fee: 0 },
  { name: "Sawahan", keywords: ["sawahan", "desa sawahan"], distance: 4, fee: 0 },
  { name: "Leteh", keywords: ["leteh", "desa leteh"], distance: 4, fee: 0 },
  { name: "Sidowayah", keywords: ["sidowayah", "desa sidowayah"], distance: 4, fee: 0 },
  { name: "Kabonganlor", keywords: ["kabonganlor", "desa kabonganlor", "kabonan lor"], distance: 4, fee: 0 },
  { name: "Kabongankidul", keywords: ["kabongankidul", "desa kabongankidul", "kabonan kidul"], distance: 4, fee: 0 },
  
  // Kecamatan Kaliori - GRATIS ONGKIR
  { name: "Sendang Agung", keywords: ["sendang agung", "desa sendang agung"], distance: 4, fee: 0 },
  { name: "Siman", keywords: ["siman", "desa siman"], distance: 4, fee: 0 },
  { name: "Bangker", keywords: ["bangker", "desa bangker"], distance: 4, fee: 0 },
  
  // ZONA ONGKIR Rp 15.000 (5-10km)
  { name: "Kedungrejo", keywords: ["kedungrejo", "desa kedungrejo"], distance: 5.2, fee: 15000 },
  { name: "Turusgede", keywords: ["turusgede", "desa turusgede"], distance: 5.2, fee: 15000 },
  { name: "Kumendung", keywords: ["kumendung", "desa kumendung"], distance: 5.2, fee: 15000 },
  { name: "Sridadi", keywords: ["sridadi", "desa sridadi"], distance: 5, fee: 15000 },
  { name: "Gedangan", keywords: ["gedangan", "desa gedangan"], distance: 7.2, fee: 15000 },
  { name: "Pasar Banggi", keywords: ["pasar banggi", "desa pasar banggi", "banggi"], distance: 8.4, fee: 15000 },
  
  // ZONA ONGKIR Rp 20.000 (10-11km)
  { name: "Tritunggal", keywords: ["tritunggal", "desa tritunggal"], distance: 10, fee: 20000 },
  { name: "Pandean", keywords: ["pandean", "desa pandean"], distance: 11, fee: 20000 },
  { name: "Tlogomojo", keywords: ["tlogomojo", "desa tlogomojo"], distance: 11, fee: 20000 },
  { name: "Kasreman", keywords: ["kasreman", "desa kasreman"], distance: 11, fee: 20000 },
  { name: "Punjulharjo", keywords: ["punjulharjo", "desa punjulharjo"], distance: 11, fee: 20000 },
  { name: "Tireman", keywords: ["tireman", "desa tireman"], distance: 11, fee: 20000 },
  
  // Area lain yang jauh
  { name: "Rembang Kota", keywords: ["rembang kota", "kota rembang", "pusat kota rembang"], distance: 8, fee: 15000 },
  { name: "Tasikharjo", keywords: ["tasikharjo"], distance: 9, fee: 15000 },
  { name: "Bulu", keywords: ["bulu", "desa bulu"], distance: 7, fee: 15000 },
  { name: "Sedan", keywords: ["sedan", "desa sedan"], distance: 8, fee: 15000 },
  { name: "Lasem", keywords: ["lasem"], distance: 18, fee: 25000 },
  { name: "Sluke", keywords: ["sluke"], distance: 17, fee: 25000 },
  { name: "Sarang", keywords: ["sarang"], distance: 19, fee: 25000 },
  { name: "Blora", keywords: ["blora"], distance: 25, fee: 30000 },
  { name: "Tuban", keywords: ["tuban"], distance: 28, fee: 30000 },
  { name: "Bojonegoro", keywords: ["bojonegoro"], distance: 35, fee: 35000 },
  { name: "Cepu", keywords: ["cepu"], distance: 32, fee: 30000 },
];

// Fungsi untuk mendeteksi area berdasarkan alamat
export function detectAreaFromAddress(address: string): { area: string; distance: number; fee: number } | null {
  const normalizedAddress = address.toLowerCase().trim();
  
  for (const area of KNOWN_AREAS) {
    for (const keyword of area.keywords) {
      if (normalizedAddress.includes(keyword)) {
        return {
          area: area.name,
          distance: area.distance,
          fee: area.fee
        };
      }
    }
  }
  
  return null; // Area tidak dikenal
}

// Fungsi untuk memberikan saran penulisan alamat
export function getAddressGuidance(): string[] {
  return [
    "📍 Contoh penulisan alamat yang benar:",
    "• Jl. Merdeka No. 123, Rembang Kota, Rembang",
    "• Desa Pulo, Kec. Rembang, Kab. Rembang",
    "• Jl. Lasem-Rembang KM 5, Tasikharjo, Rembang",
    "• Desa Kedungrejo, Kec. Rembang, Kab. Rembang",
    "",
    "💡 Tips:",
    "• Sertakan nama jalan/gang jika ada",
    "• Tulis nama desa/kelurahan dengan jelas", 
    "• Tambahkan patokan (dekat masjid, sekolah, dll)",
    "• Gunakan nama kecamatan untuk area yang jelas",
    "",
    "🚚 Info Ongkir (Berlaku untuk COD & DANA):",
    "• GRATIS: 22 desa terpilih (19 Kec. Rembang + 3 Kec. Kaliori)",
    "• Rp 15.000: 6 desa (Kedungrejo, Turusgede, Kumendung, dll)",
    "• Rp 20.000: 6 desa (Tritunggal, Pandean, Tireman, dll)",
    "• Rp 25.000: Area jauh (Lasem, Sluke, Sarang)",
    "• Rp 30.000+: Area sangat jauh (Blora, Tuban, dll)"
  ];
}

// Fungsi untuk format ongkir
export function formatShippingFee(fee: number): string {
  if (fee === 0) {
    return "GRATIS";
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(fee);
}