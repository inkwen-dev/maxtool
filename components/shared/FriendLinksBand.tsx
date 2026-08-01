import { friendLinks } from '@/lib/data/friend-links';

export default function FriendLinksBand() {
  return (
    <section
      aria-labelledby="friend-links-heading"
      className="border-t border-border bg-bg-secondary"
    >
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h2
          id="friend-links-heading"
          className="text-sm font-semibold text-text-primary mb-3"
        >
          Friend Links
        </h2>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          {friendLinks.map((link, index) => {
            const isSelf = index === 0;
            return (
              <li key={link.id} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-text-secondary/60">
                    ·
                  </span>
                ) : null}
                <a
                  href={isSelf ? '/' : link.url}
                  {...(isSelf
                    ? {}
                    : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
