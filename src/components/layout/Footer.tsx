const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-edge py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="font-display text-4xl leading-[0.95] tracking-tightest sm:text-5xl">
              Kit up your
              <br />
              whole crew.
            </p>
            <p className="mt-5 text-sm text-muted">
              Design custom merch in 3D for your college club, society or fest — share the preview,
              order in bulk. Made for India, built to scale.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Explore</span>
            <a href="/#how" className="nav-link w-fit">
              How it works
            </a>
            <a href="/#clubs" className="nav-link w-fit">
              For clubs &amp; fests
            </a>
            <a href="/#societies" className="nav-link w-fit">
              For societies &amp; events
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <span className="font-mono uppercase tracking-widest">
            tshirt.designer — EST. {YEAR}
          </span>
          <span>Designed &amp; built in India.</span>
        </div>
      </div>
    </footer>
  );
}
