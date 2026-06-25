'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { useProfileStore } from '@/store/profileStore'

export default function SetupPage() {
  const router = useRouter()
  const setProfile = useProfileStore((s) => s.setProfile)
  const today = format(new Date(), 'yyyy-MM-dd')

  const [form, setForm] = useState({
    heightFt: 6, heightIn: 3,
    currentWeight: 130, goalWeight: 150, age: 25,
    dailyCalorieTarget: 3000, proteinTarget: 150, carbTarget: 400, fatTarget: 80,
    dairyFree: true, eggFree: true, avocadoFree: true,
    workoutStartDate: today,
  })

  const set = (field: string, value: unknown) => setForm((p) => ({ ...p, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile({
      heightInches: form.heightFt * 12 + form.heightIn,
      currentWeight: form.currentWeight,
      goalWeight: form.goalWeight,
      age: form.age,
      dailyCalorieTarget: form.dailyCalorieTarget,
      proteinTarget: form.proteinTarget,
      carbTarget: form.carbTarget,
      fatTarget: form.fatTarget,
      dairyFree: form.dairyFree,
      eggFree: form.eggFree,
      avocadoFree: form.avocadoFree,
      workoutStartDate: form.workoutStartDate,
      setupComplete: true,
    })
    router.push('/dashboard')
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="min-h-full flex items-start justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Weekly Planner</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Set up your profile once — the app pre-fills your goals from here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* About You */}
          <section className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">About You</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <input type="number" min={4} max={8} value={form.heightFt}
                    onChange={(e) => set('heightFt', +e.target.value)}
                    className="w-16 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-500">ft</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input type="number" min={0} max={11} value={form.heightIn}
                    onChange={(e) => set('heightIn', +e.target.value)}
                    className="w-16 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-500">in</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { field: 'currentWeight', label: 'Current Weight', unit: 'lbs' },
                { field: 'goalWeight', label: 'Goal Weight', unit: 'lbs' },
              ].map(({ field, label, unit }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="flex items-center gap-1.5">
                    <input type="number" min={50} max={500}
                      value={form[field as keyof typeof form] as number}
                      onChange={(e) => set(field, +e.target.value)}
                      className={inputCls} />
                    <span className="text-sm text-gray-500 shrink-0">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" min={13} max={120} value={form.age}
                onChange={(e) => set('age', +e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </section>

          {/* Daily Targets */}
          <section className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Daily Targets</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { field: 'dailyCalorieTarget', label: 'Calories', unit: 'kcal' },
                { field: 'proteinTarget', label: 'Protein', unit: 'g' },
                { field: 'carbTarget', label: 'Carbs', unit: 'g' },
                { field: 'fatTarget', label: 'Fat', unit: 'g' },
              ].map(({ field, label, unit }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="flex items-center gap-1.5">
                    <input type="number" min={0}
                      value={form[field as keyof typeof form] as number}
                      onChange={(e) => set(field, +e.target.value)}
                      className={inputCls} />
                    <span className="text-sm text-gray-500 shrink-0">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dietary Preferences */}
          <section className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-900">Dietary Preferences</h2>
            {[
              { field: 'dairyFree', label: 'Dairy-free' },
              { field: 'eggFree', label: 'Egg-free' },
              { field: 'avocadoFree', label: 'Avocado-free' },
            ].map(({ field, label }) => (
              <label key={field} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox"
                  checked={form[field as keyof typeof form] as boolean}
                  onChange={(e) => set(field, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </section>

          {/* Workout Schedule */}
          <section className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-gray-900">Workout Schedule</h2>
            <p className="text-sm text-gray-500">
              Workouts alternate A → B every other day starting from this date.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Workout Day</label>
              <input type="date" value={form.workoutStartDate}
                onChange={(e) => set('workoutStartDate', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </section>

          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition-colors">
            Get Started →
          </button>
        </form>
      </div>
    </div>
  )
}
