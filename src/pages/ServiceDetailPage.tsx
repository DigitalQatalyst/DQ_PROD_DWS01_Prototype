import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { ServiceDetailHero } from '../components/ServiceDetailHero';
import { ServiceMetadataRail } from '../components/ServiceMetadataRail';
import { WhenToUseCard } from '../components/WhenToUseCard';
import { RequiredInputsList } from '../components/RequiredInputsList';
import { FulfilmentTimeline } from '../components/FulfilmentTimeline';
import { ApprovalPathCard } from '../components/ApprovalPathCard';
import { RelatedItemsCard } from '../components/RelatedItemsCard';
import { AuditNoteCard } from '../components/AuditNoteCard';
import { ServiceEmptyState } from '../components/ServiceEmptyState';

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { getServiceById, getServiceDetailByServiceId } = useServiceLifecycle();
  
  const [loading, setLoading] = useState(true);

  // Fetch data
  const service = serviceId ? getServiceById(serviceId) : undefined;
  const detail = serviceId ? getServiceDetailByServiceId(serviceId) : undefined;

  // Simulate network loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [serviceId]);

  if (loading) {
    return (
      <div className="bg-[#F6F6FB] min-h-screen py-8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
          {/* Breadcrumb Skeleton */}
          <div className="w-64 h-4 bg-border-default animate-pulse rounded mb-6" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Hero Skeleton */}
              <div className="bg-white rounded-card border border-border-default h-48 animate-pulse" />
              {/* Content Skeletons */}
              <div className="bg-white rounded-card border border-border-default h-64 animate-pulse" />
              <div className="bg-white rounded-card border border-border-default h-48 animate-pulse" />
            </div>
            
            <div className="lg:col-span-4">
              {/* Rail Skeleton */}
              <div className="bg-white rounded-card border border-border-default h-96 animate-pulse sticky top-[88px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service || !detail) {
    return (
      <div className="bg-[#F6F6FB] min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <ServiceEmptyState 
            title="Service not found" 
            message={`We couldn't find a service matching the ID "${serviceId}". It may have been removed or you might have an incorrect link.`}
            ctaLabel="Back to Service Catalogue"
            onCtaClick={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6FB] min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[12px] font-medium text-text-muted mb-6">
          <Link to="/marketplaces/services" className="hover:text-primary transition-colors">Marketplaces</Link>
          <ChevronRight size={12} />
          <Link to="/marketplaces/services" className="hover:text-primary transition-colors">Services</Link>
          <ChevronRight size={12} />
          <span className="text-text-primary">{service.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <ServiceDetailHero service={service} detail={detail} />
            
            <WhenToUseCard 
              whenToUse={detail.whenToUse} 
              whenNotToUse={detail.whenNotToUse} 
            />
            
            <RequiredInputsList inputs={detail.requiredInputs} />
            
            <FulfilmentTimeline path={detail.fulfilmentPath} />
            
            <ApprovalPathCard 
              requirement={detail.approval} 
              detail={detail.approvalDetail} 
            />
            
            <RelatedItemsCard 
              knowledgeLinks={detail.relatedKnowledge} 
              serviceLinks={detail.relatedServices} 
            />
            
            <AuditNoteCard note={detail.auditNote} />
          </div>
          
          {/* Metadata Rail (4 cols) */}
          <div className="lg:col-span-4 relative">
            <ServiceMetadataRail detail={detail} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
