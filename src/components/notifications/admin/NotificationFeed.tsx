"use client";

import { useState } from "react";
import { Mail, Calendar, X } from "lucide-react";
import Image from "next/image";

interface Recipient {
  id: number;
  name: string;
  role: string;
}

interface NotificationFeedItem {
  id: number;
  recipients: Recipient[];
  message: string;
  image?: string | null;
  date: string;
}

interface NotificationFeedProps {
  history: NotificationFeedItem[];
  title?: string;
  subTitle?: string;recipients
}

export const NotificationFeed = ({
  history,
  title = "Recent Notifications",
  subTitle = "Sent notification history",
}: NotificationFeedProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <>
      <div className="bg-[#0A0A0A] h-full border border-[#968B79]/60 rounded-[2rem] p-5 md:p-8 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="mb-6 shrink-0">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-gray-500 text-xs">{subTitle}</p>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar">
          {history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-[#111] border border-[#968B79]/60 rounded-2xl p-4 hover:border-gray-600 transition-all"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* RECIPIENTS */}
                    <div className="flex flex-wrap gap-2">
                      {item.recipients?.slice(0, 3).map((r) => (
                        <span
                          key={r.id}
                          className="text-xs bg-white/10 px-2 py-1 rounded-md text-white"
                        >
                          {r.name}
                        </span>
                      ))}

                      {item.recipients?.length > 3 && (
                        <button
                          onClick={() =>
                            setExpanded(
                              expanded === item.id ? null : item.id,
                            )
                          }
                          className="text-xs text-gray-400"
                        >
                          +{item.recipients?.length - 3} more
                        </button>
                      )}
                    </div>

                    {/* EXPANDED RECIPIENTS */}
                    {expanded === item.id && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.recipients.map((r) => (
                          <span
                            key={r.id}
                            className="text-[10px] px-2 py-1 bg-black border border-gray-700 rounded"
                          >
                            {r.name} • {r.role}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* MESSAGE */}
                    <p className="text-gray-400 text-xs italic">
                      {item.message}
                    </p>
                  </div>

                  {/* IMAGE */}
                  {item.image && (
                    <div
                      onClick={() => setPreviewImage(item.image || null)}
                      className="w-20 h-20 rounded-lg overflow-hidden border border-gray-700 cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt="notification"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>

                {/* DATE */}
                <div className="flex items-center gap-2 text-gray-500 text-[10px] mt-3">
                  <Calendar size={12} />
                  {item.date}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-10">
              No notifications found.
            </div>
          )}
        </div>
      </div>

      {/* IMAGE MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white bg-white/10 p-2 rounded-full"
          >
            <X size={20} />
          </button>

          <Image
            src={previewImage}
            alt="preview"
            width={800}
            height={800}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}
    </>
  );
};