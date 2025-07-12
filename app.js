const DATA = {
  bio_html: `<p>Christine Ballard is a seasoned <strong>Arlington, TX REALTOR®</strong> with eXp Realty, dedicated to guiding first-time buyers and sellers through every step of the real-estate journey. A lifelong Arlington resident, Christine leverages deep neighborhood knowledge, cutting-edge digital marketing, and unmatched client care to deliver exceptional results.</p>`,
  listings: [
    {
      id: '4016-jasmine-fox',
      address: '4016 Jasmine Fox Ln, Arlington, TX 76005',
      price: 875000,
      beds: 4,
      baths: 3.5,
      image: 'https://picsum.photos/seed/fox/640/420.webp',
      description:
        'Stunning 4-bedroom Viridian masterpiece featuring heated pool, gourmet granite kitchen, and spacious home office—perfect for remote professionals.',
    },
    {
      id: '2912-elm-grove',
      address: '2912 Elm Grove Ct, Arlington, TX 76006',
      price: 685000,
      beds: 3,
      baths: 2.5,
      image: 'https://picsum.photos/seed/elm/640/420.webp',
      description:
        'Elegant 3-bed North Arlington home near River Legacy Park. Natural light, vaulted ceilings, and entertainer’s patio space.',
    }
  ],
  articles: [
    {
      slug: 'first-time-buyer-tips',
      title: 'Top 5 Tips for First-Time Homebuyers in Arlington, TX',
      html: '<p>Buying your first home in Arlington, TX can feel overwhelming—but it doesn’t have to be. Here are my top 5 pro tips to make it easier…</p>'
    },
    {
      slug: 'should-i-stage-my-home',
      title: 'Does Staging Help Homes Sell Faster in DFW?',
      html: '<p>Short answer: yes. But the right strategy depends on your target buyer and price point. Let’s break down what works in Arlington and surrounding cities…</p>'
    },
    {
      slug: 'market-update-july',
      title: 'July Market Update: What’s Happening in Arlington Real Estate?',
      html: '<p>Inventory is up, interest rates have stabilized, and buyers are back in force. Here’s how the Arlington real estate market is shifting this summer…</p>'
    }
  ]
};
const { useState, useEffect, useMemo, useContext } = React;

function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const show = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div role="alert" className="toast" aria-live="assertive">
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Navigation bar
function NavBar() {
  const [open, setOpen] = useState(false);
  const route = getRoute().path;
  const Link = ({ href, children }) => (
    <a
      href={href}
      className="nav-link"
      aria-current={route === href.replace('#', '') ? 'page' : undefined}
      onClick={() => setOpen(false)}
    >
      {children}
    </a>
  );
  return (
    <nav className="site-nav" aria-label="Primary">
      <div className="site-nav__inner container">
        <a href="#/" className="font-semibold text-primary">Christine&nbsp;Ballard</a>
        <button className="hamburger" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>
          <span></span><span></span><span></span>
        </button>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          <Link href="#/">Home</Link>
          <Link href="#/listings">Arlington Listings</Link>
          <Link href="#/blog">Real-Estate Blog</Link>
          <Link href="#/about">About Christine</Link>
          <Link href="#/contact">Contact / Valuation</Link>
        </div>
      </div>
    </nav>
  );
}

// Hero section
function Hero() {
  return (
    <section className="hero text-center text-white">
      <div className="hero__content mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Christine Ballard – Your Arlington, TX Real&nbsp;Estate Expert
        </h1>
        <div
          className="text-lg mb-8"
          dangerouslySetInnerHTML={{ __html: DATA.bio_html }}
        ></div>
        <a href="#/contact" className="btn btn--primary">Get a Free Home Valuation</a>
      </div>
      <img src={DATA.listings[0].image} alt="Arlington skyline" className="hidden" loading="lazy" />
    </section>
  );
}

