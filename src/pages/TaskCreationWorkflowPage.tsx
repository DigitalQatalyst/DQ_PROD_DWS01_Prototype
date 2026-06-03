import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTaskLifecycle } from '../context/TaskLifecycleContext';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { usePersona } from '../context/PersonaContext';
import { TaskFromTemplateWizard } from '../components/TaskFromTemplateWizard';
import { ArrowLeft } from 'lucide-react';

export function TaskCreationWorkflowPage() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const knowledgeId = searchParams.get('knowledgeId');
  const navigate = useNavigate();
  
  const { templates, isLoading: templatesLoading } = useTaskLifecycle();
  const { assets, isLoading: knowledgeLoading } = useKnowledgeLifecycle();
  const { activePersona } = usePersona();

  const [template, setTemplate] = useState<any>(null);
  const [linkedKnowledge, setLinkedKnowledge] = useState<any>(null);

  useEffect(() => {
    if (!templatesLoading && templateId) {
      if (templateId === 'blank') {
        setTemplate({
          id: 'blank',
          title: 'Custom Task',
          category: 'Personal Work',
          checklist: 0,
          evidence: false,
          type: 'Execution',
          checklistDepth: 'Light',
          sla: '3–5 business days',
          approval: 'No approval'
        });
      } else {
        const found = templates.find(t => t.id === templateId);
        // Map TaskTemplateFull to wizard shape
        if (found) {
          setTemplate({
            id: found.id,
            title: found.title,
            category: found.category,
            checklist: found.checklistItems.length,
            evidence: found.evidenceRequired,
            type: found.type,
            checklistDepth: found.checklistDepth || 'Standard',
            sla: found.slaGuidance,
            approval: found.reviewPath
          });
        }
      }
    }
  }, [templatesLoading, templateId, templates]);

  useEffect(() => {
    if (!knowledgeLoading && knowledgeId) {
      const found = assets.find(a => a.id === knowledgeId);
      if (found) setLinkedKnowledge(found);
    }
  }, [knowledgeLoading, knowledgeId, assets]);

  if (templatesLoading || knowledgeLoading) {
    return <div className="p-8">Loading workflow...</div>;
  }

  if (!template) {
    return <div className="p-8 text-danger">Template not found.</div>;
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary"
          >
            <ArrowLeft size={16} />
            Cancel Creation
          </button>
        </div>
      </div>

      <div className="py-8 pb-32">
        <TaskFromTemplateWizard 
          template={template}
          activePersona={activePersona}
          onClose={() => navigate(-1)}
          preLinkedKnowledge={linkedKnowledge}
          isModal={false}
        />
      </div>
    </div>
  );
}
