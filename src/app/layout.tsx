import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Weekly Planner',
  description: 'Personal meal & workout planner',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <head>
        {/* Apply dark class synchronously before first paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body className="h-full bg-gray-50 dark:bg-gray-950 antialiased text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  )
}
