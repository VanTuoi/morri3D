import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '~/layouts/app-layout'
import { DashboardPage } from '~/pages/dashboard-page'
import { OrdersPage } from '~/pages/orders-page'
import { InventoryPage } from '~/pages/inventory-page'
import { AddPage } from '~/pages/add-page'
import { NotFoundPage } from '~/pages/not-found-page'

export default function useRouteElements(managerData: any) {
    return (
        <Routes>
            <Route path='/' element={<AppLayout managerData={managerData} />}>
                <Route index element={<DashboardPage />} />
                <Route path='orders' element={<OrdersPage />} />
                <Route path='inventory' element={<InventoryPage />} />
                <Route path='add' element={<AddPage />} />
                <Route path='*' element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}
