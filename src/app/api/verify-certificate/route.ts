import { NextResponse } from 'next/server';

// Mock database of certificates
const certificates = [
  { id: 'GIRSD-2026-001', name: 'John Doe', course: 'Advanced Research Methods', date: '2026-05-15' },
  { id: 'GIRSD-2026-002', name: 'Jane Smith', course: 'Data Science with Python', date: '2026-06-20' },
];

export async function POST(request: Request) {
  try {
    const { certificateId } = await request.json();
    
    if (!certificateId) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    const cert = certificates.find(c => c.id.toUpperCase() === certificateId.toUpperCase());

    if (cert) {
      return NextResponse.json({ valid: true, cert });
    } else {
      return NextResponse.json({ valid: false, error: 'Certificate not found' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
