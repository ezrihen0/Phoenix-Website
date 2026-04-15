import type { CmsStorageStatus } from "@/lib/cms/storage";

type AdminStorageUnavailablePanelProps = {
    title: string;
    description: string;
};

export function AdminStorageStatusBanner({
    status,
}: {
    status: CmsStorageStatus;
}) {
    if (status.healthy) {
        return null;
    }

    const toneClasses =
        status.tone === "error"
            ? "border-red-200 bg-red-50 text-red-900"
            : "border-amber-200 bg-amber-50 text-amber-900";
    const labelClasses =
        status.tone === "error"
            ? "bg-red-100 text-red-800"
            : "bg-amber-100 text-amber-800";

    return (
        <div className={`rounded-[2rem] border px-5 py-5 sm:px-6 ${toneClasses}`}>
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${labelClasses}`}>
                        {status.label}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] opacity-75">
                        CMS storage status
                    </span>
                </div>
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">{status.title}</h2>
                    <p className="mt-2 max-w-4xl text-sm leading-7">{status.message}</p>
                    <p className="mt-2 text-sm leading-7 opacity-80">
                        Fix the Blob configuration in Vercel, redeploy, and refresh admin before generating or saving content.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function AdminStorageUnavailablePanel({
    title,
    description,
}: AdminStorageUnavailablePanelProps) {
    return (
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">{description}</p>
        </div>
    );
}