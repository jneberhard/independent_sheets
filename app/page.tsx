import Image from "next/image";
import Link from "next/link";
import FeaturedHome from "@/components/home/FeaturedHome";
import CatalogSection from "@/components/home/CatalogSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import HowItWorks from "@/components/home/HowItWorks";

export default async function Home() {
  return (
    <>
      <main className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>

        {/* Hero Section */}
        <section className="relative h-[500px] w-full">
          <Image
            src="/hero.png"
            alt="Independent Sheets Hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="bg-black/40 p-5 rounded-lg">
              <h1 className="text-5xl font-bold tracking-tight">
                Independent Sheets
              </h1>
              <p className="mt-4 max-w-2xl text-lg">
                Discover quality sheet music for choirs, soloists, and instrumental ensembles.
              </p>
            </div>
          </div>
        </section>

        {/* Explore Our Catalog Section */}
          <CatalogSection />

        {/* Featured */}
        <section className="section-light py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-xl">Featured</h2>
              <Link href="/catalog" className="border p-2 rounded bg-[var(--accent)] transition duration-75 ease-in-out hover:bg-[var(--accent)]/50">View all</Link>
            </div>
            <FeaturedHome />
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks /> 

        {/* Recognition / Testimonials */}
        <TestimonialsSection />

        {/* Final CTA Section */}
        <section className="cta-gradient py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Next Piece?
            </h2>
            <p className="mb-8 text-lg">
              Browse thousands of quality arrangements from independent composers. New music added weekly.
            </p>
            <Link href="/catalog" className="btn-primary inline-block mb-8">
              Start Browsing
            </Link>

            <hr style={{ borderColor: "rgba(255, 255, 255, 0.2)", marginTop: "2rem", marginBottom: "2rem" }} />

            <h3 className="text-2xl font-bold mb-4">
              Share Your Music with the World
            </h3>
            <p className="mb-6 text-lg">
              Join our community of composers and arrangers. Set your own prices and earn fair royalties.
            </p>
            <Link href="/register/publisher" className="btn-outline inline-block">
              Become a Contributor
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}