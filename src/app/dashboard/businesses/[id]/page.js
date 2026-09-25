'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, Star, Phone, Globe, MapPin, ExternalLink,
  Calendar, Search, Hash, AlertTriangle, Loader2
} from 'lucide-react';
import { businessesApi } from '../../../../lib/api/businesses';
import { useLeadsCacheQuery } from '../../../../hooks/useLeadsCacheQuery';

function InfoRow({ label, value, link }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-500 w-36 shrink-0">{label}</span>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 text-right">
          {value} <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <span className="text-xs text-slate-200 text-right">{value}</span>
      )}
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

export default function BusinessDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useLeadsCacheQuery({
    queryKey: ['business-detail', id],
    queryFn: () => businessesApi.getById(id),
    staleTime: 60000,
  });

  const b = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
      </div>
    );
  }

  if (isError || !b) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-sm">Business not found.</p>
        <Link href="/dashboard/businesses" className="text-blue-400 text-sm mt-2 inline-block">← Back to Businesses</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Business Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600/15 border border-blue-600/20 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{b.name}</h1>
              {b.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 mt-1">
                  {b.category}
                </span>
              )}
              {b.rating != null && (
                <div className="flex items-center gap-1.5 mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(b.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                  ))}
                  <span className="text-sm font-semibold text-slate-200">{b.rating}</span>
                  <span className="text-xs text-slate-500">({b.reviewCount?.toLocaleString() ?? 0} reviews)</span>
                </div>
              )}
            </div>
          </div>
          {b.mapsUrl && (
            <a
              href={b.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Maps
            </a>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InfoCard title="Contact Information">
          <InfoRow label="Phone" value={b.phone} />
          <InfoRow label="Website" value={b.website} link={b.website} />
        </InfoCard>

        <InfoCard title="Location">
          <InfoRow label="Address" value={b.address} />
          <InfoRow label="Plus Code" value={b.plusCode} />
          <InfoRow label="Latitude" value={b.latitude?.toString()} />
          <InfoRow label="Longitude" value={b.longitude?.toString()} />
          {b.latitude && b.longitude && (
            <a
              href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              View on Google Maps
            </a>
          )}
        </InfoCard>

        {/* Opening Hours */}
        {b.openingHours && Object.keys(b.openingHours).length > 0 && (
          <InfoCard title="Opening Hours">
            {Object.entries(b.openingHours).map(([day, time]) => (
              <InfoRow key={day} label={day} value={time} />
            ))}
          </InfoCard>
        )}

        <InfoCard title="Scraping Information">
          <InfoRow label="Source Keyword" value={b.searchKeyword} />
          <InfoRow label="Place ID" value={b.placeId} />
          <InfoRow label="Price Level" value={b.priceLevel} />
          <InfoRow label="Scraped At" value={b.scrapedAt ? new Date(b.scrapedAt).toLocaleString() : undefined} />
          <InfoRow label="Maps URL" value={b.mapsUrl ? 'View link →' : undefined} link={b.mapsUrl} />
        </InfoCard>
      </div>
    </div>
  );
}
