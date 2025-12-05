'use client';

import React from 'react';

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  children?: React.ReactNode;
  className?: string;
}

export const buildWhatsAppUrl = (phone: string, message: string) => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone,
  message,
  children = 'Pesan via WhatsApp',
  className = '',
}) => {
  const url = buildWhatsAppUrl(phone, message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ${className}`}
    >
      {children}
    </a>
  );
};

export default WhatsAppButton;