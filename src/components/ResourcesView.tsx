import React from 'react';
import { ExternalLink, BookOpen, CheckCircle, ShieldAlert, Sparkles, Compass, Lightbulb, ArrowLeft } from 'lucide-react';
import { TOPIC_INFO } from '../data/questions';

interface ResourcesViewProps {
  onBack: () => void;
  onStartPractice: () => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onBack, onStartPractice }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <button
          onClick={onStartPractice}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Start Practice Quiz
        </button>
      </div>

      {/* Official Study Guide Hero Card */}
      <section className="bg-linear-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          Official Certification Guide
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Microsoft Certified: Azure Fundamentals (AZ-900)
        </h1>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          The AZ-900 exam validates foundational knowledge of cloud services and how those services are provided with Microsoft Azure. It is suitable for both technical and non-technical professionals.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            Open Official Microsoft Study Guide
            <ExternalLink className="w-4 h-4" />
          </a>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Pass Score: 700 / 1000 (70%)</span>
            <span>•</span>
            <span>Duration: 45 Minutes</span>
          </div>
        </div>
      </section>

      {/* Syllabus Domains Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          Official Exam Skills Measured
        </h2>

        <div className="space-y-4">
          {/* Domain 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                Domain 1: 25–30% of exam
              </span>
              <span className="text-xs font-semibold text-slate-500">Cloud Concepts</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {TOPIC_INFO['cloud-concepts'].name}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Defines cloud computing principles, high availability, scalability, elasticity, agility, disaster recovery, capital expenditure (CapEx) vs operational expenditure (OpEx), cloud service models (IaaS, PaaS, SaaS), and the shared responsibility model.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span>Shared Responsibility: Customer always secures Data and Identities</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span>Scalability = capacity to grow; Elasticity = auto-growing and auto-shrinking</span>
              </div>
            </div>
          </div>

          {/* Domain 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                Domain 2: 35–40% of exam
              </span>
              <span className="text-xs font-semibold text-slate-500">Core Architecture</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {TOPIC_INFO['azure-architecture'].name}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Core architectural components: Azure regions, availability zones, region pairs, subscriptions, management groups, resource groups, Azure compute (VMs, App Service, Container Instances, AKS, Virtual Desktop), storage redundancy (LRS, ZRS, GRS), access tiers (Hot, Cool, Cold, Archive), and Azure Virtual Networks & ExpressRoute.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>Availability Zones = physical datacenters with separate power/cooling in 1 region</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>ExpressRoute = private dedicated circuit bypassing the public internet</span>
              </div>
            </div>
          </div>

          {/* Domain 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Domain 3: 30–35% of exam
              </span>
              <span className="text-xs font-semibold text-slate-500">Governance & Security</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {TOPIC_INFO['azure-governance'].name}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Cost management (Pricing Calculator, TCO, Budgets), Azure governance (Azure Policy, Resource Locks, RBAC), monitoring solutions (Azure Monitor, Service Health), and security compliance tools (Microsoft Defender for Cloud, Microsoft Sentinel).
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>CanNotDelete Lock allows reading/editing but blocks deletion</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Azure Service Health reports global cloud outages; Monitor tracks your resources</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AZ-900 Test Day Strategies & Traps */}
      <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">
            Top 4 AZ-900 Exam Traps to Avoid
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">
              1. "Least Administrative Effort" vs "Lowest Cost"
            </h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              If an exam prompt asks for "least administrative effort", prefer PaaS or Serverless (like Azure App Service or Azure Functions). If it asks for "lowest storage cost for multi-year compliance", choose Archive tier!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">
              2. Pricing Calculator vs TCO Calculator
            </h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Use the Pricing Calculator to estimate monthly fees for new Azure workloads. Use the TCO Calculator to compare on-premises physical datacenter costs against Azure migration savings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">
              3. Resource Locks vs Azure Policy
            </h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              A Resource Lock prevents accidental deletion (CanNotDelete) or modifications (ReadOnly). Azure Policy enforces guardrails on new deployments (e.g. only allowing VMs in South Africa North).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">
              4. Inbound vs Outbound Data Transfer
            </h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Inbound data transfer (data moving INTO Azure datacenters) is generally free. Outbound data transfer (egress leaving Azure) is billed based on volume.
            </p>
          </div>
        </div>
      </section>

      {/* Independent Project Disclaimer Notice */}
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Disclaimer: </span>
          CloudPass is an independent, unofficial AZ-900 learning project. It is not affiliated with, endorsed by, or sponsored by Microsoft. All practice questions are original educational materials developed to teach Azure principles and do not contain live exam questions.
        </div>
      </section>
    </div>
  );
};
