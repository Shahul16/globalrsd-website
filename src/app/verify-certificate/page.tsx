import CertificateVerificationForm from "@/components/CertificateVerificationForm";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Verify Certificate | GIRSD",
  description: "Verify the authenticity of certificates issued by the Global Institute of Research & Skills Development.",
};

export default function VerifyCertificatePage() {
  return (
    <main>
      <PageHero
        title="Certificate Verification"
        subtitle="Ensuring the integrity and authenticity of academic achievements."
      />
      
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-navy">Online Verification Service</h2>
            <p className="mt-4 text-slate-600">
              GIRSD provides a secure online verification service to confirm the authenticity of our certificates. 
              Please enter the unique participant code found on your certificate to view its details.
            </p>
          </div>
          
          <CertificateVerificationForm />
          
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            <div className="p-6 bg-cream rounded-xl">
              <h3 className="font-bold text-navy">Why Verify?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Verification protects the value of your achievement and provides confidence to employers and institutions.
              </p>
            </div>
            <div className="p-6 bg-cream rounded-xl">
              <h3 className="font-bold text-navy">Need Help?</h3>
              <p className="mt-2 text-sm text-slate-600">
                If you are having trouble verifying a certificate, please contact our support team at verification@girsd.org.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
