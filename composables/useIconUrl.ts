/**
 * Composable to get icon URLs for mobile/native app compatibility
 * Uses direct file imports instead of /public/ paths for file:// protocol support
 */

const iconCache: { [key: string]: string } = {
  'dietology': new URL('@/public/icons/dietology.png', import.meta.url).href,
  'cardiology': new URL('@/public/icons/cardiology.png', import.meta.url).href,
  'heart': new URL('@/public/icons/heart.png', import.meta.url).href,
  'endocrinology': new URL('@/public/icons/endocrinology.png', import.meta.url).href,
  'lungs': new URL('@/public/icons/lungs.png', import.meta.url).href,
  'pills': new URL('@/public/icons/pills.png', import.meta.url).href,
  'patient': new URL('@/public/icons/patient.png', import.meta.url).href,
  'liver': new URL('@/public/icons/liver.png', import.meta.url).href,
  'kidneys': new URL('@/public/icons/kidneys.png', import.meta.url).href,
};

export const useIconUrl = () => {
  const getIconUrl = (iconName: string): string => {
    return iconCache[iconName] || '';
  };

  const addIcon = (name: string, path: string) => {
    iconCache[name] = path;
  };

  return {
    getIconUrl,
    addIcon,
  };
};
