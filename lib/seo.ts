import type { Metadata } from "next";
export const buildServicePage = (s: { title: string; metaDescription: string }): Metadata => ({ title: s.title, description: s.metaDescription });
export const buildCityPage = (c: { title: string; metaDescription: string }): Metadata => ({ title: c.title, description: c.metaDescription });