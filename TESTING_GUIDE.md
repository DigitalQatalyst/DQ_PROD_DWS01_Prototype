# Role-Based Navigation Testing Guide

## Quick Start

1. **Start the dev server** (already running):
   ```
   npm run dev
   ```
   Server: http://localhost:5174/

2. **Open the application** in your browser

3. **Locate the role switcher** in the topbar (top-right area)

## Test Scenarios

### Test 1: Associate Role
**Steps:**
1. Switch to "Associate" role in topbar
2. Observe sidebar navigation

**Expected Results:**
- ✅ See: ORIENTATION (Home, Dashboard, AI Cockpit)
- ✅ See: MARKETPLACE (4D Marketplaces)
- ✅ See: TASKS (all groups)
  - Should NOT see "Team Task View" in Task Board
- ✅ See: SERVICES (Hub, Catalogue, Intake)
  - Should NOT see "Fulfilment Queues"
- ✅ See: TRACKER (partial - My Tracker, Request Status, Actions, Blockers)
  - Should NOT see "Team Tracker Overview"
  - Should NOT see "Decision & Outcome Tracker"
- ✅ See: PERFORMANCE (My Performance only)
  - Should NOT see Team/Unit Performance
- ❌ Should NOT see: WORKFLOWS
- ❌ Should NOT see: ANALYTICS
- ❌ Should NOT see: GOVERNANCE
- ❌ Should NOT see: ADMINISTRATION

### Test 2: Lead Role
**Steps:**
1. Switch to "Scrum Master" or "Team / Squad Lead" or "Unit Lead" role in topbar
2. Observe sidebar navigation

**Expected Results:**
- ✅ See: All TASKS groups including "Team Task View"
- ✅ See: All SERVICES groups including "Fulfilment Queues"
- ✅ See: All TRACKER groups
- ✅ See: All WORKFLOWS groups except Routing & Templates
- ✅ See: PERFORMANCE (My, Team, Unit, SLA, Outcome)
- ✅ See: ANALYTICS (all except Governance Analytics limited)
- ✅ See: GOVERNANCE (most groups)
- ❌ Should NOT see: ADMINISTRATION

### Test 3: GovernanceLead Role
**Steps:**
1. Switch to "HRA" or "Support" role in topbar
2. Observe sidebar navigation

**Expected Results:**
- ✅ See: TASKS (execution views)
- ✅ See: SERVICES (limited)
- ✅ See: TRACKER (full)
- ✅ See: WORKFLOWS (Centre, Inbox, Handoffs)
  - Should NOT see "Routing & State Control"
  - Should NOT see "Templates"
- ✅ See: PERFORMANCE (Team, Unit, SLA, Outcome)
  - Should NOT see "My Performance"
- ✅ See: ANALYTICS (SLA, Governance, Outcome)
- ✅ See: GOVERNANCE (full access)
  - Should see "Audit Log", "Activity History", "Access History"
- ❌ Should NOT see: ADMINISTRATION

### Test 4: Leadership Role
**Steps:**
1. Switch to "CEO" role in topbar
2. Observe sidebar navigation

**Expected Results:**
- ✅ See: ORIENTATION, MARKETPLACE
- ✅ See: TRACKER (Team Tracker, Blockers/SLA, Decisions only)
  - Should NOT see "My Tracker", "Request Status", "Actions"
- ✅ See: PERFORMANCE (Team, Unit, SLA, Outcome)
- ✅ See: ANALYTICS (full)
- ✅ See: GOVERNANCE (Review, Discipline, limited Audit)
  - Should see "Evidence Trail", "Compliance View"
  - Should NOT see "Audit Log", "Activity History", "Access History"
- ❌ Should NOT see: TASKS
- ❌ Should NOT see: SERVICES
- ❌ Should NOT see: WORKFLOWS
- ❌ Should NOT see: ADMINISTRATION

### Test 5: PlatformAdmin Role
**Steps:**
1. Switch to "Admin" role in topbar
2. Observe sidebar navigation

**Expected Results:**
- ✅ See: Everything from all other roles
- ✅ See: ADMINISTRATION feature area with all 5 feature groups:
  - User & Role Management
  - Organisation / Unit / Team Setup
  - Task & Request Configuration
  - Workflow, Approval & SLA Rules
  - Integration, Audit & Automation Settings

### Test 6: Route Access Control
**Steps:**
1. Switch to "Associate" role
2. Navigate to a task page (e.g., `/tasks/my-work/assigned-tasks`)
3. Manually enter `/administration/user-role-management/user-directory` in browser address bar
4. Press Enter

