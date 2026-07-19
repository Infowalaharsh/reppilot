
# Nextrep MVP — Full Functionality Pass

Every screen becomes real: create/edit workouts, log sets, track nutrition and body weight, see progress graphs, and edit your profile. All data persists in localStorage (Cloud can come later; MVP scope keeps it fast and offline-first per the current architecture).

## Scope (in order)

### 1. Data layer (foundation)
- Extend `types.ts` with: `Meal`, `WeightLog`, `Measurement`, custom `ExerciseLibraryItem`, per-exercise `notes`, `rpe`, `tempo`, favorites, recents.
- Extend `storage.ts` with granular actions: `updatePlan`, `addDay`, `updateDay`, `deleteDay`, `reorderExercises`, `addExercise`, `updateExercise`, `deleteExercise`, `duplicateExercise`, `addMeal`, `deleteMeal`, `logWeight`, `addMeasurement`, `updateProfile`, `updateGoals`, `saveCustomExercise`, `toggleFavoriteExercise`.
- Add a seeded exercise library (`lib/nextrep/library.ts`) with ~60 common exercises across Chest/Back/Shoulders/Legs/Arms/Core/Cardio.
- Selectors: `getLastPerformance(exerciseId)`, `getPRs()`, `getVolumeByDay()`, `getWeightHistory()`, `todayNutritionTotals()`.

### 2. Workout builder
- `/workout` (existing) — list of days with edit/delete/duplicate, "New day" button, drag handle to reorder days.
- New `/workout/day/$dayId/edit` — edit day name/focus, list exercises with drag-to-reorder (dnd-kit), edit/delete/duplicate, "Add exercise" opens library sheet.
- New `/workout/day/new` — pick template (Push/Pull/Legs/Upper/Lower/Full/Custom) or start empty.
- Exercise editor sheet — configure name, muscle, equipment, notes, rest, sets, target reps min/max, target weight, RPE, tempo.
- Exercise library sheet — search bar, category tabs, favorites, recents, "Create custom" flow. Selecting adds to current day with sensible defaults.

### 3. Session logger (already exists, upgrade)
- Show "Previous: 60kg × 8 × 3" line per exercise from last completed session.
- Pre-fill target weight from progressive overload recommendation.
- Auto-save logs to localStorage as user types (draft session), restore on refresh.
- Rest timer already good; add browser Notification/vibration on end.
- Confirm dialog on "Finish" if any sets incomplete.

### 4. Nutrition
- Add meal flow: pick meal slot → search foods (seeded ~40 common foods with kcal/P/C/F per 100g) or add custom → set grams → save.
- Meal cards show real totals; tap to expand items; swipe/long-press to delete.
- Rings update from today's totals; water tracker with +250ml buttons.
- Foods stored under `state.meals: Meal[]` with `date` (YYYY-MM-DD).

### 5. Progress
- Weight chart (recharts) from `weightLogs`; "Log weight" button.
- Strength progress: pick exercise → chart of top-set weight over time.
- Workout frequency: bar chart of sessions per week for last 8 weeks.
- PR list already exists; wire to real names from library/plan.
- Body measurements: chest/waist/arms/thighs entries with history.

### 6. Home dashboard
- Real calories/protein consumed today (from meals).
- Real "Recent PR" from sessions.
- Recovery score: quick check-in modal (sleep 1-5, stress 1-5, fatigue 1-5) → score 0-100, stored daily.
- "Quick start workout" jumps to today's day; if none scheduled, opens picker.

### 7. Profile
- Editable form for name/age/height/weight/goal/activity/split/units.
- Changing split regenerates plan (with confirm — preserves existing session history).
- Reset app data (with confirm).
- Units toggle (kg/lb) — display-only conversion helpers.

### 8. UX polish
- Add `sonner` toasts on save/delete/PR.
- `AlertDialog` (shadcn) for destructive actions.
- Loading skeletons on route mount where state hydrates.
- Consistent primary button (`<Button variant>` via existing shadcn).
- Fix hydration: all pages use `ssr: false` already; keep it.

## Technical notes

- Stack unchanged: TanStack Start + Router, Tailwind v4, shadcn, localStorage via `storage.ts` + `useAppState` hook + `nextrep:state` event bus.
- New deps: `@dnd-kit/core`, `@dnd-kit/sortable`, `recharts` (already common), `sonner` (check if present).
- File structure additions:
  - `src/lib/nextrep/library.ts` (exercises + foods seed)
  - `src/lib/nextrep/selectors.ts`
  - `src/components/nextrep/ExerciseLibrarySheet.tsx`
  - `src/components/nextrep/ExerciseEditorSheet.tsx`
  - `src/components/nextrep/ConfirmDialog.tsx`
  - `src/components/nextrep/WeightChart.tsx`, `StrengthChart.tsx`, `FrequencyChart.tsx`
  - `src/routes/workout.day.$dayId.edit.tsx`
  - `src/routes/workout.day.new.tsx`
- Progressive overload rule (already in `plan.ts`) extended: track consecutive failures per exercise; after 2 in a row, recommend `-10%` deload; surface on Home + session start.
- All list mutations produce new arrays (immutable) via `updateState`.

## Out of scope for this pass

- Real backend / Cloud sync (state stays local; can migrate later).
- AI coach chat and AI photo food estimation (feature stubs remain hidden, not shown as fake buttons).
- Push notifications beyond in-tab Notification API + vibration.

I'll implement top-to-bottom in the order above and verify with a build + a quick Playwright smoke on the workout builder → logger → progress loop.
