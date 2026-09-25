'use client';

// components/common/LoadingSkeleton.js
export function SkeletonLine({ className = '' }) {
  return <div className={`shimmer rounded h-4 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonLine className="w-24" />
        <div className="shimmer rounded-lg w-8 h-8" />
      </div>
      <SkeletonLine className="w-16 h-7" />
      <SkeletonLine className="w-32" />
    </div>
  );
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="border-b border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLine className={`w-${i === 0 ? '32' : '20'}`} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonLine key={i} className={`h-12 w-full ${i > 2 ? 'opacity-50' : ''}`} />
      ))}
    </div>
  );
}
