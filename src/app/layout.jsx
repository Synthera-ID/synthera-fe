import { Inter } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/components/atoms/ThemeProvider";

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

export const metadata = {
  title: "Synthera - Subscription Platform",
  description: "Modern subscription membership platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
