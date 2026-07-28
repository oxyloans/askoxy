import React, { useEffect, useState, useMemo } from "react";
import { Spin, Card, Tag, Empty, Row, Col, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  RiPhoneLine,
  RiPhoneFindLine,
  RiPulseLine,
  RiBarChartLine,
  RiPieChartLine,
  RiListCheck2,
} from "react-icons/ri";
import { getInboundCalls, getOutboundCalls } from "./api";
import type { CallsResponse } from "./types";
import { PLATFORMS, PLATFORM_LABELS } from "./types";
import VoiceAdminLayout from "./components/VoiceAdminLayout";

const API_DATE_FORMAT = "DD-MM-YYYY";

const PLATFORM_DOT_COLORS: Record<string, string> = {
  OXYLOANS: "bg-gradient-to-br from-blue-300 to-blue-400",
  ASKOXY: "bg-gradient-to-br from-violet-300 to-violet-400",
  OXYGOLD: "bg-gradient-to-br from-amber-300 to-amber-400",
  OXYBRICK: "bg-gradient-to-br from-orange-300 to-orange-400",
  STUDYABROAD: "bg-gradient-to-br from-cyan-300 to-cyan-400",
  OXYBFSAI: "bg-gradient-to-br from-pink-300 to-pink-400",
  OXYGLOBAL: "bg-gradient-to-br from-emerald-300 to-emerald-400",
};
const KPI_ICON_BG: Record<string, string> = {
  "Inbound Calls Today":
    "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500",
  "Outbound Calls Today":
    "bg-gradient-to-br from-violet-50 to-violet-100 text-violet-500",
  "Total Calls Today":
    "bg-gradient-to-br from-amber-50 to-amber-100 text-[#b8860b]",
};

type CallLike = {
  timestamp: string;
  callDirection: string;
  callPurpose?: string;
  callSummary?: string;
};

/** Group calls into 24 hourly buckets and trim to the hours that actually have activity. */
function useHourlyBuckets(calls: CallLike[]) {
  return useMemo(() => {
    const counts = Array.from({ length: 24 }, () => 0);
    calls.forEach((c) => {
      counts[dayjs(c.timestamp).hour()] += 1;
    });
    const active = counts
      .map((count, hour) => ({ hour, count }))
      .filter((b) => b.count > 0);
    const startHour = active.length ? Math.max(0, active[0].hour - 1) : 8;
    const endHour = active.length
      ? Math.min(23, active[active.length - 1].hour + 1)
      : 20;
    return counts
      .map((count, hour) => ({ hour, count }))
      .slice(startHour, endHour + 1);
  }, [calls]);
}

