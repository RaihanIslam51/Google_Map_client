'use client';

import { useState, useEffect } from 'react';
import {
  Mail, Plus, Copy, Check, Search,
  Edit2, Trash2, X, RotateCcw
} from 'lucide-react';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const INITIAL_EMAIL_TEMPLATES = [
  {
    id: '1',
    title: 'Gym & Fitness [No Website]',
    category: 'Gym',
    subject: 'আধুনিক ওয়েবসাইট ও ডিজিটাল মেম্বারশিপ পোর্টাল প্রস্তাবনা — [Business Name]',
    content: `প্রিয় প্রতিষ্ঠাতা/পরিচালক,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের প্রতিষ্ঠান [Business Name] দেখে যোগাযোগ করছি।

আমরা ByteWave International থেকে ব্র্যান্ডেড জিম ও ফিটনেস সেন্টারের জন্য কাস্টম ওয়েবসাইট, অনলাইন মেম্বারশিপ বুকিং এবং ক্লায়েন্ট ম্যানেজমেন্ট সল্যুশন প্রদান করে থাকি।

আপনার প্রতিষ্ঠানের জন্য একটি ফ্রি ডেমো দেখতে চাইলে উত্তর দিন।

ধন্যবাদান্তে,
ByteWave Team`,
  },
  {
    id: '2',
    title: 'Real Estate & Properties',
    category: 'Real Estate',
    subject: 'প্রিমিয়াম ক্লায়েন্ট লিড ও ওয়েবসাইট ডিজিটাল সমাধান — [Business Name]',
    content: `প্রিয় [Owner Name],

আসসালামু আলাইকুম। আপনাদের প্রোপার্টি ও রিয়েল এস্টেট প্রজেক্ট [Business Name] এর সমৃদ্ধি দেখে খুব আনন্দিত হলাম।

আমরা উচ্চমানসম্পন্ন রিয়েল এস্টেট ক্লায়েন্ট লিড জেনারেশন, প্রোপার্টি পোর্টাল এবং ভার্চুয়াল ট্যুর ইন্টারফেস তৈরিতে সহায়তা করে থাকি।

আপনাদের সেলস বৃদ্ধি নিয়ে কথা বলতে একটি সংক্ষিপ্ত আলোচনা শিডিউল করতে পারেন।

আন্তরিক শুভেচ্ছা,
ByteWave International`,
  },
  {
    id: '3',
    title: 'Restaurants & Cafes [No Website]',
    category: 'Restaurants',
    subject: 'ডিজিটাল কিউআর মেনু ও অনলাইন ফুড অর্ডারিং সিস্টেম — [Business Name]',
    content: `প্রিয় রেস্টুরেন্ট টিম,

আশা করি সবাই সুস্থ আছেন। গুগল ম্যাপসে আপনাদের জনপ্রিয় রেস্টুরেন্ট [Business Name] এর সুনাম দেখে প্রস্তাবটি পাঠাচ্ছি।

আমরা রেস্টুরেন্টগুলোর জন্য ইনস্ট্যান্ট QR কোড কন্ট্যাক্টলেস মেনু, ডিরেক্ট ওয়েবসাইট ফুড অর্ডার এবং টেক-অ্যাওয়ে ম্যানেজমেন্ট সার্ভিস দিচ্ছি।

আপনার রেস্টুরেন্টের জন্য ডিজিটাল মেনু ডেমো দেখতে আমায় জানাবেন।

শুভকামনায়,
ByteWave Tech`,
  },
  {
    id: '4',
    title: 'Mobile & Electronics Shop',
    category: 'Mobile Shop',
    subject: 'কাস্টমার সেলস ও প্রোডাক্ট স্টক অটোমেশন প্রস্তাবনা — [Business Name]',
    content: `প্রিয় ম্যানেজার/মালিক,

আশা করি ভালো আছেন। [City] এলাকার সেরা ইলেকট্রনিক্স ও মোবাইল শপ হিসেবে আপনাদের [Business Name] কে চিহ্নিত করেছি।

আপনার দোকানের নতুন প্রোডাক্ট স্টক, অফার নোটিফিকেশন ও অনলাইন ওয়ারেন্টি ট্র্যাকিং ইমেইল/মেসেজিং অটোমেশনের মাধ্যমে সহজ করার সমাধান রয়েছে আমাদের কাছে।

বিস্তারিত আলোচনার জন্য যোগাযোগ করুন।

ধন্যবাদ,
ByteWave Solutions`,
  },
  {
    id: '5',
    title: 'Hotel & Resort Outreach',
    category: 'Hotels',
    subject: 'সরাসরি ডিরেক্ট বুকিং বৃদ্ধি ও গুগল রিভিউ সার্ভিস — [Business Name]',
    content: `প্রিয় হোটেল কতৃপক্ষ,

আসসালামু আলাইকুম। গুগল ম্যাপসে আপনাদের হোটেল/রিসোর্ট [Business Name] এর ইতিবাচক রিভিউ দেখে মুগ্ধ হলাম।

থার্ড-পার্টি কমিশন ছাড়াই ওয়েবসাইট থেকে সরাসরি রুম বুকিং এবং ৫-স্টার রিভিউ বাড়ানোর জন্য আমাদের কাছে বিশেষ হোটেল ওটিএ স্ট্র্যাটেজি আছে।

আপনার সুবিধাজনক সময়ে সংক্ষিপ্ত জুম কল/ইমেইল আলোচনার জন্য প্রস্তুত আছি।

ধন্যবাদান্তে,
ByteWave Hospitality Solutions`,
  },
  {
    id: '6',
    title: 'Diagnostic Center & Hospital',
    category: 'Healthcare',
    subject: 'অনলাইন পেশেন্ট এপয়েন্টমেন্ট ও গুগল ভিজিবিলিটি — [Business Name]',
    content: `প্রিয় হাসপাতাল পরিচালক/ম্যানেজমেন্ট,

আশা করি ভালো আছেন। [City] এলাকায় আপনাদের ডায়াগনস্টিক সেন্টার/হাসপাতাল [Business Name] এর চিকিৎসা সেবার সুনাম শুনেছি।

রোগীদের সহজে ডাক্তার ও টেস্টের সিরিয়াল বুকিং এবং ডিজিটাল প্রেসক্রিপশন পোর্টাল তৈরির ব্যাপারে আমরা বিশেষ হেলথকেয়ার সফটওয়্যার সেবা দিচ্ছি।

কাস্টম ডেমো দেখার ইচ্ছুক হলে রিপ্লাই দিন।

শ্রদ্ধাসহ,
ByteWave Medical Tech`,
  },
  {
    id: '7',
    title: 'Jewelry & Luxury Store',
    category: 'Jewelry',
    subject: 'ডিজিটাল জুয়েলারী ক্যাটালগ ও প্রিমিয়াম ক্লায়েন্ট রিচ — [Business Name]',
    content: `প্রিয় জুয়েলারী ওনার,

আসসালামু আলাইকুম। আপনাদের জুয়েলারী শপ [Business Name] এর প্রিমিয়াম কালেকশন সোশ্যাল ও ডিজিটালি আরও বড় পরিসরে পৌঁছানোর সুযোগ রয়েছে।

আমরা এআই জুয়েলারী ক্যাটালগ এবং হাই-নেট-ওয়ার্থ কাস্টমার রিচ করার মতো ডিজিটাল প্রেজেন্স তৈরি করি।

একটি সংক্ষিপ্ত প্রস্তাবনা পাঠানোর অনুমতি চাচ্ছি।

ধন্যবাদ,
ByteWave Marketing`,
  },
  {
    id: '8',
    title: 'Clothing & Fashion Boutique',
    category: 'Fashion',
    subject: 'ই-কমার্স ইকোসিস্টেম ও ব্র‍্যান্ড গ্রোথ সল্যুশন — [Business Name]',
    content: `প্রিয় ফ্যাশন উদ্যোক্তা,

আশা করি ভালো আছেন। আপনাদের ক্লোথিং ও ফ্যাশন ব্র‍্যান্ড [Business Name] এর অসাধারণ কালেকশন আমরা লক্ষ্য করেছি।

আপনার ব্র‍্যান্ডের জন্য আধুনিক ই-কমার্স শপ ও অনলাইন অ্যাড বুস্টিং ক্যাম্পেইন রান করার সুবিধা দিচ্ছি।

ই-কমার্স ডেমো দেখতে এখনই রিপ্লাই দিতে পারেন।

শুভকামনায়,
ByteWave E-Commerce`,
  },
  {
    id: '9',
    title: 'Software & IT Services',
    category: 'Software & IT',
    subject: 'B2B Qualified Lead Generation & Tech Partnership for [Business Name]',
    content: `Dear Management Team,

Greetings from ByteWave International.

We came across [Business Name] while identifying top IT companies in [City]. We specialize in B2B qualified lead generation and client outreach automation for software firms.

Would you be open to a 10-minute quick discovery call to explore targeted lead partnerships?

Best regards,
ByteWave Enterprise Sales`,
  },
  {
    id: '10',
    title: 'Schools & Coaching Centers',
    category: 'Education',
    subject: 'ডিজিটাল অ্যাডমিশন ক্যাম্পেইন ও স্টুডেন্ট পোর্টাল — [Business Name]',
    content: `প্রিয় পরিচালক/অধ্যক্ষ,

আসসালামু আলাইকুম। আপনাদের স্বনামধন্য শিক্ষা প্রতিষ্ঠান [Business Name] এর শিক্ষার্থী ভর্তি ও সাফল্য আমাদের দৃষ্টি আকর্ষণ করেছে।

ভর্তি মৌসুমে নতুন স্টুডেন্ট রিচ বাড়ানো, অনলাইন অ্যাডমিশন ও ডিজিটাল রেজাল্ট সিস্টেম তৈরিতে আমরা বিশ্বস্ত প্ল্যাটফর্ম হিসেবে কাজ করছি।

প্রতিষ্ঠানের জন্য কাস্টম প্রপোজাল দেখতে যোগাযোগ করুন।

ধন্যবাদান্তে,
ByteWave EduTech`,
  },
  {
    id: '11',
    title: 'Pharmacy & Healthcare',
    category: 'Pharmacy',
    subject: 'অনলাইন মেডিসিন ডেলিভারি ও ফার্মেসী ম্যানেজমেন্ট — [Business Name]',
    content: `প্রিয় ফার্মেসী ওনার,

আশা করি ভালো আছেন। আপনাদের ফার্মেসী [Business Name] এর ওষুধ ইনভেন্টরি ও কাস্টমার রিটেনশন বৃদ্ধিতে ডিজিটাল ব্যবস্থা গ্রহণ করার প্রস্তাব জানাচ্ছি।

আপনার নিয়মিত কাস্টমারদের জন্য অনলাইন মেডিসিন রিফিল নোটিফিকেশন ও কাস্টম ক্যাটালগ সিস্টেম সুবিধা রয়েছে।

বিস্তারিত জানতে আমাদের মেসেজ পাঠান।

ধন্যবাদ,
ByteWave Health`,
  },
  {
    id: '12',
    title: 'Beauty Parlor & Salons',
    category: 'Beauty & Salon',
    subject: 'অনলাইন পার্লার সলুশন ও ফেস্টিভ কাস্টমার অফার — [Business Name]',
    content: `প্রিয় বিউটি এক্সপার্ট,

আসসালামু আলাইকুম। আপনারা [Business Name] এ যেভাবে বিউটি সার্ভিস দিচ্ছেন তা সত্যিই প্রশংসনীয়।

কাস্টমারদের জন্য সহজ অনলাইন টাইম-স্লট বুকিং ওয়েবসাইট এবং প্রমোশনাল কুপন নোটিফিকেশনের সার্ভিস অফার করছি।

আপনার পার্লারের জন্য ডেমো দেখতে আমাদের সাথেই থাকুন।

শুভেচ্ছান্তে,
ByteWave Beauty Tech`,
  },
  {
    id: '13',
    title: 'Automobile & Repair Workshops',
    category: 'Automobile',
    subject: 'গাড়ি সার্ভিসিং রিমাইন্ডার ও নতুন ক্লায়েন্ট অ্যাকুইজিশন — [Business Name]',
    content: `প্রিয় সার্ভিস ম্যানেজার,

আশা করি ভালো আছেন। গুগল ম্যাপসে আপনাদের অটোগ্যারেজ/ওয়ার্কশপ [Business Name] কে শীর্ষ রেটিং প্রাপ্ত প্রতিষ্ঠান হিসেবে দেখেছি।

নিয়মিত ক্লায়েন্টদের পিরিওডিক কার সার্ভিসিং রিমাইন্ডার পাঠানোর অটোমেটিক সার্ভিস সিস্টেমের ডেমো আপনাদের সাথে শেয়ার করতে চাই।

আগ্রহী হলে রিপ্লাই দিয়ে নিশ্চিত করুন।

ধন্যবাদ,
ByteWave AutoTech`,
  },
  {
    id: '14',
    title: 'Dental Clinics & Doctors',
    category: 'Dental & Medical',
    subject: 'রোগীদের অ্যাপয়েন্টমেন্ট ও অটোমেটেড চেকাপ রিমাইন্ডার — [Business Name]',
    content: `শ্রদ্ধেয় ডক্টর/ক্লিনিক কতৃপক্ষ,

আসসালামু আলাইকুম। গুগল ম্যাপসে আপনাদের ডেন্টাল ক্লিনিক [Business Name] এর চিকিৎসা সেবার সুনাম দেখে প্রস্তাবনাটি পাঠাচ্ছি।

রোগীদের বুকিং প্রসেস সহজ করা এবং ফলো-আপ অ্যাপয়েন্টমেন্ট অনুস্মারক পাঠানোর জন্য ডিজিটাল ক্লিনিক ম্যানেজমেন্ট সলিউশন দিচ্ছি।

ফ্রি ডেমোর জন্য আমায় ইমেইল পাঠান।

শ্রদ্ধাসহ,
ByteWave Dental Systems`,
  },
  {
    id: '15',
    title: 'Law Firms & Consultants',
    category: 'Legal & Advisory',
    subject: 'Corporate Client Acquisition & Advisory Proposal for [Business Name]',
    content: `Dear Legal Team / Partners,

Greetings from ByteWave International.

We respect the corporate legal services provided by [Business Name]. We assist leading law and advisory firms in building authoritative digital brand assets and targeted corporate inquiry pipelines.

We would welcome the opportunity to share a tailored digital consultation.

Sincerely,
ByteWave Legal Solutions`,
  },
  {
    id: '16',
    title: 'Interior Design & Architecture',
    category: 'Interior & Construction',
    subject: 'ডিজিটাল পোর্টফোলিও শোকেস ও প্রিমিয়াম ইন্টেরিয়র ক্লায়েন্ট লিড — [Business Name]',
    content: `প্রিয় চিফ আর্কিটেক্ট/ডিজাইনার,

আসসালামু আলাইকুম। আপনাদের ইন্টেরিয়র ডিজাইন ফার্ম [Business Name] এর পোর্টফোলিও কাজগুলো অসাধারণ।

উচ্চবিত্ত ক্লায়েন্টদের আকৃষ্ট করতে আধুনিক ওয়েবসাইট পোর্টফোলিও এবং এআই থ্রিডি ভিউয়ার সংযোজনের সার্ভিস শেয়ার করতে চাই।

প্রজেক্ট পোর্টফোলিও সাইটের ডেমো পেতে রিপ্লাই দিন।

ধন্যবাদান্তে,
ByteWave Design Tech`,
  },
  {
    id: '17',
    title: 'Event Management & Catering',
    category: 'Event & Wedding',
    subject: 'ওয়েডিং ও কর্পোরেট ইভেন্ট বুকিং বুস্টিং সল্যুশন — [Business Name]',
    content: `প্রিয় ইভেন্ট প্ল্যানার,

আশা করি ভালো আছেন। আপনাদের ইভেন্ট ম্যানেজমেন্ট এন্টারপ্রাইজ [Business Name] এর ডিজাইন ও আয়োজন দেখে খুব প্রীত হলাম।

আপনাদের ওয়েডিং ও কর্পোরেট গ্যাট-টুগেদার বুকিং ডিজিটাল বিজ্ঞাপনের মাধ্যমে বহুগুণ বাড়াতে বিশেষ প্যাকেজ নিয়ে হাজির হয়েছি।

বিস্তারিত জানার সুযোগ চাইলে যোগাযোগ করুন।

ধন্যবাদ,
ByteWave Events`,
  },
  {
    id: '18',
    title: 'Photography & Studio',
    category: 'Photography',
    subject: 'ফটোগ্রাফি পোর্টফোলিও সাইট ও ক্লায়েন্ট বুকিং সার্ভিস — [Business Name]',
    content: `প্রিয় фотографиার/স্টুডিও ওনার,

আসসালামু আলাইকুম। আপনারা [Business Name] এ যেভাবে অপূর্ব ফ্রেম ও পোর্টফোলিও উপহার দিচ্ছেন তা সত্যি প্রশংসনীয়।

আপনাদের সকল অ্যালবাম ও প্রাইসিং প্যাকেজ সুন্দরভাবে প্রদর্শন করে সরাসরি ফটোশুট বুকিং নেয়ার কাস্টম পোর্টফোলিও ওয়েবসাইট তৈরি করে দিচ্ছি।

ডেমো ওয়েবসাইট দেখতে রিপ্লাই করুন।

শুভকামনায়,
ByteWave Media`,
  },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({ title: '', subject: '', category: 'General', content: '' });
  const [deleteId, setDeleteId] = useState(null);

  // Load templates from localStorage or fallback to defaults
  useEffect(() => {
    const saved = localStorage.getItem('email_templates_v2');
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch {
        setTemplates(INITIAL_EMAIL_TEMPLATES);
      }
    } else {
      setTemplates(INITIAL_EMAIL_TEMPLATES);
      localStorage.setItem('email_templates_v2', JSON.stringify(INITIAL_EMAIL_TEMPLATES));
    }
  }, []);

  const saveTemplatesToStorage = (updated) => {
    setTemplates(updated);
    localStorage.setItem('email_templates_v2', JSON.stringify(updated));
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all Email templates to initial defaults?')) {
      saveTemplatesToStorage(INITIAL_EMAIL_TEMPLATES);
    }
  };

  const handleCopy = (tmpl) => {
    const fullText = `Subject: ${tmpl.subject || ''}\n\n${tmpl.content}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(tmpl.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData({ title: '', subject: '', category: 'General', content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (tmpl) => {
    setEditingTemplate(tmpl);
    setFormData({
      title: tmpl.title,
      subject: tmpl.subject || '',
      category: tmpl.category || 'General',
      content: tmpl.content
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingTemplate) {
      const updated = templates.map((t) =>
        t.id === editingTemplate.id
          ? {
              ...t,
              title: formData.title,
              subject: formData.subject,
              category: formData.category,
              content: formData.content
            }
          : t
      );
      saveTemplatesToStorage(updated);
    } else {
      const newTmpl = {
        id: `email_${Date.now()}`,
        title: formData.title,
        subject: formData.subject,
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

  const insertSubjectVariable = (varName) => {
    setFormData((prev) => ({
      ...prev,
      subject: prev.subject + ` [${varName}]`,
    }));
  };

  // Extract all categories dynamically
  const categories = ['All', ...new Set(templates.map((t) => t.category || 'General'))];

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subject && t.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
              Email Templates
            </h1>
            <span className="bg-indigo-100/90 text-indigo-700 border border-indigo-200 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
              <Mail className="w-3 h-3 text-indigo-600 fill-indigo-600" />
              SYSTEM & CUSTOM
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Create, edit, and manage custom B2B Cold Email templates for all business categories.
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
            className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-white stroke-[3]" />
            <span>Create Email Template</span>
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
              placeholder="Search email templates by title, subject line, or category..."
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
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all group relative"
            >
              <div className="space-y-3">
                {/* Title & Action Buttons Header */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-700 transition-colors">
                    {tmpl.title}
                  </h3>

                  {/* EDIT & DELETE BUTTONS */}
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

                {/* Subject Line Pill */}
                {tmpl.subject && (
                  <div className="bg-indigo-50/70 border border-indigo-100/80 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-indigo-900 flex items-center gap-1.5">
                    <span className="text-indigo-500 font-bold shrink-0">Subject:</span>
                    <span className="truncate">{tmpl.subject}</span>
                  </div>
                )}

                {/* Email Body Container */}
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
                  onClick={() => handleCopy(tmpl)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Copy Email</span>
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
          <Mail className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">No email templates found</p>
          <p className="text-[11px] text-slate-400">Try adjusting your search query or creating a new email template</p>
        </div>
      )}

      {/* ─── Create / Edit Template Modal ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                <span>{editingTemplate ? 'Edit Email Template' : 'Create Email Template'}</span>
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
                  placeholder="e.g. Gym Outreach Email or Real Estate Cold Mail"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Subject Line
                  </label>
                  <div className="flex items-center gap-1">
                    {['Business Name', 'Owner Name', 'City'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertSubjectVariable(tag)}
                        className="text-[10px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                      >
                        + [{tag}]
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Partnership proposal for [Business Name]"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
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
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Email Message Body (Bengali/English) *
                  </label>
                </div>
                <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">Insert Tags:</span>
                  {['Business Name', 'Owner Name', 'City', 'Website'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertVariable(tag)}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer shrink-0"
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
                  placeholder="প্রিয় পরিচালক, আশা করি ভালো আছেন..."
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-xs font-normal text-slate-900 rounded-xl p-3.5 focus:outline-none focus:border-indigo-500 leading-relaxed"
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
                  className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  {editingTemplate ? 'Save Changes' : 'Create Email Template'}
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
        title="Delete Email Template?"
        description="Are you sure you want to delete this email template? You can restore factory defaults anytime using the Reset button."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
