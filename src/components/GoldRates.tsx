import React, { useEffect, useRef, useState } from "react";

// ========== CAPS GOLD TYPES ==========
type ParsedRowcapsgold = {
  name: string;
  price: string;
};

type ParsedRowdpgold = {
  name: string;
  price: string;
};

// ========== MANOKAMANA TYPES ==========
type PriceState = {
  GOLD_SPOT?: string;
  SILVER_SPOT?: string;
  USDINR?: string;
  GOLD_HYD?: string;
  SILVER_HYD?: string;
};

// ========== IBJA TYPES ==========
type IBJAPrices = {
  "585"?: string;
  "750"?: string;
  "916"?: string;
  "995"?: string;
  "999"?: string;
};

type IBJAResponse = {
  source: string;
  prices: IBJAPrices;
  status: string;
};



const API_URL_CAPS_GOLD =
  "https://bcast.capsgold.net:4768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/capsgoldTelangana";
const API_URL_IBJA =
  "https://meta.oxyloans.com/api/user-service/get-ibja-rates";

const WS_URL =
  "wss://www.manokamanagold.com/ws.ashx?key=bced91dd-9f18-4f40-b6e6-49250434be38";
const API_URL_DP_GOLD =
  "https://statewisebcast.dpgold.in:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/dpgold";

const PID_MAP: Record<string, keyof PriceState> = {
  pid25: "GOLD_SPOT",
  pid26: "SILVER_SPOT",
  pid27: "USDINR",
  pid34: "GOLD_HYD",
  pid20: "SILVER_HYD",
};

const IBJA_POLL_INTERVAL = 600000;

