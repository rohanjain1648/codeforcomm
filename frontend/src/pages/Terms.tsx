import { StaticPageLayout } from "../components/ui/StaticPageLayout";

export default function Terms() {
  return (
    <StaticPageLayout title="Terms of Service">
      <p>
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <p>
        Please read these Terms of Service ("Terms") carefully before using the KisanAlert application.
      </p>
      
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">1. Acceptance of Terms</h2>
      <p>
        By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
      </p>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">2. Use of Service</h2>
      <p>
        KisanAlert provides agricultural advisory and AI diagnostic tools. These tools are provided "as is" and should be used as supplementary guidance. We do not guarantee crop yields or assume liability for agricultural losses based on our AI recommendations.
      </p>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">3. User Accounts</h2>
      <p>
        You are responsible for safeguarding the password or SMS OTPs that you use to access the service and for any activities or actions under your password.
      </p>
    </StaticPageLayout>
  );
}
