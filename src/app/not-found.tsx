import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-cream px-4 py-16">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-gold">404</p>
        <h1 className="mt-3 font-display text-3xl font-bold">Page Not Found</h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-navy mt-8">
          Return to the homepage
        </Link>
      </div>
    </section>
  );
}