const GoldRates: React.FC = () => {
  const [rowsDP, setRowsDP] = useState<ParsedRowdpgold[]>([]);
  const [dpLoading, setDPLoading] = useState<boolean>(true);
  const [dpError, setDPError] = useState<string | null>(null);
  const prevRowsDPRef = useRef<ParsedRowdpgold[]>([]);

  const [rowsCaps, setRowsCaps] = useState<ParsedRowcapsgold[]>([]);
  const [capsLoading, setCapsLoading] = useState<boolean>(true);
  const [capsError, setCapsError] = useState<string | null>(null);
  const prevRowsCapsRef = useRef<ParsedRowcapsgold[]>([]);

  const [ibjaRates, setIbjaRates] = useState<IBJAPrices>({});
  const [ibjaLoading, setIbjaLoading] = useState<boolean>(true);
  const [ibjaError, setIbjaError] = useState<string | null>(null);
  const ibjaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);



  // ========== MANOKAMANA STATE ==========
  const [prices, setPrices] = useState<PriceState>({});
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const lastMessageTimeRef = useRef<number>(Date.now());
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const parseResponsedpgold = (response: string): ParsedRowdpgold[] => {
    const lines = response.split("\n");
    // Initialize array with 7 empty slots to match the line indices
    const parsed: ParsedRowdpgold[] = Array(7)
      .fill(null)
      .map(() => ({ name: "", price: "" }));

    lines.forEach((line, index) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      const a = cleanLine.split(/\s+/);

      let name = "";
      let price = "";

      // Map to correct array positions based on line index
      if (index === 0) {
        name = "Gold Spot";
        price = a[3];
        parsed[0] = { name, price };
      } else if (index === 1) {
        name = "Silver Spot";
        price = a[3];
        parsed[1] = { name, price };
      } else if (index === 2) {
        name = "USDINR";
        price = a[2];
        parsed[2] = { name, price };
      } else if (index === 3) {
        name = "Gold Hyderabad";
        price = a[7];
        parsed[3] = { name, price };
      } else if (index === 6) {
        name = "Silver Hyderabad";
        price = a[7];
        parsed[6] = { name, price };
      }
    });

    return parsed;
  };

  const fetchDatadpgold = async () => {
    try {
      const res = await fetch(API_URL_DP_GOLD, {
        headers: { Accept: "text/plain, */*; q=0.01" },
      });

      if (!res.ok) throw new Error("DP Gold API request failed");

      const text = await res.text();
      const newRows = parseResponsedpgold(text);

      setRowsDP((prevRows) => {
        if (prevRows.length === 0) {
          prevRowsDPRef.current = newRows;
          setDPLoading(false);
          return newRows;
        }

        const updated = prevRows.map((row, i) => {
          if (newRows[i] && row.price !== newRows[i]?.price) {
            return { ...row, price: newRows[i].price };
          }
          return row;
        });

        console.log("===== DP GOLD UPDATED ROWS =====", updated);

        prevRowsDPRef.current = updated;
        return updated;
      });

      setDPError(null);
    } catch (err: any) {
      console.error("DP Gold API Error:", err);
      setDPError(err.message);
      setDPLoading(false);
    }
  };

  const parseResponsecapsgold = (response: string): ParsedRowcapsgold[] => {
    const lines = response.split("\n");
    const parsed: ParsedRowcapsgold[] = [];

    const allLines = lines
      .map((line, index) => {
        const cleanLine = line.trim();
        if (!cleanLine) return null;

        return {
          index,
          arr: cleanLine.split(/\s+/),
        };
      })
      .filter(Boolean) as { index: number; arr: string[] }[];

    const orderedLines = [
      ...allLines.filter(
        (l) => l.index === 2 || l.index === 3 || l.index === 4,
      ),
      ...allLines.filter((l) => l.index === 0 || l.index === 1),
      ...allLines.filter((l) => ![0, 1, 2, 3, 4].includes(l.index)),
    ];

    console.log("===== CAPS GOLD REORDERED ARRAYS =====");

    orderedLines.forEach(({ index, arr }) => {
      console.log(`Original Line ${index} ARRAY:`, arr);

      let name = "";
      let price = "";

      if (index === 2 || index === 3 || index === 4) {
        name = `${arr[1]} ${arr[2]}`;
        price = arr[3];
      } else if (index === 1) {
        name = `${arr[1]} ${arr[2]}`;
        price = arr[3];
      } else if (index === 5) {
        name = `${arr[1]} ${arr[2]} ${arr[3]}`;
        price = arr[4];
      } else if (index === 0) {
        name = `${arr[1]} ${arr[2]} ${arr[3]} ${arr[4]} ${arr[5]}`;
        price = arr[7];
      } else if(index === 6) {
        name = `${arr[1]} ${arr[2]}`;
        price = arr[4];
      }

      if (name && price) {
        parsed.push({ name, price });
      }
    });

    console.log("===== CAPS GOLD PARSED (ORDERED) =====", parsed);

    return parsed;
  };

  // ========== CAPS GOLD FETCH ==========
  const fetchDatacapsgold = async () => {
    try {
      const res = await fetch(API_URL_CAPS_GOLD, {
        headers: { Accept: "text/plain, */*; q=0.01" },
      });
      if (!res.ok) throw new Error("API request failed");

      const text = await res.text();
      const newRows = parseResponsecapsgold(text);

      setRowsCaps((prevRows) => {
        // First load
        if (prevRows.length === 0) {
          prevRowsCapsRef.current = newRows;
          setCapsLoading(false);
          return newRows;
        }

        // Update ONLY price
        const updated = prevRows.map((row, i) => {
          if (row.price !== newRows[i]?.price) {
            return { ...row, price: newRows[i].price };
          }
          return row;
        });

        prevRowsCapsRef.current = updated;
        return updated;
      });

      // Clear any previous error
      setCapsError(null);
    } catch (err: any) {
      console.error("Caps Gold API Error:", err);
      setCapsError(err.message);
      setCapsLoading(false);
    }
  };

  // ========== IBJA FETCH ==========
  const fetchIBJARates = async () => {
    try {
      const res = await fetch(API_URL_IBJA);
      if (!res.ok) throw new Error("IBJA API request failed");

      const data: IBJAResponse = await res.json();

      console.log("===== IBJA RESPONSE =====", data);

      if (data.status === "SUCCESS" && data.prices) {
        setIbjaRates(data.prices);
        setIbjaLoading(false);
        setIbjaError(null);
      } else {
        throw new Error("Invalid IBJA response");
      }
    } catch (err: any) {
      console.error("IBJA API Error:", err);
      setIbjaError(err.message);
      setIbjaLoading(false);
    }
  };



  // ========== CAPS GOLD EFFECT - CONTINUOUS POLLING ==========
  useEffect(() => {
    let isActive = true;

    const runContinuously = async () => {
      while (isActive) {
        await fetchDatadpgold();
        await fetchDatacapsgold();
      }
    };

    runContinuously();

    return () => {
      isActive = false;
    };
  }, []);

  // ========== IBJA EFFECT WITH INTERVAL ==========
  useEffect(() => {
    // Initial fetch
    fetchIBJARates();

    // Set up polling interval
    ibjaIntervalRef.current = setInterval(() => {
      fetchIBJARates();
    }, IBJA_POLL_INTERVAL);

    // Cleanup
    return () => {
      if (ibjaIntervalRef.current) {
        clearInterval(ibjaIntervalRef.current);
      }
    };
  }, []);



  // ========== MANOKAMANA WEBSOCKET EFFECT ==========
  useEffect(() => {
    let isActive = true;

    const connectWebSocket = () => {
      if (!isActive) return;

      console.log("🔌 Attempting to connect to Manokamana WebSocket...");

      try {
        const socket = new WebSocket(WS_URL);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("✅ WebSocket connected!");
          setWsConnected(true);
          lastMessageTimeRef.current = Date.now();

          // Start heartbeat checker - reconnect if no message in 30 seconds
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }

          heartbeatIntervalRef.current = setInterval(() => {
            const timeSinceLastMessage =
              Date.now() - lastMessageTimeRef.current;
            console.log(
              `Heartbeat check: ${Math.floor(timeSinceLastMessage / 1000)}s since last message`,
            );

            // If no message received in 30 seconds, force reconnect
            if (timeSinceLastMessage > 30000) {
              console.log(
                "⚠️ No messages for 30+ seconds, forcing reconnect...",
              );
              if (socketRef.current) {
                socketRef.current.close();
              }
            }
          }, 10000);
        };

        socket.onmessage = (event: MessageEvent) => {
          lastMessageTimeRef.current = Date.now();

          console.log("Raw WebSocket message received:", event.data);

          if (typeof event.data !== "string") {
            console.log("Non-string message received, skipping");
            return;
          }

          // pid25^4892.28***12:11:40 PM^395
          const raw = event.data.trim();
          console.log("📋 Trimmed message:", raw);

          const [pid, rest] = raw.split("^");
          console.log("🔍 Parsed - PID:", pid, "Rest:", rest);

          if (!PID_MAP[pid]) {
            console.log(`⚠️ Unknown PID: ${pid} - Message: ${raw}`);
            return;
          }

          const value = rest.split("***")[0];
          const key = PID_MAP[pid];

          setPrices((prev) => ({
            ...prev,
            [key]: value,
          }));

          const now = new Date();
          setLastUpdate(now.toLocaleTimeString());

          console.log(`✅ Updated ${key}: ${value}`);
        };

        socket.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          setWsConnected(false);
        };

        socket.onclose = (event) => {
          console.log("🔴 WebSocket closed:", event.code, event.reason);
          setWsConnected(false);

          // Clear heartbeat interval
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
          }

          // Attempt to reconnect after 3 seconds
          if (isActive) {
            console.log("🔄 Reconnecting in 3 seconds...");
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocket();
            }, 3000);
          }
        };
      } catch (error) {
        console.error("❌ WebSocket connection error:", error);
        setWsConnected(false);

        // Retry connection after 3 seconds
        if (isActive) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      }
    };

    // Initial connection
    connectWebSocket();

    // Cleanup function
    return () => {
      isActive = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Main Price Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mt-3">
          <div className="px-3 py-2 sm:px-4 sm:py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 text-center">
               Gold Prices Comparison Table
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-700 whitespace-nowrap">
                    Type
                  </th>
                  <th className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-red-600 whitespace-nowrap">
                    Manokamana
                  </th>
                  <th className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-indigo-600 whitespace-nowrap">
                    Caps Gold
                  </th>
                  <th className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-green-600 whitespace-nowrap">
                    DP Gold
                  </th>
                  <th className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-green-600 whitespace-nowrap">
                    IBJA
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 font-semibold text-gray-700 text-center whitespace-nowrap align-middle">
                    Gold Spot Price
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {prices.GOLD_SPOT ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsCaps[0]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsDP[0]?.price ?? "--"}
                  </td>

                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center text-gray-400 align-middle">
                    --
                  </td>
                </tr>

                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 font-semibold text-gray-700 text-center whitespace-nowrap align-middle">
                    Silver Spot Price
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {prices.SILVER_SPOT ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsCaps[1]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsDP[1]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center text-gray-400 align-middle">
                    --
                  </td>
                </tr>

                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 font-semibold text-gray-700 text-center whitespace-nowrap align-middle">
                    USD to INR
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {prices.USDINR ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsCaps[2]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsDP[2]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center text-gray-400 align-middle">
                    --
                  </td>
                </tr>

                <tr className="hover:bg-blue-50 transition-colors bg-amber-50">
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 font-semibold text-gray-700 text-center whitespace-nowrap align-middle">
                    Gold Price (Hyderabad)
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {prices.GOLD_HYD ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsCaps[3]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsDP[3]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {ibjaLoading ? (
                      <span className="inline-flex gap-1">
                        <span
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></span>
                        <span
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                      </span>
                    ) : (
                      (ibjaRates["999"] ?? "--")
                    )}
                  </td>
                </tr>

                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 font-semibold text-gray-700 text-center whitespace-nowrap align-middle">
                    Silver Price (Hyderabad)
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {prices.SILVER_HYD ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsCaps[6]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {rowsDP[6]?.price ?? "--"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center text-gray-400 align-middle">
                    --
                  </td>
                </tr>

                <tr className="hover:bg-blue-50 transition-colors bg-amber-50">
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 font-semibold text-gray-700 text-center whitespace-nowrap align-middle">
                    Gold 916 (22K)
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center text-gray-400 align-middle">
                    --
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center text-gray-400 align-middle">
                    --
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center text-gray-400 align-middle">
                    --
                  </td>
                  <td className="border border-gray-200 px-2 py-2 sm:px-3 sm:py-2.5 text-center font-bold text-gray-900 align-middle">
                    {ibjaLoading ? (
                      <span className="inline-flex gap-1">
                        <span
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></span>
                        <span
                          className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                      </span>
                    ) : (
                      (ibjaRates["916"] ?? "--")
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GoldRates;
