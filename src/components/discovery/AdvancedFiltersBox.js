'use client';

import { Globe2 } from 'lucide-react';

const fieldCls =
  'w-full h-10 bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all';

function Section({ title, children }) {
  return (
    <div className="space-y-3.5">
      <h3 className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</h3>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-[13px] font-medium text-slate-700 mb-1.5">{children}</label>;
}

export default function AdvancedFiltersBox({
  noWebsite,
  setNoWebsite,
  mustHavePhone,
  setMustHavePhone,
  headful,
  setHeadful,
  location,
  setLocation,
  radius,
  setRadius,
  minRating,
  setMinRating,
  minReviews,
  setMinReviews,
  negativeKeywords,
  setNegativeKeywords,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-12">
        {/* Left Column */}
        <div className="space-y-8">
          {/* DATA REQUIREMENTS */}
          <Section title="Data requirements">
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={noWebsite}
                  onChange={(e) => setNoWebsite(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer shrink-0"
                />
                <div>
                  <p className="text-[13px] font-medium text-slate-800">No professional website</p>
                  <p className="text-xs text-slate-400 leading-snug mt-0.5">
                    Find businesses with missing websites or using Facebook/Instagram.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={mustHavePhone}
                  onChange={(e) => setMustHavePhone(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer shrink-0"
                />
                <span className="text-[13px] font-medium text-slate-800">Must have phone number</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors">
                <input
                  type="checkbox"
                  checked={headful}
                  onChange={(e) => setHeadful(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 cursor-pointer shrink-0"
                />
                <div>
                  <span className="text-[13px] font-medium text-slate-800 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
                    Open browser window
                  </span>
                  <p className="text-xs text-slate-500 leading-snug mt-0.5">
                    Opens a visible Chromium window so you can watch live Google Maps scrolling &amp; lead collection.
                  </p>
                </div>
              </label>
            </div>
          </Section>

          {/* GEOGRAPHY & RADIUS */}
          <Section title="Geography & radius">
            <div className="space-y-4">
              <div>
                <Label>Location (city / area)</Label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Gulshan"
                  className={fieldCls}
                />
              </div>

              <div>
                <Label>Radius search</Label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className={`${fieldCls} cursor-pointer`}
                >
                  <option value="Any distance">Any distance</option>
                  <option value="5 km">5 km radius</option>
                  <option value="10 km">10 km radius</option>
                  <option value="25 km">25 km radius</option>
                  <option value="50 km">50 km radius</option>
                </select>
                <p className="text-xs text-amber-600 mt-1.5">Enter a location first to use radius.</p>
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* QUALITY METRICS */}
          <Section title="Quality metrics">
            <div className="space-y-4">
              <div>
                <Label>Minimum rating</Label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className={`${fieldCls} cursor-pointer`}
                >
                  <option value="Any Rating">Any Rating</option>
                  <option value="4.0">4.0 &amp; above ⭐</option>
                  <option value="4.5">4.5 &amp; above ⭐</option>
                </select>
              </div>

              <div>
                <Label>Minimum reviews</Label>
                <input
                  type="text"
                  value={minReviews}
                  onChange={(e) => setMinReviews(e.target.value)}
                  placeholder="e.g. 10"
                  className={fieldCls}
                />
              </div>
            </div>
          </Section>

          {/* SMART EXCLUSIONS */}
          <Section title="Smart exclusions">
            <div>
              <Label>Negative keywords</Label>
              <input
                type="text"
                value={negativeKeywords}
                onChange={(e) => setNegativeKeywords(e.target.value)}
                placeholder="e.g. restaurant, school, hospital"
                className={fieldCls}
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Separate multiple words with commas to exclude from results.
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
