import type { Metadata } from "next";

const mockCustomer = {
  name: "Demo Homeowner",
  address: "Example property record for portal preview only",
  jobStatus: "In Progress",
  scheduledWindow: "Thursday, April 23 · 9:00 AM to 11:00 AM",
  coordinator: "Phoenix Field Team",
  services: [
    {
      name: "WETT Inspection",
      summary: "Documentation-focused inspection, venting check, and appliance safety review.",
      state: "Confirmed",
    },
    {
      name: "Chimney Cleaning",
      summary: "Full sweeping visit with soot removal, draft check, and cleanup.",
      state: "Queued",
    },
  ],
  documents: [
    {
      name: "Invoice",
      detail: "Billing summary and payment receipt will appear here after the visit is closed.",
      action: "Invoice Pending",
    },
    {
      name: "Service Report",
      detail: "Technician notes, findings, and recommendations will be posted after inspection.",
      action: "Report Pending",
    },
  ],
} as const;

const progressSteps = ["Scheduled", "In Progress", "Completed"] as const;

export const metadata: Metadata = {
  title: "Customer Portal | Phoenix Chimney & Fireplace",
  description: "Standalone mock customer portal preview for Phoenix Chimney & Fireplace.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function CustomerPortalPage({
  params,
}: {
  params: Promise<{ portalId: string }>;
}) {
  const { portalId } = await params;
  const resolvedPortalId = decodeURIComponent(portalId);
  const currentStepIndex = progressSteps.findIndex(
    (step) => step === mockCustomer.jobStatus,
  );
  const progressPercentage =
    currentStepIndex <= 0
      ? 12
      : (currentStepIndex / (progressSteps.length - 1)) * 100;

  return (
    <>
      <style>{`
        body:has([data-portal-shell="true"]) {
          background:
            radial-gradient(circle at top, rgba(249, 115, 22, 0.18), transparent 32%),
            linear-gradient(180deg, #0f172a 0%, #020617 100%);
          color: #e2e8f0;
        }

        body:has([data-portal-shell="true"]) > div.relative {
          padding-bottom: 0;
          background: transparent;
        }

        body:has([data-portal-shell="true"]) > div.relative > header,
        body:has([data-portal-shell="true"]) > div.relative > footer,
        body:has([data-portal-shell="true"]) > div.relative > div.fixed {
          display: none;
        }
      `}</style>

      <div data-portal-shell="true" className="min-h-screen bg-transparent text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <header className="rounded-[2rem] border border-slate-800/80 bg-slate-950/85 px-5 py-5 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur md:px-7 md:py-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-orange-400">
                  Customer Portal
                </p>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Phoenix Chimney & Fireplace
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Track the current visit, review scheduled services, and see when your project documents are ready.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 rounded-[1.5rem] border border-slate-800/80 bg-slate-900/80 px-4 py-4 text-sm text-slate-300 sm:min-w-[17rem]">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Portal Access
                  </p>
                  <p className="mt-2 font-mono text-sm text-orange-300">{resolvedPortalId}</p>
                </div>
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Service Window
                  </p>
                  <p className="mt-2 text-slate-100">{mockCustomer.scheduledWindow}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="mt-6 grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="grid gap-6">
              <article className="rounded-[2rem] border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur sm:p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-slate-500">
                      Customer
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      {mockCustomer.name}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                      {mockCustomer.address}
                    </p>
                  </div>

                  <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/12 px-4 py-2 text-sm font-semibold text-orange-200">
                    {mockCustomer.jobStatus}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Project Lead
                    </p>
                    <p className="mt-3 text-base font-medium text-slate-100">
                      {mockCustomer.coordinator}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Your portal will update here first when the technician closes the visit.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Property Status
                    </p>
                    <p className="mt-3 text-base font-medium text-slate-100">
                      Access confirmed and work order active
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      We have your visit window, property details, and requested services ready for dispatch.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[2rem] border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-orange-400">
                      Your Services
                    </p>
                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      Scheduled work for this address
                    </h2>
                  </div>
                  <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {mockCustomer.services.length} items
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  {mockCustomer.services.map((service, index) => (
                    <div
                      key={service.name}
                      className="rounded-[1.6rem] border border-slate-800 bg-slate-900/70 p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-xl">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/14 text-sm font-semibold text-orange-300">
                              0{index + 1}
                            </span>
                            <h3 className="text-lg font-semibold text-white">
                              {service.name}
                            </h3>
                          </div>
                          <p className="mt-4 text-sm leading-7 text-slate-300">
                            {service.summary}
                          </p>
                        </div>

                        <span className="inline-flex rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                          {service.state}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-6">
              <article className="rounded-[2rem] border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur sm:p-6">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-orange-400">
                  Project Status
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Current progress
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  The project is currently marked as {mockCustomer.jobStatus.toLowerCase()}. This card updates as Phoenix moves from booking to site completion.
                </p>

                <div className="mt-6 overflow-hidden rounded-full bg-slate-800/90">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {progressSteps.map((step, index) => {
                    const isComplete = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div
                        key={step}
                        className={`rounded-[1.4rem] border p-4 transition ${
                          isCurrent
                            ? "border-orange-500/40 bg-orange-500/12"
                            : isComplete
                              ? "border-slate-700 bg-slate-900/90"
                              : "border-slate-800 bg-slate-900/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            Step {index + 1}
                          </p>
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isCurrent
                                ? "bg-orange-400"
                                : isComplete
                                  ? "bg-emerald-400"
                                  : "bg-slate-700"
                            }`}
                          />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">{step}</p>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-[2rem] border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur sm:p-6">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-orange-400">
                  Documents
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Reports and billing
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Documents will appear here when the visit is finalized and ready for customer review.
                </p>

                <div className="mt-6 grid gap-4">
                  {mockCustomer.documents.map((document) => (
                    <div
                      key={document.name}
                      className="rounded-[1.6rem] border border-slate-800 bg-slate-900/70 p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-lg">
                          <h3 className="text-lg font-semibold text-white">{document.name}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-300">
                            {document.detail}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/12 px-5 py-3 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/18"
                        >
                          {document.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}