/**
 * Methodology page - explains scoring, alignment, and data collection.
 */

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Methodology</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This document outlines the calculation methods, assumptions, and alignment principles used
          in Citilyze.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">How Scores Are Calculated</h2>
        <p className="mb-3">
          Citilyze uses a composite scoring model that combines multiple indices into two primary
          metrics:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>Urban Stability Index (USI)</strong> – measures resilience and infrastructure
            quality
          </li>
          <li>
            <strong>Institutional Integrity Index (III)</strong> – measures governance transparency
            and effectiveness
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-5 mb-2">Stability Score Formula</h3>
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded font-mono text-sm mb-3 border-l-4 border-blue-600">
          <p>Stability = (0.35 × Infrastructure)</p>
          <p className="ml-4">+ (0.25 × Governance)</p>
          <p className="ml-4">+ (0.20 × Transparency)</p>
          <p className="ml-4">+ (0.20 × Emergency Response)</p>
        </div>

        <p>
          Each component is normalized to a 0–100 scale before weighting. Results are clamped to
          remain within valid bounds.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Data Assumptions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Historical data spans a 6-month rolling window for baseline trends</li>
          <li>Incidents and complaints are assumed to be reported in real time</li>
          <li>Infrastructure spending is normalized by population equivalence</li>
          <li>Audit frequency reflects governance maturity; higher frequency = higher score</li>
          <li>Transparency metrics are drawn from public reporting and accessibility audits</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Weighting Logic</h2>
        <p className="mb-3">
          Weights are assigned based on research in urban resilience and institutional effectiveness:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 px-3">Component</th>
                <th className="text-right py-2 px-3">Weight</th>
                <th className="text-left py-2 px-3">Rationale</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-3">Infrastructure</td>
                <td className="text-right py-2 px-3">35%</td>
                <td className="py-2 px-3">
                  Physical systems are the foundation of urban stability
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-3">Governance</td>
                <td className="text-right py-2 px-3">25%</td>
                <td className="py-2 px-3">
                  Institutional capability enables problem-solving
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-3">Transparency</td>
                <td className="text-right py-2 px-3">20%</td>
                <td className="py-2 px-3">
                  Public trust reduces conflict and improves outcomes
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3">Emergency Response</td>
                <td className="text-right py-2 px-3">20%</td>
                <td className="py-2 px-3">
                  Crisis management capacity protects urban welfare
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">UN Sustainable Development Goals Alignment</h2>

        <h3 className="text-xl font-semibold mt-5 mb-2">SDG 11: Sustainable Cities and Communities</h3>
        <p className="mb-2">
          Citilyze directly supports SDG 11 by monitoring urban infrastructure resilience, disaster
          risk reduction, and inclusive city planning. Our stability metrics align with targets:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>11.5</strong> – Deaths, missing persons, and direct economic loss due to
            disasters (via incident tracking)
          </li>
          <li>
            <strong>11.a</strong> – Strong regional and city planning (infrastructure &amp;
            governance indices)
          </li>
          <li>
            <strong>11.b</strong> – Disaster risk reduction and preparedness (emergency response
            capability)
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-5 mb-2">SDG 16: Peace, Justice, and Strong Institutions</h3>
        <p className="mb-2">
          Our institutional integrity and transparency indices measure governance capacity and
          accountability, directly addressing:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>16.6</strong> – Develop effective, accountable, and inclusive institutions
          </li>
          <li>
            <strong>16.10</strong> – Ensure public access to information and protect fundamental
            freedoms (transparency metrics)
          </li>
          <li>
            <strong>16.a</strong> – Strengthen capacity for violence prevention and rule of law
            (emergency response)
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Data Quality & Maintenance</h2>
        <p>
          Anomaly detection using standard deviation thresholds identifies suspicious data points
          and infrastructure events that may warrant manual review. Regular audits of input sources
          ensure integrity of calculations.
        </p>
      </section>

      <section className="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p>
          <em>Last updated: March 2026</em>
        </p>
      </section>
    </div>
  );
}
