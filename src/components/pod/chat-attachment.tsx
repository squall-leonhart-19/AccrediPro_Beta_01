import { FileText, FileSpreadsheet, Video, Download, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatAttachmentProps {
    type: "pdf" | "spreadsheet" | "video" | "doc";
    title: string;
    description: string;
    valuePrice?: string;
    downloadUrl: string;
    isUnlocked?: boolean;
}

export function ChatAttachment({
    type,
    title,
    description,
    valuePrice = "$47",
    downloadUrl,
    isUnlocked = true
}: ChatAttachmentProps) {

    const getIcon = () => {
        switch (type) {
            case "spreadsheet": return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
            case "video": return <Video className="w-8 h-8 text-rose-500" />;
            case "doc": return <FileText className="w-8 h-8 text-blue-500" />;
            default: return <FileText className="w-8 h-8 text-rose-500" />; // PDF default
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case "spreadsheet": return "EXCEL TEMPLATE";
            case "video": return "MASTERCLASS";
            case "doc": return "WORD DOC";
            default: return "PDF GUIDE";
        }
    };

    return (
        <div className="mt-3 mb-1 w-full max-w-sm group">
            <div className={cn(
                "relative overflow-hidden rounded-xl border border-gold-400/30 bg-gradient-to-br from-white to-orange-50/50 shadow-lg transition-all hover:shadow-gold-500/10 hover:border-gold-400/60",
                !isUnlocked && "opacity-90 grayscale-[0.3]"
            )}>

                {/* Top Banner / Badge */}
                <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-burgundy-900 to-burgundy-800 text-white">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gold-400 flex items-center gap-1.5">
                        {isUnlocked ? <Sparkles className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {getTypeLabel()}
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-white/90">
                        {valuePrice} VALUE
                    </span>
                </div>

                {/* Content Body */}
                <div className="p-4 flex gap-4">
                    <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                        {getIcon()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1 group-hover:text-burgundy-900 transition-colors">
                            {title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="px-4 pb-4">
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "flex items-center justify-center w-full gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                            isUnlocked
                                ? "bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-950 hover:from-gold-300 hover:to-gold-400 shadow-md hover:shadow-lg translate-y-0 hover:-translate-y-0.5"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        )}
                        onClick={(e) => !isUnlocked && e.preventDefault()}
                    >
                        {isUnlocked ? (
                            <>
                                <Download className="w-3.5 h-3.5" />
                                DOWNLOAD RESOURCE
                            </>
                        ) : (
                            <>
                                <Lock className="w-3.5 h-3.5" />
                                LOCKED AWAITING UNLOCK
                            </>
                        )}
                    </a>
                </div>

                {/* Decorative background glow */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />
            </div>
        </div>
    );
}
