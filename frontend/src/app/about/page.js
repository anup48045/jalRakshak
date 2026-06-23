
import React from 'react'

const About = () => {
  return (
    <div className="about bg-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-lg">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#003366] to-[#005B96] px-8 py-12 text-white text-center">
            <h1 className="text-4xl font-bold">
              JalRakshak Water Monitoring Platform
            </h1>

            <p className="mt-4 max-w-4xl mx-auto text-slate-100 leading-7">
              An integrated water body monitoring platform developed to support
              sustainable management, environmental protection, and evidence-based
              decision-making for Delhi's lakes, ponds, reservoirs, and river systems.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-0 border-b border-slate-200">

            <div className="p-6 text-center border-r border-slate-200">
              <h3 className="text-3xl font-bold text-[#003366]">625+</h3>
              <p className="text-slate-600 mt-2">Water Bodies</p>
            </div>

            <div className="p-6 text-center border-r border-slate-200">
              <h3 className="text-3xl font-bold text-[#003366]">24×7</h3>
              <p className="text-slate-600 mt-2">Continuous Monitoring</p>
            </div>

            <div className="p-6 text-center border-r border-slate-200">
              <h3 className="text-3xl font-bold text-[#003366]">100%</h3>
              <p className="text-slate-600 mt-2">AI Featured Real-Time Data Access</p>
            </div>

            <div className="p-6 text-center">
              <h3 className="text-3xl font-bold text-[#003366]">Live Status</h3>
              <p className="text-slate-600 mt-2">Alerts for Water Quality Issues</p>
            </div>

          </div>

          <div className="p-8 lg:p-12 space-y-12">

            {/* Mission */}
            <section className="grid lg:grid-cols-2 gap-10">

              <div>
                <h2 className="text-3xl font-bold text-[#003366] mb-5">
                  Mission & Objectives
                </h2>

                <p className="text-slate-700 leading-8">
                  JalRakshak aims to strengthen the monitoring and protection
                  of Delhi's water resources through continuous environmental
                  surveillance, pollution tracking, citizen participation, and
                  data-driven governance. The platform facilitates timely
                  identification of risks and supports sustainable water
                  management practices.
                </p>
              </div>

              <div className="space-y-4">

                <div className="border-l-4 border-[#003366] bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-slate-900">
                    Water Quality Surveillance
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Monitor key environmental indicators to detect pollution,
                    contamination, and ecosystem degradation.
                  </p>
                </div>

                <div className="border-l-4 border-[#003366] bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-slate-900">
                    Decision Support System
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Provide actionable intelligence for administrators,
                    planners, researchers, and environmental agencies.
                  </p>
                </div>

              </div>

            </section>

            {/* Platform Overview */}
            <section className="grid lg:grid-cols-2 gap-10">

              <div className="space-y-4">

                <div className="border-l-4 border-[#003366] bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-slate-900">
                    GIS-Based Monitoring
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Interactive geospatial visualization of water body status
                    using real-time monitoring data and health indicators.
                  </p>
                </div>

                <div className="border-l-4 border-[#003366] bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-semibold text-slate-900">
                    Citizen Reporting Mechanism
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Enable public participation through pollution reporting,
                    issue tracking, and environmental observations.
                  </p>
                </div>

              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#003366] mb-5">
                  Platform Overview
                </h2>

                <p className="text-slate-700 leading-8">
                  The platform integrates environmental datasets, GIS
                  visualization tools, sensor-based monitoring systems,
                  and citizen-generated reports into a unified interface.
                  This enables stakeholders to assess water quality,
                  identify emerging concerns, and take corrective actions
                  efficiently.
                </p>
              </div>

            </section>

            {/* Objectives */}
            <section className="bg-slate-50 border border-slate-200 rounded-lg p-8">

              <h2 className="text-3xl font-bold text-[#003366] mb-6">
                Key Objectives
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <ul className="space-y-4 text-slate-700">
                  <li>• Monitor water quality parameters in real time.</li>
                  <li>• Detect contamination and pollution incidents.</li>
                  <li>• Support evidence-based environmental planning.</li>
                </ul>

                <ul className="space-y-4 text-slate-700">
                  <li>• Improve public transparency and awareness.</li>
                  <li>• Enable citizen participation in conservation.</li>
                  <li>• Strengthen protection of urban water bodies.</li>
                </ul>

              </div>

            </section>

            {/* Capabilities */}
            <section>

              <h2 className="text-3xl font-bold text-[#003366] mb-8">
                Core Functional Capabilities
              </h2>

              <div className="grid md:grid-cols-3 gap-6">

                <div className="border border-slate-200 bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Comprehensive Coverage
                  </h3>

                  <p className="mt-3 text-slate-600">
                    Monitoring of lakes, ponds, rivers, wetlands,
                    and reservoirs across Delhi.
                  </p>
                </div>

                <div className="border border-slate-200 bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Real-Time Analytics
                  </h3>

                  <p className="mt-3 text-slate-600">
                    Continuous collection and visualization of
                    environmental metrics and alerts.
                  </p>
                </div>

                <div className="border border-slate-200 bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Community Engagement
                  </h3>

                  <p className="mt-3 text-slate-600">
                    Citizen-focused reporting tools that encourage
                    participation in water conservation initiatives.
                  </p>
                </div>

              </div>

            </section>

            {/* Footer Note */}
            <section className="border-t pt-8 text-center">

              <p className="text-slate-600 leading-7">
                JalRakshak supports the sustainable management and protection
                of Delhi's water resources through integrated monitoring,
                transparency, and community participation.
              </p>

            </section>

          </div>
        </div>

      </div>
    </div>
  )
}

export default About

