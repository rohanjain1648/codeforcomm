import { StaticPageLayout } from "../components/ui/StaticPageLayout";

export default function Privacy() {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p>
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <p>
        KisanAlert ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by KisanAlert.
      </p>
      
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as your phone number (for SMS alerts), location data (to provide hyper-local weather and crop recommendations), and any images you upload for AI crop disease diagnostics.
      </p>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">How We Use Your Information</h2>
      <p>
        Your data is used strictly to provide and improve our services. Location data is sent to Google Earth Engine to retrieve NDVI and soil moisture levels. Uploaded images are processed by Google Gemini to provide diagnostic feedback. We do not sell your personal data to third parties.
      </p>

      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Data Retention</h2>
      <p>
        We retain your data only for as long as necessary to provide you with our services. You may request deletion of your data at any time by contacting support.
      </p>
    </StaticPageLayout>
  );
}
