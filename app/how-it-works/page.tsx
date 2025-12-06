import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Droplets, Fish, Layers, Lightbulb, Settings, Share2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold font-outfit text-slate-900">How AquaBuilder Works</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          A Simple Guide to Planning a Compatible Aquarium Setup
        </p>
        <div className="pt-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            Start Building Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Introduction */}
      <Card className="p-8 bg-linear-to-br from-teal-50 to-white border-teal-100">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg leading-relaxed text-slate-700">
            AquaBuilder is designed to help aquarium keepers plan healthy and compatible tank setups with clarity and confidence. Whether you are setting up your very first tank or creating a complex aquascape, AquaBuilder guides you through each decision and checks compatibility in real time so you avoid common mistakes and ensure long-term success.
          </p>
        </div>
      </Card>

      {/* What Is AquaBuilder */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-outfit text-slate-800">What Is AquaBuilder?</h2>
        <p className="text-slate-600 leading-relaxed">
          AquaBuilder is an interactive aquarium planning tool similar to how PCPartPicker helps computer builders. You can select a tank, add fish, plants, invertebrates, and equipment, and instantly see whether everything works together. AquaBuilder evaluates water parameters, aggression levels, tank size requirements, plant needs, and equipment capacity to help you build a healthy environment before spending money or introducing livestock.
        </p>
      </section>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4 border-t-4 border-t-teal-500">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-2">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">1. Choose Your Aquarium Tank</h3>
          <p className="text-slate-600">
            Your tank determines many aspects of the final setup. AquaBuilder uses your tank size and dimensions to:
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" /> Check whether your chosen fish species have enough room</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" /> Recommend the appropriate filter, heater, and lighting</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" /> Calculate stocking levels and bioload limits</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" /> Ensure overall compatibility across your build</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-4 border-t-4 border-t-blue-500">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
            <Fish className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">2. Add Compatible Fish</h3>
          <p className="text-slate-600">
            Browse freshwater or saltwater fish and view important information. AquaBuilder automatically identifies issues such as:
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Aggressive or territorial behavior</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Fish that may eat smaller tankmates</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Understocked schooling fish groups</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Species that require different water parameters</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-4 border-t-4 border-t-green-500">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">3. Add Plants & Elements</h3>
          <p className="text-slate-600">
            Choose from a variety of plants and invertebrates. AquaBuilder checks for:
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Light and CO2 needs</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Substrate compatibility</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Plants that are likely to be eaten or uprooted</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> Invertebrates that may be vulnerable to certain fish</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-4 border-t-4 border-t-orange-500">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-2">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">4. Select Equipment</h3>
          <p className="text-slate-600">
            AquaBuilder evaluates your equipment choices to prevent common problems:
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> Filter flow rate relative to tank volume</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> Heater wattage for stable temperatures</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> Lighting intensity and spectrum for plant growth</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> CO2 requirements for high-light setups</li>
          </ul>
        </Card>
      </div>

      {/* Real-Time Insights */}
      <Card className="p-8 bg-slate-900 text-white">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold">5. Real-Time Compatibility Insights</h3>
            </div>
            <p className="text-slate-300">
              Every time you add or change something, AquaBuilder updates your compatibility report. This includes parameter compatibility, aggression checks, bioload calculations, and equipment capacity verification.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-800 p-3 rounded border border-slate-700">
                <span className="block text-yellow-400 font-bold text-sm">Parameter Check</span>
                <span className="text-xs text-slate-400">Temp, pH, Hardness overlap</span>
              </div>
              <div className="bg-slate-800 p-3 rounded border border-slate-700">
                <span className="block text-red-400 font-bold text-sm">Aggression Check</span>
                <span className="text-xs text-slate-400">Predator/Prey & Territory</span>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-8 h-8 text-teal-400" />
              <h3 className="text-2xl font-bold">6. Save, Share, & Export</h3>
            </div>
            <p className="text-slate-300">
              Once your build is ready, you can save multiple builds, duplicate them to test variations, share them using a generated link, or export a shopping checklist.
            </p>
          </div>
        </div>
      </Card>

      {/* Why AquaBuilder */}
      <section className="space-y-6 py-8">
        <h2 className="text-2xl font-bold font-outfit text-slate-800 text-center">Why AquaBuilder Is Helpful</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-lg text-slate-900 mb-2">Prevent Conflicts</h4>
            <p className="text-slate-600 text-sm">Avoid aggression between fish and ensure peaceful community tanks.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-lg text-slate-900 mb-2">Avoid Overstocking</h4>
            <p className="text-slate-600 text-sm">Keep your bioload in check and ensure your filtration can handle the load.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-lg text-slate-900 mb-2">Save Money</h4>
            <p className="text-slate-600 text-sm">Don&apos;t buy incompatible equipment or livestock that won&apos;t thrive.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-teal-600 rounded-2xl p-12 text-center text-white space-y-6">
        <h2 className="text-3xl font-bold font-outfit">Ready to Build Your Dream Tank?</h2>
        <p className="text-teal-100 max-w-2xl mx-auto text-lg">
          Join thousands of hobbyists who use AquaBuilder to plan successful, healthy aquariums.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-colors font-bold text-lg shadow-lg"
        >
          Start Your Build <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
