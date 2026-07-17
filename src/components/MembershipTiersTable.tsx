"use client";

import { Check, X } from "lucide-react";
import Reveal from "./Reveal";

const tiers = [
  {
    name: "Student",
    price: "£49",
    period: "per year",
    description: "For currently enrolled undergraduate and postgraduate students.",
    features: {
      "Conference Discount": "15%",
      "Course Discount": "10%",
      "Mentoring": true,
      "Members-only Briefings": true,
      "Voting Rights": false,
      "Research Grants": false,
    },
  },
  {
    name: "Professional",
    price: "£149",
    period: "per year",
    description: "For academics, researchers, and industry professionals.",
    featured: true,
    features: {
      "Conference Discount": "30%",
      "Course Discount": "20%",
      "Mentoring": true,
      "Members-only Briefings": true,
      "Voting Rights": true,
      "Research Grants": true,
    },
  },
  {
    name: "Institutional",
    price: "£599",
    period: "per year",
    description: "For universities, research centers, and organizations.",
    features: {
      "Conference Discount": "Group (40%)",
      "Course Discount": "Group (30%)",
      "Mentoring": "For 5 staff",
      "Members-only Briefings": true,
      "Voting Rights": true,
      "Research Grants": true,
    },
  },
];

const allFeatures = [
  "Conference Discount",
  "Course Discount",
  "Mentoring",
  "Members-only Briefings",
  "Voting Rights",
  "Research Grants",
];

export default function MembershipTiersTable() {
  return (
    <div className="mt-16 overflow-x-auto">
      <div className="min-w-[800px] pb-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="pt-32">
            <h3 className="text-lg font-bold text-navy">Key Benefits</h3>
            <p className="mt-2 text-sm text-slate-500">Compare our membership plans to find the best fit for you.</p>
          </div>
          
          {tiers.map((tier) => (
            <Reveal key={tier.name} className={`flex flex-col rounded-2xl p-6 ${tier.featured ? 'bg-navy text-white ring-4 ring-gold/20 shadow-xl' : 'bg-cream text-navy'}`}>
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className={`text-sm ${tier.featured ? 'text-slate-300' : 'text-slate-500'}`}>{tier.period}</span>
              </div>
              <p className={`mt-4 text-sm leading-relaxed ${tier.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                {tier.description}
              </p>
              <button className={`mt-8 w-full rounded-lg py-2.5 text-sm font-bold transition ${tier.featured ? 'bg-gold text-navy hover:bg-gold-light' : 'bg-navy text-white hover:bg-navy-light'}`}>
                Join as {tier.name}
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          {allFeatures.map((feature) => (
            <div key={feature} className="grid grid-cols-4 items-center gap-4 border-b border-slate-100 py-4">
              <div className="text-sm font-semibold text-slate-700">{feature}</div>
              {tiers.map((tier) => (
                <div key={`${tier.name}-${feature}`} className="text-center">
                  {typeof tier.features[feature as keyof typeof tier.features] === 'string' ? (
                    <span className="text-sm font-bold">{tier.features[feature as keyof typeof tier.features]}</span>
                  ) : tier.features[feature as keyof typeof tier.features] ? (
                    <Check className="mx-auto h-5 w-5 text-gold" />
                  ) : (
                    <X className="mx-auto h-5 w-5 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
