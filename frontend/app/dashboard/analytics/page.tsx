'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fetchSuperAdminAnalytics } from '@/lib/api';
import { useRouter } from 'next/navigation';

type SeriesPoint = { _id: string; revenue: number; count: number };

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(v);

function parseDayKey(s: string): Date | null {
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}
function pad2(n: number) {
  return String(n).padStart(2, '0');
}
function formatDayKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  return x;
}
function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(1);
  return x;
}
function startOfYear(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setMonth(0, 1);
  return x;
}

function groupSeries(series: SeriesPoint[], groupBy: 'day' | 'week' | 'month' | 'year') {
  const map = new Map<string, { revenue: number; count: number }>();

  for (const p of series || []) {
    const d = parseDayKey(p._id);
    if (!d) continue;

    let key: string;
    if (groupBy === 'day') key = p._id;
    else if (groupBy === 'week') key = `Minggu ${formatDayKey(startOfWeekMonday(d))}`;
    else if (groupBy === 'month') key = `${startOfMonth(d).getFullYear()}-${pad2(startOfMonth(d).getMonth() + 1)}`;
    else key = `${startOfYear(d).getFullYear()}`;

    const cur = map.get(key) || { revenue: 0, count: 0 };
    cur.revenue += Number(p.revenue || 0);
    cur.count += Number(p.count || 0);
    map.set(key, cur);
  }

  const keys = Array.from(map.keys()).sort((a, b) => {
    const toTime = (k: string) => {
      if (k.startsWith('Minggu ')) return new Date(k.replace('Minggu ', '') + 'T00:00:00').getTime();
      if (/^\d{4}-\d{2}$/.test(k)) return new Date(k + '-01T00:00:00').getTime();
      if (/^\d{4}$/.test(k)) return new Date(k + '-01-01T00:00:00').getTime();
      if (/^\d{4}-\d{2}-\d{2}$/.test(k)) return new Date(k + 'T00:00:00').getTime();
      return 0;
    };
    return toTime(a) - toTime(b);
  });

  return keys.map((k) => ({ key: k, ...map.get(k)! }));
}

function MiniBarChart({
  title,
  items,
  formatValue,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
  formatValue: (v: number) => string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value || 0));

  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="mb-2 text-sm font-semibold">{title}</div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">Belum ada data</div>
      ) : (
        <div className="flex items-end gap-2 overflow-x-auto pb-2">
          {items.map((it) => {
            const h = Math.round((Math.max(0, it.value) / max) * 120); // tinggi max 120px
            return (
              <div key={it.label} className="flex w-10 flex-col items-center gap-1">
                <div className="text-[10px] text-gray-500">{formatValue(it.value)}</div>
                <div
                  className="w-8 rounded-md bg-orange-500"
                  style={{ height: `${Math.max(4, h)}px` }}
                  title={`${it.label}: ${formatValue(it.value)}`}
                />
                <div className="truncate text-[10px] text-gray-600" title={it.label}>
                  {it.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardAnalyticsPage() {
  const router = useRouter();

  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const rangeOptions = useMemo(() => {
    if (groupBy === 'day') return [7, 14, 30, 90];
    if (groupBy === 'week') return [28, 56, 84, 168];
    if (groupBy === 'month') return [180, 365, 730, 1095];
    return [365, 730, 1095, 1825];
  }, [groupBy]);

  const [days, setDays] = useState<number>(30);

  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (u.role !== 'super_admin') router.replace('/dashboard/orders');
    } catch {
      router.replace('/dashboard/orders');
    }
  }, [router]);

  const load = async (d = days) => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetchSuperAdminAnalytics(d);
      setData(res);
    } catch (e: any) {
      setErr(e.message || 'Gagal memuat analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDays(rangeOptions[2] ?? rangeOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  useEffect(() => {
    load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const grouped = useMemo(() => {
    const series: SeriesPoint[] = data?.series || [];
    return groupSeries(series, groupBy);
  }, [data, groupBy]);

  const chartRevenue = useMemo(() => {
    // ambil maksimal 14 titik biar chart tidak kepanjangan
    const slice = grouped.slice(-14);
    return slice.map((x) => ({
      label: x.key.length > 10 ? x.key.slice(0, 10) : x.key,
      value: Number(x.revenue || 0),
    }));
  }, [grouped]);

  const chartOrders = useMemo(() => {
    const slice = grouped.slice(-14);
    return slice.map((x) => ({
      label: x.key.length > 10 ? x.key.slice(0, 10) : x.key,
      value: Number(x.count || 0),
    }));
  }, [grouped]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">Analytics</h1>
          <p className="text-xs text-gray-600">
            Omset dihitung dari pembayaran berstatus <b>paid</b>.
          </p>
        </div>

        <button onClick={() => load(days)} className="rounded-lg border px-3 py-2 text-sm">
          Refresh
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Group</label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="rounded-lg border px-2 py-2 text-sm"
          >
            <option value="day">Harian</option>
            <option value="week">Mingguan</option>
            <option value="month">Bulanan</option>
            <option value="year">Tahunan</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Range data</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-lg border px-2 py-2 text-sm"
          >
            {rangeOptions.map((d) => (
              <option key={d} value={d}>
                {d} hari data
              </option>
            ))}
          </select>
        </div>
      </div>

      {err && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div>Memuat...</div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-3">
              <div className="text-xs text-gray-500">Omset (Paid)</div>
              <div className="text-xl font-bold">{formatPrice(data?.revenuePaid || 0)}</div>
            </div>
            <div className="rounded-xl border bg-white p-3">
              <div className="text-xs text-gray-500">Order Paid</div>
              <div className="text-xl font-bold">{data?.ordersPaidCount || 0}</div>
            </div>
            <div className="rounded-xl border bg-white p-3">
              <div className="text-xs text-gray-500">Range</div>
              <div className="text-xl font-bold">{data?.rangeDays || days} hari</div>
            </div>
          </div>

          {/* ✅ GRAFIK */}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MiniBarChart title="Grafik Omset" items={chartRevenue} formatValue={formatPrice} />
            <MiniBarChart title="Grafik Jumlah Order" items={chartOrders} formatValue={(v) => String(v)} />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-3">
              <h2 className="mb-2 text-sm font-semibold">Top Produk (by qty)</h2>
              <div className="space-y-1 text-sm">
                {(data?.topProducts || []).map((p: any) => (
                  <div key={String(p._id)} className="flex justify-between gap-2">
                    <span className="truncate">{p.name}</span>
                    <span className="font-semibold">{p.qty}</span>
                  </div>
                ))}
                {!data?.topProducts?.length && (
                  <div className="text-gray-500 text-sm">Belum ada data</div>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-3">
              <h2 className="mb-2 text-sm font-semibold">
                Penjualan ({groupBy === 'day'
                  ? 'Harian'
                  : groupBy === 'week'
                    ? 'Mingguan'
                    : groupBy === 'month'
                      ? 'Bulanan'
                      : 'Tahunan'}
                )
              </h2>

              <div className="max-h-72 overflow-auto text-sm">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500">
                      <th className="py-1">Periode</th>
                      <th className="py-1">Order</th>
                      <th className="py-1">Omset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.map((s) => (
                      <tr key={s.key} className="border-t">
                        <td className="py-1">{s.key}</td>
                        <td className="py-1">{s.count}</td>
                        <td className="py-1">{formatPrice(s.revenue)}</td>
                      </tr>
                    ))}

                    {!grouped.length && (
                      <tr>
                        <td className="py-1 text-gray-500" colSpan={3}>
                          Belum ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}