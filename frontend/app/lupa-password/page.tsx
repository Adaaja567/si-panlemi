'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset, verifyPasswordReset } from '@/lib/api';

export default function LupaPasswordPage() {
    const [phone, setPhone] = useState('');
    const [step, setStep] = useState<'input' | 'verification' | 'success'>('input');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validasi nomor WA
            if (!phone || phone.length < 10) {
                throw new Error('Nomor WhatsApp tidak valid');
            }

            // Panggil API untuk request reset password
            const response = await requestPasswordReset(phone);

            setStep('verification');

            // Tampilkan kode untuk development (akan dihapus di production)
            if (response.devCode) {
                alert(`Kode verifikasi telah dikirim ke WhatsApp ${phone}. Untuk development, gunakan kode: ${response.devCode}`);
            } else {
                alert(`Kode verifikasi telah dikirim ke WhatsApp ${phone}. Silakan cek pesan WhatsApp Anda.`);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!verificationCode || verificationCode.length !== 6) {
                throw new Error('Kode verifikasi harus 6 digit');
            }

            if (!newPassword || newPassword.length < 6) {
                throw new Error('Password minimal 6 karakter');
            }

            // Panggil API untuk verify dan reset password
            await verifyPasswordReset(phone, verificationCode, newPassword);

            setStep('success');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Lupa Password</h1>
                        <p className="text-gray-600 mt-2">
                            {step === 'input' && 'Masukkan nomor WhatsApp untuk reset password'}
                            {step === 'verification' && 'Masukkan kode verifikasi dan password baru'}
                            {step === 'success' && 'Password berhasil direset'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Input Phone */}
                    {step === 'input' && (
                        <form onSubmit={handleRequestReset} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Kode verifikasi akan dikirim via WhatsApp
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                            >
                                {loading ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Verification */}
                    {step === 'verification' && (
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode Verifikasi
                                </label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="123456"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Cek WhatsApp Anda untuk kode 6 digit
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimal 6 karakter"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('input')}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300"
                                >
                                    Kembali
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                                >
                                    {loading ? 'Memproses...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Success */}
                    {step === 'success' && (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Berhasil Direset!</h3>
                                <p className="text-gray-600 text-sm">
                                    Password Anda telah berhasil diubah. Silakan login dengan password baru.
                                </p>
                            </div>

                            <Link
                                href="/login"
                                className="inline-block w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 font-medium"
                            >
                                Login Sekarang
                            </Link>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-sm text-orange-600 hover:text-orange-700">
                            ← Kembali ke Login
                        </Link>
                    </div>

                    {/* Security Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">🔒 Keamanan</h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Kode verifikasi hanya berlaku 10 menit</li>
                            <li>• Hanya pemilik nomor WA yang bisa reset</li>
                            <li>• Jika bukan Anda yang meminta, abaikan pesan ini</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}