// Testimonials on home screen
export default function TestimonialsSection() {
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
    <section className="section-dark py-16 px-4 md:px-8">
    <div className="max-w-6xl mx-auto">
        <h2 className="text-xl text-center mb-12">What Musicians Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="border p-5 rounded-xl bg-[var(--card)]">
              <div className="quote-mark">&quot;</div>
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
  );
}