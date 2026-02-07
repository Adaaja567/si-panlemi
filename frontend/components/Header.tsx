'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import SmartNavLink from './SmartNavLink';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const { getTotalItems } = useCart();

    useEffect(() => {
        // Check if user is logged in
        const checkLoginStatus = () => {
            try {
                const userInfo = localStorage.getItem('userInfo');

                if (userInfo) {
                    const user = JSON.parse(userInfo);
                    // Cek apakah user adalah regular user (bukan admin)
                    if (user.role === 'user') {
                        setIsLoggedIn(true);
                        setUserName(user.name || '');
                    } else {
                        // Jika admin, jangan tampilkan sebagai logged in user
                        setIsLoggedIn(false);
                        setUserName('');
                    }
                } else {
                    setIsLoggedIn(false);
                    setUserName('');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setIsLoggedIn(false);
                setUserName('');
            }
        };

        checkLoginStatus();

        // Listen for login/logout events
        const handleStorageChange = () => checkLoginStatus();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('userInfoUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userInfoUpdated', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userToken');
        localStorage.removeItem('customerInfo');
        setIsLoggedIn(false);
        setUserName('');
        window.dispatchEvent(new Event('userInfoUpdated'));
    };

    const totalItems = getTotalItems();

    return (
        <header className="bg-white shadow-sm border-b border-orange-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-orange-200">
                            <Image
                                src="/images/logo.png"
                                alt="Ngendok Farm Logo"
                                fill
                                sizes="40px"
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="hidden sm:block">
                            <div className="text-lg font-bold text-orange-600">Ngendok_Farm</div>
                            <div className="text-xs text-gray-600">Fresh & Ready to Cook</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <SmartNavLink
                            href="/"
                            sectionId="beranda"
                            className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all"
                        >
                            Beranda
                        </SmartNavLink>
                        <SmartNavLink
                            href="/"
                            sectionId="produk"
                            className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all"
                        >
                            Produk
                        </SmartNavLink>
                        <Link href="/cara-pesan" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">
                            Cara Pesan
                        </Link>
                        <Link href="/riwayat-pesanan" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">
                            Riwayat Pesanan
                        </Link>
                        <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                            Keranjang
                            {totalItems > 0 && (
                                <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </nav>

                    {/* Cart & Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700">
                                    Halo, {userName ? (userName.length > 10 ? userName.substring(0, 10) + '...' : userName) : 'User'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                >
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-3">
                            <SmartNavLink
                                href="/"
                                sectionId="beranda"
                                className="text-gray-700 hover:text-orange-600 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Beranda
                            </SmartNavLink>
                            <SmartNavLink
                                href="/"
                                sectionId="produk"
                                className="text-gray-700 hover:text-orange-600 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Produk
                            </SmartNavLink>
                            <Link
                                href="/cara-pesan"
                                className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Cara Pesan
                            </Link>
                            <Link
                                href="/riwayat-pesanan"
                                className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Riwayat Pesanan
                            </Link>
                            <Link
                                href="/cart"
                                className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                                Keranjang
                                {totalItems > 0 && (
                                    <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            <div className="pt-3 border-t border-gray-200">
                                {isLoggedIn ? (
                                    <div className="flex flex-col space-y-2">
                                        <span className="text-sm text-gray-700 py-2">
                                            Halo, {userName ? (userName.length > 15 ? userName.substring(0, 15) + '...' : userName) : 'User'}
                                        </span>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="text-left text-gray-700 hover:text-orange-600 transition-colors py-2"
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Link
                                            href="/login"
                                            className="text-gray-700 hover:text-orange-600 transition-colors py-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="inline-block px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;