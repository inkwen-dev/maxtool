export type FriendLink = {
  id: string;
  name: string;
  url: string;
};

/** Hub site — fixed #2 on product sites; #1 when current */
export const LEIWEN_PRO: FriendLink = {
  id: 'leiwenpro',
  name: 'Leiwen Pro',
  url: 'https://leiwen.pro',
};

export const CURRENT_SITE_ID = 'maxtool';

const portfolioLinks: FriendLink[] = [
  { id: 'startupsense', name: 'StartupSense', url: 'https://startupsense.co' },
  { id: 'levelmere', name: 'Levelmere', url: 'https://levelmere.com' },
  { id: 'mahjonghand', name: 'MahjongHand', url: 'https://mahjonghand.com' },
  { id: 'wallpapersense', name: 'WallpaperSense', url: 'https://wallpapersense.com' },
  { id: 'maxtool', name: 'MaxTool', url: 'https://maxtool.me/' },
  { id: 'humannatureexplained', name: 'HumanNatureExplained', url: 'https://humannatureexplained.org/' },
  { id: 'physicsexplained', name: 'PhysicsExplained', url: 'https://physicsexplained.org' },
  { id: 'beautygirlgallery', name: 'Beauty Girl Gallery', url: 'https://beautygirlgallery.com/' },
  { id: 'contentqr', name: 'ContentQR', url: 'https://contentqr.ai/' },
  { id: 'markdownstudio', name: 'MarkdownStudio', url: 'https://markdownstudio.io/' },
  { id: 'inkwellflow', name: 'InkwellFlow', url: 'https://inkwellflow.com' },
  { id: 'ghibliwallpapers', name: 'Ghibli Wallpapers', url: 'https://ghibli-wallpapers.com/' },
  { id: 'jiutianlanyue', name: '九天揽月科技', url: 'https://jiutianlanyue.com/' },
];

/**
 * Friend-link order:
 * 1. current site (self)
 * 2. Leiwen Pro (skipped when current is already leiwen.pro)
 * 3+. remaining portfolio sites
 */
export function buildFriendLinks(currentSiteId: string): FriendLink[] {
  const self =
    currentSiteId === LEIWEN_PRO.id
      ? LEIWEN_PRO
      : portfolioLinks.find((l) => l.id === currentSiteId);

  if (!self) {
    throw new Error(`Unknown friend-link site id: ${currentSiteId}`);
  }

  const rest = portfolioLinks.filter((l) => l.id !== currentSiteId);
  if (currentSiteId === LEIWEN_PRO.id) {
    return [self, ...rest];
  }
  return [self, LEIWEN_PRO, ...rest];
}

export const friendLinks = buildFriendLinks(CURRENT_SITE_ID);
