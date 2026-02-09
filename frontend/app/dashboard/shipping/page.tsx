'use client';

import React, { useState, useEffect } from 'react';

interface ShippingSetting {
  _id: string;
  areaName: string;
  keywords: string[];
  distanceKm: number;
  shippingFee: number;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

export default function ShippingSettingsPage() {
  const [settings, setSettings] = useState<ShippingSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);