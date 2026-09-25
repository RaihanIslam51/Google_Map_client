'use client';

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
    <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-12">
        {/* Left Column */}
        <div className="space-y-5 sm:space-y-6">
          {/* DATA REQUIREMENTS */}
          <div className="space-y-3">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              DATA REQUIREMENTS
            </h3>
            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={noWebsite}
                  onChange={(e) => setNoWebsite(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer shrink-0"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                    No Professional Website
                  </p>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    Find businesses with missing websites or using Facebook/Instagram.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group pt-1">
                <input
                  type="checkbox"
                  checked={mustHavePhone}
                  onChange={(e) => setMustHavePhone(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                  Must have Phone Number
                </span>
              </label>

              <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer group p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/80 hover:bg-purple-50 transition-colors mt-2">
                <input
                  type="checkbox"
                  checked={headful}
                  onChange={(e) => setHeadful(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-purple-900 group-hover:text-purple-950 flex items-center gap-1.5">
                    🌐 Open Browser Window (Live Google Maps Window)
                  </span>
                  <p className="text-[11px] text-purple-700/80 leading-tight mt-0.5">
                    Opens visible Chromium browser window on your desktop to watch live search scrolling & lead collection.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* GEOGRAPHY & RADIUS */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              GEOGRAPHY & RADIUS
            </h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location (City/Area)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Gulshan"
                  className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Radius Search
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="Any distance">Any distance</option>
                  <option value="5 km">5 km radius</option>
                  <option value="10 km">10 km radius</option>
                  <option value="25 km">25 km radius</option>
                  <option value="50 km">50 km radius</option>
                </select>
                <p className="text-[10px] text-amber-600 font-medium mt-1">
                  Enter a location first to use radius.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5 sm:space-y-6">
          {/* QUALITY METRICS */}
          <div className="space-y-3">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              QUALITY METRICS
            </h3>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="Any Rating">Any Rating</option>
                  <option value="4.0">4.0 & above ⭐</option>
                  <option value="4.5">4.5 & above ⭐</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Minimum Reviews
                </label>
                <input
                  type="text"
                  value={minReviews}
                  onChange={(e) => setMinReviews(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* SMART EXCLUSIONS */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              SMART EXCLUSIONS
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Negative Keywords
              </label>
              <input
                type="text"
                value={negativeKeywords}
                onChange={(e) => setNegativeKeywords(e.target.value)}
                placeholder="e.g. restaurant, school, hospital"
                className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
              />
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Separate multiple words with commas to exclude from results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
