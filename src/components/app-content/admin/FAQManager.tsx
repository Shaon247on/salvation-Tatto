/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { FAQ } from "@/redux/services/admin/appContent/appContentApi";

interface FAQManagerProps {
  faqs: FAQ[];
  onCreateFAQ: (data: { question: string; answer: string }) => Promise<any>;
  onUpdateFAQ: (data: {
    id: number;
    data: { question: string; answer: string };
  }) => Promise<any>;
  onDeleteFAQ: (id: number) => Promise<any>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onRefresh: () => void;
}

export const FAQManager = ({
  faqs,
  onCreateFAQ,
  onUpdateFAQ,
  onDeleteFAQ,
  isCreating,
  isUpdating,
  isDeleting,
  onRefresh,
}: FAQManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle Create FAQ
  const handleCreateFAQ = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError("Question and answer are required");
      return;
    }

    try {
      setError(null);
      await onCreateFAQ({
        question: formData.question,
        answer: formData.answer,
      });
      setSuccess("FAQ created successfully!");
      setFormData({ question: "", answer: "" });
      setIsAdding(false);
      onRefresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.data?.detail || "Failed to create FAQ");
    }
  };

  // Handle Update FAQ
  const handleUpdateFAQ = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError("Question and answer are required");
      return;
    }

    try {
      setError(null);
      await onUpdateFAQ({
        id: editingId!,
        data: {
          question: formData.question,
          answer: formData.answer,
        },
      });
      setSuccess("FAQ updated successfully!");
      setFormData({ question: "", answer: "" });
      setEditingId(null);
      onRefresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.data?.detail || "Failed to update FAQ");
    }
  };

  // Handle Delete FAQ
  const handleDeleteFAQ = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      setError(null);
      await onDeleteFAQ(id);
      setSuccess("FAQ deleted successfully!");
      onRefresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.data?.detail || "Failed to delete FAQ");
    }
  };

  // Handle Edit Click
  const handleEditClick = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData({ question: faq.question, answer: faq.answer });
    setIsAdding(false);
  };

  // Handle Cancel
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ question: "", answer: "" });
    setError(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-[#968B79]/60 rounded-2xl p-4 flex gap-3 items-start">
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex gap-3 items-start">
          <div className="w-4 h-4 rounded-full bg-emerald-500 mt-1 shrink-0" />
          <p className="text-emerald-400 text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Add/Edit Button */}
      <div className="flex justify-end">
        {!isAdding && editingId === null && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-2xl font-bold hover:bg-gray-200 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCreating || isUpdating || isDeleting}
          >
            <Plus size={18} /> Add FAQ
          </button>
        )}
      </div>

      {/* Add/Edit FAQ Form */}
      {(isAdding || editingId !== null) && (
        <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-white font-bold">
            {isAdding ? "Add New FAQ" : "Edit FAQ"}
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                Question
              </label>
              <input
                type="text"
                placeholder="Enter FAQ question"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="w-full bg-black border border-[#968B79]/60 rounded-xl p-4 text-sm text-white focus:border-[#404040] outline-none"
                disabled={isCreating || isUpdating}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">
                Answer
              </label>
              <textarea
                placeholder="Enter FAQ answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                className="w-full bg-black border border-[#968B79]/60 rounded-xl p-4 text-sm text-white min-h-30 resize-none outline-none focus:border-[#404040]"
                disabled={isCreating || isUpdating}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={isAdding ? handleCreateFAQ : handleUpdateFAQ}
              disabled={isCreating || isUpdating}
              className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreating || isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  {isAdding ? "Saving..." : "Updating..."}
                </>
              ) : isAdding ? (
                "Save FAQ"
              ) : (
                "Update FAQ"
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isCreating || isUpdating}
              className="bg-black border border-[#968B79]/60 text-gray-500 px-8 py-3 rounded-xl font-bold hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-8 text-center">
            <p className="text-gray-500 text-sm">
              No FAQs yet. Create one to get started!
            </p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-[#0A0A0A] border border-[#968B79]/60 rounded-3xl p-8 group hover:border-[#404040] transition-all opacity-100"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <h4 className="text-white font-bold text-base">
                    {faq.question}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-3xl italic">
                    {faq.answer}
                  </p>
                  <p className="text-gray-700 text-xs mt-3">
                    Created: {new Date(faq.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(faq)}
                    disabled={isUpdating || isDeleting}
                    className="p-2 text-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    disabled={isDeleting}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
