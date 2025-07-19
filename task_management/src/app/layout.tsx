import { dmSans } from "@/lib/font";
import "@/styles/globals.css";

export const metadata = {
  title: "App",
  description: "App description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
