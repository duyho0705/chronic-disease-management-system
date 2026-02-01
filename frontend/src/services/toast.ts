import toast from 'react-hot-toast'

/**
 * Enterprise-grade toast notification service
 * Centralized, typed, themed notifications matching app design
 */

interface ToastOptions {
    duration?: number
    position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'
}

class ToastService {
    private defaultDuration = 4000

    /**
     * Success notification - Green theme
     */
    success(message: string, options?: ToastOptions) {
        return toast.success(message, {
            duration: options?.duration ?? this.defaultDuration,
            position: options?.position ?? 'top-right',
            style: {
                background: '#10b981',
                color: '#fff',
                fontWeight: '500',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
            },
        })
    }

    /**
     * Error notification - Red theme
     */
    error(message: string, options?: ToastOptions) {
        return toast.error(message, {
            duration: options?.duration ?? this.defaultDuration,
            position: options?.position ?? 'top-right',
            style: {
                background: '#ef4444',
                color: '#fff',
                fontWeight: '500',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
            },
        })
    }

    /**
     * Info notification - Blue theme
     */
    info(message: string, options?: ToastOptions) {
        return toast(message, {
            duration: options?.duration ?? this.defaultDuration,
            position: options?.position ?? 'top-right',
            icon: 'ℹ️',
            style: {
                background: '#3b82f6',
                color: '#fff',
                fontWeight: '500',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
            },
        })
    }

    /**
     * Warning notification - Amber theme
     */
    warning(message: string, options?: ToastOptions) {
        return toast(message, {
            duration: options?.duration ?? this.defaultDuration,
            position: options?.position ?? 'top-right',
            icon: '⚠️',
            style: {
                background: '#f59e0b',
                color: '#fff',
                fontWeight: '500',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
            },
        })
    }

    /**
     * Loading notification with promise tracking
     */
    async promise<T>(
        promise: Promise<T>,
        messages: {
            loading: string
            success: string
            error: string
        }
    ): Promise<T> {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                style: {
                    fontWeight: '500',
                    padding: '16px',
                    borderRadius: '12px',
                },
                success: {
                    duration: 3000,
                    style: {
                        background: '#10b981',
                        color: '#fff',
                    },
                },
                error: {
                    duration: 4000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                    },
                },
            }
        )
    }

    /**
     * Dismiss all toasts
     */
    dismissAll() {
        toast.dismiss()
    }

    /**
     * Dismiss specific toast
     */
    dismiss(toastId: string) {
        toast.dismiss(toastId)
    }
}

// Export singleton instance
export const toastService = new ToastService()

// Export for custom usage
export { toast }
