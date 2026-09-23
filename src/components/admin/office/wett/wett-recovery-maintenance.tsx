"use client";

import { useEffect } from "react";

import { purgeExpiredWettLocalRecovery } from "@/lib/wett/local-recovery";

export function WettRecoveryMaintenance() {
  useEffect(() => {
    purgeExpiredWettLocalRecovery();
  }, []);

  return null;
}
