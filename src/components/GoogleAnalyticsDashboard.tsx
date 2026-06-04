import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const PROPERTY_ID = "462928986";

const GoogleAnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [overview, setOverview] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/analytics.readonly",

    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;

      fetchOverview(token);
      fetchPages(token);
      fetchSources(token);
      fetchDevices(token);
    },

    onError: () => {
      alert("Google login failed");
    },
  });

  const runReport = async (
    token: string,
    dimensions: any[],
    metrics: any[],
    limit = 10
  ) => {
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          dateRanges: [
            {
              startDate: "30daysAgo",
              endDate: "today",
            },
          ],

          dimensions,
          metrics,
          limit,
        }),
      }
    );

    return response.json();
  };

  const fetchOverview = async (token: string) => {
    setLoading(true);

    const data = await runReport(
      token,
      [],
      [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "newUsers" },
      ]
    );

    setOverview(data.rows?.[0]?.metricValues || []);

    setLoading(false);
  };

  const fetchPages = async (token: string) => {
    const data = await runReport(
      token,
      [{ name: "pagePath" }],
      [
        { name: "screenPageViews" },
        { name: "activeUsers" },
      ],
      20
    );

    setPages(data.rows || []);
  };

  const fetchSources = async (token: string) => {
    const data = await runReport(
      token,
      [{ name: "sessionSource" }],
      [{ name: "activeUsers" }],
      10
    );

    setSources(data.rows || []);
  };

  const fetchDevices = async (token: string) => {
    const data = await runReport(
      token,
      [{ name: "deviceCategory" }],
      [{ name: "activeUsers" }],
      10
    );

    setDevices(data.rows || []);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 p-6 text-white shadow-2xl">
          <h1 className="text-2xl font-bold md:text-4xl">
            ASKOXY Analytics Dashboard
          </h1>

          <p className="mt-2 text-sm text-indigo-100 md:text-base">
            Live analytics directly from Google Analytics API.
          </p>

          <button
            onClick={() => login()}
            className="mt-5 rounded-2xl bg-white px-5 py-3 font-bold text-indigo-700 shadow-lg"
          >
            Connect Analytics
          </button>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow">
            Loading analytics...
          </div>
        )}

        {overview && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card
                title="Active Users"
                value={overview?.[0]?.value || "0"}
              />

              <Card title="Sessions" value={overview?.[1]?.value || "0"} />

              <Card
                title="Page Views"
                value={overview?.[2]?.value || "0"}
              />

              <Card title="New Users" value={overview?.[3]?.value || "0"} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-3xl bg-white shadow-xl">
                <div className="border-b p-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Top Website Pages
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3">Page</th>
                        <th className="px-5 py-3">Views</th>
                        <th className="px-5 py-3">Users</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pages.map((row, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-5 py-3 font-medium">
                            {row.dimensionValues?.[0]?.value}
                          </td>

                          <td className="px-5 py-3">
                            {row.metricValues?.[0]?.value}
                          </td>

                          <td className="px-5 py-3">
                            {row.metricValues?.[1]?.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <ListCard title="Traffic Sources" rows={sources} />

                <ListCard title="Devices" rows={devices} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Card = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h2 className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </h2>
    </div>
  );
};

const ListCard = ({
  title,
  rows,
}: {
  title: string;
  rows: any[];
}) => {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-xl">
      <h2 className="mb-4 text-lg font-bold text-slate-900">
        {title}
      </h2>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
          >
            <span className="font-medium text-slate-700">
              {row.dimensionValues?.[0]?.value}
            </span>

            <span className="font-bold text-slate-900">
              {row.metricValues?.[0]?.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleAnalyticsDashboard;