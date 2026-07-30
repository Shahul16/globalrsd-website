import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import EnrolPanel from "@/components/EnrolPanel";
import { courses, getCourse } from "@/lib/data/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/courses/${course.slug}` },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <p className="animate-fadeUp text-sm font-semibold uppercase tracking-widest text-gold">
            {course.category} · {course.level}
          </p>
          <h1 className="mt-3 max-w-3xl animate-fadeUp font-display text-3xl font-bold text-white sm:text-4xl" style={{ animationDelay: "100ms" }}>
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl animate-fadeUp text-lg text-slate-300" style={{ animationDelay: "200ms" }}>
            {course.summary}
          </p>
          <p className="mt-4 animate-fadeUp text-sm font-medium text-slate-300" style={{ animationDelay: "300ms" }}>
            {course.duration} · {course.effort} · Fully online
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <Reveal>
            <h2 className="flourish font-display text-2xl font-bold">Course Description</h2>
            <p className="mt-5 leading-relaxed">{course.description}</p>
          </Reveal>

          <Reveal>
            <h2 className="mt-12 font-display text-2xl font-bold">Syllabus</h2>
            <div className="mt-5 space-y-4">
              {course.syllabus.map((m) => (
                <details key={m.module} className="card group p-0">
                  <summary className="cursor-pointer list-none p-5 font-display text-lg font-bold text-navy transition group-open:text-gold-dark">
                    {m.module}
                  </summary>
                  <ul className="space-y-2 px-5 pb-5 text-sm text-slate-600">
                    {m.topics.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span aria-hidden="true" className="text-gold-dark">◆</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-2xl font-bold">Online Support</h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {course.support.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden="true" className="text-gold-dark">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Assessment</h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {course.assessment.map((a) => (
                    <li key={a} className="flex gap-2">
                      <span aria-hidden="true" className="text-gold-dark">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-12 rounded-lg border-l-4 border-gold bg-cream p-6">
              <h2 className="font-display text-xl font-bold">Certification</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{course.certification}</p>
            </div>
          </Reveal>
        </div>

        <aside aria-label="Enrolment">
          <EnrolPanel courseSlug={course.slug} price={course.price} />
        </aside>
      </div>
    </>
  );
}
