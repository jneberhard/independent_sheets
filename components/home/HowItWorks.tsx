export default function HowItWorks() {
    return(
        <section className="section-dark py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto border p-10 rounded-2xl bg-[var(--accent)]">
            <h2 className="text-2xl text-center mb-12">How It Works</h2>
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
    )
}