import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Image, RefreshCw, Filter } from "lucide-react";

const _UNUSED = [
  { name: "Home Hero Background", category: "Hero", used_in: "pages/Home — HeroSection", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/25859f12a_01_332_home-hero-bg_1920x1080.jpg" },
  { name: "Home Coffee Works Background", category: "Background", used_in: "pages/Home — CTABanner", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/39eba63bf_10_491_home-coffee-that-works-bg_1920x1080.jpg" },
  { name: "Our Story Hero Background", category: "Hero", used_in: "pages/OurStory — Hero", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/831e204d2_02_202_our-story-hero-bg_1920x1080.jpg" },
  { name: "Our Story Family Tradition", category: "Story", used_in: "pages/OurStory — Family Tradition section", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/ed2863763_03_418_our-story-family-tradition_1200x800.jpg" },
  { name: "Our Story Small Batch Icon", category: "Story", used_in: "pages/OurStory — Small Batch icon", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/fed049da6_04_200_our-story-small-batch-icon_1000x1000.jpg" },
  { name: "Our Story Air Cooling Icon", category: "Story", used_in: "pages/OurStory — Air Cooling icon", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/caaed3ebe_05_218_our-story-air-cooling-icon_1000x1000.jpg" },
  { name: "Our Story Balanced Profiles Icon", category: "Story", used_in: "pages/OurStory — Balanced Profiles icon", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/d013fd804_06_361_our-story-balanced-profiles-icon_1000x1000.jpg" },
  { name: "Products Hero Background", category: "Hero", used_in: "pages/Products — Hero", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/5d86bb91b_07_457_products-hero-bg_1920x1080.jpg" },
  { name: "Connect / Request Sample Hero", category: "Hero", used_in: "pages/Connect — Hero", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/365864440_connect_top_background_1920x1080_v2.jpg" },
  { name: "Sample Request Confirmation Background", category: "Banner", used_in: "pages/Connect — Confirmation screen", original_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ca7a4061ebed2270e358d1/bb1d67bf1_09_464_sample-request-confirmation-bg_1920x1080.jpg" },
];

const CATEGORY_COLORS = {
  Hero: "bg-blue-100 text-blue-800",
  Background: "bg-purple-100 text-purple-800",
  Product: "bg-amber-100 text-amber-800",
  Story: "bg-green-100 text-green-800",
  Banner: "bg-rose-100 text-rose-800",
  Other: "bg-gray-100 text-gray-800",
};

export default function PhotoGalleryPage() {
  const [records, setRecords] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const galleryRecords = await base44.entities.PhotoGallery.list();
    setRecords(galleryRecords);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDownload = async (url, name) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name.replace(/\s+/g, "-").toLowerCase() + ".jpg";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    filtered.forEach((rec, i) => {
      setTimeout(() => handleDownload(rec.stored_url || rec.original_url, rec.name), i * 400);
    });
  };

  const categories = ["All", ...Array.from(new Set(records.map(r => r.category)))];

  const filtered = activeFilter === "All"
    ? records
    : records.filter(r => r.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
            <p className="text-gray-500 mt-1">All image assets used across the website</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={loadData}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            {filtered.length > 0 && (
              <Button
                onClick={handleDownloadAll}
                className="bg-[#704214] hover:bg-[#201e20] text-white gap-2"
              >
                <Download className="w-4 h-4" />
                Download All ({filtered.length})
              </Button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        {records.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Filter className="w-4 h-4 text-gray-400 self-center" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === cat
                    ? "bg-[#704214] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
                {cat === "All" ? ` (${records.length})` : ` (${records.filter(r => r.category === cat).length})`}
              </button>
            ))}
          </div>
        )}

        {/* Loading / empty state */}
        {loading && (
          <div className="text-center py-24">
            <RefreshCw className="w-8 h-8 text-gray-300 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading gallery…</p>
          </div>
        )}
        {!loading && records.length === 0 && (
          <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No images found.</p>
          </div>
        )}

        {/* Gallery Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(rec => (
              <div key={rec.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={rec.stored_url || rec.original_url}
                    alt={rec.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{rec.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${CATEGORY_COLORS[rec.category] || CATEGORY_COLORS.Other}`}>
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-snug flex-1">{rec.used_in}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 mt-1 text-xs"
                    onClick={() => handleDownload(rec.stored_url || rec.original_url, rec.name)}
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}