/**
 * AcuityBadge - Enterprise visual priority indicator
 * Maps acuity levels (1-5) to color-coded badges for instant recognition
 * 
 * Color System:
 * - Level 1-2: Red (Emergency/Urgent)
 * - Level 3: Yellow (Moderate)
 * - Level 4-5: Green (Low priority)
 */

interface AcuityBadgeProps {
    level: string | number | null | undefined
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
}

export function AcuityBadge({ level, size = 'md', showLabel = true }: AcuityBadgeProps) {
    if (!level) {
        return (
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                —
            </span>
        )
    }

    const numLevel = typeof level === 'string' ? parseInt(level, 10) : level

    // Enterprise color mapping
    const getConfig = (level: number) => {
        if (level <= 2) {
            // Emergency/Urgent - RED
            return {
                bg: 'bg-red-100',
                border: 'border-red-300',
                text: 'text-red-900',
                ring: 'ring-red-500/20',
                icon: '🚨',
                label: level === 1 ? 'Cấp cứu' : 'Khẩn cấp',
                pulse: true,
            }
        } else if (level === 3) {
            // Moderate - YELLOW/AMBER
            return {
                bg: 'bg-amber-100',
                border: 'border-amber-300',
                text: 'text-amber-900',
                ring: 'ring-amber-500/20',
                icon: '⚠️',
                label: 'Trung bình',
                pulse: false,
            }
        } else {
            // Low priority - GREEN
            return {
                bg: 'bg-green-100',
                border: 'border-green-300',
                text: 'text-green-900',
                ring: 'ring-green-500/20',
                icon: '✅',
                label: 'Ổn định',
                pulse: false,
            }
        }
    }

    const config = getConfig(numLevel)

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    }

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 rounded-lg border font-semibold
        ${config.bg} ${config.border} ${config.text} ${config.ring}
        ${sizeClasses[size]}
        ${config.pulse ? 'animate-pulse ring-2' : ''}
        transition-all duration-200
      `}
        >
            <span className="text-base leading-none">{config.icon}</span>
            <span>Level {level}</span>
            {showLabel && size !== 'sm' && (
                <span className="font-normal opacity-75">• {config.label}</span>
            )}
        </span>
    )
}

/**
 * Compact version - just icon + number for tables
 */
export function AcuityIndicator({ level }: { level: string | number | null | undefined }) {
    if (!level) return <span className="text-slate-400">—</span>

    const numLevel = typeof level === 'string' ? parseInt(level, 10) : level

    const getColor = (level: number) => {
        if (level <= 2) return 'text-red-600 bg-red-50'
        if (level === 3) return 'text-amber-600 bg-amber-50'
        return 'text-green-600 bg-green-50'
    }

    return (
        <span
            className={`
        inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
        ${getColor(numLevel)}
        ${numLevel <= 2 ? 'ring-2 ring-red-500/20' : ''}
      `}
        >
            {level}
        </span>
    )
}
