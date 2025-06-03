import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Internexus | Your Central Hub for Growth and Impact',
  description: 'Transform your internship experience with an intelligent task and progress management platform designed for ambitious interns.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background-light">
            <NavBar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 