**Expected Results:**
- ❌ Page should redirect to `/tasks/my-work/assigned-tasks` (Associate default route)
- User should not see the Administration page

**Alternative Test:**
1. Switch to "CEO" role
2. Manually enter `/tasks/my-work/assigned-tasks` in browser address bar
3. Press Enter

**Expected Results:**
- ❌ Page should redirect to `/analytics/execution-analytics/execution-overview` (Leadership default route)

### Test 7: Expand/Collapse Preservation
**Steps:**
1. Switch to "Lead" role
2. Expand "TASKS > My Work"
3. Expand "SERVICES > Service Hub"
4. Switch to "Associate" role
5. Switch back to "Lead" role

**Expected Results:**
- ✅ Expanded groups should remain expanded after role change
- ✅ "My Work" still expanded
- ✅ "Service Hub" still expanded
- ✅ State persists in localStorage

### Test 8: Active Route Highlighting
**Steps:**
1. Switch to "Lead" role
2. Click on "TASKS > My Work > Assigned Tasks"
3. Observe sidebar

**Expected Results:**
- ✅ "My Work" group should show as active
- ✅ "Assigned Tasks" should show as active
- ✅ Active indicator bar (vertical blue line) should appear on left

### Test 9: Feature Group Visibility Logic
**Steps:**
1. Switch to "Associate" role
2. Look at SERVICES area
3. Count visible feature groups

**Expected Results:**
- ✅ "Service Hub" visible (all items visible to Associate)
- ✅ "Service Catalogue" visible (all items visible to Associate)
- ✅ "Request Intake & Submission" visible (all items visible to Associate)
- ❌ "Fulfilment Queues" NOT visible (no items visible to Associate)
- ✅ "Service Closure & Feedback" visible (some items visible to Associate)

### Test 10: Mixed Visibility Within Feature Group
**Steps:**
1. Switch to "Associate" role
2. Expand "TASKS > Closure Reviews"
3. Count visible features

**Expected Results:**
- ✅ "Request Closure Review" visible
- ✅ "Closure Checklist" visible
- ❌ "Evidence Review" NOT visible (Lead+ only)
- ❌ "Return for Rework" NOT visible (Lead+ only)
- ❌ "Close Task" NOT visible (Lead+ only)

**Then:**
1. Switch to "Lead" role
2. Expand "TASKS > Closure Reviews"

**Expected Results:**
- ✅ All 5 features now visible

## Visual Verification Checklist

For each role, verify:
- [ ] Feature Areas display correctly (uppercase labels, no icons)
- [ ] Feature Groups display correctly (icon + label + chevron)
- [ ] Features display correctly (text-only, indented)
- [ ] Expand/collapse animations work smoothly
- [ ] Active route highlighting works
- [ ] No JavaScript errors in console
- [ ] Sidebar scrolling works if content exceeds viewport
- [ ] Role name displays correctly in topbar

## Known Working Roles (from segments.ts)

The application supports these WorkspaceRole values:
- "Associate" → maps to DwsRole "Associate"
- "Scrum Master" → maps to DwsRole "Lead"
- "Team / Squad Lead" → maps to DwsRole "Lead"
- "Unit Lead" → maps to DwsRole "Lead"
- "HRA" → maps to DwsRole "GovernanceLead"
- "Admin" → maps to DwsRole "PlatformAdmin"
- "Support" → maps to DwsRole "GovernanceLead"
- "CEO" → maps to DwsRole "Leadership"

## Troubleshooting

### Sidebar doesn't update after role change
- Check browser console for errors
- Verify `activeDwsRole` is updating in React DevTools
- Check localStorage for `dws-active-role` key

### All navigation items visible regardless of role
- Check `filterNavByRole()` function is being called
- Verify `visibleTo` arrays in `roleBasedNavigation.ts`
- Check that items without `visibleTo` have correct logic

### Route redirect not working
- Check `hasRouteAccess()` implementation
- Verify default routes in `src/types/roles.ts`
- Check useEffect dependency array in StandardSidebar

### Build errors
- Run `npm run build` to see TypeScript errors
- Check imports are correct
- Verify all new files are properly exported

## Success Criteria

All tests passing means:
✅ Role-based filtering works correctly  
✅ Route access control works  
✅ UI state persists across role changes  
✅ Visual hierarchy preserved  
✅ No breaking changes to existing functionality  
✅ Performance is acceptable  

---

**Testing Date**: 2026-06-09  
**Dev Server**: http://localhost:5174/  
**Status**: Ready for testing
