'use client';

import Link from 'next/link';
import React from 'react';
import { Baloo_2, Nunito_Sans } from 'next/font/google';

// Font bulat untuk "Ngendok"
const ngendokFont = Baloo_2({
  subsets: ['latin'],
  weight: '700',
});

// Font lembut untuk "Farm"
const farmFont = Nunito_Sans({
  subsets: ['latin'],
  weight: '700',
});

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  asLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', asLink = true }) => {
  const sizeConfig = {
    sm: { text: 'text-[1.1rem]', egg: 'h-6 w-4', chicken: 'h-6 w-6' },
    md: { text: 'text-[1.3rem]', egg: 'h-8 w-5', chicken: 'h-8 w-8' },
    lg: { text: 'text-[1.6rem]', egg: 'h-10 w-6', chicken: 'h-10 w-10' },
    xl: { text: 'text-[2.2rem]', egg: 'h-14 w-8', chicken: 'h-14 w-14' }
  };

  const { text: textSize, egg: eggSize, chicken: chickenSize } = sizeConfig[size];

  const logoContent = (
    <div className={`flex items-center gap-3 ${asLink ? 'rounded-full px-3 py-1 hover:bg-orange-50 hover:shadow-sm hover:scale-[1.01] transition' : ''} ${className}`}>
      {/* Blok kiri: Ngendok (font bulat, warna oranye) */}
      <span
        className={`${ngendokFont.className} flex items-center gap-1px ${textSize} font-extrabold tracking-tight text-orange-600`}
      >
        {/* N g e n d */}
        <span>Ngend</span>

        {/* o → telur miring, putih + kuning, mepet ke huruf */}
        <span className={`inline-flex ${eggSize} -mx-1px items-center justify-center`}>
          <svg viewBox="0 0 24 32" className="h-full w-full">
            <g transform="rotate(15 12 16)">
              {/* cangkang telur */}
              <path
                d="M12 2.5C8.5 2.5 5 8.2 5 14c0 5.3 3.1 9.5 7 9.5s7-4.2 7-9.5C19 8.2 15.5 2.5 12 2.5z"
                fill="#FEFCE8"
                stroke="#F97316"
                strokeWidth="1.5"
              />
              {/* putih telur */}
              <ellipse cx="12" cy="16" rx="4.4" ry="5.4" fill="#FFFBEB" />
              {/* kuning telur */}
              <circle cx="12" cy="16.2" r="2.2" fill="#FACC15" />
            </g>
          </svg>
        </span>

        {/* k, agak ditarik mendekati telur */}
        <span className="-ml-1px">k</span>
      </span>

      {/* Blok kanan: Farm (font lembut, warna hijau) */}
      <span
        className={`${farmFont.className} flex items-center gap-1px ${textSize} font-extrabold tracking-tight text-emerald-600`}
      >
        {/* F */}
        <span>F</span>

        {/* a → ayam betina mengerami telur di sarang, sedikit lebih besar dan mepet */}
        <span className={`inline-flex ${chickenSize} -mx-1px items-center justify-center`}>
          <svg viewBox="0 0 40 32" className="h-full w-full">
            {/* sarang jerami */}
            <ellipse cx="20" cy="24" rx="13" ry="4.5" fill="#FBBF24" />
            {/* telur di sarang */}
            <ellipse cx="16" cy="21" rx="3" ry="3.8" fill="#FEFCE8" />
            <ellipse cx="22" cy="21.2" rx="2.7" ry="3.4" fill="#FEF3C7" />
            {/* badan ayam betina */}
            <ellipse cx="21" cy="17" rx="7.2" ry="5.2" fill="#FDBA74" />
            {/* kepala */}
            <circle cx="26" cy="13" r="3.3" fill="#FB923C" />
            {/* paruh */}
            <polygon points="29,13 32,14.2 29,15.4" fill="#FACC15" />
            {/* jambul */}
            <path
              d="M25 9 C26 7.8 27.4 7.8 28.2 9"
              stroke="#DC2626"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* sayap */}
            <path
              d="M17 17 C18.5 18.5 19.5 19 21.5 19"
              stroke="#FB923C"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </span>

        {/* rm, ditarik sedikit mendekati ayam */}
        <span className="-ml-1px">rm</span>
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/#beranda" aria-label="Ngendok_Farm">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;