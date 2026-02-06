import React, { useEffect, useRef, useState } from "react";

// ========== CAPS GOLD TYPES ==========
type ParsedRowcapsgold = {
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


const API_URL_CAPS_GOLD = "https://bcast.capsgold.net:4768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/capsgoldTelangana";
const API_URL_IBJA = "http://65.0.147.157:9024/api/user-service/get-ibja-rates";
const WS_URL = "wss://www.manokamanagold.com/ws.ashx?key=bced91dd-9f18-4f40-b6e6-49250434be38";

const PID_MAP: Record<string, keyof PriceState> = {
  pid25: "GOLD_SPOT",
  pid26: "SILVER_SPOT",
  pid27: "USDINR",
  pid34: "GOLD_HYD",
  pid20: "SILVER_HYD",
};


const IBJA_POLL_INTERVAL = 600000;

const GoldRates: React.FC = () => {
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
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMessageTimeRef = useRef<number>(Date.now());
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

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
      ...allLines.filter((l) => l.index === 2 || l.index === 3 || l.index === 4),
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
      } else if (index === 1 || index === 6) {
        name = `${arr[1]} ${arr[2]}`;
        price = arr[3];
      } else if (index === 5) {
        name = `${arr[1]} ${arr[2]} ${arr[3]}`;
        price = arr[4];
      } else if (index === 0) {
        name = `${arr[1]} ${arr[2]} ${arr[3]} ${arr[4]} ${arr[5]}`;
        price = arr[7];
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
            const timeSinceLastMessage = Date.now() - lastMessageTimeRef.current;
            console.log(`Heartbeat check: ${Math.floor(timeSinceLastMessage / 1000)}s since last message`);

            // If no message received in 30 seconds, force reconnect
            if (timeSinceLastMessage > 30000) {
              console.log("⚠️ No messages for 30+ seconds, forcing reconnect...");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-2">

      <div className="mt-4 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="px-5 py-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">
            Gold Price Comparison Table
          </h2>
        </div>

        <div className="p-5 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-red-600">Manokamana</th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-indigo-600">Caps Gold</th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">IBJA</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Gold Spot Price */}
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Gold Spot Price</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.GOLD_SPOT ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[0]?.price ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
              </tr>

              {/* Row 2: Silver Spot Price */}
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Silver Spot Price</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.SILVER_SPOT ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[1]?.price ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
              </tr>

              {/* Row 3: USD to INR */}
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">USD to INR</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.USDINR ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[2]?.price ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
              </tr>

              {/* Row 4: Gold Price (Hyderabad) */}
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Gold Price (Hyderabad)</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.GOLD_HYD ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[3]?.price ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{ibjaRates["999"] ?? "loading..."}</td>
              </tr>

              {/* Row 5: Silver Price (Hyderabad) */}
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Silver Price (Hyderabad)</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.SILVER_HYD ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[6]?.price ?? "--"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
              </tr>

              {/* Row 6: Gold 916 (22K) */}
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Gold 916 (22K)</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{ibjaRates["916"] ?? "loading..."}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoldRates;















// import React, { useEffect, useRef, useState } from "react";

// // ========== CAPS GOLD TYPES ==========
// type ParsedRowcapsgold = {
//   name: string;
//   price: string;
// };

// // ========== MANOKAMANA TYPES ==========
// type PriceState = {
//   GOLD_SPOT?: string;
//   SILVER_SPOT?: string;
//   USDINR?: string;
//   GOLD_HYD?: string;
//   SILVER_HYD?: string;
// };

// // ========== IBJA TYPES ==========
// type IBJAPrices = {
//   "585"?: string;
//   "750"?: string;
//   "916"?: string;
//   "995"?: string;
//   "999"?: string;
// };

// type IBJAResponse = {
//   source: string;
//   prices: IBJAPrices;
//   status: string;
// };

// // ========== CONSTANTS ==========
// const API_URL_CAPS_GOLD = "https://bcast.capsgold.net:4768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/capsgoldTelangana";
// const API_URL_IBJA = "http://65.0.147.157:9024/api/user-service/get-ibja-rates";

// const WS_URL = "wss://www.manokamanagold.com/ws.ashx?key=bced91dd-9f18-4f40-b6e6-49250434be38";

// const PID_MAP: Record<string, keyof PriceState> = {
//   pid25: "GOLD_SPOT",
//   pid26: "SILVER_SPOT",
//   pid27: "USDINR",
//   pid34: "GOLD_HYD",
//   pid20: "SILVER_HYD",
// };

// // Poll intervals
// const CAPS_GOLD_POLL_INTERVAL = 5000;
// const IBJA_POLL_INTERVAL = 5000;

// const GoldRates: React.FC = () => {
//   // ========== CAPS GOLD STATE ==========
//   const [rowsCaps, setRowsCaps] = useState<ParsedRowcapsgold[]>([]);
//   const [capsLoading, setCapsLoading] = useState<boolean>(true);
//   const [capsError, setCapsError] = useState<string | null>(null);
//   const prevRowsCapsRef = useRef<ParsedRowcapsgold[]>([]);
//   const capsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // ========== IBJA STATE ==========
//   const [ibjaRates, setIbjaRates] = useState<IBJAPrices>({});
//   const [ibjaLoading, setIbjaLoading] = useState<boolean>(true);
//   const [ibjaError, setIbjaError] = useState<string | null>(null);
//   const ibjaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // ========== MANOKAMANA STATE ==========
//   const [prices, setPrices] = useState<PriceState>({});
//   const socketRef = useRef<WebSocket | null>(null);
//   const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const lastMessageTimeRef = useRef<number>(Date.now());
//   const [wsConnected, setWsConnected] = useState<boolean>(false);
//   const [lastUpdate, setLastUpdate] = useState<string>("");

//   const parseResponsecapsgold = (response: string): ParsedRowcapsgold[] => {
//     const lines = response.split("\n");
//     const parsed: ParsedRowcapsgold[] = [];

//     const allLines = lines
//       .map((line, index) => {
//         const cleanLine = line.trim();
//         if (!cleanLine) return null;

//         return {
//           index,
//           arr: cleanLine.split(/\s+/),
//         };
//       })
//       .filter(Boolean) as { index: number; arr: string[] }[];

//     const orderedLines = [
//       ...allLines.filter((l) => l.index === 2 || l.index === 3 || l.index === 4),
//       ...allLines.filter((l) => l.index === 0 || l.index === 1),
//       ...allLines.filter((l) => ![0, 1, 2, 3, 4].includes(l.index)),
//     ];

//     console.log("===== CAPS GOLD REORDERED ARRAYS =====");

//     orderedLines.forEach(({ index, arr }) => {
//       console.log(`Original Line ${index} ARRAY:`, arr);

//       let name = "";
//       let price = "";

//       if (index === 2 || index === 3 || index === 4) {
//         name = `${arr[1]} ${arr[2]}`;
//         price = arr[3];
//       } else if (index === 1 || index === 6) {
//         name = `${arr[1]} ${arr[2]}`;
//         price = arr[3];
//       } else if (index === 5) {
//         name = `${arr[1]} ${arr[2]} ${arr[3]}`;
//         price = arr[4];
//       } else if (index === 0) {
//         name = `${arr[1]} ${arr[2]} ${arr[3]} ${arr[4]} ${arr[5]}`;
//         price = arr[7];
//       }

//       if (name && price) {
//         parsed.push({ name, price });
//       }
//     });

//     console.log("===== CAPS GOLD PARSED (ORDERED) =====", parsed);

//     return parsed;
//   };

//   // ========== CAPS GOLD FETCH ==========
//   const fetchDatacapsgold = async () => {
//     try {
//       const res = await fetch(API_URL_CAPS_GOLD, {
//         headers: { Accept: "text/plain, */*; q=0.01" },
//       });
//       if (!res.ok) throw new Error("API request failed");

//       const text = await res.text();
//       const newRows = parseResponsecapsgold(text);

//       setRowsCaps((prevRows) => {
//         // First load
//         if (prevRows.length === 0) {
//           prevRowsCapsRef.current = newRows;
//           setCapsLoading(false);
//           return newRows;
//         }

//         // Update ONLY price
//         const updated = prevRows.map((row, i) => {
//           if (row.price !== newRows[i]?.price) {
//             return { ...row, price: newRows[i].price };
//           }
//           return row;
//         });

//         prevRowsCapsRef.current = updated;
//         return updated;
//       });

//       // Clear any previous error
//       setCapsError(null);
//     } catch (err: any) {
//       console.error("Caps Gold API Error:", err);
//       setCapsError(err.message);
//       setCapsLoading(false);
//     }
//   };

//   // ========== IBJA FETCH ==========
//   const fetchIBJARates = async () => {
//     try {
//       const res = await fetch(API_URL_IBJA);
//       if (!res.ok) throw new Error("IBJA API request failed");

//       const data: IBJAResponse = await res.json();

//       console.log("===== IBJA RESPONSE =====", data);

//       if (data.status === "SUCCESS" && data.prices) {
//         setIbjaRates(data.prices);
//         setIbjaLoading(false);
//         setIbjaError(null);
//       } else {
//         throw new Error("Invalid IBJA response");
//       }
//     } catch (err: any) {
//       console.error("IBJA API Error:", err);
//       setIbjaError(err.message);
//       setIbjaLoading(false);
//     }
//   };

//   // ========== CAPS GOLD EFFECT WITH INTERVAL ==========
//   useEffect(() => {
//     // Initial fetch
//     fetchDatacapsgold();

//     // Set up polling interval
//     capsIntervalRef.current = setInterval(() => {
//       fetchDatacapsgold();
//     }, CAPS_GOLD_POLL_INTERVAL);

//     // Cleanup
//     return () => {
//       if (capsIntervalRef.current) {
//         clearInterval(capsIntervalRef.current);
//       }
//     };
//   }, []);

//   // ========== IBJA EFFECT WITH INTERVAL ==========
//   useEffect(() => {
//     // Initial fetch
//     fetchIBJARates();

//     // Set up polling interval
//     ibjaIntervalRef.current = setInterval(() => {
//       fetchIBJARates();
//     }, IBJA_POLL_INTERVAL);

//     // Cleanup
//     return () => {
//       if (ibjaIntervalRef.current) {
//         clearInterval(ibjaIntervalRef.current);
//       }
//     };
//   }, []);

//   // ========== MANOKAMANA WEBSOCKET EFFECT ==========
//   useEffect(() => {
//     let isActive = true;

//     const connectWebSocket = () => {
//       if (!isActive) return;

//       console.log("🔌 Attempting to connect to Manokamana WebSocket...");

//       try {
//         const socket = new WebSocket(WS_URL);
//         socketRef.current = socket;

//         socket.onopen = () => {
//           console.log("✅ WebSocket connected!");
//           setWsConnected(true);
//           lastMessageTimeRef.current = Date.now();

//           // Start heartbeat checker - reconnect if no message in 30 seconds
//           if (heartbeatIntervalRef.current) {
//             clearInterval(heartbeatIntervalRef.current);
//           }

//           heartbeatIntervalRef.current = setInterval(() => {
//             const timeSinceLastMessage = Date.now() - lastMessageTimeRef.current;
//             console.log(`Heartbeat check: ${Math.floor(timeSinceLastMessage / 1000)}s since last message`);

//             // If no message received in 30 seconds, force reconnect
//             if (timeSinceLastMessage > 30000) {
//               console.log("⚠️ No messages for 30+ seconds, forcing reconnect...");
//               if (socketRef.current) {
//                 socketRef.current.close();
//               }
//             }
//           }, 10000); // Check every 10 seconds
//         };

//         socket.onmessage = (event: MessageEvent) => {
//           lastMessageTimeRef.current = Date.now();

//           console.log("📨 Raw WebSocket message received:", event.data);

//           if (typeof event.data !== "string") {
//             console.log("⚠️ Non-string message received, skipping");
//             return;
//           }

//           // pid25^4892.28***12:11:40 PM^395
//           const raw = event.data.trim();
//           console.log("📋 Trimmed message:", raw);

//           const [pid, rest] = raw.split("^");
//           console.log("🔍 Parsed - PID:", pid, "Rest:", rest);

//           if (!PID_MAP[pid]) {
//             console.log(`⚠️ Unknown PID: ${pid} - Message: ${raw}`);
//             return;
//           }

//           const value = rest.split("***")[0];
//           const key = PID_MAP[pid];

//           setPrices((prev) => ({
//             ...prev,
//             [key]: value,
//           }));

//           const now = new Date();
//           setLastUpdate(now.toLocaleTimeString());

//           console.log(`✅ Updated ${key}: ${value}`);
//         };

//         socket.onerror = (error) => {
//           console.error("❌ WebSocket error:", error);
//           setWsConnected(false);
//         };

//         socket.onclose = (event) => {
//           console.log("🔴 WebSocket closed:", event.code, event.reason);
//           setWsConnected(false);

//           // Clear heartbeat interval
//           if (heartbeatIntervalRef.current) {
//             clearInterval(heartbeatIntervalRef.current);
//             heartbeatIntervalRef.current = null;
//           }

//           // Attempt to reconnect after 3 seconds
//           if (isActive) {
//             console.log("🔄 Reconnecting in 3 seconds...");
//             reconnectTimeoutRef.current = setTimeout(() => {
//               connectWebSocket();
//             }, 3000);
//           }
//         };
//       } catch (error) {
//         console.error("❌ WebSocket connection error:", error);
//         setWsConnected(false);

//         // Retry connection after 3 seconds
//         if (isActive) {
//           reconnectTimeoutRef.current = setTimeout(() => {
//             connectWebSocket();
//           }, 3000);
//         }
//       }
//     };

//     // Initial connection
//     connectWebSocket();

//     // Cleanup function
//     return () => {
//       isActive = false;

//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }

//       if (heartbeatIntervalRef.current) {
//         clearInterval(heartbeatIntervalRef.current);
//       }

//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   // ========== RENDER ==========
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-2">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//         {/* 🔹 CAPS GOLD */}
//         <div className="bg-white rounded-xl shadow-md border border-gray-200">
//           <div className="px-5 py-4 border-b bg-gray-50 rounded-t-xl">
//             <h2 className="text-lg font-semibold text-gray-800">
//               Live Gold Rates — <span className="text-indigo-600">Caps Gold</span>
//             </h2>
//           </div>

//           <div className="p-5">
//             {capsLoading && <p className="text-blue-500 text-sm">Loading...</p>}
//             {capsError && <p className="text-red-500 text-sm">{capsError}</p>}

//             {!capsLoading && !capsError && (
//               <div className="space-y-3">
//                 {rowsCaps.map((row) => (
//                   <div
//                     key={row.name}
//                     className="flex justify-between items-center text-sm border-b last:border-b-0 pb-2"
//                   >
//                     <span className="font-medium text-gray-700">{row.name}</span>
//                     <span className="font-semibold text-gray-900">{row.price}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 🔹 MANOKAMANA */}
//         <div className="bg-white rounded-xl shadow-md border border-gray-200">
//           <div className="px-5 py-4 border-b bg-gray-50 rounded-t-xl">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Live Gold Rates — <span className="text-red-600">Manokamana</span>
//               </h2>
//             </div>
//           </div>

//           <div className="p-5">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">Spot Prices</h3>

//             <div className="space-y-2 text-sm mb-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Gold Spot</span>
//                 <span className="font-semibold">{prices.GOLD_SPOT ?? "--"}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">Silver Spot</span>
//                 <span className="font-semibold">{prices.SILVER_SPOT ?? "--"}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">USD / INR</span>
//                 <span className="font-semibold">{prices.USDINR ?? "--"}</span>
//               </div>
//             </div>

//             <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-4 pt-4 border-t">
//               Hyderabad (TDS)
//             </h3>

//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Gold HYD</span>
//                 <span className="font-semibold">{prices.GOLD_HYD ?? "--"}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">Silver HYD</span>
//                 <span className="font-semibold">{prices.SILVER_HYD ?? "--"}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 🔹 IBJA */}
//         <div className="bg-white rounded-xl shadow-md border border-gray-200">
//           <div className="px-5 py-4 border-b bg-gray-50 rounded-t-xl">
//             <h2 className="text-lg font-semibold text-gray-800">
//               Live Gold Rates — <span className="text-green-600">IBJA</span>
//             </h2>
//           </div>

//           <div className="p-5">
//             {ibjaLoading && <p className="text-blue-500 text-sm">Loading...</p>}
//             {ibjaError && <p className="text-red-500 text-sm">{ibjaError}</p>}

//             {!ibjaLoading && !ibjaError && (
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center text-sm border-b pb-2">
//                   <span className="font-medium text-gray-700">Gold 585 (14K)</span>
//                   <span className="font-semibold text-gray-900">{ibjaRates["585"] ?? "--"}</span>
//                 </div>

//                 <div className="flex justify-between items-center text-sm border-b pb-2">
//                   <span className="font-medium text-gray-700">Gold 750 (18K)</span>
//                   <span className="font-semibold text-gray-900">{ibjaRates["750"] ?? "--"}</span>
//                 </div>

//                 <div className="flex justify-between items-center text-sm border-b pb-2">
//                   <span className="font-medium text-gray-700">Gold 916 (22K)</span>
//                   <span className="font-semibold text-gray-900">{ibjaRates["916"] ?? "--"}</span>
//                 </div>

//                 <div className="flex justify-between items-center text-sm border-b pb-2">
//                   <span className="font-medium text-gray-700">Gold 995 (24K)</span>
//                   <span className="font-semibold text-gray-900">{ibjaRates["995"] ?? "--"}</span>
//                 </div>

//                 <div className="flex justify-between items-center text-sm">
//                   <span className="font-medium text-gray-700">Gold 999 (Pure)</span>
//                   <span className="font-semibold text-gray-900">{ibjaRates["999"] ?? "--"}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 🔹 COMPARISON TABLE */}
//       <div className="mt-4 bg-white rounded-xl shadow-md border border-gray-200">
//         <div className="px-5 py-4 border-b bg-gray-50 rounded-t-xl">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Rate Comparison Table
//           </h2>
//         </div>

//         <div className="p-5 overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">Type</th>
//                 <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-red-600">Manokamana</th>
//                 <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-indigo-600">Caps Gold</th>
//                 <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-green-600">IBJA</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Row 1: Gold Spot Price */}
//               <tr className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Gold Spot Price</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.GOLD_SPOT ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[0]?.price ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//               </tr>

//               {/* Row 2: Silver Spot Price */}
//               <tr className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Silver Spot Price</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.SILVER_SPOT ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[1]?.price ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//               </tr>

//               {/* Row 3: USD to INR */}
//               <tr className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">USD to INR</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.USDINR ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[2]?.price ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//               </tr>

//               {/* Row 4: Gold Price (Hyderabad) */}
//               <tr className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Gold Price (Hyderabad)</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.GOLD_HYD ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[3]?.price ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//               </tr>

//               {/* Row 5: Silver Price (Hyderabad) */}
//               <tr className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Silver Price (Hyderabad)</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{prices.SILVER_HYD ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{rowsCaps[6]?.price ?? "--"}</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//               </tr>

//               {/* Row 6: Gold 916 (22K) */}
//               <tr className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Gold 916 (22K)</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{ibjaRates["916"] ?? "--"}</td>
//               </tr>

//               {/* Row 7: Gold 999 (Pure) */}
//               <tr className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">Gold 999 (Pure Gold)</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">--</td>
//                 <td className="border border-gray-300 px-4 py-2 text-center font-semibold">{ibjaRates["999"] ?? "--"}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GoldRates;
































































