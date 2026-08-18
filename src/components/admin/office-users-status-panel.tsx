import type { OfficeDailySummaryStatus } from "@/lib/office/daily-checklist";

const STATUS_COPY: Record<
  OfficeDailySummaryStatus,
  { emoji: string; label: string; tone: string }
> = {
  completed: {
    emoji: "🟢",
    label: "Daily checklist completed",
    tone: "text-emerald-800",
  },
  "in-progress": {
    emoji: "🟡",
    label: "Daily checklist in progress",
    tone: "text-amber-800",
  },
  "not-started": {
    emoji: "🔴",
    label: "Daily checklist not completed",
    tone: "text-red-800",
  },
};

type OfficeUserStatus = {
  username: string;
  status: OfficeDailySummaryStatus;
  progressLabel: string;
};

type OfficeUsersStatusPanelProps = {
  users: OfficeUserStatus[];
  dateLabel: string;
};

export function OfficeUsersStatusPanel({ users, dateLabel }: OfficeUsersStatusPanelProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      <p className="eyebrow">Office users</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">Office Users</h2>
      <p className="mt-2 text-sm text-[var(--color-muted)]">Today: {dateLabel}</p>

      {users.length === 0 ? (
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
          No office users are configured yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {users.map((user) => {
            const copy = STATUS_COPY[user.status];

            return (
              <li
                key={user.username}
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 px-5 py-4"
              >
                <p className="font-semibold text-[var(--color-ink)]">{user.username}</p>
                <p className={`mt-2 text-sm ${copy.tone}`}>
                  {copy.emoji} {copy.label}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">Checklist progress: {user.progressLabel}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
