/**
 * About page - explains Citilyze mission and values.
 */

export default function AboutPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-4">About Citilyze</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Empowering cities through AI-driven governance and infrastructure intelligence.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">What is Citilyze?</h2>
        <p className="mb-4 leading-relaxed">
          Citilyze is an AI-powered platform that measures and monitors urban stability and
          institutional integrity. By aggregating data from infrastructure systems, governance
          processes, and public reporting, Citilyze provides city leaders and stakeholders with
          real-time insights into the health and resilience of their urban environments.
        </p>
        <p className="leading-relaxed">
          Our platform combines advanced analytics, predictive modeling, and transparent
          methodologies to help cities identify risks, optimize resource allocation, and drive
          evidence-based policymaking.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="leading-relaxed">
          We believe that data-driven governance leads to more resilient, inclusive, and
          sustainable cities. Citilyze's mission is to make governance intelligence accessible and
          actionable for cities of all sizes—enabling leaders to make informed decisions that
          improve quality of life, reduce risk, and strengthen institutional trust.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Core Metrics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Urban Stability Index</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A composite measure of infrastructure resilience, emergency response capability, and
              service continuity. Ranges from 0–100, with higher scores indicating greater urban
              resilience to shocks and crises.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Institutional Integrity Index</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A measure of governance transparency, accountability, and effectiveness. Evaluates
              decision-making maturity, public engagement, and institutional capacity to deliver
              on commitments.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Sustainable Development Goals Alignment</h2>
        <p className="mb-4 leading-relaxed">
          Citilyze is designed to advance the United Nations' Sustainable Development Goals,
          specifically:
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
              SDG 11: Sustainable Cities and Communities
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              We help cities build resilient infrastructure, reduce vulnerability to disaster risk,
              and ensure inclusive and accessible urban spaces. Our metrics directly track progress
              on targets 11.5, 11.a, and 11.b.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
              SDG 16: Peace, Justice, and Strong Institutions
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              We advance transparent, accountable institutions and strengthen the rule of law.
              Citilyze measures institutional effectiveness and public trust, supporting targets
              16.6, 16.10, and 16.a.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span>
              <strong>Data-Driven:</strong> Real-time integration from IoT, public records, and
              surveys
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span>
              <strong>Transparent:</strong> Open methodologies and explainable metrics
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span>
              <strong>Actionable:</strong> Simulation and forecasting to support decision-making
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <span>
              <strong>Inclusive:</strong> Accessible to cities, communities, and civil society
            </span>
          </li>
        </ul>
      </section>

      <section className="pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <p>
          For more details on our methodology and calculation approach, visit our{" "}
          <a
            href="/methodology"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Methodology page
          </a>
          .
        </p>
      </section>
    </div>
  );
}
