'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare, Plus, Copy, Check, Search,
  Edit2, Trash2, X, RotateCcw
} from 'lucide-react';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const INITIAL_TEMPLATES = [
  {
    id: '1',
    title: 'Gym & Fitness [No Website]',
    category: 'Gym',
    content: `আসসালামু আলাইকুম [First Name],

আশা করি ভালো আছেন। আমি ByteWave International-এর পক্ষ থেকে যোগাযোগ করছি। গুগল ম্যাপসে আপনাদের প্রতিষ্ঠান [Business Name] দেখে খুব ভালো লাগল। আপনার জিমের জন্য কি একটি আধুনিক ওয়েবসাইট ও সদস্যপদ ব্যবস্থাপনা সফটওয়্যার প্রয়োজন?`,
  },
  {
    id: '2',
    title: 'Website Update [ Real Estate]',
    category: 'Real Estate',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আমি ByteWave International-এর পক্ষ থেকে যোগাযোগ করছি। আপনাদের রিয়েল এস্টেট ব্যবসার পরিধি দেখে খুব ভালো লাগল। আপনাদের ওয়েবসাইট আপডেট, ভার্চুয়াল প্রোপার্টি ট্যুর এবং নতুন ক্লায়েন্ট সংগ্রহের ব্যাপারে সাহায্য করতে পারি।`,
  },
  {
    id: '3',
    title: 'Restaurants & Cafes [No Website]',
    category: 'Restaurants',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আমি ByteWave International থেকে বলছি। গুগল ম্যাপসে আপনাদের রেস্টুরেন্ট [Business Name] দেখে খুব ভালো লাগল। আপনাদের জন্য একটি ডিজিটাল কিউআর মেনু ও ফুড অর্ডারিং ওয়েবসাইট তৈরি করতে পারি।`,
  },
  {
    id: '4',
    title: 'Mobile & Electronics Shop',
    category: 'Mobile Shop',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের মোবাইল শপ [Business Name] দেখে যোগাযোগ করছি। আপনাদের দোকানের নতুন স্টক, ওয়ারেন্টি সার্ভিস এবং ডিসকাউন্ট অফার কাস্টমারদের হোয়াটসঅ্যাপে অটোমেটিক জানানোর ব্যবস্থা করে দিচ্ছি।`,
  },
  {
    id: '5',
    title: 'Hotel & Resort Outreach',
    category: 'Hotels',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের হোটেল [Business Name] দেখে খুব ভালো লাগল। আপনাদের সরাসরি অনলাইন রুম বুকিং বৃদ্ধি ও গুগল 5-Star রিভিউ বাড়ানোর সমাধান আমাদের কাছে রয়েছে।`,
  },
  {
    id: '6',
    title: 'Diagnostic Center & Hospital',
    category: 'Healthcare',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আমি ByteWave International থেকে বলছি। ডায়াগনস্টিক সেন্টারের গুগল প্রোফাইল অপটিমাইজেশন ও অনলাইন পেশেন্ট এপয়েন্টমেন্ট সিস্টেম নিয়ে কথা বলতে চাই।`,
  },
  {
    id: '7',
    title: 'Jewelry & Luxury Store',
    category: 'Jewelry',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আমি ByteWave International থেকে বলছি। জুয়েলারি শপের ডিজিটাল ক্যাটালগ তৈরি এবং টার্গেটেড প্রিমিয়াম কাস্টমার রিচ বাড়ানোর জন্য সার্ভিস দিচ্ছি।`,
  },
  {
    id: '8',
    title: 'Clothing & Fashion Boutique',
    category: 'Fashion',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আমি ByteWave International থেকে বলছি। আপনাদের ফ্যাশন ব্র্যান্ডের জন্য সোশাল মিডিয়া সেলস বুস্টিং ও ই-কমার্স ওয়েবসাইট তৈরির বিশেষ অফার শেয়ার করতে চাই।`,
  },
  {
    id: '9',
    title: 'Software & IT Services',
    category: 'Software & IT',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আমি ByteWave International থেকে বলছি। আপনাদের আইটি ও সফটওয়্যার কোম্পানির জন্য বিটুবি কোয়ালিফাইড লিড জেনারেশন ও ক্লায়েন্ট অ্যাকুইজিশন টুল নিয়ে কাজ করছি।`,
  },
  {
    id: '10',
    title: 'Schools & Coaching Centers',
    category: 'Education',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের শিক্ষা প্রতিষ্ঠান [Business Name] দেখে যোগাযোগ করছি। আপনাদের অ্যাডমিশন প্রচার, ডিজিটাল উপস্থিতি এবং ডিজিটাল স্টুডেন্ট পোর্টাল নিয়ে সাহায্য করতে পারি।`,
  },
  {
    id: '11',
    title: 'Pharmacy & Healthcare',
    category: 'Pharmacy',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের ফার্মেসী [Business Name] দেখে খুব ভালো লাগল। আপনাদের ঔষধের দোকান ও হেলথকেয়ার সার্ভিসের জন্য মেম্বারশিপ এবং কাস্টমার লয়ালটি প্ল্যাটফর্ম সার্ভিস দিচ্ছি।`,
  },
  {
    id: '12',
    title: 'Beauty Parlor & Salons',
    category: 'Beauty & Salon',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের বিউটি পার্লার [Business Name] দেখে যোগাযোগ করছি। আপনাদের কাস্টমারদের অনলাইন বুকিং এবং ফেস্টিভ অফার প্রচারের জন্য হোয়াটসঅ্যাপ বুস্টিং সার্ভিস দিচ্ছি।`,
  },
  {
    id: '13',
    title: 'Automobile & Repair Workshops',
    category: 'Automobile',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের অটো গ্যারেজ/ওয়ার্কশপ [Business Name] দেখে কথা বলছি। গাড়ি সার্ভিসিং এর নিয়মিত রিমাইন্ডার এবং নতুন কাস্টমার লিড পাওয়ার জন্য আমাদের কাছে কাস্টম সল্যুশন আছে।`,
  },
  {
    id: '14',
    title: 'Dental Clinics & Doctors',
    category: 'Dental & Medical',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের ডেন্টাল ক্লিনিক [Business Name] দেখে কথা বলছি। রোগীদের সিরিয়াল বুকিং ও রেগুলার চেকাপ রিমাইন্ডার পাঠানোর জন্য কাস্টম সমাধান দিচ্ছি।`,
  },
  {
    id: '15',
    title: 'Law Firms & Consultants',
    category: 'Legal & Advisory',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আপনাদের ল ফার্ম/কনসালটেন্সি ফার্ম [Business Name] এর অনলাইন প্রেজেন্স এবং কর্পোরেট ক্লায়েন্ট লিড জেনারেশন নিয়ে সাহায্য করতে চাই।`,
  },
  {
    id: '16',
    title: 'Interior Design & Architecture',
    category: 'Interior & Construction',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের ইন্টেরিয়র ডিজাইন ফার্ম [Business Name] দেখে যোগাযোগ করছি। আপনাদের পোর্টফোলিও শোকেস এবং প্রিমিয়াম ক্লায়েন্ট এনগেজমেন্ট বাড়ানোর সার্ভিস দিচ্ছি।`,
  },
  {
    id: '17',
    title: 'Event Management & Catering',
    category: 'Event & Wedding',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আপনাদের ইভেন্ট ম্যানেজমেন্ট এন্টেরপ্রাইজ [Business Name] এর ডিজিটাল মার্কেটিং ও ওয়েডিং ইভেন্ট বুকিং বুস্টিং নিয়ে কথা বলতে চাই।`,
  },
  {
    id: '18',
    title: 'Photography & Studio',
    category: 'Photography',
    content: `আসসালামু আলাইকুম,

আশা করি ভালো আছেন। আপনাদের ফটোগ্রাফি স্টুডিও [Business Name] এর কাজের পোর্টফোলিও ওয়েবসাইট এবং সোশ্যাল মিডিয়া লিড জেনারেশন সার্ভিস শেয়ার করতে চাই।`,
  },
];

