"use client";

import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function CertificateVerificationForm() {
  const [certId, setCertId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/verify-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId: certId }),
      });
      const data = await res.json();
      
      if (data.valid) {
        setResult(data.cert);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder="Enter Certificate ID (e.g. GIRSD-2026-001)"
          className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-navy whitespace-nowrap flex items-center justify-center gap-2"
        >
          {status === 'loading' && <Loader2 className="animate-spin h-4 w-4" />}
          Verify Certificate
        </button>
      </form>

      <div className="mt-8">
        {status === 'success' && result && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4 animate-fadeUp">
            <CheckCircle className="text-green-600 h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-900 text-lg">Valid Certificate</h3>
              <div className="mt-2 space-y-1 text-green-800">
                <p><span className="font-semibold">Recipient:</span> {result.name}</p>
                <p><span className="font-semibold">Course:</span> {result.course}</p>
                <p><span className="font-semibold">Issued Date:</span> {result.date}</p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4 animate-fadeUp">
            <XCircle className="text-red-600 h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 text-lg">Verification Failed</h3>
              <p className="mt-1 text-red-800">The certificate ID provided could not be found in our records. Please check the ID and try again.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
