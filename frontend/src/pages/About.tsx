import { StaticPageLayout } from "../components/ui/StaticPageLayout";

export default function About() {
  return (
    <StaticPageLayout title="About Us">
      <p>
        At KisanAlert, our mission is to empower farmers worldwide with precision agriculture tools. We believe that access to high-fidelity weather and satellite data shouldn't be restricted to large agribusinesses.
      </p>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Our Vision</h2>
      <p>
        Climate change has made traditional farming intuition less reliable. By combining Google Earth Engine telemetry with cutting-edge AI diagnostic models, we give farmers a localized, data-driven edge to maximize yields and minimize resource waste.
      </p>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">The Team</h2>
      <p>
        We are a passionate team of engineers, agronomists, and data scientists dedicated to solving one of the world's most pressing challenges: food security in the face of an unpredictable climate.
      </p>
    </StaticPageLayout>
  );
}
