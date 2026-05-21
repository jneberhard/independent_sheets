import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const categories = [
    {
      title: "Choral SATB",
      description: "Four-part harmony arrangements for mixed voices",
      pieces: "850 pieces"
    },
    {
      title: "Solo Vocal",
      description: "Art songs and vocal solos with accompaniment",
      pieces: "420 pieces"
    },
    {
      title: "With Piano",
      description: "Vocal pieces with piano accompaniment included",
      pieces: "680 pieces"
    },
    {
      title: "A Cappella",
      description: "Unaccompanied vocal arrangements for all ensembles",
      pieces: "550 pieces"
    }
  ];

  const featured = [
    {
      title: "Ave Verum Corpus",
      isNew: true,
      composer: "Sarah Mitchell",
      voicing: "SATB",
      price: "$4.99"
    },
    {
      title: "The Water is Wide",
      isNew: false,
      composer: "James Chen",
      voicing: "SAB with Piano",
      price: "$3.99"
    },
    {
      title: "Shenandoah",
      isNew: true,
      composer: "Emily Roberts",
      voicing: "TTBB",
      price: "$4.49"
    },
    {
      title: "Simple Gifts",
      isNew: false,
      composer: "Michael Torres",
      voicing: "SSAA",
      price: "$3.49"
    },
    {
      title: "Danny Boy",
      isNew: false,
      composer: "Patricia O'Brien",
      voicing: "Solo with Piano",
      price: "$5.99"
    },
    {
      title: "Lux Aeterna",
      isNew: true,
      composer: "David Kim",
      voicing: "SATB divisi",
      price: "$6.99"
    }
  ];

  const composers = [
    {
      initials: "SM",
      name: "Sarah Mitchell",
      genre: "Sacred Choral",
      bio: "Award-winning composer known for her lush harmonies and accessible arrangements for church choirs.",
      pieces: "45 pieces available",
      featured: true
    },
    {
      initials: "JC",
      name: "James Chen",
      genre: "Folk Arrangements",
      bio: "Specializes in arranging traditional folk songs from around the world for various vocal ensembles.",
      pieces: "38 pieces available",
      featured: false
    },
    {
      initials: "ER",
      name: "Emily Roberts",
      genre: "Contemporary A Cappella",
      bio: "Creates innovative arrangements for collegiate and professional a cappella groups.",
      pieces: "52 pieces available",
      featured: false
    },
    {
      initials: "MT",
      name: "Michael Torres",
      genre: "Educational",
      bio: "Former music educator creating accessible pieces perfect for developing young singers.",
      pieces: "67 pieces available",
      featured: true
    }
  ];

  const testimonials = [
    {
      quote: "Finding quality SATB arrangements used to take hours. Now I can browse, preview, and purchase exactly what my choir needs in minutes.",
      author: "Jennifer Walsh",
      role: "Choir Director",
      organization: "St. Matthew's Church"
    },
    {
      quote: "As a composer, I finally have a platform that values my work. The royalty rates are fair, and the community is incredibly supportive.",
      author: "David Kim",
      role: "Composer",
      organization: "Independent"
    },
    {
      quote: "The quality of engraving is consistently excellent. Every piece I've downloaded has been clean, readable, and performance-ready.",
      author: "Maria Santos",
      role: "Music Educator",
      organization: "Lincoln High School"
    }
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen" style={{ backgroundColor: "var(--background-ivory)" }}>
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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            <h1 className="text-5xl font-bold tracking-tight">
              Independent Sheets
            </h1>
            <p className="mt-4 max-w-2xl text-lg">
              Discover quality sheet music for choirs, soloists, and instrumental ensembles.
            </p>
          </div>
        </section>

        {/* Explore Our Catalog Section */}
        <section className="section-dark py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title section-title-dark">Explore Our Catalog</h2>
              <p className="section-subtitle text-white" style={{ opacity: 0.8 }}>
                From sacred classics to contemporary arrangements, find the perfect music for your ensemble.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, idx) => (
                <div key={idx} className="card-music" style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
                  <h3 className="text-lg font-bold text-purple">
                    {category.title}
                  </h3>
                  <p className="text-sm my-3 text-muted">
                    {category.description}
                  </p>
                  <p className="text-sm font-semibold text-gold">
                    {category.pieces}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured This Week */}
        <section className="section-light py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="section-title section-title-light">Featured This Week</h2>
              <Link href="/catalog" className="btn-outline">View all</Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((item, idx) => (
                <div key={idx} className="card-featured card-music">
                  {item.isNew && <span className="badge-new">New</span>}
                  <h3 className="font-semibold text-lg mb-2 text-navy">
                    {item.title}
                  </h3>
                  <p className="text-sm mb-3 text-muted">
                    {item.composer}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-purple">
                      {item.voicing}
                    </span>
                    <span className="text-sm font-bold text-gold">
                      {item.price}
                    </span>
                  </div>
                  <Link
                    href="/details"
                    className="mt-4 text-sm font-medium block text-center py-2 rounded border text-purple"
                    style={{ borderColor: "var(--primary-purple)" }}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-dark py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title section-title-dark text-center mb-12">How It Works</h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* For Musicians */}
              <div>
                <h3 className="text-2xl font-bold mb-8 heading-gold">
                  For Musicians & Directors
                </h3>
                <div className="space-y-8">
                  {[
                    { num: "1", title: "Browse & Discover", desc: "Search our catalog by voicing, difficulty, style, or composer. Filter to find exactly what your ensemble needs." },
                    { num: "2", title: "Purchase & Download", desc: "Buy individual pieces or bundles. Download high-quality PDFs instantly, ready for printing or digital display." },
                    { num: "3", title: "Perform & Share", desc: "Print copies for your ensemble. Each purchase includes a license for your group to perform the piece." }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="step-number step-number-gold">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="font-bold mb-2 text-white">
                          {step.title}
                        </h4>
                        <p className="text-muted-light">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* For Composers */}
              <div>
                <h3 className="text-2xl font-bold mb-8 heading-gold">
                  For Composers & Arrangers
                </h3>
                <div className="space-y-8">
                  {[
                    { num: "1", title: "Submit Your Music", desc: "Upload your original compositions or licensed arrangements through our simple submission portal." },
                    { num: "2", title: "Quality Review", desc: "Our editorial team reviews submissions for engraving quality, ensuring professional standards." },
                    { num: "3", title: "Earn Royalties", desc: "Set your own prices. Receive competitive royalty payments for every sale, paid monthly." }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="step-number step-number-gold">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="font-bold mb-2 text-white">
                          {step.title}
                        </h4>
                        <p className="text-muted-light">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Composers */}
        <section className="section-light py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="section-title section-title-light">Meet Our Composers</h2>
              <Link href="/composers" className="btn-outline">View All Composers</Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {composers.map((composer, idx) => (
                <div key={idx} className="card-composer card-composer-light">
                  {composer.featured && <span className="badge-new">Featured</span>}
                  <div className="composer-avatar">{composer.initials}</div>
                  <h3 className="font-bold text-lg mb-1 text-navy">
                    {composer.name}
                  </h3>
                  <p className="text-sm mb-3 text-gold">
                    {composer.genre}
                  </p>
                  <p className="text-sm mb-3 text-muted">
                    {composer.bio}
                  </p>
                  <p className="text-xs font-semibold text-purple">
                    {composer.pieces}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition / Testimonials */}
        <section className="section-dark py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title section-title-dark text-center mb-12">What Musicians Say</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="card-music card-testimonial">
                  <div className="quote-mark">"</div>
                  <p className="mb-6 text-navy">
                    {testimonial.quote}
                  </p>
                  <div>
                    <p className="font-bold text-navy">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-purple">
                      {testimonial.organization}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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
            <Link href="/contribute" className="btn-outline inline-block">
              Become a Contributor
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}