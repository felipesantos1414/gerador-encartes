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
  grid: { row1: 4, rowRest: 3 },
  maxProducts: 10,
  headerVariant: 'brand',
  badgeText: 'Ofertas exclusivas desta loja',
  footerText: 'As ofertas são válidas até que durarem os estoques!',
}

export const redefort = {
  id: 'redefort',
  name: 'Redefort',
  colors: {
    background: '#1E3FA8',
    headerBg: '#132B7A',
    footerBg: '#3D5FD0',
    priceTag: '#E22118',
    priceText: '#FFFFFF',
    productName: '#FFFFFF',
    divider: '#FFFFFF',
  },
  font: "'Nunito', 'Arial Rounded MT Bold', system-ui, sans-serif",
  grid: { row1: 3, rowRest: 3 },
  maxProducts: 9,
  headerVariant: 'logo',
  logoUrl: '/redefort-logo-sacolao.png',
  mascotUrl: '/redefort-mascote.png',
  footerText: 'As ofertas são válidas até que durarem os estoques!',
}

export const themes = {
  [megaOfertas.id]: megaOfertas,
  [redefort.id]: redefort,
}

export const defaultTheme = megaOfertas
