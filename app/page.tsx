import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { RealWorkProof } from "@/components/home/RealWorkProof";
import { StaticReviews } from "@/components/home/StaticReviews";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return <><Hero /><TrustBar /><ServicesOverview /><RealWorkProof /><StaticReviews /><FinalCTA /></>;
}