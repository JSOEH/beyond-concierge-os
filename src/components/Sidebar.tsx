import { NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { nav, navGroups } from "@/nav";
import { cn } from "@/lib/cn";

function Wordmark() {
  return (
    <div className="flex items-center gap-3 px-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-sheen shadow-gold">
        <span className="font-display text-lg font-bold text-charcoal-900">B</span>
      </div>
      <div className="leading-tight">
        <div className="font-display text-[15px] font-semibold tracking-tight text-white">
          Beyond Concierge
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300/80">
          Executive OS
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-charcoal-deep surface-grain">
      <div className="pt-6 pb-5">
        <Wordmark />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group}>
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal-400">
              {group}
            </div>
            <div className="space-y-0.5">
              {nav
                .filter((n) => n.group === group)
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn("nav-link no-tap", isActive && "nav-link-active")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            isActive ? "text-gold-300" : "text-charcoal-300",
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-400" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald" />
          <div className="leading-tight">
            <div className="text-xs font-semibold text-white">Owner Access</div>
            <div className="text-[10px] text-charcoal-300">Single source of truth · synced</div>
          </div>
        </div>
      </div>
    </div>
  );
}
