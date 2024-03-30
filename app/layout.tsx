import './globals.css'
import { fonts } from './fonts'
import { Providers } from './providers'

export const metadata = {
  title: 'human sort',
  description: 'Relative sorting made simple',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fonts.inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
