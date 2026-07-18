import { API_ORIGIN } from "../services/api";

// Resolves a CMS image value into a URL that will actually load.
//
// Depending on backend config (see backend/config/settings.py), an uploaded
// image comes back as either:
//   - a full URL already (S3 is configured)              -> use as-is
//   - a relative "/media/xyz.jpg" path (local disk fallback) -> needs the
//     backend origin prefixed on, since a relative <img src> / CSS
//     background-image resolves against the CURRENT PAGE, not the API
//
// Every component here also falls back to a *locally bundled* image import
// (e.g. `import j3 from "../assets/j3.webp"`) when no CMS image is set yet.
// Those bundled paths never start with "/media/" (they're "/src/assets/..."
// in dev or a hashed "/assets/..." path in a production build), so checking
// specifically for the "/media/" prefix — rather than "does this start with
// http" — means bundled assets are always left alone and only genuine
// backend uploads ever get the origin prefixed on.
export function resolveImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/media/")) return `${API_ORIGIN}${image}`;
  return image;
}
