import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Toast } from "../utils/toast";

export default function SystemJobs() {
  const { token, user } = useSelector((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [webhookEvents, setWebhookEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const isStaff = user?.role === "ADMIN" || user?.role === "MANAGER";
  const isAdmin = user?.role === "ADMIN";

  const fetchSystemLogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/system/cron-logs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (res.ok) {
        setLogs(data.data?.logs || []);
        setWebhookEvents(data.data?.webhookEvents || []);
      }
    } catch (err) {
      console.error("Failed to fetch system logs:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSystemLogs();
  }, [fetchSystemLogs]);

  if (!token || !isStaff) return <Navigate to="/" replace />;

  const handleRunCleanupNow = async () => {
    setRunning(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/system/cron-logs/run-now`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to run cron job");

      Toast.fire({
        icon: "success",
        title: `Cleanup completed: ${data.data.log.cancelledOrdersCount} order(s) cancelled`,
      });
      fetchSystemLogs();
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.message,
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
            SYSTEM OBSERVABILITY
          </span>
          <h2 className="fw-bold mb-1">Cron Jobs & Webhook Logs</h2>
          <p className="text-muted mb-0">
            Monitor scheduled order cleanup executions, stock rollbacks, and
            idempotent carrier webhooks
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Cron Job Status & Manual Trigger Card */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success-subtle text-success rounded-pill px-3">
                ● ACTIVE SCHEDULE
              </span>
              <code className="text-muted small">0 6 * * * (Africa/Cairo)</code>
            </div>
            <h5 className="fw-bold mb-1">
              ⏰ Daily Unpaid Orders Cleanup & Inventory Rollback
            </h5>
            <p className="text-muted small mb-0">
              Automatically cancels <strong>Pending</strong> orders older than
              24 hours, restores product stock quantities, and dispatches
              Discord alerts.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              onClick={fetchSystemLogs}
              disabled={loading}
              className="btn btn-light border rounded-pill px-3 fw-semibold"
            >
              🔄 Refresh
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={handleRunCleanupNow}
                disabled={running}
                className="btn btn-primary rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
              >
                {running ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Running Job...
                  </>
                ) : (
                  "▶ Run Cleanup Now"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cron Execution History Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="fw-bold mb-0">
            📋 Cron Job Execution History ({logs.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No execution logs yet. Click <strong>Run Cleanup Now</strong> to
              test the job immediately.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 py-3">Executed At</th>
                    <th className="py-3">Trigger</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Cancelled Orders</th>
                    <th className="py-3">Restored Stock</th>
                    <th className="py-3">Duration</th>
                    <th className="pe-4 py-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td className="ps-4 py-3 small text-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            log.triggerType === "MANUAL"
                              ? "bg-info-subtle text-info-emphasis"
                              : "bg-secondary-subtle text-secondary"
                          }`}
                        >
                          {log.triggerType}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            log.status === "SUCCESS"
                              ? "bg-success-subtle text-success"
                              : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="fw-bold">{log.cancelledOrdersCount}</td>
                      <td className="fw-bold text-primary">
                        +{log.restoredItemsCount} units
                      </td>
                      <td className="text-muted small font-monospace">
                        {log.durationMs} ms
                      </td>
                      <td className="pe-4 small text-muted">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Idempotent Webhook Events Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="fw-bold mb-0">
            🔗 Processed Webhook Events (Idempotency Log)
          </h5>
        </div>
        <div className="card-body p-0">
          {webhookEvents.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No carrier webhook events recorded yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 py-3">Event ID (Idempotency Key)</th>
                    <th className="py-3">Provider</th>
                    <th className="py-3">Event Type</th>
                    <th className="pe-4 py-3">Received At</th>
                  </tr>
                </thead>
                <tbody>
                  {webhookEvents.map((evt) => (
                    <tr key={evt._id}>
                      <td className="ps-4 py-3 font-monospace small text-primary">
                        {evt.eventId}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {evt.provider}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary rounded-pill">
                          {evt.eventType}
                        </span>
                      </td>
                      <td className="pe-4 small text-muted">
                        {new Date(evt.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