/** Single-color hourly bar chart, reused for inbound-only and outbound-only views. */
const HourlyBarChart: React.FC<{
  calls: CallLike[];
  barFrom: string;
  barTo: string;
}> = ({ calls, barFrom, barTo }) => {
  const buckets = useHourlyBuckets(calls);
  const max = Math.max(1, ...buckets.map((b) => b.count));

  if (calls.length === 0) {
    return (
      <div className="py-10">
        <Empty description="No calls yet today" />
      </div>
    );
  }

  return (
    <div className="px-5 pb-5 pt-2">
      <div className="flex items-end gap-1.5 h-32">
        {buckets.map((b) => (
          <div
            key={b.hour}
            className="flex-1 flex flex-col justify-end items-center group relative"
          >
            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-medium text-slate-700 bg-white border border-gray-100 shadow-sm rounded px-1.5 py-0.5 whitespace-nowrap z-10">
              {b.count} call{b.count !== 1 ? "s" : ""}
            </div>
            <div
              className={`w-full rounded-t-sm bg-gradient-to-t ${barFrom} ${barTo} transition-all group-hover:opacity-80`}
              style={{
                height: `${Math.max((b.count / max) * 100, b.count ? 6 : 0)}%`,
                minHeight: b.count ? 4 : 0,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {buckets.map((b) => (
          <div
            key={b.hour}
            className="flex-1 text-center text-[10px] text-slate-400"
          >
            {dayjs().hour(b.hour).minute(0).format("hA")}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Combined stacked hourly view, inbound + outbound side by side per hour. */
const CombinedHourlyChart: React.FC<{ calls: CallLike[] }> = ({ calls }) => {
  const buckets = useMemo(() => {
    const counts = Array.from({ length: 24 }, () => ({
      inbound: 0,
      outbound: 0,
    }));
    calls.forEach((c) => {
      const hour = dayjs(c.timestamp).hour();
      if (c.callDirection === "INBOUND") counts[hour].inbound += 1;
      else counts[hour].outbound += 1;
    });
    const withHour = counts.map((b, hour) => ({ ...b, hour }));
    const active = withHour.filter((b) => b.inbound + b.outbound > 0);
    const startHour = active.length ? Math.max(0, active[0].hour - 1) : 8;
    const endHour = active.length
      ? Math.min(23, active[active.length - 1].hour + 1)
      : 20;
    return withHour.slice(startHour, endHour + 1);
  }, [calls]);

  const max = Math.max(1, ...buckets.map((b) => b.inbound + b.outbound));

  if (calls.length === 0) {
    return (
      <div className="py-10">
        <Empty description="No calls yet today" />
      </div>
    );
  }

  return (
    <div className="px-5 pb-5 pt-2">
      <div className="flex items-end gap-1.5 h-40">
        {buckets.map((b) => {
          const total = b.inbound + b.outbound;
          const heightPct = (total / max) * 100;
          const inboundPct = total ? (b.inbound / total) * 100 : 0;
          return (
            <div
              key={b.hour}
              className="flex-1 flex flex-col justify-end items-center group relative"
            >
              <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-medium text-slate-700 bg-white border border-gray-100 shadow-sm rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                {total} call{total !== 1 ? "s" : ""}
              </div>
              <div
                className="w-full rounded-t-sm overflow-hidden flex flex-col-reverse"
                style={{
                  height: `${Math.max(heightPct, total ? 4 : 0)}%`,
                  minHeight: total ? 6 : 0,
                }}
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-400 to-blue-300"
                  style={{ height: `${inboundPct}%` }}
                />
                <div
                  className="w-full bg-gradient-to-t from-violet-400 to-violet-300"
                  style={{ height: `${100 - inboundPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {buckets.map((b) => (
          <div
            key={b.hour}
            className="flex-1 text-center text-[10px] text-slate-400"
          >
            {dayjs().hour(b.hour).minute(0).format("hA")}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-400" /> Inbound
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-violet-400" /> Outbound
        </span>
      </div>
    </div>
  );
};

/** Donut showing the real inbound/outbound split for today, built in plain SVG. */
const DirectionDonut: React.FC<{ inbound: number; outbound: number }> = ({
  inbound,
  outbound,
}) => {
  const total = inbound + outbound;
  const size = 152;
  const stroke = 20;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const inboundDash = total ? (inbound / total) * circumference : 0;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ede9fe"
          strokeWidth={stroke}
        />
        {total > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={stroke}
            strokeDasharray={`${inboundDash} ${circumference - inboundDash}`}
            strokeLinecap="butt"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-slate-900 leading-tight">
          {total}
        </div>
        <div className="text-[11px] text-slate-500">Calls Today</div>
      </div>
    </div>
  );
};

/** Ranked horizontal bars of the most common call purpose/summary text for one direction. */
const TopPurposesList: React.FC<{ calls: CallLike[]; barColor: string }> = ({
  calls,
  barColor,
}) => {
  const ranked = useMemo(() => {
    const tally = new Map<string, number>();
    calls.forEach((c) => {
      const label = (c.callPurpose || c.callSummary || "Uncategorized").trim();
      tally.set(label, (tally.get(label) ?? 0) + 1);
    });
    return Array.from(tally.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [calls]);

  if (ranked.length === 0) {
    return (
      <div className="py-8">
        <Empty description="No calls yet today" />
      </div>
    );
  }

  const max = ranked[0][1];

  return (
    <div className="px-5 pb-5 pt-1 space-y-3">
      {ranked.map(([label, count]) => (
        <div key={label}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-700 truncate pr-2">{label}</span>
            <span className="font-semibold text-slate-900 shrink-0">
              {count}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${Math.max((count / max) * 100, 6)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  accent?: string;
}> = ({ icon, title, accent }) => (
  <div className="p-5 pb-0 flex items-center gap-2">
    <span className={accent}>{icon}</span>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [inbound, setInbound] = useState<CallsResponse | null>(null);
  const [outbound, setOutbound] = useState<CallsResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const today = dayjs().format(API_DATE_FORMAT);
    (async () => {
      setLoading(true);
      setError(false);
      const [inRes, outRes] = await Promise.allSettled([
        getInboundCalls(today, today),
        getOutboundCalls(today, today),
      ]);
      if (!isMounted) return;
      if (inRes.status === "fulfilled") setInbound(inRes.value);
      if (outRes.status === "fulfilled") setOutbound(outRes.value);
      if (inRes.status === "rejected" && outRes.status === "rejected")
        setError(true);
      setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const inboundCalls = inbound?.calls || [];
  const outboundCalls = outbound?.calls || [];
  const allCallsToday = useMemo(
    () => [...inboundCalls, ...outboundCalls],
    [inboundCalls, outboundCalls],
  );

  const recentCalls = useMemo(
    () =>
      [...allCallsToday]
        .sort(
          (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf(),
        )
        .slice(0, 6),
    [allCallsToday],
  );

  const totalCallsToday =
    (inbound?.totalCalls ?? 0) + (outbound?.totalCalls ?? 0);

  const kpiCards = [
    {
      label: "Inbound Calls Today",
      value: inbound?.totalCalls ?? 0,
      icon: RiPhoneLine,
      onClick: () => navigate("/voiceadmin/inbound"),
    },
    {
      label: "Outbound Calls Today",
      value: outbound?.totalCalls ?? 0,
      icon: RiPhoneFindLine,
      onClick: () => navigate("/voiceadmin/outbound"),
    },
    {
      label: "Total Calls Today",
      value: totalCallsToday,
      icon: RiPulseLine,
    },
  ];

  return (
    <VoiceAdminLayout activeKey="dashboard">
      <Spin spinning={loading}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Voice Ops <span className="text-[#b8860b]">Dashboard</span>
          </h1>
          <p className="text-slate-800 text-sm mt-0.5">
            {dayjs().format("dddd, DD MMMM YYYY")} · overview of your AI voice
            agent's calls and platforms
          </p>
        </div>

        {/* Overview: combined hourly trend + inbound/outbound split */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} lg={16}>
            <Card
              className="rounded-lg border-gray-100 shadow-sm h-full"
              bodyStyle={{ padding: 0 }}
            >
              <SectionHeader
                icon={<RiBarChartLine />}
                title="Calls by Hour Today"
                accent="text-slate-400"
              />
              <CombinedHourlyChart calls={allCallsToday} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              className="rounded-lg border-gray-100 shadow-sm h-full"
              bodyStyle={{ padding: 0 }}
            >
              <SectionHeader
                icon={<RiPieChartLine />}
                title="Inbound vs Outbound"
                accent="text-slate-400"
              />
              <div className="p-6 flex items-center justify-center gap-6 flex-wrap">
                <DirectionDonut
                  inbound={inbound?.totalCalls ?? 0}
                  outbound={outbound?.totalCalls ?? 0}
                />
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="text-slate-500 w-16">Inbound</span>
                    <span className="font-semibold text-slate-900">
                      {inbound?.totalCalls ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-300" />
                    <span className="text-slate-500 w-16">Outbound</span>
                    <span className="font-semibold text-slate-900">
                      {outbound?.totalCalls ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Per-direction hourly breakdown */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} lg={12}>
            <Card
              className="rounded-lg border-gray-100 shadow-sm h-full"
              bodyStyle={{ padding: 0 }}
            >
              <SectionHeader
                icon={<RiPhoneLine />}
                title="Inbound Calls by Hour"
                accent="text-blue-400"
              />
              <HourlyBarChart
                calls={inboundCalls}
                barFrom="from-blue-400"
                barTo="to-blue-300"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              className="rounded-lg border-gray-100 shadow-sm h-full"
              bodyStyle={{ padding: 0 }}
            >
              <SectionHeader
                icon={<RiPhoneFindLine />}
                title="Outbound Calls by Hour"
                accent="text-violet-400"
              />
              <HourlyBarChart
                calls={outboundCalls}
                barFrom="from-violet-400"
                barTo="to-violet-300"
              />
            </Card>
          </Col>
        </Row>

        {/* Per-direction top call purposes */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} lg={12}>
            <Card
              className="rounded-lg border-gray-100 shadow-sm h-full"
              bodyStyle={{ padding: 0 }}
            >
              <SectionHeader
                icon={<RiListCheck2 />}
                title="Top Inbound Call Reasons"
                accent="text-blue-400"
              />
              <TopPurposesList calls={inboundCalls} barColor="bg-blue-400" />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              className="rounded-lg border-gray-100 shadow-sm h-full"
              bodyStyle={{ padding: 0 }}
            >
              <SectionHeader
                icon={<RiListCheck2 />}
                title="Top Outbound Call Reasons"
                accent="text-violet-400"
              />
              <TopPurposesList calls={outboundCalls} barColor="bg-violet-400" />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="mb-6">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <Col xs={24} sm={8} key={card.label}>
                <Card
                  hoverable={!!card.onClick}
                  onClick={card.onClick}
                  className="rounded-lg border-gray-100 shadow-sm transition-transform hover:-translate-y-0.5"
                  bodyStyle={{ padding: 20 }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2.5 rounded-md ${KPI_ICON_BG[card.label]}`}
                    >
                      <Icon className="text-lg" />
                    </div>
                    <Statistic
                      value={card.value}
                      valueStyle={{
                        fontSize: 24,
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    />
                  </div>
                  <div className="font-medium text-slate-500 mt-3 text-sm">
                    {card.label}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Recent calls */}
          <Card
            className="lg:col-span-3 rounded-lg border-gray-100 shadow-sm"
            bodyStyle={{ padding: 0 }}
          >
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-slate-900">
                Most Recent Calls
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentCalls.length === 0 ? (
                <div className="p-8">
                  <Empty description="No calls today yet" />
                </div>
              ) : (
                recentCalls.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Tag
                        color={
                          item.callDirection === "INBOUND" ? "blue" : "purple"
                        }
                        className="rounded-full px-2.5"
                      >
                        {item.callDirection}
                      </Tag>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {item.callerNumber}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {item.callPurpose || item.callSummary}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs whitespace-nowrap ml-3">
                      {dayjs(item.timestamp).format("hh:mm A")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Platforms */}
          <Card
            className="lg:col-span-2 rounded-lg border-gray-100 shadow-sm"
            bodyStyle={{ padding: 0 }}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Configured Platforms
              </h3>
              <span
                className="text-xs font-medium text-[#b8860b] hover:underline cursor-pointer"
                onClick={() => navigate("/voiceadmin/instructions")}
              >
                Manage
              </span>
            </div>
            <div className="p-3">
              {PLATFORMS.map((p) => (
                <div
                  key={p}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/voiceadmin/instructions")}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${PLATFORM_DOT_COLORS[p] || "bg-gray-400"}`}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {PLATFORM_LABELS[p]}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{p}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Spin>
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 text-red-500 text-sm rounded-lg p-3 mt-4">
          Couldn't load today's call data. Please refresh the page.
        </div>
      )}
    </VoiceAdminLayout>
  );
};

export default Dashboard;
