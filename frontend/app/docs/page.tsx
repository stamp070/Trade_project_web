import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import { Download, ChevronRight, Settings, CheckCircle2 } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="space-y-8 p-6 min-h-screen bg-slate-50/50 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">EA Installation Guide</h1>
                    <p className="text-sm text-slate-500 mt-1">Follow these steps carefully to install and configure the Expert Advisor on your MetaTrader 5 terminal.</p>
                </div>
                <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/ea/get-ea`}
                    className="flex items-center gap-2 p-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
                    download
                >
                    <Download className="w-4 h-4" />
                    Download EA
                </a>
            </div>

            <div className="space-y-6">
                <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-100  p-4 px-6 items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">1</div>
                        <h2 className="font-semibold text-slate-800 text-lg">Download & Extract</h2>
                    </div>
                    <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <p className="text-slate-600 leading-relaxed">
                                Begin by downloading the MetaTrader 5 Expert Advisor (EA) file from the button above, or from the <span className="font-medium text-slate-800">"+ MT5 Account"</span> section on your Dashboard.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Extract the downloaded ZIP file to find the <code className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-xs font-mono">expert.ex5</code> file.
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2 border border-slate-200/60 shadow-sm">
                            <Image src="/img/1.EA.png" alt="EA Download" width={400} height={400} className="rounded-lg w-full object-cover" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-100  p-4 px-6 items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">2</div>
                        <h2 className="font-semibold text-slate-800 text-lg">Install into MT5</h2>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="text-slate-600">
                            Open your MT5 Terminal and sign into your trading account. Then, navigate to the data folder to install the EA.
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 shadow-sm flex flex-col items-center gap-4">
                                <div className="text-sm font-medium text-slate-700 flex items-center gap-2 w-full pb-2 border-b border-slate-200">
                                    <span className="text-slate-400">File</span> <ChevronRight className="w-3 h-3 text-slate-400" /> <span className="text-blue-600">Open Data Folder</span>
                                </div>
                                <Image src="/img/2.EA.png" alt="MT5 Options" width={180} height={180} className="rounded-md shadow-sm border border-slate-200" />
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 shadow-sm flex flex-col items-center gap-4">
                                <div className="text-sm font-medium text-slate-700 flex items-center gap-2 w-full pb-2 border-b border-slate-200">
                                    <span className="text-slate-400">MQL5</span> <ChevronRight className="w-3 h-3 text-slate-400" /> <span className="text-blue-600">Experts</span>
                                </div>
                                <Image src="/img/3.EA.png" alt="Experts Folder" width={400} height={400} className="w-full rounded-md shadow-sm border border-slate-200" />
                                <p className="text-xs text-slate-500 text-center">Paste the <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded">expert.ex5</code> file here.</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 text-amber-800 text-sm p-4 rounded-xl border border-amber-200/50 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            <strong>Important:</strong> You must restart your MetaTrader 5 terminal after pasting the file for the EA to appear in your Navigator panel.
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-100  p-4 px-6 items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">3</div>
                        <h2 className="font-semibold text-slate-800 text-lg">Configure Permissions</h2>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div>
                            <p className="text-slate-600 mb-4">
                                The EA needs permission to execute trades autonomously and communicate with our backend servers.
                            </p>
                            <div className="text-sm font-medium text-slate-700 flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 w-fit mb-6">
                                <Settings className="w-4 h-4 text-slate-500" />
                                Navigate to: <span className="text-slate-400">Tools</span> <ChevronRight className="w-3 h-3 text-slate-400" /> <span className="text-blue-600">Options</span> <ChevronRight className="w-3 h-3 text-slate-400" /> <span className="text-blue-600">Expert Advisors</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-700">Check <strong className="text-slate-900">Allow Algorithmic Trading</strong></p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-700">Check <strong className="text-slate-900">Allow WebRequest for listed URL</strong></p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <div className="text-sm text-slate-700">
                                        Add the following URL to the list:
                                        <code className="block mt-2 bg-slate-100 text-slate-800 p-2 rounded-lg text-xs break-all border border-slate-200 select-all">
                                            https://logging-grand-heating-cigarette.trycloudflare.com
                                        </code>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-2 border border-slate-200/60 shadow-sm">
                                <Image src="/img/7.permission.png" alt="Permissions" width={400} height={400} className="w-full rounded-lg" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-100  p-4 px-6 items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">4</div>
                        <h2 className="font-semibold text-slate-800 text-lg">Run the Bot</h2>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                    <p className="text-sm text-slate-600">Turn on the global <strong className="text-emerald-600">Algo Trading</strong> button located on the top toolbar of MT5.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                    <p className="text-sm text-slate-600">Open the chart for the currency pair you want to trade (e.g., EURUSD).</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                    <p className="text-sm text-slate-600">From the Navigator panel, drag the EA onto the chart.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">4</div>
                                    <div className="text-sm text-slate-600">
                                        <p>In the Inputs tab that appears, enter your unique Token (found on your Dashboard) into the <strong className="text-slate-900">InpToken</strong> field and click OK.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 shadow-sm h-fit flex flex-col gap-4">
                                <Image src="/img/8.algotrading.png" alt="Algo Trading" width={400} height={400} className="w-full rounded-lg border border-slate-200 shadow-sm" />
                                <Image src="/img/9.EA-setting.png" alt="EA Setting" width={400} height={400} className="w-full rounded-lg border border-slate-200 shadow-sm" />
                            </div>
                        </div>

                        <div className="bg-emerald-50 text-emerald-800 text-sm p-4 rounded-xl border border-emerald-200/50 text-center font-medium">
                            🎉 Congratulations! Your bot should now be fully connected and executing trades.
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}