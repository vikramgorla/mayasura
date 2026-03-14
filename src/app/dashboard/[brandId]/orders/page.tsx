'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Truck, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { Order, Brand } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: Clock },
};

const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrdersPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const toast = useToast();

  const loadData = () => {
    fetch(`/api/brands/${brandId}`).then(r => r.json()).then(d => setBrand(d.brand));
    fetch(`/api/brands/${brandId}/orders`).then(r => r.json()).then(d => setOrders(d.orders || []));
  };

  useEffect(() => { loadData(); }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/brands/${brandId}/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      toast.success(`Order ${status}`);
      loadData();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
      }
    } catch {
      toast.error('Failed to update order');
    }
  };

  if (!brand) return null;

  const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="p-4 sm:p-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-400 mt-1">{orders.length} total orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{orders.length}</p>
                  <p className="text-xs text-slate-400">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingOrders}</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${totalRevenue.toFixed(0)}
                  </p>
                  <p className="text-xs text-slate-400">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                  <p className="text-xs text-slate-400">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No orders yet</p>
              <p className="text-sm text-slate-400 mt-1">Orders will appear here when customers checkout</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order list */}
            <div className="lg:col-span-2 space-y-3">
              {orders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.pending;
                return (
                  <Card
                    key={order.id}
                    className={`cursor-pointer transition-shadow hover:shadow-md ${selectedOrder?.id === order.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-slate-400">#{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{order.customer_name}</p>
                          <p className="text-xs text-slate-400">{order.customer_email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-slate-900 dark:text-white">
                            {order.currency} {order.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order detail */}
            <div>
              {selectedOrder ? (
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-sm">Order #{selectedOrder.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Customer</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedOrder.customer_name}</p>
                      <p className="text-xs text-slate-400">{selectedOrder.customer_email}</p>
                    </div>

                    {selectedOrder.shipping_address && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Shipping</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{selectedOrder.shipping_address}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-slate-400 mb-2">Items</p>
                      {(() => {
                        try {
                          const items = JSON.parse(selectedOrder.items);
                          return (
                            <div className="space-y-2">
                              {items.map((item: { name: string; quantity: number; price: number }, i: number) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-slate-700 dark:text-slate-300">
                                    {item.name} ×{item.quantity}
                                  </span>
                                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        } catch { return <p className="text-xs text-slate-400">Unable to parse items</p>; }
                      })()}
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between">
                        <span className="font-semibold text-sm">Total</span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {selectedOrder.currency} {selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status actions */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-400 mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {statusFlow.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(selectedOrder.id, s)}
                            disabled={selectedOrder.status === s}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              selectedOrder.status === s
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-sm text-slate-400">Select an order to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
