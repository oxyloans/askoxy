import React, { useEffect, useMemo, useState } from "react";

import {
  CalendarOutlined,
  RiseOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  ConfigProvider,
  DatePicker,
  Empty,
  Grid,
  Skeleton,
  Table,
  message,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

interface JourneyScorecardRow {
  journeyId: string;
  journeyName: string;
  totalInterested: number;
  todayInterested: number;
  dateRangeInterested: number;
}

interface JourneyScorecardResponse {
  data?: JourneyScorecardRow[];
  message?: string;
  status?: boolean;
}

const LeagueJourneyScorecard: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [rows, setRows] = useState<JourneyScorecardRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScorecard = async (range: [Dayjs, Dayjs] = dateRange) => {
    const [start, end] = range;

    if (!start || !end) {
      message.warning("Select both start and end dates.");
      return;
    }

    if (start.isAfter(end, "day")) {
      message.warning("Start date cannot be after end date.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get<JourneyScorecardResponse>(
        `${BASE_URL}/marketing-service/campgin/score-card-journies`,
        {
          params: {
            startDate: start.format("YYYY-MM-DD"),
            endDate: end.format("YYYY-MM-DD"),
          },
          headers: { accept: "*/*" },
        },
      );

      if (response.data?.status === false) {
        throw new Error(
          response.data?.message || "Unable to load the journey scorecard.",
        );
      }

      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setRows(data);
    } catch (error) {
      console.error("Failed to fetch journey scorecard", error);
      setRows([]);
      message.error(
        error instanceof Error
          ? error.message
          : "Unable to load the journey scorecard. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchScorecard(dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          acc.totalInterested += Number(row.totalInterested) || 0;
          acc.todayInterested += Number(row.todayInterested) || 0;
          acc.dateRangeInterested += Number(row.dateRangeInterested) || 0;
          return acc;
        },
        {
          totalInterested: 0,
          todayInterested: 0,
          dateRangeInterested: 0,
        },
      ),
    [rows],
  );

  const columns: ColumnsType<JourneyScorecardRow> = [
    {
      title: "Journey",
      dataIndex: "journeyName",
      key: "journeyName",
     align:"center",
      render: (value: string, row) => (
        <div className="min-w-[180px]">
          <div className="font-extrabold text-slate-900">
            {value || "Unnamed Journey"}
          </div>
          {/* <div className="mt-1 max-w-[260px] truncate text-[10px] text-slate-400">
            {String(row.journeyId).slice(0, 4)}
          </div> */}
        </div>
      ),
    },
    {
      title: "Total Interested",
      dataIndex: "totalInterested",
      key: "totalInterested",
      align: "center",
      render: (value: number) => (
        <span className="font-bold text-[#008cba]">{Number(value) || 0}</span>
      ),
    },
    {
      title: "Today Interested",
      dataIndex: "todayInterested",
      key: "todayInterested",
      align: "center",
      render: (value: number) => (
        <span className="font-bold text-[#1ab34a]">{Number(value) || 0}</span>
      ),
    },
    {
      title: "Selected Range",
      dataIndex: "dateRangeInterested",
      key: "dateRangeInterested",
      align: "center",
      render: (value: number) => (
        <span className="font-bold text-[#8b5cf6]">{Number(value) || 0}</span>
      ),
    },
  ];

  const metricCards = [
    {
      label: "Journeys",
      value: rows.length,
      note: "Journeys returned by scorecard",
      icon: <TrophyOutlined />,
      accent: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Interested",
      value: totals.totalInterested,
      note: "All-time interested count",
      icon: <TeamOutlined />,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Today Interested",
      value: totals.todayInterested,
      note: dayjs().format("DD MMM YYYY"),
      icon: <RiseOutlined />,
      accent: "bg-amber-50 text-amber-700",
    },
    {
      label: "Date Range Interested",
      value: totals.dateRangeInterested,
      note: `${dateRange[0].format("DD MMM")} – ${dateRange[1].format("DD MMM YYYY")}`,
      icon: <CalendarOutlined />,
      accent: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#008cba",
          colorBgBase: "#ffffff",
          colorTextBase: "#0f172a",
          borderRadius: 12,
        },
      }}
    >
      <div
        className="min-h-screen bg-[#f7f9fc] text-slate-900"
        style={{ colorScheme: "light" }}
      >
        <style>
          {`.ant-table-centered .ant-table-thead > tr > th,
            .ant-table-centered .ant-table-tbody > tr > td { text-align: center; }
            .ant-table-centered .ant-table-thead > tr > th { vertical-align: middle; }
            .ant-table-centered .ant-table-tbody > tr > td { vertical-align: middle; }
            .ant-table-centered .ant-table-thead > tr > th:nth-child(1),
            .ant-table-centered .ant-table-tbody > tr > td:nth-child(1) { text-align: left; }`}
        </style>

        <header className=" backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-3 py-4 sm:px-5 lg:px-7">
            {/* Left – title & subtitle */}
            <div className="min-w-0">
             
              <h1 className="mt-0.5 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                Journey Scorecard
              </h1>
              <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                Track total, today and selected-date-range interest for every journey.
              </p>
            </div>

            {/* Right – two separate date inputs */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[11px] font-semibold text-slate-500">From</span>
                <DatePicker
                  value={dateRange[0]}
                  allowClear={false}
                  format="DD MMM YYYY"
                  disabled={loading}
                  disabledDate={(d) => d.isAfter(dateRange[1], "day")}
                  onChange={(val) => {
                    if (!val) return;
                    setDateRange([val as Dayjs, dateRange[1]]);
                  }}
                  className="w-[148px]"
                />
              </div>
            
              <div className="flex flex-col items-start gap-1">
                <span className="text-[11px] font-semibold text-slate-500">To</span>
                <DatePicker
                  value={dateRange[1]}
                  allowClear={false}
                  format="DD MMM YYYY"
                  disabled={loading}
                  disabledDate={(d) => d.isBefore(dateRange[0], "day")}
                  onChange={(val) => {
                    if (!val) return;
                    setDateRange([dateRange[0], val as Dayjs]);
                  }}
                  className="w-[148px]"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-3 py-4 sm:px-5 lg:px-7">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {loading && rows.length === 0
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                ))
              : metricCards.map((card) => (
                  <article
                    key={card.label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                          {card.label}
                        </div>
                        <div className="mt-2 text-3xl font-black text-slate-950">
                          {card.value.toLocaleString("en-IN")}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-400">
                          {card.note}
                        </div>
                      </div>
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${card.accent}`}
                      >
                        {card.icon}
                      </span>
                    </div>
                  </article>
                ))}
          </section>

          <section className="mt-4 overflow-hidden ">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
              <div className="font-black text-slate-950">Journey-wise Scorecard</div>
              <div className="mt-1 text-xs text-slate-500">
                {dateRange[0].format("DD MMM YYYY")} to{" "}
                {dateRange[1].format("DD MMM YYYY")}
              </div>
            </div>

            {loading && rows.length === 0 ? (
              <div className="p-5">
                <Skeleton active paragraph={{ rows: 7 }} />
              </div>
            ) : rows.length === 0 ? (
              <div className="p-10">
                <Empty description="No scorecard data available for this date range" />
              </div>
              ) : (
              <Table<JourneyScorecardRow>
                rowKey="journeyId"
                columns={columns}
                dataSource={rows}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: true }}
                onRow={(record) => ({
                  onClick: () => {
                    navigate(
                      `/admin/journeyvscampaignsvsinteresteusers?journeyId=${encodeURIComponent(
                        String(record.journeyId),
                      )}`,
                    );
                  },
                })}
                rowClassName={() => "cursor-pointer"}
                loading={loading}
                className="ant-table-centered"
              />
            )}
          </section>
        </main>
      </div>
    </ConfigProvider>
  );
};

export default LeagueJourneyScorecard;
