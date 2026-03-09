import { Inter } from "next/font/google";
import "./globals.css";

const Font_Inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Synthera",
  description: "Synthera - E Course Subscription Membership",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${Font_Inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
