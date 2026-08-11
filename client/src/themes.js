export const megaOfertas = {
  id: 'mega-ofertas',
  name: 'Mega Ofertas',
  colors: {
    background: '#1E3FA8',
    headerBg: '#132B7A',
    footerBg: '#3D5FD0',
    priceTag: '#E22118',
    priceText: '#FFFFFF',
    productName: '#FFFFFF',
    badge: '#E22118',
    divider: '#FFFFFF',
  },
  font: "'Nunito', 'Arial Rounded MT Bold', system-ui, sans-serif",
  maxCols: 4,
  maxProducts: 10,
  headerVariant: 'brand',
  badgeText: 'Ofertas exclusivas desta loja',
  footerText: 'As ofertas são válidas até que durarem os estoques!',
  // Row1 cells are ~22.75% of the flyer's width (4 cols, 3% gaps); this
  // keeps the photo filling most of that cell without overflowing it.
  imageSize: 'clamp(48px, 17cqw, 130px)',
}

export const redefort = {
  id: 'redefort',
  name: 'Redefort',
  colors: {
    // Header and body are the same color by design (verified against
    // referencia-encarte.png: the header band has no distinct background
    // color, just the glowing divider marking the transition).
    background: '#1E3FA8',
    headerBg: '#1E3FA8',
    footerBg: '#3D5FD0',
    priceTag: '#E22118',
    priceText: '#FFFFFF',
    productName: '#FFFFFF',
    divider: '#FFFFFF',
  },
  font: "'Nunito', 'Arial Rounded MT Bold', system-ui, sans-serif",
  maxCols: 3,
  maxProducts: 9,
  headerVariant: 'logo',
  logoUrl: '/redefort-logo-sacolao.png',
  mascotUrl: '/redefort-mascote-header.png',
  footerText: 'As ofertas são válidas até que durarem os estoques!',
  // Cells are ~31.3% of the flyer's width (3 cols, 3% gaps); this keeps the
  // photo filling most of that cell without overflowing it.
  imageSize: 'clamp(56px, 24cqw, 170px)',
}

export const themes = {
  [megaOfertas.id]: megaOfertas,
  [redefort.id]: redefort,
}

export const defaultTheme = megaOfertas