// Blog preview on home
function BlogPreview() {
  return (
    <section className="container py-16">
      <h2 className="text-2xl font-semibold mb-8">Latest Real-Estate Insights</h2>
      <div className="flex flex-col gap-8">
        {DATA.articles.slice(0, 3).map((a) => (
          <article key={a.slug} className="card">
            <div className="card__body">
              <h3 className="text-xl font-semibold mb-4">{a.title}</h3>
              <p>
                {a.html.replace(/<[^>]+>/g, '').split(' ').slice(0, 30).join(' ')}…
              </p>
              <a href={`#/blog?slug=${a.slug}`} className="btn btn--secondary mt-8">Read More</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Home() {
  useEffect(() => setCanonical(location.href), []);
  return (
    <main>
      <Hero />
      <BlogPreview />
    </main>
  );
}

// Listing card
function ListingCard({ l }) {
  const msg = encodeURIComponent(`Hi Christine, I'd like to schedule a viewing for ${l.address}`);
  return (
    <div className="card flex flex-col">
      <img src={l.image} alt={`${l.beds}-bedroom Arlington home`} className="img-responsive" loading="lazy" />
      <div className="card__body flex flex-col gap-4 flex-1">
        <h3 className="text-lg font-semibold">{l.address}</h3>
        <p className="font-semibold text-primary">${l.price.toLocaleString()}</p>
        <p className="text-sm">{l.beds} beds · {l.baths} baths</p>
        <p className="text-sm flex-1">{l.description}</p>
        <a href={`#/contact?prefill=${msg}`} className="btn btn--primary btn--sm">Schedule a Viewing</a>
      </div>
    </div>
  );
}

// Listings page
function Listings() {
  const [filters, setFilters] = useState({ min: '', max: '', beds: '', hood: '' });
  const handle = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const results = DATA.listings.filter((l) => {
    const okMin = filters.min ? l.price >= Number(filters.min) : true;
    const okMax = filters.max ? l.price <= Number(filters.max) : true;
    const okBeds = filters.beds ? l.beds === Number(filters.beds) : true;
    const okHood = filters.hood ? l.address.toLowerCase().includes(filters.hood.toLowerCase()) : true;
    return okMin && okMax && okBeds && okHood;
  });
  useEffect(() => setCanonical(location.href), []);
  return (
    <main className="container py-16">
      <h2 className="text-2xl font-semibold mb-8">Arlington Homes for Sale</h2>
      <form className="grid gap-4 sm:grid-cols-4 mb-8" onSubmit={(e) => e.preventDefault()}>
        <input name="min" value={filters.min} onChange={handle} type="number" placeholder="Min Price" className="form-control" />
        <input name="max" value={filters.max} onChange={handle} type="number" placeholder="Max Price" className="form-control" />
        <select name="beds" value={filters.beds} onChange={handle} className="form-control">
          <option value="">Beds</option>
          {[2, 3, 4].map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <input name="hood" value={filters.hood} onChange={handle} type="text" placeholder="Neighborhood" className="form-control" />
      </form>
      {results.length === 0 ? (
        <p>No listings match your criteria.</p>
      ) : (
        <div className="listing-grid">
          {results.map((l) => (
            <ListingCard l={l} key={l.id} />
          ))}
        </div>
      )}
    </main>
  );
}

// Blog
function Blog() {
  const { params } = getRoute();
  const slug = params.get('slug');
  const article = DATA.articles.find((a) => a.slug === slug);

  useEffect(() => setCanonical(location.href), [slug]);

  if (slug && article) {
    return (
      <main className="container py-16">
        <article>
          <h2 className="text-3xl font-semibold mb-8">{article.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: article.html }}></div>
        </article>
        <a href="#/blog" className="btn btn--secondary mt-16">← Back to Blog</a>
      </main>
    );
  }
  return (
    <main className="container py-16">
      <h2 className="text-2xl font-semibold mb-8">Real-Estate Blog</h2>
      <div className="flex flex-col gap-8">
        {DATA.articles.map((a) => (
          <article key={a.slug} className="card">
            <div className="card__body">
              <h3 className="text-xl font-semibold mb-4">{a.title}</h3>
              <p>{a.html.replace(/<[^>]+>/g, '').slice(0, 200)}…</p>
              <a href={`#/blog?slug=${a.slug}`} className="btn btn--secondary mt-8">Read More</a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function About() {
  useEffect(() => setCanonical(location.href), []);
  return (
    <main className="container py-16">
      <h2 className="text-2xl font-semibold mb-8">About Christine</h2>
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <img src={DATA.listings[1].image} alt="Christine Ballard smiling" className="w-full max-w-xs rounded" loading="lazy" />
        <div>
          <div dangerouslySetInnerHTML={{ __html: DATA.bio_html }}></div>
          <ul className="list-disc pl-6 mt-4 text-sm">
            <li>Comparative Market Analysis (CMA) expertise</li>
            <li>Cutting-edge digital advertising</li>
            <li>First-time buyer guidance</li>
            <li>Seller staging & marketing</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

// Contact / Lead Capture
function Contact() {
  const showToast = React.useContext(ToastContext);
  const { params } = getRoute();
  const prefill = params.get('prefill') || '';
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: prefill });
  const [status, setStatus] = useState('idle');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ----------------------------------------------------
     LEAD-CAPTURE LOGIC + in-memory storage (no localStorage)
  ---------------------------------------------------- */
  const onSubmit = (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    // Simple validation
    if (!form.name || !form.email) {
      showToast('Please enter name and email.');
      return;
    }

    setStatus('loading');
    // Fake reCAPTCHA success callback
    setTimeout(() => {
      const lead = { id: Date.now(), ...form, ts: new Date().toISOString() };
      leads.push(lead); // store in memory
      // Google Analytics event
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', { event_category: 'leads', event_label: form.email });
      }
      setStatus('done');
      showToast('Thanks! Your request was sent.');
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 800);
  };

  useEffect(() => setCanonical(location.href), []);

  return (
    <main className="container py-16 max-w-lg">
      <h2 className="text-2xl font-semibold mb-8">Request Your Free Home Valuation</h2>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} aria-label="Contact form">
        <input name="name" value={form.name} onChange={handle} placeholder="Name" className="form-control" />
        <input name="email" value={form.email} onChange={handle} placeholder="Email" type="email" className="form-control" />
        <input name="phone" value={form.phone} onChange={handle} placeholder="Phone" className="form-control" />
        <textarea name="message" value={form.message} onChange={handle} placeholder="Message" rows="4" className="form-control"></textarea>
        <div className="g-recaptcha" data-sitekey="YOUR_RECAPTCHA_SITE_KEY"></div>
        <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send'}
        </button>
      </form>
    </main>
  );
}

function Dashboard() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (!authed) {
      const pwd = prompt('Enter password to access dashboard');
      if (pwd === 'sold') setAuthed(true);
      else location.hash = '#/';
    }
  }, [authed]);

  if (!authed) return null;
  useEffect(() => setCanonical(location.href), []);
  const downloadHref = React.useMemo(() => {
    const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }, [leads.length]);
  return (
    <main className="container py-16">
      <h2 className="text-2xl font-semibold mb-8">Lead Dashboard</h2>
      <p className="mb-8">Total leads this session: <strong>{leads.length}</strong></p>
      {leads.length === 0 ? (
        <p>No leads captured yet.</p>
      ) : (
        <>
          <table className="table mb-8" aria-label="Leads table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td><td>{l.email}</td><td>{l.phone}</td><td>{l.message}</td><td>{new Date(l.ts).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a href={downloadHref} download="leads.json" className="btn btn--outline">Export JSON</a>
        </>
      )}
    </main>
  );
}

function NotFound() {
  return (
    <main className="container py-16">
      <h2 className="text-2xl font-semibold mb-8">Page not found</h2>
      <a href="#/" className="btn btn--secondary">Go Home</a>
    </main>
  );
}

function RouterView() {
  const [route, setRoute] = useState(getRoute());
  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  switch (true) {
    case route.path === '/' || route.path === '':
      return <Home />;
    case route.path === '/listings':
      return <Listings />;
    case route.path === '/blog':
      return <Blog />;
    case route.path === '/about':
      return <About />;
    case route.path === '/contact':
      return <Contact />;
    case route.path === '/dashboard':
      return <Dashboard />;
    default:
      return <NotFound />;
  }
}

function Footer() {
  return (
    <footer className="bg-secondary py-16 mt-16 text-sm">
      <div className="container flex flex-col gap-4">
        <div className="flex gap-8">
          <a href="#/" className="font-semibold">Home</a>
          <a href="#/listings">Listings</a>
          <a href="#/blog">Blog</a>
          <a href="#/about">About</a>
          <a href="#/contact">Contact</a>
        </div>
        <div>
          © {new Date().getFullYear()} Christine Ballard · eXp Realty · Arlington, TX
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <ToastProvider>
      <NavBar />
      <RouterView />
      <Footer />
    </ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <RouterView />
  </ToastProvider>
);
