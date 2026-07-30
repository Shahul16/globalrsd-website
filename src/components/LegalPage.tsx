import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} intro={`Last updated: ${updated}`} />
      <article className="prose-legal mx-auto max-w-3xl px-4 py-14 text-slate-700">
        {children}
        <hr className="my-8 border-slate-200" />
        <p className="text-sm text-slate-500">{SITE.companyLine}</p>
      </article>
    </>
  );
}
