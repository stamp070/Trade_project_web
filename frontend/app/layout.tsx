import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { AuthProvider } from "@/components/provider/auth-provider";

const kanit = Kanit({
    weight: ["100", "200", "300", "400", "500"],
    subsets: ["thai"],
    variable: "--font-kanit",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${kanit.className} antialiased min-h-screen bg-main`}>
                <main className="text-main-color max-w-full mx-auto">
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </main>
            </body>
        </html>
    );
}