export default function WhatsAppTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'General', content: '' });
  const [deleteId, setDeleteId] = useState(null);

  // Load templates from localStorage or fallback to defaults
  useEffect(() => {
    const saved = localStorage.getItem('wa_templates_v2');
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch {
        setTemplates(INITIAL_TEMPLATES);
      }
    } else {
      setTemplates(INITIAL_TEMPLATES);
      localStorage.setItem('wa_templates_v2', JSON.stringify(INITIAL_TEMPLATES));
    }
  }, []);

  const saveTemplatesToStorage = (updated) => {
    setTemplates(updated);
    localStorage.setItem('wa_templates_v2', JSON.stringify(updated));
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all WhatsApp templates to factory defaults?')) {
      saveTemplatesToStorage(INITIAL_TEMPLATES);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData({ title: '', category: 'General', content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (tmpl) => {
    setEditingTemplate(tmpl);
    setFormData({ title: tmpl.title, category: tmpl.category || 'General', content: tmpl.content });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingTemplate) {
      // Update ANY template (both system and custom)
      const updated = templates.map((t) =>
        t.id === editingTemplate.id
          ? { ...t, title: formData.title, category: formData.category, content: formData.content }
          : t
      );
      saveTemplatesToStorage(updated);
    } else {
      // Create new custom template
      const newTmpl = {
        id: `template_${Date.now()}`,
        title: formData.title,
        category: formData.category,
        content: formData.content,
      };
      saveTemplatesToStorage([newTmpl, ...templates]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const updated = templates.filter((t) => t.id !== deleteId);
    saveTemplatesToStorage(updated);
    setDeleteId(null);
  };

  const insertVariable = (varName) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + ` [${varName}]`,
    }));
  };

  // Extract all categories dynamically
  const categories = ['All', ...new Set(templates.map((t) => t.category || 'General'))];

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 text-slate-800">
      {/* ─── Header Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              WhatsApp Templates
            </h1>
            <span className="bg-emerald-100/90 text-emerald-700 border border-emerald-200 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
              <MessageSquare className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              SYSTEM & CUSTOM
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Create, edit, and manage custom WhatsApp message templates for all business categories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all border border-slate-200 cursor-pointer"
            title="Reset all templates to initial defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-white stroke-[3]" />
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {/* ─── Filter & Search Bar ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          {/* Search Box */}
          <div className="flex-1 flex items-center gap-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-3.5 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by title, category, or message content..."
              className="w-full bg-transparent text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-bold shadow-2xs'
                  : 'bg-[#F8FAFC] text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Template Cards Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tmpl) => {
          const isCopied = copiedId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all group relative"
            >
              <div className="space-y-3">
                {/* Title & Action Buttons Header */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                    {tmpl.title}
                  </h3>

                  {/* EDIT & DELETE BUTTONS ON ALL TEMPLATES */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(tmpl)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Template"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500 hover:text-indigo-600" />
                    </button>
                    <button
                      onClick={() => setDeleteId(tmpl.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Template"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
                    </button>
                  </div>
                </div>

                {/* Message Body Container */}
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-4 text-xs text-slate-600 leading-relaxed font-normal min-h-[110px] whitespace-pre-line overflow-hidden max-h-[160px] relative">
                  {tmpl.content}
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md border border-slate-200/60">
                  {tmpl.category || 'General'}
                </span>

                <button
                  onClick={() => handleCopy(tmpl.id, tmpl.content)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">No WhatsApp templates found</p>
          <p className="text-[11px] text-slate-400">Try adjusting your search query or creating a new template</p>
        </div>
      )}

      {/* ─── Create / Edit Template Modal ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>{editingTemplate ? 'Edit WhatsApp Template' : 'Create WhatsApp Template'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Gym Outreach or Hotel Special Offer"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Tag *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Gym, Real Estate, Restaurants, Mobile Shop, Education"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Template Message Body (Bengali/English) *
                  </label>
                </div>
                <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">Insert Tags:</span>
                  {['Business Name', 'First Name', 'Phone', 'City'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertVariable(tag)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer shrink-0"
                    >
                      + [{tag}]
                    </button>
                  ))}
                </div>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="আসসালামু আলাইকুম, আশা করি ভালো আছেন..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-xs font-normal text-slate-900 rounded-xl p-3.5 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  {editingTemplate ? 'Save Changes' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Dialog ─────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete WhatsApp Template?"
        description="Are you sure you want to delete this template? You can restore factory defaults anytime using the Reset button."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
