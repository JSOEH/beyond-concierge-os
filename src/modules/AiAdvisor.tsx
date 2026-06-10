import { Link } from "react-router-dom";
import {
  Sparkles, AlertTriangle, Lightbulb, Wand2, ArrowRight, FileText, Flag, CheckCircle2,
} from "lucide-react";
import { Card, PageIntro, SectionHeader, Badge } from "@/components/ui";
import { issues, opportunities, recommendations, weeklyBrief, type Insight } from "@/data/advisor";

const moduleRoute: Record<string, string> = {
  Inventory: "/inventory", "GLP-1": "/glp1", "Website & SEO": "/seo", Advertising: "/ads",
  "Profit Engine": "/profit", Social: "/social",
};

const sevTone = { high: "rose", medium: "amber", low: "charcoal" } as const;

function InsightCard({ insight }: { insight: Insight }) {
  const route = moduleRoute[insight.module];
  const body = (
    <Card hover className="h-full">
      <div className="flex items-center justify-between">
        <Badge tone={sevTone[insight.severity]} dot>{insight.module}</Badge>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-300">{insight.severity}</span>
      </div>
      <h4 className="mt-2.5 font-display text-base font-semibold text-charcoal-900">{insight.title}</h4>
      <p className="mt-1.5 text-[13px] leading-snug text-charcoal-500">{insight.detail}</p>
      <div className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-gold-700">
        <ArrowRight className="h-3.5 w-3.5" /> {insight.action}
      </div>
    </Card>
  );
  return route ? <Link to={route} className="block">{body}</Link> : body;
}

export default function AiAdvisor() {
  return (
    <>
      <PageIntro
        eyebrow="AI Advisor"
        title="What the numbers are telling you."
        description="A continuous read across finance, inventory, marketing, social, and ops — distilled into what to do next."
      />

      {/* Weekly brief */}
      <Card className="relative overflow-hidden border-charcoal-800 bg-charcoal-deep text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] text-gold-300"><Sparkles className="h-5 w-5" /></span>
            <div>
              <div className="eyebrow text-gold-200/80">Weekly Executive Brief</div>
              <div className="text-[11px] text-charcoal-300">Generated {weeklyBrief.generated}</div>
            </div>
          </div>
          <Badge tone="gold" dot>Auto-generated</Badge>
        </div>

        <p className="mt-4 max-w-3xl font-display text-xl leading-snug text-white">{weeklyBrief.headline}</p>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gold-200"><FileText className="h-4 w-4" /> The read</div>
            <ul className="space-y-2">
              {weeklyBrief.points.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] text-charcoal-100">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gold-200"><Flag className="h-4 w-4" /> This week's priorities</div>
            <ul className="space-y-2">
              {weeklyBrief.priorities.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 rounded-lg bg-white/[0.04] px-3 py-2 text-[13px] text-white">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />{p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Issues */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose" />
          <h3 className="font-display text-lg font-semibold text-charcoal-900">Immediate Issues</h3>
          <Badge tone="rose">{issues.length}</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {issues.map((i) => <InsightCard key={i.id} insight={i} />)}
        </div>
      </div>

      {/* Opportunities */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-gold-600" />
          <h3 className="font-display text-lg font-semibold text-charcoal-900">Opportunities</h3>
          <Badge tone="gold">{opportunities.length}</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {opportunities.map((i) => <InsightCard key={i.id} insight={i} />)}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-charcoal-700" />
          <h3 className="font-display text-lg font-semibold text-charcoal-900">Recommendations</h3>
          <Badge tone="charcoal">{recommendations.length}</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {recommendations.map((i) => <InsightCard key={i.id} insight={i} />)}
        </div>
      </div>
    </>
  );
}
