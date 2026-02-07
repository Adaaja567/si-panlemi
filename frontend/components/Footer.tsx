'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';
import SmartNavLink from './SmartNavLink';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [jamOperasional, setJamOperasional] = useState<string>('08:00 - 17:00 WIB');

    useEffect(() => {
        fetchJamOperasional();
    }, []);

    const fetchJamOperasional = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/jam_operasional`);
            if (res.ok) {
                const data = await res.json();
                const today = new Date().getDay();
                const hariMap = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
                const hariIni = hariMap[today];
                const jam = data.value[hariIni];

                if (jam.libur) {
                    setJamOperasional('Tutup (Libur)');
                } else {
                    setJamOperasional(`${jam.buka} - ${jam.tutup} WIB`);
                }
            }
        } catch (error) {
            console.error('Error fetching jam operasional:', error);
            // Fallback ke jam default jika gagal
            setJamOperasional('08:00 - 17:00 WIB');
        }
    };

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-orange-400">
                                <Image
                                    src="/images/logo.png"
                                    alt="Ngendok Farm Logo"
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-orange-400">Ngendok_Farm</div>
                                <div className="text-sm text-gray-400">Fresh & Ready to Cook</div>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Menyediakan telur, ayam ungkep, lele fresh dan marinasi, serta minyak goreng
                            dalam kondisi bersih, higienis, dan siap olah. Solusi praktis untuk kebutuhan
                            dapur rumah tangga dan usaha makanan.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://wa.me/6289532642246"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                </svg>
                                WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-orange-400">Menu Utama</h3>
                        <ul className="space-y-2">
                            <li>
                                <SmartNavLink href="/" sectionId="beranda" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                                    Beranda
                                </SmartNavLink>
                            </li>
                            <li>
                                <SmartNavLink href="/" sectionId="produk" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                                    Produk
                                </SmartNavLink>
                            </li>
                            <li>
                                <Link href="/cara-pesan" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                                    Cara Pesan
                                </Link>
                            </li>
                            <li>
                                <Link href="/riwayat-pesanan" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                                    Riwayat Pesanan
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                                    Keranjang
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kontak */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-orange-400">Hubungi Kami</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://wa.me/6289532642246"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                    WhatsApp
                                </a>
                            </li>
                            <li>
                                <span className="text-gray-300 text-sm">
                                    🕒 Buka: {jamOperasional}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Lokasi */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-orange-400">Lokasi Kami</h3>
                        <div className="space-y-3">
                            <p className="text-gray-300 text-sm">
                                Jl. Lkr. Rembang, Ngrandu, Pulo<br />
                                Kec. Rembang, Kabupaten Rembang<br />
                                Jawa Tengah 59219
                            </p>
                            <p className="text-gray-300 text-sm italic">
                                📍 Sebelah timur Apotek
                            </p>
                            <div className="mt-3">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15849.385423006292!2d111.3153706002525!3d-6.727526846994513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7725ab5060fb37%3A0x59a34f9e0ddb73de!2s78FJ%2B2HM%2C%20Jl.%20Lkr.%20Rembang%2C%20Ngrandu%2C%20Pulo%2C%20Kec.%20Rembang%2C%20Kabupaten%20Rembang%2C%20Jawa%20Tengah%2059219!5e0!3m2!1sid!2sid!4v1768133037295!5m2!1sid!2sid"
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="rounded-lg shadow-sm"
                                    title="Lokasi Ngendok_Farm"
                                />
                            </div>
                            <a
                                href="https://www.google.com/maps/place/78FJ%2B2HM,+Jl.+Lkr.+Rembang,+Ngrandu,+Pulo,+Kec.+Rembang,+Kabupaten+Rembang,+Jawa+Tengah+59219/@-6.7275268,111.3153706,15z/data=!3m1!4b1!4m6!3m5!1s0x2e7725ab5060fb37:0x59a34f9e0ddb73de!8m2!3d-6.7275268!4d111.3228453!16s%2Fg%2F11y3k8y8qy?entry=ttu&g_ep=EgoyMDI1MDExMy4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-orange-400 hover:text-orange-300 text-sm underline transition-colors"
                            >
                                🗺️ Buka di Google Maps
                            </a>
                        </div>
                    </div>

                    {/* Akun */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-orange-400">Akun</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/login" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                                    Masuk
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                                    Daftar
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin-login" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                                    Admin
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-400">
                            © {currentYear} Ngendok_Farm. Semua hak cipta dilindungi.
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span>Dibuat dengan ❤️ untuk kemudahan berbelanja</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;