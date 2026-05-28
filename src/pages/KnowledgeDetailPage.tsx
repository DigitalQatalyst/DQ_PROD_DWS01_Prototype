import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { KnowledgeDetailRecord } from '../types/knowledgeDiscovery';
import { KnowledgeDetailHero } from '../components/KnowledgeDetailHero';
import { KnowledgeActionRail } from '../components/KnowledgeActionRail';
import { ApplicabilityCard } from '../components/ApplicabilityCard';
import { CoreGuidancePreview } from '../components/CoreGuidancePreview';
import { EvidenceExpectationCard } from '../components/EvidenceExpectationCard';
import { LinkedWorkPanel } from '../components/LinkedWorkPanel';
import { RelatedKnowledgeGrid } from '../components/RelatedKnowledgeGrid';
import { KnowledgeFeedbackPanel } from '../components/KnowledgeFeedbackPanel';
import { VersionHistoryList } from '../components/VersionHistoryList';
import { AlertCircle } from 'lucide-react';

export function KnowledgeDetailPage() {
  const { knowledgeId } = useParams();
  const navigate = useNavigate();
  const {
    assets,
    isLoading,
    getAssetDetail,
    getApplicabilityForAsset,
    getLinkedWorkForAsset,
    getRelatedKnowledgeForAsset
  } = useKnowledgeLifecycle();

  const [detail, setDetail] = useState<KnowledgeDetailRecord | undefined>(undefined);
  const [detailLoading, setDetailLoading] = useState(true);

  const asset = assets.find(a => a.id === knowledgeId);

  useEffect(() => {
    if (knowledgeId) {
      setDetailLoading(true);
      getAssetDetail(knowledgeId).then(data => {
        setDetail(data);
        setDetailLoading(false);
      });
    }
  }, [knowledgeId, getAssetDetail]);

  if (isLoading || detailLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-sm text-text-muted">Loading knowledge asset...</div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-warning" />
        <h2 className="mb-2 text-2xl font-bold text-text-primary">Asset Not Found</h2>
        <p className="mb-6 text-text-secondary">The knowledge asset you are looking for could not be found.</p>
        <button
          onClick={() => navigate('/marketplaces/knowledge')}
          className="rounded-lg bg-primary px-5 py-2.5 font-bold text-white hover:bg-navy-700"
        >
          Return to Knowledge Hub
        </button>
      </div>
    );
  }

  const applicability = getApplicabilityForAsset(asset.id);
  const linkedWork = getLinkedWorkForAsset(asset.id);
  const relatedKnowledge = getRelatedKnowledgeForAsset(asset.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <KnowledgeDetailHero asset={asset} />

      {/* Content + Rail */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Main Content — Left 2/3 */}
        <div className="space-y-6 lg:col-span-2">

          {/* 1. Purpose & Scope */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Purpose & Scope</h2>
            <p className="mb-6 text-text-secondary leading-relaxed">{asset.purpose}</p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-bold text-text-primary">When to Use</h3>
                <ul className="space-y-2">
                  {asset.whenToUse.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                      {item}
                    </li>
                  ))}
                  {asset.whenToUse.length === 0 && (
                    <li className="text-sm text-text-muted">No specific guidance provided.</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold text-text-primary">When NOT to Use</h3>
                <ul className="space-y-2">
                  {asset.whenNotToUse.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                      {item}
                    </li>
                  ))}
                  {asset.whenNotToUse.length === 0 && (
                    <li className="text-sm text-text-muted">No specific exclusions.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Applicability */}
          {applicability && <ApplicabilityCard record={applicability} />}

          {/* 3. Core Guidance */}
          <CoreGuidancePreview asset={asset} />

          {/* 4. Full Detail Sections */}
          {detail && detail.sections.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
              <h2 className="mb-5 text-lg font-bold text-text-primary">Reference Content</h2>
              {detail.content && (
                <p className="mb-6 text-text-secondary leading-relaxed">{detail.content}</p>
              )}
              <div className="space-y-6">
                {detail.sections.map(section => (
                  <div key={section.id}>
                    <h3 className="mb-3 text-sm font-bold text-text-primary">{section.title}</h3>
                    <div className="rounded-lg bg-surface px-5 py-4 ring-1 ring-border-subtle">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{section.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Evidence Expectations */}
          <EvidenceExpectationCard asset={asset} />

          {/* 6. Work Application */}
          {detail?.workApplication && (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
              <h2 className="mb-4 text-lg font-bold text-text-primary">How This Applies to Work</h2>
              <p className="text-sm leading-relaxed text-text-secondary">{detail.workApplication}</p>
            </div>
          )}

          {/* 7. Review & Acknowledgement Expectations */}
          {(detail?.reviewExpectation || detail?.acknowledgementExpectation) && (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
              <h2 className="mb-5 text-lg font-bold text-text-primary">Review & Acknowledgement</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {detail.reviewExpectation && (
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-text-primary">Review Expectation</h3>
                    <p className="text-sm text-text-secondary">{detail.reviewExpectation}</p>
                  </div>
                )}
                {detail.acknowledgementExpectation && (
                  <div>
                    <h3 className="mb-2 text-sm font-bold text-text-primary">Acknowledgement Expectation</h3>
                    <p className="text-sm text-text-secondary">{detail.acknowledgementExpectation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. Linked Work */}
          <LinkedWorkPanel records={linkedWork} />

          {/* 9. Related Knowledge */}
          <RelatedKnowledgeGrid records={relatedKnowledge} allAssets={assets} />

          {/* 10. Version History */}
          {detail && <VersionHistoryList detail={detail} />}

          {/* 11. Feedback */}
          <KnowledgeFeedbackPanel assetId={asset.id} />
        </div>

        {/* Sticky Right Rail — 1/3 */}
        <div className="lg:col-span-1">
          <KnowledgeActionRail asset={asset} />
        </div>
      </div>
    </div>
  );
}
