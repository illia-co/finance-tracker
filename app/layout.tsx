import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SuppressHydrationWarning from '@/components/SuppressHydrationWarning'
import { BalanceVisibilityProvider } from '@/contexts/BalanceVisibilityContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import BalanceToggleButton from '@/components/BalanceToggleButton'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finance Tracker',
  description: 'Track your financial portfolio and net worth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress hydration warnings from browser extensions
              (function() {
                const originalError = console.error;
                const originalWarn = console.warn;
                
                console.error = function(...args) {
                  const message = args[0]?.toString() || '';
                  if (
                    message.includes('Extra attributes from the server') ||
                    message.includes('cz-shortcut-listen') ||
                    message.includes('data-new-gr-c-s-check-loaded') ||
                    message.includes('data-gr-ext-installed')
                  ) {
                    return;
                  }
                  originalError.apply(console, args);
                };
                
                console.warn = function(...args) {
                  const message = args[0]?.toString() || '';
                  if (
                    message.includes('Extra attributes from the server') ||
                    message.includes('cz-shortcut-listen') ||
                    message.includes('data-new-gr-c-s-check-loaded') ||
                    message.includes('data-gr-ext-installed')
                  ) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <SuppressHydrationWarning />
        <ThemeProvider>
          <BalanceVisibilityProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Finance Tracker
                    </h1>
                  </div>
                    <div className="flex items-center space-x-4">
                      <BalanceToggleButton />
                      <ThemeToggle />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Track your net worth
                      </span>
                    </div>
                  </div>
                </div>
              </nav>
              <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>
          </BalanceVisibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
