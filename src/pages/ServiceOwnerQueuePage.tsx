import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { QueueKpiStrip } from '../components/QueueKpiStrip';
import { RoutedRequestTable } from '../components/RoutedRequestTable';

export function ServiceOwnerQueuePage() {
  const navigate = useNavigate();
  const { queueItems, updateRequestStatus } = useServiceLifecycle();

  // Local state for queue updates to simulate interaction
  const [localItems, setLocalItems] = useState(queueItems);

  const handleRowClick = (requestId: string) => {
    navigate(`/requests/${requestId}/status`);
  };

  const handleAccept = (itemId: string) => {
    setLocalItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'In Fulfilment' } : item
    ));
    // Simulate linking to the request update
    const item = localItems.find(i => i.id === itemId);
    if (item) updateRequestStatus(item.requestId, 'In Fulfilment');
    
    toast.success('Request accepted');
  };

  const handleReturnForInfo = (itemId: string) => {
    setLocalItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'Returned for Information' } : item
    ));
    const item = localItems.find(i => i.id === itemId);
    if (item) updateRequestStatus(item.requestId, 'Returned for Information');
    
    toast.success('Request returned for information');
  };

  const handleUpdateStatus = (itemId: string, status: string) => {
    setLocalItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status } : item
    ));
    const item = localItems.find(i => i.id === itemId);
    if (item) updateRequestStatus(item.requestId, status as any);
    
    toast.success(`Status updated to ${status}`);
  };

  const handleClose = (itemId: string) => {
    setLocalItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'Closed' } : item
    ));
    const item = localItems.find(i => i.id === itemId);
    if (item) updateRequestStatus(item.requestId, 'Closed');
    
    toast.success('Request closed successfully');
  };

  return (
    <div className="bg-[#F6F6FB] min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Service Owner Queue</h1>
          <p className="text-sm text-text-secondary">Manage and fulfil requests routed to your services.</p>
        </div>

        <QueueKpiStrip items={localItems} />

        <div className="bg-white rounded-[12px] border border-border-default shadow-sm overflow-hidden">
          <div className="border-b border-border-default pt-2 px-6 flex items-center gap-6 bg-surface/30">
            <button className="py-3 text-sm font-bold border-b-2 border-primary text-primary transition-colors">
              Routed Requests
            </button>
            <button className="py-3 text-sm font-semibold border-b-2 border-transparent text-text-muted hover:text-text-secondary transition-colors">
              Performance
            </button>
          </div>

          <div className="relative">
            <RoutedRequestTable 
              items={localItems} 
              onAccept={handleAccept}
              onReturnForInfo={handleReturnForInfo}
              onUpdateStatus={handleUpdateStatus}
              onClose={handleClose}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
