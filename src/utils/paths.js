/**
 * Helper to handle asset paths correctly across local and production (GH Pages)
 * 
 * Usage: getAssetPath('/myImage.webp') -> '/Jerry-s-website/myImage.webp' (prod)
 */
export const getAssetPath = (path) => {
    // If path already starts with the repo name or is a full URL, return as is
    if (path.startsWith('http') || path.startsWith('https') || path.startsWith('/Jerry-s-website/')) {
        return path;
    }

    // Only prefix if we are in production and it's a root-relative path
    const base = import.meta.env.PROD ? '/Jerry-s-website' : '';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${base}${cleanPath}`;
};
