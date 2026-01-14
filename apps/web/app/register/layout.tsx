import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Cadastro - Campanha",
    description: "Cadastre-se para fazer parte da nossa campanha",
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`}>
                <div className="min-h-screen flex flex-col">
                    {/* Header */}
                    <header className="py-6 px-4">
                        <div className="container mx-auto max-w-lg">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-white">🗳️ Campanha</h1>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 flex items-center justify-center px-4 py-8">
                        {children}
                    </main>

                    {/* Footer */}
                    <footer className="py-4 px-4 text-center">
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} Campanha. Todos os direitos reservados.
                        </p>
                    </footer>
                </div>
            </body>
        </html>
    );
}
