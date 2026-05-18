import React, { useState, createContext, useContext } from 'react';
import type { Persona, PersonaId } from '../types/platform';
import { personas } from '../mocks/platform.mock';
interface PersonaContextType {
  activePersonaId: PersonaId;
  activePersona: Persona;
  setActivePersona: (id: PersonaId) => void;
  getDefaultRoute: (persona: Persona) => string;
  hasRouteAccess: (route: string, persona: Persona) => boolean;
}
const PersonaContext = createContext<PersonaContextType | undefined>(undefined);
/**
 * Routes that every persona can use — these power the shared
 * "My Daily Work" sidebar group and must never be restricted.
 */
const universalRoutes = new Set<string>([
'/workspace/my-tasks',
'/workspace/my-updates',
'/workspace/my-blockers',
'/workspace/my-requests',
'/workspace/notifications',
'/workspace/knowledge-context']
);
export function PersonaProvider({ children }: {children: ReactNode;}) {
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>('associate');
  const activePersona =
  personas.find((p) => p.id === activePersonaId) || personas[0];
  const getDefaultRoute = (persona: Persona) => persona.defaultRoute;
  const hasRouteAccess = (route: string, persona: Persona) => {
    // Stage 0, onboarding, and shared daily-work routes are open to all
    if (route.startsWith('/stage-0')) return true;
    if (route.startsWith('/onboarding')) return true;
    if (universalRoutes.has(route)) return true;
    const accessMap: Record<string, PersonaId[]> = {
      '/marketplaces/services': ['associate', 'hra', 'admin', 'support'],
      '/marketplaces/task-templates': [
      'associate',
      'scrum-master',
      'team-lead',
      'unit-lead',
      'admin'],

      '/marketplaces/knowledge': [
      'associate',
      'scrum-master',
      'team-lead',
      'unit-lead',
      'hra',
      'admin',
      'support'],

      '/marketplaces/work-directory': [
      'associate',
      'scrum-master',
      'team-lead',
      'unit-lead',
      'hra',
      'admin',
      'support'],

      '/marketplaces/analytics': [
      'scrum-master',
      'team-lead',
      'unit-lead',
      'hra',
      'admin',
      'support',
      'ceo'],

      '/marketplaces/feedback': ['associate', 'hra', 'admin', 'support'],
      '/workspace/my-work': ['associate'],
      '/workspace/objective-linked-tasks': ['associate'],
      '/workspace/agile-execution': ['scrum-master'],
      '/operations/team-execution': ['team-lead'],
      '/operations/unit-visibility': ['unit-lead'],
      '/operations/hra-workflow': ['hra'],
      '/support/operations': ['support'],
      '/admin/console': ['admin'],
      '/execution/workflow': [
      'scrum-master',
      'team-lead',
      'unit-lead',
      'hra',
      'admin',
      'support',
      'ceo'],

      '/intelligence/sla': [
      'scrum-master',
      'team-lead',
      'unit-lead',
      'hra',
      'admin',
      'support',
      'ceo'],

      '/executive/enterprise-execution': ['ceo'],
      '/admin/audit-log': ['admin', 'ceo']
    };
    // Persona-scoped subtree restrictions — routes inside these prefixes
    // are only reachable for the listed personas. Anything else falls
    // through to a placeholder page.
    const scopedPrefixes: {
      prefix: string;
      allowed: PersonaId[];
    }[] = [
    {
      prefix: '/admin/',
      allowed: ['admin']
    },
    {
      prefix: '/executive/',
      allowed: ['ceo']
    },
    {
      prefix: '/hra/',
      allowed: ['hra']
    },
    {
      prefix: '/support/',
      allowed: ['support']
    },
    {
      prefix: '/agile/',
      allowed: ['scrum-master']
    },
    {
      prefix: '/team/',
      allowed: ['team-lead']
    },
    {
      prefix: '/unit/',
      allowed: ['unit-lead']
    }];

    if (accessMap[route]) {
      return accessMap[route].includes(persona.id);
    }
    for (const { prefix, allowed } of scopedPrefixes) {
      if (route.startsWith(prefix)) {
        return allowed.includes(persona.id);
      }
    }
    // Placeholder / unmapped routes — let the placeholder page render.
    return true;
  };
  return (
    <PersonaContext.Provider
      value={{
        activePersonaId,
        activePersona,
        setActivePersona: setActivePersonaId,
        getDefaultRoute,
        hasRouteAccess
      }}>
      
      {children}
    </PersonaContext.Provider>);

}
export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}