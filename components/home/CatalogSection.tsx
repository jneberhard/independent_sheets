import Link from "next/link";

// Cards on home screen. Split here for segmentation of code
export default function CatalogSection() {
    const categories = [
    {
      title: "Choral",
      description: "Multi-part harmony arrangements for mixed voices",
      link: "/catalog/voicing/choir"
    },
    {
      title: "Piano",
      description: "Instrumental featuring piano and many other instruments",
      link: "/catalog/instrument/piano"
    },
    {
      title: "A Cappella",
      description: "Unaccompanied vocal arrangements for all ensembles",
      link: "/catalog/voicing/acapella"
    },
    {
      title: "... And Much More!",
      description: "A wide variety of music to suit your tastes!",
      link: "/catalog"
    }
  ];

  return (
    <section className="section-dark py-16 px-4 md:px-8">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="section-title section-title-dark text-xl">Explore Our Catalog</h2>
        <p className="section-subtitle text-white" style={{ opacity: 0.8 }}>
          From sacred classics to contemporary arrangements, find the perfect music for your ensemble.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, idx) => (
          <Link href={category.link} key={idx} className="card-music p-3 rounded-xl text-center bg-[var(--card)] transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-102">
            <h3 className="text-lg font-bold text-purple">
              {category.title}
            </h3>
            <p className="text-sm my-3">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
    </section>
  );
}