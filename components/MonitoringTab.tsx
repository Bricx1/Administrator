import { useEffect, useState } from "react";

const MonitoringTab = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/integrations/availity/logs");
        const result = await res.json();
        if (result.success) {
          setLogs(result.logs);
        } else {
          console.error("Load transactions error:", result.error);
        }
      } catch (err) {
        console.error("Load transactions error", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Connection Logs</h2>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500">No logs available.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {logs.map((log, idx) => (
            <li key={idx} className="py-2 text-sm">
              <div>
                <strong>{log.type}</strong>{" "}
                <span
                  className={
                    log.status === "success"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  — {log.status.toUpperCase()}
                </span>
              </div>
              <div className="text-gray-600">{log.message}</div>
              <div className="text-xs text-gray-400">
                {new Date(log.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MonitoringTab;
