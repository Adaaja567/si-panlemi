'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface JamOperasional {
    buka: string;
    tutup: string;
    libur: boolean;
}

interface JamOperasionalData {
    senin: JamOperasional;
    selasa: JamOperasional;
    rabu: JamOperasional;
    kamis: JamOperasional;
    jumat: JamOperasional;
    sabtu: JamOperasional;
    minggu: JamOperasional;
}

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [jamOperasional, setJamOperasional] = useState<JamOperasionalData | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/jam_operasional`);
            if (res.ok) {
                const data = await res.json();
                setJamOperasional(data.value);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            // Get token from localStorage
            const userInfo = localStorage.getItem('userInfo');
            const token = userInfo ? JSON.parse(userInfo).token : null;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/jam_operasional`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                credentials: 'include',
                body: JSON.stringify({
                    value: jamOperasional,
                    description: 'Jam operasional toko'
                })
            });

            if (res.ok) {
                setMessage('✅ Jam operasional berhasil diupdate! Perubahan akan terlihat di footer.');
                setTimeout(() => setMessage(''), 5000);
            } else {
                const error = await res.json();
                setMessage(`❌ Gagal update: ${error.message || 'Terjadi kesalahan'}`);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('❌ Terjadi kesalahan saat menyimpan');
        } finally {
            setSaving(false);
        }
    };

    const updateHari = (hari: keyof JamOperasionalData, field: keyof JamOperasional, value: string | boolean) => {
        if (!jamOperasional) return;
        setJamOperasional({
            ...jamOperasional,
            [hari]: {
                ...jamOperasional[hari],
                [field]: value
            }
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const hariList: Array<{ key: keyof JamOperasionalData; label: string }> = [
        { key: 'senin', label: 'Senin' },
        { key: 'selasa', label: 'Selasa' },
        { key: 'rabu', label: 'Rabu' },
        { key: 'kamis', label: 'Kamis' },
        { key: 'jumat', label: 'Jumat' },
        { key: 'sabtu', label: 'Sabtu' },
        { key: 'minggu', label: 'Minggu' }
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Toko</h1>
                <p className="text-gray-600 mt-1">Kelola jam operasional toko</p>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded-lg ${message.includes('berhasil') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Jam Operasional</h2>

                <div className="space-y-4">
                    {hariList.map(({ key, label }) => {
                        const jam = jamOperasional?.[key];
                        if (!jam) return null;

                        return (
                            <div key={key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-24 font-medium text-gray-700">{label}</div>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={jam.libur}
                                        onChange={(e) => updateHari(key, 'libur', e.target.checked)}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-600">Libur</span>
                                </label>

                                {!jam.libur && (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Buka:</label>
                                            <input
                                                type="time"
                                                value={jam.buka}
                                                onChange={(e) => updateHari(key, 'buka', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Tutup:</label>
                                            <input
                                                type="time"
                                                value={jam.tutup}
                                                onChange={(e) => updateHari(key, 'tutup', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
}
