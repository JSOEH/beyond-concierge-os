import { useMemo, useState } from "react";
import { CalendarRange, CheckCircle2, Circle, Flag, Rocket, Eye, Hammer } from "lucide-react";
import { Card, KpiCard, PageIntro, SectionHeader, Badge, ProgressBar } from "@/components/ui";
import { num } from "@/lib/format";
import { phases as seedPhases, type GrowthTask } from "@/data/growth";

const phaseIcon = [Hammer, Eye, Rocket];

export default function GrowthPlanner() {
  const [phases, setPhases] = useState(seedPhases.map((p) => ({ ...p, tasks: p.tasks.map((t) => ({ ...t })) })));

  const toggle = (phaseId: string, taskId: string) =>
    setPhases((ps) => ps.map((p) => p.id !== phaseId ? p : { ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, done: !t.done } : t) }));

  const all = phases.flatMap((p) => p.tasks);
  const overall = Math.round((all.filter((t) => t.done).length / all.length) * 100);
  const pp = (p: { tasks: GrowthTask[] }) => Math.round((p.tasks.filter((t) => t.done).length / p.tasks.length) * 100);
  const highImpactOpen = useMemo(() => all.filter((t) => !t.done && t.impact === "High").length, [phases]);

  return (
    <>
      <PageIntro
        eyebrow="90-Day Growth Plan"
        title="Foundation → Awareness → Scale."
        description="A clear operating cadence for the next quarter. Check tasks off and watch the plan move."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard accent index={0} label="Overall Progress" value={`${overall}%`} icon={CalendarRange} sub={`${all.filter((t) => t.done).length}/${all.length} tasks`} />
        <KpiCard index={1} label="High-Impact Open" value={num(highImpactOpen)} icon={Flag} sub="Move these first" />
        <KpiCard index={2} label="Phase 1 · Foundation" value={`${pp(phases[0])}%`} icon={Hammer} sub={phases[0].range} />
        <KpiCard index={3} label="Phase 3 · Scale" value={`${pp(phases[2])}%`} icon={Rocket} sub={phases[2].range} />
      </div>

      {/* Timeline progress bar */}
      <Card>
        <div className="flex items-center justify-between">
          <SectionHeader eyebrow="Quarter at a glance" title="Plan Timeline" />
          <span className="num text-2xl font-semibold text-charcoal-900">{overall}%</span>
        </div>
        <div className="mt-4"><ProgressBar value={overall} tone="gold" className="h-3" /></div>
        <div className="mt-2 flex justify-between text-[11px] font-medium text-charcoal-400">
          <span>Day 1</span><span>Day 30</span><span>Day 60</span><span>Day 90</span>
        </div>
      </Card>

      {/* Phases */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {phases.map((phase, i) => {
          const PIcon = phaseIcon[i];
          const prog = pp(phase);
          return (
            <Card key={phase.id} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-charcoal-900 text-gold-200"><PIcon className="h-5 w-5" /></span>
                <div>
                  <div className="eyebrow">{phase.range}</div>
                  <h3 className="font-display text-lg font-semibold text-charcoal-900">{phase.focus}</h3>
                </div>
                <span className="num ml-auto text-lg font-semibold text-charcoal-900">{prog}%</span>
              </div>
              <p className="mt-2 text-[13px] text-charcoal-500">{phase.theme}</p>
              <ProgressBar value={prog} tone={prog === 100 ? "emerald" : "gold"} className="mt-3" />

              <div className="mt-4 space-y-1.5">
                {phase.tasks.map((t) => (
                  <button key={t.id} onClick={() => toggle(phase.id, t.id)} className="flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-paper-soft">
                    {t.done ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-charcoal-300" />}
                    <span className="flex-1">
                      <span className={`text-sm ${t.done ? "text-charcoal-400 line-through" : "text-charcoal-700"}`}>{t.title}</span>
                      <span className="mt-0.5 flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wide text-charcoal-400">{t.owner}</span>
                        <Badge tone={t.impact === "High" ? "gold" : t.impact === "Medium" ? "charcoal" : "charcoal"}>{t.impact}</Badge>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
