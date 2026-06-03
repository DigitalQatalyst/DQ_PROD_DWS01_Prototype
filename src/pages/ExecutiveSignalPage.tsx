import React from 'react';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { ExecutiveSignalStrip } from '../components/ExecutiveSignalStrip';
import { ServiceDemandCard } from '../components/ServiceDemandCard';
import { SlaExposureCard } from '../components/SlaExposureCard';
import { EscalationSignalCard } from '../components/EscalationSignalCard';
import { RecurringIssuesTable } from '../components/RecurringIssuesTable';
import { ServiceOwnerPerformanceTable } from '../components/ServiceOwnerPerformanceTable';
import { ServiceEmptyState } from '../components/ServiceEmptyState';

export function ExecutiveSignalPage() {
  const { signals, categoryDemand, serviceOwnerPerformance } = useServiceLifecycle();

  if (!signals || signals.length === 0) {
    return (
      <div className="bg-[#F6F6FB] min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <ServiceEmptyState 
            title="No service request signals yet" 
            message="Data will populate here once requests begin flowing through the system."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6FB] min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Service Request Signals</h1>
          <p className="text-sm text-text-secondary max-w-3xl">
            Executive oversight of aggregate service demand, SLA exposure, escalations, and service owner performance across the enterprise.
          </p>
        </div>

        <ExecutiveSignalStrip signals={signals} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8">
            <ServiceDemandCard demand={categoryDemand} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SlaExposureCard />
            <EscalationSignalCard />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecurringIssuesTable />
          <ServiceOwnerPerformanceTable performance={serviceOwnerPerformance} />
        </div>

      </div>
    </div>
  );
}
