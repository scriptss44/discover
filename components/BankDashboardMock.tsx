"use client";

import { useMemo, useState } from "react";

/* Small building blocks */
const Chevron = ({ className = "h-4 w-4" }) => (
  <svg
    className={className + " text-zinc-400"}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ListRow = ({ title, right = null, sub = null }) => (
  <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-zinc-50">
    <div>
      <div className="text-zinc-900 font-medium text-[15px]">{title}</div>
      {sub && <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>}
    </div>
    <div className="flex items-center gap-2">
      {right && <div className="text-zinc-900 font-semibold text-[15px]">{right}</div>}
      <Chevron />
    </div>
  </button>
);

const ActivityRow = ({ title, date, amount, positive = false, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-start gap-3 py-3.5 px-3 hover:bg-zinc-50 rounded-xl transition text-left"
    aria-label={`View details for ${title}`}
  >
    <div className={`mt-1 h-2.5 w-2.5 rounded-full ${positive ? "bg-emerald-500" : "bg-zinc-300"}`} />
    <div className="flex-1">
      <div className="font-semibold text-zinc-800 truncate max-w-[210px] sm:max-w-none">{title}</div>
      <div className="text-xs text-zinc-500">{date}</div>
    </div>
    <div className={`font-semibold ${positive ? "text-emerald-600" : "text-zinc-800"}`}>
      {positive ? "+" : ""}${amount}
    </div>
    <Chevron />
  </button>
);

export default function BankDashboardMock() {
  // --- Core numbers ---
  const creditLimit = 22000;
  const baseBalance = 21760.87; // starts without relief
  const reliefAmount = 21500.0; // applied after activation

  // Payments details (before relief)
  const lastStatementBalance = 20845.92;
  const minDueBeforeRelief = 652.0;
  const dueDate = "August 23, 2025";

  // --- UI state ---
  const [reliefActive, setReliefActive] = useState(false);
  const [activeTab, setActiveTab] = useState("activity"); // activity | payments | rewards | services | more
  const [txnDetail, setTxnDetail] = useState(null as null | "bailout");

  // --- helpers ---
  const formatMoney = (value: number) =>
    value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const today = new Date();
  const formatOffset = (days: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - days);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // --- derived values ---
  const currentBalance = reliefActive ? Math.max(0, baseBalance - reliefAmount) : baseBalance; // becomes 260.87 after relief
  const availableCredit = Math.max(0, creditLimit - currentBalance);
  const minimumPaymentDue = reliefActive ? 0 : minDueBeforeRelief;
  const usagePct = useMemo(() => Math.min(100, (currentBalance / creditLimit) * 100), [currentBalance]);

  /* ===================== HEADERS ===================== */
  const HeaderActivity = () => (
    <header className="relative bg-[#1f2130] pt-10 pb-20 text-white">
      <div className="px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <span className="text-3xl font-bold tracking-wide flex items-center">
              <span className="text-white">DISC</span>
              <span className="mx-1 h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 inline-block" />
              <span className="text-white">VER</span>
            </span>
          </div>
          <button className="absolute right-6 text-sm text-white/90 hover:text-white">Log Out</button>
        </div>

        <div className="mt-2 h-0.5 w-full bg-orange-600/80" />

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/90">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span>Current Balance</span>
          </div>
          <div className="mt-2 text-4xl font-semibold tracking-tight">${formatMoney(currentBalance)}</div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-orange-500" style={{ width: `${usagePct}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-white/90">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span>
              Available Credit: ${formatMoney(availableCredit)} of ${formatMoney(creditLimit)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center mb-6">
          <button className="rounded-full border border-white/40 px-6 py-2 text-sm font-medium text-white hover:bg-white/10">
            Refer a Friend
          </button>
        </div>
      </div>
    </header>
  );

  const HeaderPayments = () => (
    <header className="relative bg-[#1f2130] pt-10 pb-10 text-white">
      <div className="px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center text-2xl font-semibold">Payments</div>
          <button className="absolute right-6 text-sm text-white/90 hover:text-white">Log Out</button>
        </div>
        <div className="mt-2 h-0.5 w-full bg-orange-600/80" />

        <div className="mt-6 text-center">
          <div className="text-white/80">Minimum Payment Due</div>
          <div className="text-5xl font-semibold tracking-tight mt-1">${formatMoney(minimumPaymentDue)}</div>
          <div className="text-white/80 mt-2">Due on {dueDate}</div>
          <div className="mt-4 flex justify-center">
            <button className="rounded-full border border-white/40 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10">
              Make a Payment
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  /* ===================== SCREENS ===================== */
  const ScreenActivity = () => (
    <>
      <HeaderActivity />
      <main className="relative -mt-14 px-4 pb-20 flex-1">
        <div className="relative z-20 mx-auto w-[90%] -mt-6">
          {!reliefActive && (
            <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow text-center mb-6">
              <div className="font-semibold">Debt Relief Program Available</div>
              <p className="mt-1 text-sm">Apply a one-time credit of ${formatMoney(reliefAmount)} to reduce your balance.</p>
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => setReliefActive(true)}
                  className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  Activate Debt Relief Program
                </button>
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-zinc-200 shadow bg-white">
            <div className="px-4 pt-4 pb-2 text-lg font-semibold text-zinc-900">Recent Activity</div>
            <div className="px-2">
              {reliefActive && (
                <ActivityRow
                  title="Bailout Relief"
                  date={`${formatOffset(0)} · Payment`}
                  amount={formatMoney(reliefAmount)}
                  positive
                  onClick={() => setTxnDetail("bailout")}
                />
              )}
              <ActivityRow title="LD PHO CHICAGO IL" date={`${formatOffset(0)} · Posted`} amount={formatMoney(33.87)} />
              <ActivityRow title="HULU" date={`${formatOffset(0)} · Posted`} amount={formatMoney(13.89)} />
            </div>
            <div className="px-4 pb-4 pt-2">
              <button className="w-full rounded-xl bg-white px-4 py-2 text-center text-sm font-medium text-indigo-700 ring-1 ring-indigo-600/20 hover:bg-indigo-50">
                View Recent Activity
              </button>
            </div>
          </section>
        </div>

        <section className="mx-2 mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-3">
          <button className="w-full text-center text-sm font-medium text-indigo-700">View Spend Analyzer</button>
        </section>

        <section className="mx-2 mt-3 rounded-3xl border border-zinc-200 p-4 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-zinc-900">Statement Summary</div>
            <button className="rounded-full border border-indigo-600 px-5 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">Pay</button>
          </div>

          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-zinc-600">Payment Due Date</div>
              <div className="font-semibold text-zinc-900">{dueDate}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-zinc-600">Minimum Payment Due</div>
              <div className="font-semibold text-zinc-900">${formatMoney(minimumPaymentDue)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-zinc-600">Last Statement Balance</div>
              <div className="font-semibold text-zinc-900">${formatMoney(lastStatementBalance)}</div>
            </div>
          </div>
        </section>

        <div className="mt-6 flex justify-center pb-2">
          <div className="h-1.5 w-28 rounded-full bg-zinc-300" />
        </div>
      </main>
    </>
  );

  const ScreenPayments = () => (
    <>
      <HeaderPayments />
      <main className="relative -mt-6 px-4 pb-20 flex-1">
        {/* Balance Summary Card */}
        <section className="mx-auto w-[92%] rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between px-5 pt-4">
            <div className="text-xl font-semibold text-zinc-900">Balance Summary</div>
            <button className="rounded-full border border-indigo-600 px-5 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">Pay</button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-zinc-600">Current Balance</div>
              <div className="font-semibold text-zinc-900">${formatMoney(currentBalance)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-zinc-600">Last Statement Balance</div>
              <div className="font-semibold text-zinc-900">${formatMoney(lastStatementBalance)}</div>
            </div>
          </div>
        </section>

        {/* Scheduled / Posted Card */}
        <section className="mx-auto w-[92%] mt-3 rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <div className="flex items-center px-5 pt-4 text-lg font-semibold text-zinc-900">
            <button className="pr-6 text-indigo-900">Scheduled</button>
            <button className="text-zinc-400">Posted</button>
          </div>
          <div className="px-5 pt-1">
            <div className="h-1 w-24 bg-orange-500 rounded-full" />
          </div>
          <div className="px-3 pb-3">
            <ListRow
              title="Automatic Payment"
              sub="15th of every month • Minimum Payment Only (was Full Statement Balance)"
              right={<span className="text-amber-500">Minimum Payment Only</span>}
            />
            <div className="px-4 pb-3">
              <button className="w-full rounded-xl bg-white px-4 py-2 text-center text-sm font-medium text-indigo-700 ring-1 ring-indigo-600/20 hover:bg-indigo-50">
                View Payment Activity
              </button>
            </div>
          </div>
        </section>

        {/* More settings list */}
        <section className="mx-auto w-[92%] mt-3 rounded-3xl bg-white border border-zinc-200 shadow-sm divide-y">
          <ListRow title="Automatic Payments" />
          <ListRow title="Change Payment Due Date" />
          <ListRow title="Manage Bank Accounts" />
        </section>
      </main>
    </>
  );

  const Placeholder = ({ title }) => (
    <>
      <header className="relative bg-[#1f2130] pt-10 pb-6 text-white">
        <div className="px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center text-2xl font-semibold">{title}</div>
            <button className="absolute right-6 text-sm text-white/90 hover:text-white">Log Out</button>
          </div>
          <div className="mt-2 h-0.5 w-full bg-orange-600/80" />
        </div>
      </header>
      <main className="px-4 py-6">
        <section className="mx-auto w-[92%] rounded-3xl bg-white border border-zinc-200 shadow-sm p-6 text-center text-zinc-600">
          {title} screen coming soon.
        </section>
      </main>
    </>
  );

  /* ===================== SHELL + NAV ===================== */
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Full screen mobile layout with Safari fixes */}
      <div className="relative w-full min-h-screen flex flex-col bg-white overflow-hidden" style={{minHeight: '100vh'}}>
        {/* Scrollable content with bottom padding for fixed nav */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-16">
          {activeTab === "activity" && <ScreenActivity />}
          {activeTab === "payments" && <ScreenPayments />}
          {activeTab === "rewards" && <Placeholder title="Rewards" />}
          {activeTab === "services" && <Placeholder title="Services" />}
          {activeTab === "more" && <Placeholder title="More" />}
        </div>

        {/* Bottom Nav - Fixed at bottom always visible */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#1f2130] text-white flex justify-around items-center z-50">
          {/* Activity */}
          <button onClick={() => setActiveTab("activity")} className="flex flex-col items-center text-xs" aria-label="Activity">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={activeTab === 'activity' ? '#f59e0b' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h12M4 12h8M4 18h6"/>
              <circle cx="20" cy="6" r="1"/><circle cx="20" cy="12" r="1"/><circle cx="20" cy="18" r="1"/>
            </svg>
            <span className={activeTab === 'activity' ? 'text-amber-400' : 'text-white'}>Activity</span>
          </button>

          {/* Payments */}
          <button onClick={() => setActiveTab("payments")} className="flex flex-col items-center text-xs" aria-label="Payments">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={activeTab === 'payments' ? '#f59e0b' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8"/>
              <path d="M13.5 8.5c-.5-.3-1.1-.5-1.8-.5-1.7 0-2.7 1-2.7 2 0 2 4.5 1.2 4.5 3.2 0 .8-.8 1.6-2.1 1.6-.8 0-1.6-.2-2.2-.7"/>
              <path d="M12 7.5v9"/>
              <path d="M16.5 12h2.5"/>
              <path d="M15.5 10l3.5 2-3.5 2"/>
            </svg>
            <span className={activeTab === 'payments' ? 'text-amber-400' : 'text-white'}>Payments</span>
          </button>

          {/* Rewards */}
          <button onClick={() => setActiveTab("rewards")} className="flex flex-col items-center text-xs" aria-label="Rewards">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={activeTab === 'rewards' ? '#f59e0b' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="8" width="18" height="11" rx="2"/>
              <path d="M3 12h18"/>
              <path d="M8 8v-1a3 3 0 1 1 6 0v1"/>
              <path d="M10 8v-1a1 1 0 1 0-2 0v1"/>
              <path d="M14 8v-1a1 1 0 1 1 2 0v1"/>
            </svg>
            <span className={activeTab === 'rewards' ? 'text-amber-400' : 'text-white'}>Rewards</span>
          </button>

          {/* Services */}
          <button onClick={() => setActiveTab("services")} className="flex flex-col items-center text-xs" aria-label="Services">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke={activeTab === 'services' ? '#f59e0b' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="12" rx="2"/>
              <path d="M3 10h18"/>
              <circle cx="7.5" cy="13.5" r="1"/>
            </svg>
            <span className={activeTab === 'services' ? 'text-amber-400' : 'text-white'}>Services</span>
          </button>

          {/* More */}
          <button onClick={() => setActiveTab("more")} className="flex flex-col items-center text-xs" aria-label="More">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill={activeTab === 'more' ? '#f59e0b' : '#ffffff'}>
              <circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>
            </svg>
            <span className={activeTab === 'more' ? 'text-amber-400' : 'text-white'}>More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
