"use client";

import { useMemo, useState } from "react";

const ActivityRow = ({ title, date, amount, positive = false }) => {
  return (
    <button
      className="w-full flex items-start gap-3 py-3.5 px-3 hover:bg-zinc-50 rounded-xl transition"
      aria-label={`View details for ${title}`}
    >
      <div className={`mt-1 h-2.5 w-2.5 rounded-full ${positive ? "bg-emerald-500" : "bg-zinc-300"}`} />
      <div className="flex-1 text-left">
        <div className="font-semibold text-zinc-800 truncate max-w-[210px] sm:max-w-none">{title}</div>
        <div className="text-xs text-zinc-500">{date}</div>
      </div>
      <div className={`font-semibold ${positive ? "text-emerald-600" : "text-zinc-800"}`}>
        {positive ? "+" : ""}${amount}
      </div>
      <svg
        className="ml-2 mt-1 h-4 w-4 text-zinc-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
};

export default function BankDashboardMock() {
  const creditLimit = 22000;
  const baseBalance = 21760.87;
  const reliefAmount = 21500.0;

  const [reliefActive, setReliefActive] = useState(false);

  const formatMoney = (value: number) =>
    value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const today = new Date();
  const formatDate = (offsetDays = 0) => {
    const d = new Date(today);
    d.setDate(today.getDate() - offsetDays);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const currentBalance = reliefActive ? Math.max(0, baseBalance - reliefAmount) : baseBalance;
  const availableCredit = Math.max(0, creditLimit - currentBalance);
  const usagePct = useMemo(() => Math.min(100, (currentBalance / creditLimit) * 100), [currentBalance]);

  return (
    <div className="min-h-screen w-full bg-neutral-100">
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative rounded-[40px] border border-zinc-300 bg-white shadow-2xl overflow-hidden">
          <header className="bg-[#1f2130] pt-10 pb-6 text-white">
            <div className="px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-center">
                  <span className="text-3xl font-bold tracking-wide flex items-center">
                    <span className="text-white">DISC</span>
                    <span className="mx-1 h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 inline-block"></span>
                    <span className="text-white">VER</span>
                  </span>
                </div>
                <button className="absolute right-6 text-sm text-white/90 hover:text-white">Log Out</button>
              </div>

              <div className="mt-2 h-0.5 w-full bg-orange-600/80" />

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-white/90">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                  <span>Current Balance</span>
                </div>
                <div className="mt-2 text-4xl font-semibold tracking-tight">${formatMoney(currentBalance)}</div>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${usagePct}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-white/90">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                  <span>
                    Available Credit: ${formatMoney(availableCredit)} of ${formatMoney(creditLimit)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button className="rounded-full border border-white/40 px-6 py-2 text-sm font-medium text-white hover:bg-white/10">
                  Refer a Student
                </button>
              </div>
            </div>
          </header>

          <main className="-mt-6 rounded-t-3xl bg-white px-4 pb-8">
            {!reliefActive && (
              <section className="mx-2 mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
                <div className="font-semibold">Debt Relief Program Available</div>
                <p className="mt-1 text-sm">Apply a one-time credit of ${formatMoney(reliefAmount)} to reduce your balance.</p>
                <div className="mt-3">
                  <button
                    onClick={() => setReliefActive(true)}
                    className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    Activate Debt Relief Program
                  </button>
                </div>
              </section>
            )}

            <section className="mx-2 mt-4 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="px-4 pt-4 pb-2 text-lg font-semibold text-zinc-900">Recent Activity</div>
              <div className="px-2">
                {reliefActive && (
                  <ActivityRow
                    title="Bailout Relief"
                    date={`${formatDate(0)} · Payment`}
                    amount={formatMoney(reliefAmount)}
                    positive
                  />
                )}
                <ActivityRow title="LD PHO CHICAGO IL" date={`${formatDate(1)} · Posted`} amount={formatMoney(33.87)} />
                <ActivityRow title="NRDC 212-727-2700 NY" date={`${formatDate(2)} · Posted`} amount={formatMoney(20.0)} />
              </div>
              <div className="px-4 pb-4 pt-2">
                <button className="w-full rounded-xl bg-white px-4 py-2 text-center text-sm font-medium text-indigo-700 ring-1 ring-indigo-600/20 hover:bg-indigo-50">
                  View Recent Activity
                </button>
              </div>
            </section>

            <section className="mx-2 mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3">
              <button className="w-full text-center text-sm font-medium text-indigo-700">View Spend Analyzer</button>
            </section>

            <section className="mx-2 mt-3 rounded-3xl border border-zinc-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-zinc-900">Statement Summary</div>
                <button className="rounded-full border border-indigo-600 px-5 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">Pay</button>
              </div>

              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Last Statement Balance</div>
                  <div className="font-semibold text-zinc-900">$1,378.90</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Minimum Payment Due</div>
                  <div className="font-semibold text-zinc-900">$0.00</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600">Payment Due Date</div>
                  <div className="font-semibold text-zinc-900">{formatDate(3)}</div>
                </div>
              </div>
            </section>

            <div className="mt-6 flex justify-center pb-2">
              <div className="h-1.5 w-28 rounded-full bg-zinc-300" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
