"use client";

import {
  Bell,
  ChevronDown,
  ChevronUp,
  X,
  Clock,
  InboxIcon,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { ReceivedNotificationItem } from "@/redux/services/admin/notification/notificationsApi";

interface Props {
  notifications: ReceivedNotificationItem[];
}

const ROLE_LABEL: Record<string, string> = {
  branch_manager: "Branch Manager",
  admin: "Admin",
  tattoo_artist: "Tattoo Artist",
};

function formatRole(role: string) {
  return ROLE_LABEL[role] ?? role.replace(/_/g, " ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function ReceivedNotificationFeed({ notifications }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const displayed = notifications.slice(0, visibleCount);
  const hasMore = visibleCount < notifications.length;

  return (
    <>
      <div className="bg-[#0A0A0A] border border-[#968B79]/40 rounded-3xl p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Bell size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Received Notifications</h3>
              <p className="text-gray-500 text-xs">Inbox activity</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
            {notifications.length} {notifications.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <InboxIcon size={20} className="text-gray-500" />
            </div>
            <p className="text-gray-500 text-sm">No received notifications</p>
          </div>
        )}

        {/* List */}
        {notifications.length > 0 && (
          <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1 custom-scrollbar">
            {displayed.map((item) => {
              const isExpanded = expandedId === item.id;
              const { date, time } = formatDate(item.created_at);
              const isLong = item.message.length > 120;

              return (
                <div
                  key={item.id}
                  className="bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/20 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {getInitials(item.sender_name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Sender + time */}
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-white font-semibold text-sm">
                                {item.sender_name}
                              </span>
                              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                Received
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <ShieldCheck size={11} className="text-gray-500" />
                              <span className="text-xs text-gray-500 capitalize">
                                {formatRole(item.sender_role)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
                            <Clock size={11} />
                            <span>{date}</span>
                            <span className="text-gray-700">·</span>
                            <span>{time}</span>
                          </div>
                        </div>

                        {/* Message */}
                        <p
                          className={`text-sm text-gray-300 mt-2.5 leading-relaxed ${
                            !isExpanded && isLong ? "line-clamp-2" : ""
                          }`}
                        >
                          {item.message}
                        </p>

                        {/* Image thumbnail */}
                        {item.image && (
                          <button
                            onClick={() => setLightboxSrc(item.image)}
                            className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-white/10 hover:border-emerald-500/30 transition-all group block"
                          >
                            <Image
                              src={item.image}
                              alt="Attachment"
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <span className="text-xs text-white/70 group-hover:text-white bg-black/40 px-3 py-1 rounded-full transition-colors">
                                Click to enlarge
                              </span>
                            </div>
                          </button>
                        )}

                        {/* Toggle */}
                        {isLong && (
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : item.id)
                            }
                            className="mt-2 flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
                          >
                            {isExpanded ? (
                              <><ChevronUp size={13} /> Show less</>
                            ) : (
                              <><ChevronDown size={13} /> Show more</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <button
                onClick={() => setVisibleCount((p) => Math.min(p + 5, notifications.length))}
                className="w-full py-3 text-sm text-gray-500 hover:text-white border border-dashed border-white/10 hover:border-white/30 rounded-2xl transition-all"
              >
                Load more · {notifications.length - visibleCount} remaining
              </button>
            )}
          </div>
        )}

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #968b79; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #b8aa94; }
        `}</style>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt="Full size attachment"
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </>
  );
}