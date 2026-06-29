"use client";

import {
  Bell,
  ChevronDown,
  ChevronUp,
  Eye,
  Users,
  Clock,
  CheckCircle2,
  Send,
  InboxIcon,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface Recipient {
  id: number;
  name: string;
  role: string;
}

interface NotificationItem {
  id: number;
  recipients: Recipient | Recipient[];
  message: string;
  image: string;
  sender: string;
  date: string;
  time: string;
}

interface NotificationFeedProps {
  history: NotificationItem[];
  title: string;
  subTitle: string;
  type?: "received" | "sent";
}

const ROLE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  admin: {
    bg: "bg-purple-500/20",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
  manager: {
    bg: "bg-amber-500/20",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  default: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
};

function getRoleStyle(role?: string) {
  const key = role?.toLowerCase() ?? "";
  return ROLE_STYLES[key] ?? ROLE_STYLES.default;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const NotificationFeed = ({
  history,
  title,
  subTitle,
  type = "received",
}: NotificationFeedProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const toggleExpand = (id: number) =>
    setExpandedId(expandedId === id ? null : id);

  const loadMore = () =>
    setVisibleCount((prev) => Math.min(prev + 5, history.length));

  const displayedHistory = history.slice(0, visibleCount);
  const hasMore = visibleCount < history.length;

  const getRecipientNames = (recipients: Recipient | Recipient[]) => {
    if (!recipients) return "Unknown";
    if (Array.isArray(recipients))
      return recipients.map((r) => r.name).join(", ");
    return recipients.name;
  };

  const getRecipientCount = (recipients: Recipient | Recipient[]) => {
    if (!recipients) return 0;
    return Array.isArray(recipients) ? recipients.length : 1;
  };

  const getRecipientRole = (recipients: Recipient | Recipient[]) => {
    if (!recipients) return undefined;
    if (Array.isArray(recipients)) return recipients[0]?.role;
    return recipients.role;
  };

  const accentColor = type === "received" ? "emerald" : "blue";

  return (
    <div className="bg-[#0A0A0A] border border-[#968B79]/40 rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 ${
              type === "received" ? "bg-emerald-500/10" : "bg-blue-500/10"
            }`}
          >
            {type === "received" ? (
              <Bell size={18} className="text-emerald-400" />
            ) : (
              <Send size={18} className="text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
            <p className="text-gray-500 text-xs">{subTitle}</p>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full border text-xs font-medium ${
            type === "received"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
          }`}
        >
          {history.length} {history.length === 1 ? "item" : "items"}
        </div>
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <InboxIcon size={20} className="text-gray-500" />
          </div>
          <p className="text-gray-500 text-sm">No notifications yet</p>
        </div>
      )}

      {/* List */}
      {history.length > 0 && (
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
          {displayedHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            const recipientCount = getRecipientCount(item.recipients);
            const recipientNames = getRecipientNames(item.recipients);
            const role = getRecipientRole(item.recipients);
            const roleStyle = getRoleStyle(role);
            const isLong = item.message.length > 100;

            return (
              <div
                key={item.id}
                className="bg-white/[0.03] rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-200 overflow-hidden group"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar with Initials */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border text-xs font-bold ${
                        type === "received"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                          : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                      }`}
                    >
                      {getInitials(item.sender)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Top Row: Sender + Time */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-white font-medium text-sm truncate">
                            {item.sender}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${
                              type === "received"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                                : "bg-blue-500/15 text-blue-400 border-blue-500/20"
                            }`}
                          >
                            {type === "received" ? "Received" : "Sent"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
                          <Clock size={11} />
                          <span>{item.date}</span>
                          <span className="text-gray-700">·</span>
                          <span>{item.time}</span>
                        </div>
                      </div>

                      {/* Recipients Row */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Users size={11} className="text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-400 truncate max-w-[180px]">
                          {recipientCount > 1
                            ? `${recipientNames.split(",")[0]} & ${recipientCount - 1} more`
                            : recipientNames}
                        </span>
                        {role && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md border capitalize font-medium ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                          >
                            {role}
                          </span>
                        )}
                      </div>

                      {/* Message */}
                      <p
                        className={`text-sm text-gray-300 mt-2 leading-relaxed ${
                          !isExpanded ? "line-clamp-2" : ""
                        }`}
                      >
                        {item.message}
                      </p>

                      {/* Inline Image Preview (collapsed) */}
                      {item.image && !isExpanded && (
                        <div className="mt-3 relative w-full h-28 rounded-xl overflow-hidden border border-white/10">
                          <Image
                            src={item.image}
                            alt="Attachment"
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      )}

                      {/* Expand/Collapse toggle */}
                      {(isLong || item.image) && (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className={`mt-2 flex items-center gap-1 text-xs font-medium transition-colors ${
                            type === "received"
                              ? "text-emerald-500 hover:text-emerald-400"
                              : "text-blue-500 hover:text-blue-400"
                          }`}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp size={13} /> Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown size={13} /> Show more
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-3 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={15}
                        className={`mt-0.5 flex-shrink-0 ${
                          type === "received"
                            ? "text-emerald-400"
                            : "text-blue-400"
                        }`}
                      />
                      <div>
                        <p className="text-[11px] text-gray-500 mb-1 uppercase tracking-wide">
                          Full Message
                        </p>
                        <p className="text-sm text-gray-200 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {item.image && (
                      <div className="flex items-start gap-2">
                        <Eye
                          size={15}
                          className="text-blue-400 mt-0.5 flex-shrink-0"
                        />
                        <div className="w-full">
                          <p className="text-[11px] text-gray-500 mb-2 uppercase tracking-wide">
                            Attachment
                          </p>
                          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10">
                            <Image
                              src={item.image}
                              alt="Notification attachment"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Load More */}
          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full py-3 text-sm text-gray-500 hover:text-white border border-dashed border-white/10 hover:border-white/30 rounded-2xl transition-all duration-200"
            >
              Load {Math.min(5, history.length - visibleCount)} more · {history.length - visibleCount} remaining
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #968b79;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b8aa94;
        }
      `}</style>
    </div>
  );
};