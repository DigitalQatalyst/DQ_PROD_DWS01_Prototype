import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { usePersona } from '../context/PersonaContext';
import { useViewingMode } from '../context/ViewingModeContext';
import { Stage0Hero } from '../components/Stage0Hero';
import { Stage0Challenge } from '../components/Stage0Challenge';
import { Stage0PlatformValue } from '../components/Stage0PlatformValue';
import { Stage0WorkPath } from '../components/Stage0WorkPath';
import { Stage0SetupChecklist } from '../components/Stage0SetupChecklist';
import { Stage0OnboardingStepper } from '../components/Stage0OnboardingStepper';
import { Stage0RoleStartingGuide } from '../components/Stage0RoleStartingGuide';
import { Stage0RulesAck } from '../components/Stage0RulesAck';
import { Stage0WorkRules } from '../components/Stage0WorkRules';
import { Stage0NextDestinations } from '../components/Stage0NextDestinations';
import { Stage0WorkSnapshot } from '../components/Stage0WorkSnapshot';
import { Stage0Marketplaces4D } from '../components/Stage0Marketplaces4D';
import { Stage0RecommendedActions } from '../components/Stage0RecommendedActions';
import { setupChecklistItems, onboardingSteps } from '../mocks/stage0.mock';
export function Stage0OrientationPage() {
  const {
    activePersona
  } = usePersona();
  const {
    mode
  } = useViewingMode();
  const navigate = useNavigate();
  // First-time state
  const [checklist, setChecklist] = useState(setupChecklistItems);
  const [activeStep, setActiveStep] = useState(1);
  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map((item) => item.id === id ? {
      ...item,
      completed: !item.completed
    } : item));
  };
  const handleAcknowledge = () => {
    toast.success('Rules acknowledged. Welcome to your workspace.');
    navigate(activePersona.defaultRoute);
  };
  return <div className="w-full">
      {/* HERO — full-bleed, full viewport height. Rendered OUTSIDE the
             constrained container so it spans edge-to-edge. */}
      <Stage0Hero activePersona={activePersona} mode={mode} marketplaceAnchorId="explore-marketplaces" nextSectionAnchorId="stage0-after-hero" />

      {/* Anchor target for hero scroll cue */}
      <div id="stage0-after-hero" />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {mode === 'first-time' ? (
      /* ================================================================
      STATE A — FIRST-TIME / NEW JOINER
      Orientation, onboarding, platform understanding.
      ================================================================ */
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 2. The Challenge */}
            <Stage0Challenge />

            {/* 3. The Platform */}
            <Stage0PlatformValue />

            {/* 4. Governed Work Path */}
            <Stage0WorkPath />

            {/* 5. Marketplace entry point — 4D grouped (anchor target for hero CTA) */}
            <div id="explore-marketplaces" className="scroll-mt-24">
              <Stage0Marketplaces4D />
            </div>

            {/* 6 & 7 & 8. First-time setup + Guided onboarding + Role starting guide */}
            <section className="max-w-5xl mx-auto">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-primary mb-1">
                  Get set up to execute
                </h2>
                <p className="text-navy-600 text-sm">
                  Complete first-time setup, walk the guided path, and review
                  your role's starting moves.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <Stage0SetupChecklist items={checklist} toggleItem={toggleChecklistItem} />
                  <Stage0RoleStartingGuide activePersona={activePersona} />
                </div>
                <div className="space-y-8">
                  <Stage0OnboardingStepper steps={onboardingSteps} activeStep={activeStep} setActiveStep={setActiveStep} onComplete={() => setActiveStep(onboardingSteps.length)} />
                </div>
              </div>
            </section>

            {/* 9. Work Rules Snapshot */}
            <Stage0WorkRules />

            {/* Rules acknowledgement */}
            

            {/* 10. Next Destinations */}
            <Stage0NextDestinations activePersona={activePersona} />
          </div>) : (
      /* ================================================================
      STATE B — RETURNING USER
      Continuation, execution visibility, fast access.
      ================================================================ */
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 2. Continue Execution — operational destination cards */}
            <Stage0NextDestinations activePersona={activePersona} />

            {/* 3. My Work Snapshot */}
            <Stage0WorkSnapshot activePersona={activePersona} />

            {/* 4. Marketplace entry point — 4D grouped */}
            <div id="explore-marketplaces" className="scroll-mt-24">
              <Stage0Marketplaces4D compact />
            </div>

            {/* 5. Platform Summary — shortened */}
            <Stage0PlatformValue />

            {/* 6. Governed Work Path — compact */}
            <Stage0WorkPath />

            {/* 7. Work Rules Snapshot */}
            <Stage0WorkRules />

            {/* 8. Recommended Next Actions */}
            <Stage0RecommendedActions activePersona={activePersona} />

            {/* Resume CTA */}
            <div className="flex justify-center pt-2">
              <button onClick={() => navigate(activePersona.defaultRoute)} className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-button font-semibold hover:bg-navy-800 transition-colors shadow-md text-lg">
                Resume {activePersona.role} Workspace
                <ArrowRight size={20} />
              </button>
            </div>
          </div>)}
      </div>
    </div>;
}