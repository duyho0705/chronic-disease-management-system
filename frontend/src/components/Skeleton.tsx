/**
 * Enterprise-grade skeleton loading components
 * Provides smooth, animated placeholders during data fetching
 * Matches app's design system and aesthetic
 */

interface SkeletonProps {
    className?: string
}

/**
 * Base skeleton element with gradient animation
 */
export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] ${className}`}
            style={{
                animation: 'shimmer 2s infinite',
            }}
        />
    )
}

/**
 * Skeleton for table rows
 */
export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full">
                <thead>
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="table-th">
                                <Skeleton className="h-4 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-slate-100">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="table-td">
                                    <Skeleton className={`h-4 ${colIndex === 0 ? 'w-8' : 'w-24'}`} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

/**
 * Skeleton for metric cards (Analytics dashboard)
 */
export function SkeletonCard() {
    return (
        <div className="card">
            <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        </div>
    )
}

/**
 * Skeleton for patient list items
 */
export function SkeletonPatientRow() {
    return (
        <tr className="border-t border-slate-100">
            <td className="table-td">
                <Skeleton className="h-4 w-32" />
            </td>
            <td className="table-td">
                <Skeleton className="h-4 w-24" />
            </td>
            <td className="table-td">
                <Skeleton className="h-4 w-20" />
            </td>
            <td className="table-td">
                <Skeleton className="h-4 w-28" />
            </td>
            <td className="table-td">
                <Skeleton className="h-8 w-16 rounded-lg" />
            </td>
        </tr>
    )
}

/**
 * Skeleton for full patient list
 */
export function SkeletonPatientList({ rows = 10 }: { rows?: number }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="table-th"><Skeleton className="h-4 w-16" /></th>
                        <th className="table-th"><Skeleton className="h-4 w-20" /></th>
                        <th className="table-th"><Skeleton className="h-4 w-16" /></th>
                        <th className="table-th"><Skeleton className="h-4 w-24" /></th>
                        <th className="table-th"><Skeleton className="h-4 w-20" /></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <SkeletonPatientRow key={i} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

/**
 * Skeleton for analytics summary cards
 */
export function SkeletonAnalyticsSummary() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    )
}

/**
 * Skeleton for form sections
 */
export function SkeletonForm() {
    return (
        <div className="card space-y-4 max-w-2xl">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                ))}
            </div>
            <div className="flex gap-2 pt-4">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
        </div>
    )
}

// Add shimmer animation to global CSS
// Add this to index.css:
/*
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
*/
