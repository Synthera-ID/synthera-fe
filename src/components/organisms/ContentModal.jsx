"use client";

import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function ContentModal({ isOpen, onClose, onSave, content }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Tutorial",
    status: "Published",
    tier: "Free",
    thumbnail: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (content) {
      setFormData({
        ...content,
        thumbnail: content.thumbnail || null,
      });
      setPreview(content.thumbnail || null);
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Tutorial",
        status: "Published",
        tier: "Free",
        thumbnail: null,
      });
      setPreview(null);
    }
  }, [content, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSave(formData);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0D0D12] border border-[#1A1A24] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1A1A24]">
          <h2 className="text-xl font-bold text-white">{content ? "Edit Content" : "Add New Content"}</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 bg-[#13131A] border ${errors.title ? "border-red-500/50" : "border-[#1A1A24]"} rounded-xl text-sm text-white focus:outline-none focus:border-primary-1/50 transition-all`}
                  placeholder="e.g. Master React in 30 Days"
                />
                {errors.title && <p className="text-red-500 text-[11px] mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-3 bg-[#13131A] border ${errors.description ? "border-red-500/50" : "border-[#1A1A24]"} rounded-xl text-sm text-white focus:outline-none focus:border-primary-1/50 transition-all resize-none`}
                  placeholder="Tell us about this content..."
                />
                {errors.description && <p className="text-red-500 text-[11px] mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#13131A] border border-[#1A1A24] rounded-xl text-sm text-white focus:outline-none focus:border-primary-1/50 transition-all appearance-none cursor-pointer"
                  >
                    <option>Tutorial</option>
                    <option>Template</option>
                    <option>E-Book</option>
                    <option>Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Access Tier</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-4 py-3 bg-[#13131A] border border-[#1A1A24] rounded-xl text-sm text-white focus:outline-none focus:border-primary-1/50 transition-all appearance-none cursor-pointer"
                  >
                    <option>Free</option>
                    <option>Pro</option>
                    <option>Enterprise</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Side: Thumbnail */}
            <div className="flex flex-col">
              <label className="block text-[12px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Thumbnail</label>
              <div
                className="flex-1 min-h-[200px] border-2 border-dashed border-[#1A1A24] rounded-2xl flex flex-col items-center justify-center p-6 hover:border-primary-1/30 transition-all relative overflow-hidden group cursor-pointer"
                onClick={() => document.getElementById("thumb-input").click()}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center gap-2 text-white">
                      <Upload size={24} />
                      <span className="text-[12px] font-bold">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-[#6B7280]">
                    <div className="w-12 h-12 rounded-2xl bg-[#13131A] flex items-center justify-center">
                      <ImageIcon size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">Upload Thumbnail</p>
                      <p className="text-[11px]">JPG, PNG or WEBP (Max. 2MB)</p>
                    </div>
                  </div>
                )}
                <input id="thumb-input" type="file" hidden accept="image/*" onChange={handleImageChange} />
              </div>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 bg-[#13131A] border-t border-[#1A1A24] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-4 rounded-xl border border-[#1A1A24] text-[#9CA3AF] font-bold hover:bg-[#1A1A24] hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3.5 px-4 rounded-xl bg-primary-1 text-white font-bold hover:bg-primary-2 shadow-[0_8px_24px_rgba(139,92,246,0.25)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : "Save Content"}
          </button>
        </div>
      </div>
    </div>
  );
}
