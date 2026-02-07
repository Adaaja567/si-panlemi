'use client';

import React, { useState } from 'react';

export default function PasswordField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="mt-1 w-full rounded-lg border px-2 py-1.5 text-xs pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border px-2 py-1 text-[11px]"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}