import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
        <div>
          <p className="display text-lg">exobod</p>
          <p className="mt-2 max-w-[28ch] text-sm text-muted">
            Phone as brain. Frame as body. One persona, many minds, a
            constitution in silicon.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
            Product
          </p>
          <ul className="space-y-2 text-muted">
            <li><Link className="hover:text-fg" href="/docs">Docs</Link></li>
            <li><Link className="hover:text-fg" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-fg" href="/console">Console</Link></li>
            <li><Link className="hover:text-fg" href="/#live">Live demo</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
            Company
          </p>
          <ul className="space-y-2 text-muted">
            <li><Link className="hover:text-fg" href="/manifesto">Manifesto</Link></li>
            <li>
              <a
                className="hover:text-fg"
                href="https://github.com/cismankit/exobot-ai"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </li>
            <li>
              <a className="hover:text-fg" href="mailto:hello@exobod.ai">
                hello@exobod.ai
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60 py-5 text-center font-mono text-[11px] text-muted">
        © {new Date().getFullYear()} Exobod · the brain can never out-argue the
        body&apos;s constitution
      </div>
    </footer>
  );
}
