import Link from "next/link";
import { ArrowRight, Sparkles, Globe, MessageSquare, ShoppingBag, Mail, BarChart3, Layers, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const channels = [
  { icon: Globe, name: "Website", desc: "Landing pages, product pages, about & contact" },
  { icon: MessageSquare, name: "AI Chatbot", desc: "Intelligent customer support that knows your brand" },
  { icon: ShoppingBag, name: "E-Commerce", desc: "Product catalog and storefront ready to sell" },
  { icon: Mail, name: "Email", desc: "Welcome sequences, newsletters, templates" },
  { icon: BarChart3, name: "Analytics", desc: "Dashboard to track engagement and growth" },
  { icon: Layers, name: "Content Hub", desc: "Blog posts, social media, all AI-generated" },
];

const steps = [
  { number: "01", title: "Define Your Brand", desc: "Tell us your brand name, industry, and vision. Our AI suggests names, taglines, and identity." },
  { number: "02", title: "Build Your Ecosystem", desc: "Configure products, content, and channels through a guided wizard with AI assistance at every step." },
  { number: "03", title: "Launch Everything", desc: "One click deploys your complete digital presence — website, chatbot, content, and more." },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Mayasura</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/create">
              <Button size="sm" variant="brand">
                Create Brand
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-4 py-1.5 text-sm text-slate-600 mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            Open-source brand ecosystem builder
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-slide-up">
            Build your brand&apos;s
            <br />
            <span className="text-blue-600">digital palace</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Go from zero to a complete digital presence in minutes. 
            Website, chatbot, e-commerce, content — all AI-powered, 
            all in one click.
          </p>
          <div className="flex items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/create">
              <Button size="xl" variant="brand">
                Start Building
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer">
              <Button size="xl" variant="outline">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Channels Grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Every channel. One click.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Your brand gets a complete digital ecosystem, not just a website.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel) => (
              <div
                key={channel.name}
                className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <channel.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{channel.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{channel.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Three steps to launch
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Our AI-guided wizard makes brand creation effortless.
            </p>
          </div>
          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Built for the modern brand
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Architecture decisions that scale with your ambition.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Claude AI generates your brand content, product descriptions, and chatbot responses.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Open Source</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Fully open-source. Own your data, customize everything, deploy anywhere.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Composable</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every component is modular. Swap, extend, or replace any piece of the stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to build your palace?
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Start creating your brand ecosystem in minutes. No credit card required.
          </p>
          <Link href="/create">
            <Button size="xl" variant="brand">
              Create Your Brand
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-slate-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm text-slate-500">
              Mayasura — The divine architect of digital ecosystems
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
              GitHub
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
