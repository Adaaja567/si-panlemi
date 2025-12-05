export interface Product {
  _id?: string;
  name: string;
  category: 'ayam' | 'lele_fresh' | 'lele_marinasi' | 'telur' | 'minyak';
  description: string;
  price: number;
  unit: string;
  status: 'available' | 'preorder' | 'out_of_stock';
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}