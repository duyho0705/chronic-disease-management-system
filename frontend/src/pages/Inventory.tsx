import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTenant } from '@/context/TenantContext'
import { getPharmacyInventory, restockInventory } from '@/api/pharmacy'
import { toastService } from '@/services/toast'
import { Package, Search, ArrowUpRight, AlertTriangle } from 'lucide-react'
import { SkeletonTable } from '@/components/Skeleton'

export function Inventory() {
    const { headers, branchId } = useTenant()
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProductForRestock, setSelectedProductForRestock] = useState<string | null>(null)
    const [restockQty, setRestockQty] = useState(0)

    const { data: inventory, isLoading } = useQuery({
        queryKey: ['pharmacy-inventory', branchId],
        queryFn: () => getPharmacyInventory(branchId!, headers),
        enabled: !!branchId && !!headers?.tenantId,
    })

    const addStock = useMutation({
        mutationFn: (data: { productId: string; quantity: number }) =>
            restockInventory({ branchId: branchId!, ...data }, headers),
        onSuccess: () => {
            toastService.success('📦 Đã cập nhật tồn kho thành công')
            setSelectedProductForRestock(null)
            setRestockQty(0)
            queryClient.invalidateQueries({ queryKey: ['pharmacy-inventory'] })
        },
        onError: (e: Error) => toastService.error(e.message),
    })

    const filteredInventory = inventory?.filter(i =>
        i.product.nameVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.product.code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <header className="page-header flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Kho thuốc</h1>
                    <p className="text-sm text-slate-500 mt-1">Theo dõi tồn kho, nhập thuốc và quản lý danh mục.</p>
                </div>
                <div className="flex gap-2">
                </div>
            </header>

            <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên thuốc hoặc mã..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10 w-full"
                    />
                </div>
            </div>

            <section className="card">
                {isLoading ? (
                    <SkeletonTable rows={10} columns={5} />
                ) : filteredInventory?.length ? (
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="table-th">Mã Thuốc</th>
                                    <th className="table-th">Tên Thuốc</th>
                                    <th className="table-th text-center">Đơn vị</th>
                                    <th className="table-th text-right">Tồn hiện tại</th>
                                    <th className="table-th text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredInventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="table-td font-mono text-xs">{item.product.code}</td>
                                        <td className="table-td">
                                            <div className="font-semibold text-slate-900">{item.product.nameVi}</div>
                                            <div className="text-xs text-slate-500">{item.product.genericName || 'Biệt dược'}</div>
                                        </td>
                                        <td className="table-td text-center">{item.product.unit}</td>
                                        <td className="table-td text-right">
                                            <div className={`font-bold ${item.currentStock <= item.minStockLevel ? 'text-red-600 flex items-center justify-end gap-1' : 'text-slate-900'}`}>
                                                {item.currentStock <= item.minStockLevel && <AlertTriangle className="h-3 w-3" />}
                                                {item.currentStock}
                                            </div>
                                        </td>
                                        <td className="table-td text-right">
                                            <button
                                                onClick={() => setSelectedProductForRestock(item.product.id)}
                                                className="btn-secondary text-xs py-1 px-3 flex items-center gap-1 ml-auto"
                                            >
                                                <ArrowUpRight className="h-3 w-3" />
                                                Nhập kho
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Package className="h-12 w-12 mx-auto mb-4 text-slate-200" />
                        Chưa có dữ liệu tồn kho.
                    </div>
                )}
            </section>

            {/* Restock Modal Placeholder */}
            {selectedProductForRestock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="card w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Nhập kho thuốc</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">Bạn đang thực hiện nhập thêm số lượng cho sản phẩm này.</p>
                            <input
                                type="number"
                                placeholder="Số lượng nhập..."
                                value={restockQty}
                                onChange={(e) => setRestockQty(Number(e.target.value))}
                                className="input w-full"
                            />
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setSelectedProductForRestock(null)} className="btn-secondary">Hủy</button>
                                <button
                                    onClick={() => addStock.mutate({ productId: selectedProductForRestock, quantity: restockQty })}
                                    disabled={addStock.isPending || restockQty <= 0}
                                    className="btn-primary"
                                >
                                    {addStock.isPending ? 'Đang cập nhật...' : 'Xác nhận nhập'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
