import { StaticPageLayout } from "../components/ui/StaticPageLayout";

export default function Contact() {
  return (
    <StaticPageLayout title="Contact Us">
      <p>
        Have questions about KisanAlert or need support? Our team is here to help you get the most out of our precision agriculture platform.
      </p>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)]">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Technical Support</h3>
          <p className="text-[var(--text-secondary)] mb-6 text-sm">
            Issues with the dashboard, SMS alerts, or AI diagnostics? 
          </p>
          <a href="mailto:support@kisanalert.com" className="font-medium text-[var(--accent)] hover:underline">
            support@kisanalert.com
          </a>
        </div>

        <div className="p-8 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)]">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Enterprise Sales</h3>
          <p className="text-[var(--text-secondary)] mb-6 text-sm">
            Interested in deploying our models across your cooperative or agribusiness?
          </p>
          <a href="mailto:sales@kisanalert.com" className="font-medium text-[var(--accent)] hover:underline">
            sales@kisanalert.com
          </a>
        </div>
      </div>
    </StaticPageLayout>
  );
}
