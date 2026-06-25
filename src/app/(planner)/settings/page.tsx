'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import { useMealStore } from '@/store/mealStore'
import { useWorkoutStore } from '@/store/workoutStore'
import { useWeightStore } from '@/store/weightStore'

export default function SettingsPage() {
  const router = useRouter()
  const profile = useProfileStore((s) => s.profile)
  const updateProfile = useProfileStore((s) => s.updateProfile)
  const resetProfile = useProfileStore((s) => s.resetProfile)
  const resetMeals = useMealStore((s) => s.resetMeals)
  const resetWorkouts = useWorkoutStore((s) => s.resetWorkouts)
  const resetWeightLog = useWeightStore((s) => s.resetWeightLog)

  const [targets, setTargets] = useState({
    dailyCalorieTarget: profile.dailyCalorieTarget,
    proteinTarget: profile.proteinTarget,
    carbTarget: profile.carbTarget,
    fatTarget: profile.fatTarget,
  })
  const [weight, setWeight] = useState(profile.currentWeight)
  const [goalWeight, setGoalWeight] = useState(profile.goalWeight)
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const handleSaveTargets = () => {
    updateProfile({ ...targets, currentWeight: weight, goalWeight })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFullReset = () => {
    resetProfile()
    resetMeals()
    resetWorkouts()
    resetWeightLog()
    router.push('/setup')
  }

  const inputCls = 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full'

  return (
    <div className="p-6 max-w-xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Daily Targets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 space-y-4">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Daily Targets</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories (kcal)</label>
            <input type="number" min={1000} max={6000}
              value={targets.dailyCalorieTarget}
              onChange={(e) => setTargets((p) => ({ ...p, dailyCalorieTarget: +e.target.value }))}
              className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Protein (g)</label>
            <input type="number" min={50} max={400}
              value={targets.proteinTarget}
              onChange={(e) => setTargets((p) => ({ ...p, proteinTarget: +e.target.value }))}
              className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carbs (g)</label>
            <input type="number" min={50} max={800}
              value={targets.carbTarget}
              onChange={(e) => setTargets((p) => ({ ...p, carbTarget: +e.target.value }))}
              className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fat (g)</label>
            <input type="number" min={20} max={300}
              value={targets.fatTarget}
              onChange={(e) => setTargets((p) => ({ ...p, fatTarget: +e.target.value }))}
              className={inputCls} />
          </div>
        </div>
      </div>

      {/* Weight Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 space-y-4">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Weight</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Weight (lbs)</label>
            <input type="number" min={80} max={500} step={0.1}
              value={weight}
              onChange={(e) => setWeight(+e.target.value)}
              className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Weight (lbs)</label>
            <input type="number" min={80} max={500} step={0.1}
              value={goalWeight}
              onChange={(e) => setGoalWeight(+e.target.value)}
              className={inputCls} />
          </div>
        </div>
      </div>

      <button onClick={handleSaveTargets}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          saved
            ? 'bg-emerald-500 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}>
        {saved ? '✓ Saved' : 'Save Changes'}
      </button>

      {/* Profile info (read-only) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Profile</p>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between"><span>Height</span><span className="font-medium text-gray-900 dark:text-white">{Math.floor(profile.heightInches / 12)}′{profile.heightInches % 12}″</span></div>
          <div className="flex justify-between"><span>Age</span><span className="font-medium text-gray-900 dark:text-white">{profile.age}</span></div>
          <div className="flex justify-between"><span>Dairy-free</span><span className="font-medium text-gray-900 dark:text-white">{profile.dairyFree ? 'Yes' : 'No'}</span></div>
          <div className="flex justify-between"><span>Egg-free</span><span className="font-medium text-gray-900 dark:text-white">{profile.eggFree ? 'Yes' : 'No'}</span></div>
          <div className="flex justify-between"><span>Avocado-free</span><span className="font-medium text-gray-900 dark:text-white">{profile.avocadoFree ? 'Yes' : 'No'}</span></div>
        </div>
        <button onClick={() => router.push('/setup')}
          className="mt-4 w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
          Re-run setup wizard →
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-red-100 dark:border-red-900/30">
        <p className="text-xs font-semibold text-red-400 dark:text-red-500 uppercase tracking-wide mb-3">Danger Zone</p>
        {!showReset ? (
          <button onClick={() => setShowReset(true)}
            className="w-full border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg py-2 text-sm font-medium transition-colors">
            Reset All Data
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">This will delete all meals, workouts, and weight entries. Are you sure?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleFullReset}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
