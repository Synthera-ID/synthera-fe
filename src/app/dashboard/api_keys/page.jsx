"use client";

import { useState, useEffect, useCallback } from "react";
import apiFetch from "@/utils/apiFetch";
import { Eye, EyeOff, Copy, RefreshCw, Trash2, Plus, Check, ToggleLeft, ToggleRight, Loader2, Key } from "lucide-react";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Generate Modal ────────────────────────────────────────────────────────────
function GenerateModal({ onClose, onGenerated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch.post("/api-keys/generate", { name: name.trim() || null });
      onGenerated(res.data);
      onClose();
    } catch (err) {
      setError(err?.data?.message || "Failed to generate API key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="bg-bg-2 border border-bg-3 rounded-2xl p-7 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[17px] font-bold mb-1">Generate New API Key</h3>
        <p className="text-text-3 text-[13px] mb-6">Give your key a recognisable name so you can identify it later.</p>

        <form onSubmit={handleSubmit}>
          <label className="block text-[12px] font-semibold text-text-3 uppercase tracking-wider mb-2">
            Key Name <span className="text-text-3 font-normal normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production Server"
            maxLength={100}
            className="w-full px-4 py-3 bg-bg-1 border border-bg-3 rounded-xl text-[14px] text-text-1 placeholder:text-text-3 focus:outline-none focus:border-primary-3 transition-colors mb-2"
          />
          {error && <p className="text-red-400 text-[12px] mb-4">{error}</p>}

          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-bg-3 text-[13px] font-medium text-text-2 hover:bg-bg-3 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-primary-1 hover:bg-primary-2 text-white text-[13px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ──────────────────────────────────────────────────────
function DeleteModal({ keyItem, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="bg-bg-2 border border-bg-3 rounded-2xl p-7 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mb-5">
          <Trash2 size={22} className="text-red-400" />
        </div>
        <h3 className="text-[17px] font-bold mb-1">Delete API Key</h3>
        <p className="text-text-3 text-[13px] mb-2">
          You are about to permanently delete{" "}
          <span className="text-text-1 font-medium">{keyItem?.name || "this key"}</span>.
        </p>
        <p className="text-text-3 text-[13px] mb-6">
          Any applications using this key will immediately lose access. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-bg-3 text-[13px] font-medium text-text-2 hover:bg-bg-3 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ApiKeysPage() {
  const [keys, setKeys] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [activeKey, setActiveKey] = useState(null); // key object displayed in panel

  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // ── Fetch all keys ───────────────────────────────────────────────────────────
  const fetchKeys = useCallback(async () => {
    setLoadingKeys(true);
    try {
      const res = await apiFetch.get("/api-keys");
      const list = res.data || [];
      console.log("res:", res);
      setKeys(list);
      // Default: show the most recently generated key in panel
      // (list is ordered by latest, so first item is newest)
      if (!activeKey && list.length > 0) {
        setActiveKey(list[0]);
      } else if (activeKey) {
        // Refresh activeKey data in case status changed
        const refreshed = list.find((k) => k.id === activeKey.id);
        setActiveKey(refreshed || list[0] || null);
      }
    } catch {
      setKeys([]);
    } finally {
      setLoadingKeys(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchKeys();
  }, []);

  // ── Copy key ─────────────────────────────────────────────────────────────────
  const handleCopy = () => {
    if (!activeKey?.api_key) return;
    navigator.clipboard.writeText(activeKey.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── After generate ────────────────────────────────────────────────────────────
  const handleGenerated = (newKey) => {
    setActiveKey(newKey);
    setShowKey(true); // reveal the new key immediately
    fetchKeys();
  };

  // ── Toggle status ─────────────────────────────────────────────────────────────
  const handleToggleStatus = async (keyItem) => {
    setTogglingId(keyItem.id);
    try {
      await apiFetch.patch(`/api-keys/${keyItem.id}/status`);
      await fetchKeys();
    } catch {
      // silently fail — no toast lib in scope
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await apiFetch.delete(`/api-keys/${deleteTarget.id}`);
      if (activeKey?.id === deleteTarget.id) setActiveKey(null);
      setDeleteTarget(null);
      await fetchKeys();
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
  };

  // ── Derived display values ─────────────────────────────────────────────────────
  const displayedKey = activeKey
    ? showKey
      ? activeKey.api_key
      : activeKey.api_key_masked
    : "No active key — generate one below";

  return (
    <>
      {/* Modals */}
      {showGenerateModal && (
        <GenerateModal
          onClose={() => setShowGenerateModal(false)}
          onGenerated={handleGenerated}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          keyItem={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          loading={!!deletingId}
        />
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-[26px] font-bold mb-1.5">API Keys</h1>
        <p className="text-text-3 text-[13px]">Manage your API keys for authentication.</p>
      </header>

      {/* Active API Key Panel */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl p-7 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[17px] font-bold leading-tight">
              {activeKey?.name ? activeKey.name : "Active API Key"}
            </h3>
            {activeKey && (
              <p className="text-text-3 text-[12px] mt-0.5">
                Generated {formatDate(activeKey.created_at)}
                {activeKey.last_used_at ? ` · Last used ${timeAgo(activeKey.last_used_at)}` : " · Never used"}
              </p>
            )}
          </div>
          {activeKey && (
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-medium leading-none capitalize tracking-wide border ${
                activeKey.is_active
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                  : "bg-red-500/15 text-red-400 border-red-500/25"
              }`}
            >
              {activeKey.is_active ? "Active" : "Revoked"}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
          <div className="flex-1 w-full px-5 py-[14px] bg-bg-1 border border-bg-3 rounded-xl flex items-center">
            <span className="text-text-1 font-mono text-[14px] font-medium tracking-wider truncate">
              {displayedKey}
            </span>
          </div>

          {activeKey && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowKey(!showKey)}
                className="w-[50px] h-[50px] rounded-xl bg-bg-1 border border-bg-3 text-primary-3 hover:bg-bg-3 transition-all flex items-center justify-center shrink-0"
                title={showKey ? "Hide Key" : "Show Key"}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={handleCopy}
                className="flex-[1] md:flex-none h-[50px] px-6 rounded-xl bg-bg-1 border border-bg-3 text-text-1 text-[13px] font-medium hover:bg-bg-3 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {copied ? (
                  <><Check size={16} className="text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy size={16} className="text-primary-3" /> Copy</>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-5 py-2.5 bg-primary-1 hover:bg-primary-2 text-white text-[13px] font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={15} /> Generate New Key
          </button>
        </div>
      </div>

      {/* Key History Table */}
      <div className="bg-bg-2 border border-bg-3 rounded-2xl overflow-hidden">
        <div className="px-7 py-5 border-b border-bg-3 flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-bold">Key History</h3>
            <p className="text-text-3 text-[12px] mt-0.5">Click an active key to preview it in the panel above.</p>
          </div>
          {!loadingKeys && (
            <span className="text-text-3 text-[12px]">{keys.length} key{keys.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_1fr] gap-4 px-7 py-3.5 bg-bg-3/30 text-[11px] font-bold text-text-3 uppercase tracking-widest">
          <span>Name / Key</span>
          <span>Created</span>
          <span>Last Used</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {loadingKeys ? (
          <div className="flex flex-col">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_1fr] gap-4 px-7 py-5 border-b border-bg-3/60 last:border-b-0 animate-pulse">
                <div className="h-4 bg-bg-3 rounded w-3/4" />
                <div className="h-4 bg-bg-3 rounded w-1/2" />
                <div className="h-4 bg-bg-3 rounded w-1/2" />
                <div className="h-5 bg-bg-3 rounded-full w-16" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-bg-3 rounded-lg" />
                  <div className="h-8 w-8 bg-bg-3 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-3">
            <Key size={36} className="opacity-30" />
            <p className="text-[14px]">No API keys yet.</p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="mt-1 text-primary-3 text-[13px] hover:underline"
            >
              Generate your first key →
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {keys.map((item, index) => (
              <div
                key={item.id}
                className={`grid grid-cols-[1.5fr_1fr_1fr_0.8fr_1fr] gap-4 px-7 py-5 items-center transition-colors ${
                  index !== keys.length - 1 ? "border-b border-bg-3/60" : ""
                } ${
                  item.is_active ? "hover:bg-bg-3/30 cursor-pointer" : "opacity-60 hover:bg-bg-3/20"
                } ${activeKey?.id === item.id ? "bg-primary-1/5 border-l-2 border-l-primary-3" : ""}`}
                onClick={() => {
                  if (item.is_active) {
                    setActiveKey(item);
                    setShowKey(false);
                  }
                }}
                title={item.is_active ? "Click to preview this key" : "Key is revoked"}
              >
                {/* Name / masked key */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-medium text-text-1 truncate">
                    {item.name || <span className="italic text-text-3">Unnamed</span>}
                  </span>
                  <span className="text-[11px] font-mono text-text-3 truncate mt-0.5">
                    {item.api_key_masked}
                  </span>
                </div>

                <span className="text-[13px] text-text-2">{formatDate(item.created_at)}</span>
                <span className="text-[13px] text-text-2">{timeAgo(item.last_used_at)}</span>

                {/* Status badge */}
                <div>
                  {item.is_active ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 leading-none capitalize">
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/25 leading-none capitalize">
                      Revoked
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {/* Toggle status */}
                  <button
                    onClick={() => handleToggleStatus(item)}
                    disabled={togglingId === item.id}
                    title={item.is_active ? "Revoke this key" : "Activate this key"}
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                      item.is_active
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    } disabled:opacity-40`}
                  >
                    {togglingId === item.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : item.is_active ? (
                      <ToggleRight size={15} />
                    ) : (
                      <ToggleLeft size={15} />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(item)}
                    disabled={deletingId === item.id}
                    title="Delete this key"
                    className="w-8 h-8 rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all disabled:opacity-40"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
