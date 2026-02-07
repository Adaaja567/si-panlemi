'use client';

import React, { useEffect, useState } from 'react';
import {
    fetchAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    uploadProductImage,
    adminMe
} from '@/lib/api';
import type { Product } from '@/lib/types';

// Mapping foto yang benar - sama dengan ProductCard
const imageMapping: { [key: string]: string } = {
    'Ayam Ungkep 1kg': '/images/1.png',
    'Ayam Ungkep 0.5kg': '/images/1.png',
    'Lele Fresh 1kg': '/images/2.png',
    'Lele Fresh 0.5kg': '/images/2.png',
    'Lele Marinasi 1kg': '/images/3.png',
    'Lele Marinasi 0.5kg': '/images/3.png',
    'Telur Ayam Segar': '/images/4.png',
    'Minyak Goreng': '/images/5.png'
};

function getCorrectImageUrl(product: Product): string {
    return imageMapping[product.name] || product.imageUrl || '/images/placeholder-product.svg';
}

type ProductForm = Omit<Product, '_id' | 'createdAt' | 'updatedAt'> & {
    stock?: number;
    imageFile?: File | null;
};

const ProductsManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [userRole, setUserRole] = useState<string>('');
    const [customCategory, setCustomCategory] = useState('');
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    // Form state
    const [formData, setFormData] = useState<ProductForm>({
        name: '',
        category: 'ayam',
        description: '',
        price: 0,
        unit: '',
        status: 'available',
        imageUrl: '',
        usage: '',
        stock: 0,
        imageFile: null
    });

    const defaultCategories = [
        { value: 'ayam', label: 'Ayam' },
        { value: 'lele_fresh', label: 'Lele Fresh' },
        { value: 'lele_marinasi', label: 'Lele Marinasi' },
        { value: 'telur', label: 'Telur' },
        { value: 'minyak', label: 'Minyak' },
        { value: 'sayuran', label: 'Sayuran' },
        { value: 'bumbu', label: 'Bumbu & Rempah' },
        { value: 'beras', label: 'Beras' },
        { value: 'custom', label: '+ Tambah Kategori Baru' }
    ];

    const statusOptions = [
        { value: 'available', label: 'Tersedia' },
        { value: 'preorder', label: 'Pre-order' },
        { value: 'out_of_stock', label: 'Stok Habis' }
    ];

    useEffect(() => {
        checkAuth();
        loadProducts();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await adminMe();
            setUserRole(response.user.role);
        } catch (error) {
            window.location.href = '/admin-login';
        }
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetchAdminProducts();
            // Backend returns array directly, not wrapped in {products: []}
            setProducts(Array.isArray(response) ? response : response.products || []);
        } catch (err: any) {
            setError(err.message || 'Gagal memuat produk');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'ayam',
            description: '',
            price: 0,
            unit: '',
            status: 'available',
            imageUrl: '',
            usage: '',
            stock: 0,
            imageFile: null
        });
        setEditingProduct(null);
        setShowForm(false);
        setShowCustomCategory(false);
        setCustomCategory('');
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            unit: product.unit,
            status: product.status,
            imageUrl: product.imageUrl,
            usage: product.usage,
            stock: (product as any).stock || 0,
            imageFile: null
        });
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCategoryChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomCategory(true);
            setFormData({ ...formData, category: '' });
        } else {
            setShowCustomCategory(false);
            setFormData({ ...formData, category: value });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi file
            if (!file.type.startsWith('image/')) {
                setError('File harus berupa gambar');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setError('Ukuran file maksimal 5MB');
                return;
            }
            setFormData({ ...formData, imageFile: file });
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const submitData = { ...formData };

            // Jika custom category, gunakan input custom
            if (showCustomCategory && customCategory.trim()) {
                submitData.category = customCategory.trim().toLowerCase().replace(/\s+/g, '_');
            }

            // Upload image jika ada file
            if (formData.imageFile) {
                try {
                    const uploadResult = await uploadProductImage(formData.imageFile);
                    submitData.imageUrl = uploadResult.url;
                } catch (uploadError: any) {
                    setError(`Gagal upload gambar: ${uploadError.message}`);
                    return;
                }
            }

            // Remove imageFile dari submitData karena tidak perlu dikirim ke API produk
            const { imageFile, ...productData } = submitData;

            if (editingProduct) {
                await updateAdminProduct(editingProduct._id, productData);
            } else {
                await createAdminProduct(productData);
            }

            await loadProducts();
            resetForm();
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan produk');
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;

        try {
            await deleteAdminProduct(productId);
            await loadProducts();
        } catch (err: any) {
            setError(err.message || 'Gagal menghapus produk');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            available: 'bg-green-100 text-green-800',
            preorder: 'bg-yellow-100 text-yellow-800',
            out_of_stock: 'bg-red-100 text-red-800'
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { text: 'Habis', color: 'text-red-600' };
        if (stock < 10) return { text: 'Sedikit', color: 'text-yellow-600' };
        return { text: 'Tersedia', color: 'text-green-600' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat produk...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Header - Responsive */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Produk</h1>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Kelola produk yang ditampilkan di website</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                        >
                            + Tambah Produk
                        </button>
                        <a
                            href="/dashboard"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-center text-sm sm:text-base"
                        >
                            Kembali ke Dashboard
                        </a>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Product Form Modal - Responsive */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-bold mb-4">
                                    {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2 lg:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nama Produk *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Kategori *
                                            </label>
                                            <select
                                                value={showCustomCategory ? 'custom' : formData.category}
                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {defaultCategories.map(cat => (
                                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {showCustomCategory && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nama Kategori Baru *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={customCategory}
                                                    onChange={(e) => setCustomCategory(e.target.value)}
                                                    placeholder="contoh: Makanan Ringan"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Harga (Rp) *
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Unit *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                placeholder="contoh: 1 kg, 0.5 kg, 1 liter"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stok
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                min="0"
                                                placeholder="Jumlah stok tersedia"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Kosongkan jika tidak ingin menampilkan stok
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status.value} value={status.value}>{status.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gambar Produk
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Format: JPG, PNG, WEBP. Maksimal 5MB
                                        </p>
                                        {formData.imageFile && (
                                            <p className="text-xs text-green-600 mt-1">
                                                ✓ File terpilih: {formData.imageFile.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Deskripsi *
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            placeholder="Deskripsi produk..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cara Penggunaan
                                        </label>
                                        <textarea
                                            value={formData.usage}
                                            onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                                            rows={2}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Cara menggunakan atau memasak produk..."
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                        >
                                            {editingProduct ? 'Update' : 'Simpan'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid - Mobile First */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => {
                        const stockStatus = getStockStatus((product as any).stock || 0);
                        return (
                            <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                                    <img
                                        className="w-full h-48 object-cover"
                                        src={getCorrectImageUrl(product)}
                                        alt={product.name}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (!target.src.includes('placeholder-product.svg')) {
                                                target.src = '/images/placeholder-product.svg';
                                            }
                                        }}
                                    />
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                                            {statusOptions.find(s => s.value === product.status)?.label}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Unit:</span>
                                            <span className="text-xs font-medium">{product.unit}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Harga:</span>
                                            <span className="text-sm font-bold text-blue-600">{formatPrice(product.price)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Kategori:</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {defaultCategories.find(c => c.value === product.category)?.label || product.category}
                                            </span>
                                        </div>
                                        {(product as any).stock !== undefined && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Stok:</span>
                                                <span className={`text-xs font-medium ${stockStatus.color}`}>
                                                    {(product as any).stock} ({stockStatus.text})
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada produk</h3>
                        <p className="text-gray-500 mb-4">Mulai dengan menambahkan produk pertama Anda</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Tambah Produk
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsManagement;