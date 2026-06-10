import { Suspense, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles, Search, Bell, CalendarDays, Loader2, Play } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { GuidedTour, TourLauncher } from "./GuidedTour";
import { useTour } from "@/store/useTour";
import { nav } from "@/nav";

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-charcoal-300">
        <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
        <span className="text-xs font-medium uppercase tracking-[0.2em]">Loading</span>
      </div>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation();
  const startTour = useTour((s) => s.start);
  const active = nav.find((n) => (n.end ? n.to === pathname : pathname.startsWith(n.to) && n.to !== "/")) ??
    nav[0];

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal-100/70 bg-paper/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          className="grid h-9 w-9 place-items-center rounded-lg text-charcoal-500 hover:bg-paper-soft lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 text-sm lg:flex">
          <span className="text-charcoal-300">Beyond Concierge</span>
          <span className="text-charcoal-200">/</span>
          <span className="font-medium text-charcoal-700">{active.label}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-charcoal-200/70 bg-white px-3 py-2 text-sm text-charcoal-300 shadow-sm md:flex">
            <Search className="h-4 w-4" />
            <span>Search metrics, services…</span>
            <kbd className="ml-2 rounded bg-paper-soft px-1.5 py-0.5 text-[10px] font-semibold text-charcoal-400">
              ⌘K
            </kbd>
          </div>

          <div className="hidden items-center gap-1.5 rounded-xl border border-charcoal-200/70 bg-white px-3 py-2 text-xs font-medium text-charcoal-500 shadow-sm sm:flex">
            <CalendarDays className="h-3.5 w-3.5 text-gold-600" />
            June 2026
          </div>

          <button className="relative grid h-9 w-9 place-items-center rounded-lg text-charcoal-500 hover:bg-paper-soft">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose" />
          </button>

          <button onClick={startTour} className="hidden h-9 items-center gap-1.5 rounded-xl border border-charcoal-200/70 bg-white px-3 text-xs font-semibold text-charcoal-600 shadow-sm transition hover:bg-paper-soft md:inline-flex">
            <Play className="h-3.5 w-3.5 text-gold-600" />
            Tour
          </button>

          <Link to="/advisor" className="btn-gold hidden h-9 px-3 py-0 text-xs sm:inline-flex">
            <Sparkles className="h-4 w-4" />
            Ask Advisor
          </Link>

          <div className="grid h-9 w-9 place-items-center rounded-full bg-charcoal-900 text-xs font-semibold text-gold-200">
            BC
          </div>
        </div>
      </div>
    </header>
  );
}

export function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-[264px] lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-charcoal-950/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px]"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute -right-11 top-4 grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-[1400px] space-y-6"
          >
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </motion.div>
        </main>
      </div>

      <TourLauncher />
      <GuidedTour />
    </div>
  );
}
