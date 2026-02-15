
import Image from "next/image";
import Hero from "@/components/landing-page/hero";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import SupportedPlatform from "@/components/landing-page/platform-support";
import WhyAgentDaddie from "@/components/landing-page/why-agent-daddie";
import { DemoVideoPlayerDemo } from "@/components/landing-page/demo-player";
import AboutServer from "@/components/landing-page/about-server";

import Link
 from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Page border */}
      <div className="absolute inset-0 border-x border-border pointer-events-none z-[51] max-w-4xl mx-auto"></div>

      {/* Grid Pattern Background */}
      <div className="fixed inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Fixed Navbar */}
      <nav
        className="z-[51] bg-black/35 backdrop-blur-xl fixed top-6 md:top-8 left-1/2 transform -translate-x-1/2 border rounded"
        style={{ width: "calc(100% - 2rem)", maxWidth: "calc(64rem - 15rem)" }}
      >
        <div className="px-4">
          <div className="flex items-center justify-between h-[3.2rem]">
            <span className="text-sm text-white tracking-wider briFont">
              αgent daddie{" "}
              <span className="text-xs text-teal-300 tracking-widest">
                beta
              </span>
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/agentdaddie/agentdaddie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="icon-xs" variant="outline">
                  <Github className=""/>
                </Button>
              </a>
			  <Link href="/deploy">
			  <Button size="xs" variant="default" className="px-3 font-[550]">Deploy now</Button>
			  </Link>
            </div>
          </div>
        </div>
      </nav>


      <section className="w-full max-w-4xl mx-auto relative">
        <div className="w-full relative">
          {/* Diagonal Grid Background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: `linear-gradient(to right, oklch(0.2721 0.0042 132.74) 1px, transparent 1px), 
			  linear-gradient(to bottom, oklch(0.2721 0.0042 132.74) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 100% at 100% 0%, #000 70%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 100% 100% at 100% 0%, #000 70%, transparent 100%)",
            }}
          />

          {/* Hero content */}
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-36 lg:pt-40">
            <Hero />
          </div>
        </div>

        {/* Demo video */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 md:mt-14 lg:mt-16">
          <DemoVideoPlayerDemo />
        </div>

        {/* Main content sections */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 md:mt-28 space-y-16 sm:space-y-20 md:space-y-32">
          <SupportedPlatform />
          <AboutServer />
          <WhyAgentDaddie />
        </div>

      </section>


      <div className="w-full flex items-center justify-center absolute -bottom-16">
        <Image
          src="/merabharat.png"
          alt="Mera Bharat"
          width={1150}
          height={500}
          className="rounded-lg shadow-lg opacity-25 md:opacity-4"
          priority
        />
      </div>
      <div className="flex flex-col items-center justify-center w-screen pt-20 md:pt-36">
        <footer className="w-full text-xs max-w-4xl p-4 text-center rounded-t-2xl shadow border-t py-8 lg:py-6 bg-transparent relative overflow-hidden">
          <p className="relative z-10">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@grills.dev"
              className="text-primary-400 hover:underline font-medium tracking-widest pl-2"
            >
              support@agentdaddie.com
            </a>
          </p>
        </footer>
      </div>

    </div>
  );
}
