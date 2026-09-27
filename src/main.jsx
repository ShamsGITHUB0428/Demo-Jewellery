import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import heroImage from './assets/velora-hero.png';
import { products, categories, filterOptions } from './products';

const WHATSAPP_NUMBER = '919999000000';
const formatMoney = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const Icon = ({ name, size = 20, stroke = 1.6 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    heart: <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="M5 5l14 14M19 5 5 19"/></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    bag: <><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    check: <path d="m5 12 4.2 4L19 6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

function useEsc(callback, enabled = true) {
  useEffect(() => { if (!enabled) return; const key = (e) => e.key === 'Escape' && callback(); window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, [callback, enabled]);
}

function Navbar({ wishlistCount, cartCount, onCart }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const handler = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', handler); return () => window.removeEventListener('scroll', handler); }, []);
  const links = ['Home', 'Diamond', 'Rings', 'Jadau', 'Collections', 'Bridal'];
  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="utility"><div className="page-width utility-inner"><span>Book an Appointment</span><span>Store Locator</span><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp Us</a></div></div>
    <div className="page-width nav-row">
      <button className="icon-button mobile-only" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Icon name="menu" /></button>
      <a className="wordmark" href="#top" aria-label="Velora Jewels home"><span>VELORA</span> JEWELS <em>DEMO</em></a>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <a href={link === 'Home' ? '#top' : '#collection'} className={link === 'Diamond' ? 'active' : ''} key={link}>{link}</a>)}</nav>
      <div className="nav-actions"><button className="icon-button desktop-search" aria-label="Search"><Icon name="search" /></button><button className="icon-button wishlist-link" aria-label={`${wishlistCount} wishlisted items`}><Icon name="heart" /><b>{wishlistCount || ''}</b></button><button className="icon-button cart-link" onClick={onCart} aria-label={`Open cart with ${cartCount} items`}><Icon name="bag"/><b>{cartCount || ''}</b></button><a className="enquiry-link" href="#enquire">Enquiry <Icon name="arrow" size={15}/></a></div>
    </div>
    <div className={`mobile-panel ${mobileOpen ? 'open' : ''}`}><div className="mobile-panel-top"><span className="wordmark">VELORA JEWELS</span><button className="icon-button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><Icon name="close"/></button></div>{links.map((link) => <a href="#collection" onClick={() => setMobileOpen(false)} key={link}>{link}</a>)}<a href="#enquire" onClick={() => setMobileOpen(false)}>Make an Enquiry</a></div>
  </header>;
}

function FilterDrawer({ open, onClose, filters, setFilters, onClear }) {
  useEsc(onClose, open);
  const update = (group, value) => setFilters((current) => ({ ...current, [group]: current[group] === value ? '' : value }));
  return <><div className={`scrim ${open ? 'visible' : ''}`} onMouseDown={onClose}/><aside className={`filter-drawer ${open ? 'open' : ''}`} aria-label="Filter catalogue" aria-hidden={!open}>
    <div className="drawer-head"><div><p className="eyebrow">REFINE YOUR SELECTION</p><h2>Filters</h2></div><button className="icon-button" aria-label="Close filters" onClick={onClose}><Icon name="close"/></button></div>
    <div className="filter-groups">{Object.entries(filterOptions).map(([group, options]) => <section className="filter-group" key={group}><h3>{group}</h3><div>{options.map((option) => <label key={option}><input type="checkbox" checked={filters[group] === option} onChange={() => update(group, option)}/><span>{option}</span><i/></label>)}</div></section>)}</div>
    <div className="drawer-actions"><button className="text-button" onClick={onClear}>Clear all</button><button className="dark-button" onClick={onClose}>View designs</button></div>
  </aside></>;
}

function ProductCard({ product, wishlisted, onToggleWish, onQuickView, onAddToCart, onBuyNow }) {
  return <article className="product-card">
    <div className="product-image-wrap"><img src={product.image} alt={product.alt} loading="lazy"/><button className={`wish-button ${wishlisted ? 'active' : ''}`} aria-label={`Add ${product.name} to wishlist`} onClick={() => onToggleWish(product.id)}><Icon name="heart" size={18}/></button><button className="quick-button" onClick={() => onQuickView(product)}>Quick View <Icon name="arrow" size={15}/></button></div>
    <div className="product-info"><div className="product-name-row"><h3>{product.name}</h3><span>{product.code}</span></div><p>{product.description}</p><div className="demo-price"><small>{product.priceLabel}</small><strong>{formatMoney(product.price)}</strong></div><div className="card-actions"><button onClick={() => onAddToCart(product)}>Add to Cart</button><button onClick={() => onBuyNow(product)}>Buy Now</button></div><button className="price-button" onClick={() => onQuickView(product)}>View Details <Icon name="arrow" size={14}/></button></div>
  </article>;
}

function EditorialBanner() { return <section className="editorial-banner"><img src={heroImage} alt="Diamond ring on ivory silk" loading="lazy"/><div><p className="eyebrow">THE VELORA EDIT</p><h2>Designed for<br/><i>Moments That Matter</i></h2><a href="#collection">Explore Our Collections <Icon name="arrow" size={16}/></a></div></section>; }

function QuantitySelector({ value, onChange, compact = false }) { return <div className={`quantity-selector ${compact ? 'compact' : ''}`} aria-label="Quantity"><button aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))}><Icon name="minus" size={14}/></button><span>{value}</span><button aria-label="Increase quantity" onClick={() => onChange(value + 1)}><Icon name="plus" size={14}/></button></div>; }

function QuickViewModal({ product, onClose, onEnquire, wishlisted, onToggleWish, onAddToCart, onBuyNow }) {
  useEsc(onClose, Boolean(product));
  const [quantity, setQuantity] = useState(1);
  useEffect(() => setQuantity(1), [product?.id]);
  if (!product) return null;
  return <div className="modal-layer" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-title"><button className="modal-close icon-button" aria-label="Close quick view" onClick={onClose}><Icon name="close"/></button><div className="modal-photo"><img src={product.image} alt={product.alt}/></div><div className="modal-copy"><p className="eyebrow">DIAMOND RINGS · {product.code}</p><h2 id="quick-title">{product.name}</h2><p className="modal-desc">{product.fullDescription}</p><div className="modal-price"><small>{product.priceLabel}</small><strong>{formatMoney(product.price)}</strong></div><dl><div><dt>Category</dt><dd>Diamond Rings</dd></div><div><dt>Material</dt><dd>{product.metal} · Sample / Demo</dd></div><div><dt>Style</dt><dd>{product.style}</dd></div></dl><div className="purchase-row"><QuantitySelector value={quantity} onChange={setQuantity}/><button className="dark-button" onClick={() => onAddToCart(product, quantity)}>Add to Cart</button></div><button className="buy-button full" onClick={() => onBuyNow(product, quantity)}>Buy Now <Icon name="arrow" size={16}/></button><button className="enquire-button full" onClick={() => onEnquire(product)}>Make an Enquiry</button><a className="whatsapp-button" target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello, I am interested in the ${product.name}. Please share more details.`)}`}>WhatsApp <span>↗</span></a><button className={`modal-wish ${wishlisted ? 'active' : ''}`} onClick={() => onToggleWish(product.id)}><Icon name="heart" size={17}/>{wishlisted ? 'Saved to wishlist' : 'Add to wishlist'}</button></div></section></div>;
}

function EnquiryModal({ product, onClose }) {
  const [sent, setSent] = useState(false);
  useEsc(onClose, true);
  return <div className="modal-layer" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><button className="modal-close icon-button" aria-label="Close enquiry" onClick={onClose}><Icon name="close"/></button>{sent ? <div className="success-state"><span><Icon name="check"/></span><p className="eyebrow">ENQUIRY RECEIVED</p><h2>Thank you.</h2><p>Our jewellery team will contact you shortly.</p><button className="dark-button" onClick={onClose}>Continue browsing</button></div> : <><p className="eyebrow">A PERSONAL TOUCH</p><h2 id="enquiry-title">Make an Enquiry</h2><p className="enquiry-intro">{product ? <>For <strong>{product.name}</strong>, or simply tell us what you are looking for.</> : 'Our jewellery consultants are ready to help you find something memorable.'}</p><form onSubmit={(e) => { e.preventDefault(); setSent(true); }}><label>Name<input required name="name" placeholder="Your name"/></label><label>Mobile Number<input required name="mobile" type="tel" placeholder="Your mobile number"/></label><label>Email<input required name="email" type="email" placeholder="name@example.com"/></label><label>Preferred Store<select name="store" defaultValue=""><option value="" disabled>Select a city</option><option>Mumbai</option><option>Delhi</option><option>Bengaluru</option><option>Other</option></select></label><label>Message<textarea name="message" defaultValue={product ? `I would like to know more about the ${product.name}.` : ''} rows="3"/></label><button className="dark-button full" type="submit">Send Enquiry <Icon name="arrow" size={16}/></button></form></>}</section></div>;
}

function CartDrawer({ open, cart, onClose, onQuantity, onRemove, onCheckout }) {
  useEsc(onClose, open);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <><div className={`scrim ${open ? 'visible' : ''}`} onMouseDown={onClose}/><aside className={`cart-drawer ${open ? 'open' : ''}`} aria-label="Shopping cart" aria-hidden={!open}><div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping Bag</h2></div><button className="icon-button" aria-label="Close cart" onClick={onClose}><Icon name="close"/></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id}><img src={item.image} alt={item.alt}/><div><p>{item.code}</p><h3>{item.name}</h3><strong>{formatMoney(item.price)}</strong><small>{item.priceLabel}</small><QuantitySelector compact value={item.quantity} onChange={(quantity) => onQuantity(item.id, quantity)}/></div><button className="remove-item" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)}><Icon name="trash" size={17}/></button></article>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatMoney(total)}</strong></div><div><span>Estimated total</span><strong>{formatMoney(total)}</strong></div><small>All prices are clearly marked demo values.</small><button className="dark-button full" onClick={onCheckout}>Proceed to Checkout <Icon name="arrow" size={16}/></button><button className="continue-button" onClick={onClose}>Continue Shopping</button></div></> : <div className="cart-empty"><Icon name="bag" size={31}/><h3>Your bag is waiting</h3><p>Add a favourite piece to begin your demo purchase journey.</p><button className="dark-button" onClick={onClose}>Explore designs</button></div>}</aside></>;
}

function CheckoutModal({ cart, onClose, onPlaced }) {
  const [complete, setComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  useEsc(onClose, true);
  const submit = (event) => { event.preventDefault(); setOrderId(`VJ-DEMO-${String(Date.now()).slice(-6)}`); setComplete(true); onPlaced(); };
  return <div className="modal-layer checkout-layer" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><button className="modal-close icon-button" aria-label="Close checkout" onClick={onClose}><Icon name="close"/></button>{complete ? <div className="success-state"><span><Icon name="check"/></span><p className="eyebrow">DEMO ORDER CONFIRMED</p><h2>Order Placed Successfully!</h2><p>Thank you for your purchase. Your order has been received.</p><b className="order-id">Order ID: {orderId}</b><button className="dark-button" onClick={onClose}>Continue browsing</button></div> : <><div className="checkout-title"><p className="eyebrow">DEMO CHECKOUT</p><h2 id="checkout-title">Complete your order</h2><p>No payment is collected in this frontend-only demonstration.</p></div><div className="checkout-body"><form onSubmit={submit}><h3>Your details</h3><label>Customer Name<input required placeholder="Your name"/></label><label>Mobile Number<input required type="tel" placeholder="Your mobile number"/></label><label>Email<input required type="email" placeholder="name@example.com"/></label><label className="wide">Address<textarea required rows="3" placeholder="House number, street, area"/></label><label>City<input required placeholder="Your city"/></label><label>State<input required placeholder="Your state"/></label><label>PIN Code<input required inputMode="numeric" placeholder="PIN code"/></label><button className="dark-button full" type="submit">Place Order <Icon name="arrow" size={16}/></button></form><aside className="checkout-summary"><h3>Order Summary</h3>{cart.map((item) => <div className="checkout-line" key={item.id}><span>{item.name} <b>× {item.quantity}</b></span><strong>{formatMoney(item.price * item.quantity)}</strong></div>)}<div className="checkout-total"><span>Total Amount</span><strong>{formatMoney(total)}</strong></div><small>SAMPLE / DEMO PRICES ONLY</small></aside></div></>}</section></div>;
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Diamond');
  const [filters, setFilters] = useState({ Category: '', Metal: '', Diamond: '', Occasion: '', Style: '' });
  const [sort, setSort] = useState('Recommended'); const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(8); const [selected, setSelected] = useState(null); const [enquiryProduct, setEnquiryProduct] = useState(undefined); const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('velora-demo-cart')) || []; } catch { return []; } });
  const [cartOpen, setCartOpen] = useState(false); const [checkoutOpen, setCheckoutOpen] = useState(false);
  const filtered = useMemo(() => products.filter((p) => (activeCategory === 'Diamond' || p.category === activeCategory) && Object.entries(filters).every(([key, value]) => !value || p[key.toLowerCase()] === value)).sort((a,b) => sort === 'Price: Low to High' ? a.order - b.order : sort === 'Price: High to Low' ? b.order-a.order : sort === 'New Arrivals' ? b.newness-a.newness : sort === 'Best Selling' ? b.popularity-a.popularity : a.order-b.order), [activeCategory, filters, sort]);
  useEffect(() => setVisible(8), [activeCategory, filters, sort]);
  useEffect(() => { localStorage.setItem('velora-demo-cart', JSON.stringify(cart)); }, [cart]);
  const toggleWish = (id) => setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const addToCart = (product, quantity = 1) => setCart((items) => { const found = items.find((item) => item.id === product.id); return found ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...items, { ...product, quantity }]; });
  const changeQuantity = (id, quantity) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity } : item));
  const removeFromCart = (id) => setCart((items) => items.filter((item) => item.id !== id));
  const buyNow = (product, quantity = 1) => { addToCart(product, quantity); setSelected(null); setCheckoutOpen(true); };
  const openEnquiry = (product) => { setSelected(null); setEnquiryProduct(product); };
  const clearFilters = () => setFilters({ Category: '', Metal: '', Diamond: '', Occasion: '', Style: '' });
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <><Navbar wishlistCount={wishlist.length} cartCount={cartCount} onCart={() => setCartOpen(true)}/><main id="top"><div className="page-width breadcrumb"><a href="#top">Home</a><span>/</span><a href="#collection">Diamond</a><span>/</span><b>Rings</b></div><section className="hero page-width"><img src={heroImage} alt="Original Velora diamond ring campaign"/><div className="hero-copy"><p className="eyebrow">THE DIAMOND EDIT</p><h1>Diamond Rings</h1><p>Discover elegant diamond rings designed for every celebration and every story.</p><a href="#collection">Explore designs <Icon name="arrow" size={16}/></a></div><div className="hero-count"><b>48</b><span>DESIGNS</span></div></section><section className="page-width tabs-wrap" id="collection"><div className="category-tabs" role="tablist" aria-label="Jewellery categories">{categories.map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></section><section className="catalogue page-width"><div className="toolbar"><div><span className="design-count">{filtered.length} {filtered.length === 1 ? 'Design' : 'Designs'}</span><button className="filter-trigger" onClick={() => setShowFilters(true)}><Icon name="filter" size={17}/> Filter {Object.values(filters).filter(Boolean).length ? <b>{Object.values(filters).filter(Boolean).length}</b> : ''}</button></div><label className="sort-label">Sort By <select value={sort} onChange={(e) => setSort(e.target.value)}>{['Recommended','New Arrivals','Best Selling','Price: Low to High','Price: High to Low'].map((option) => <option key={option}>{option}</option>)}</select><Icon name="chevron" size={15}/></label></div>{filtered.length ? <><div className="product-grid">{filtered.slice(0,visible).map((product, index) => <React.Fragment key={product.id}><ProductCard product={product} wishlisted={wishlist.includes(product.id)} onToggleWish={toggleWish} onQuickView={setSelected} onAddToCart={addToCart} onBuyNow={buyNow}/>{index === 3 && <EditorialBanner/>}</React.Fragment>)}</div>{visible < filtered.length && <div className="load-more"><button onClick={() => setVisible(filtered.length)}>Load More <Icon name="arrow" size={16}/></button></div>}</> : <div className="empty-state"><h2>No designs found</h2><p>Try adjusting your filters to discover more pieces.</p><button className="dark-button" onClick={clearFilters}>Clear filters</button></div>}</section><section className="trust"><div className="page-width trust-grid">{[['01','Premium Craftsmanship'],['02','Personalized Assistance'],['03','Curated Collections'],['04','Store Experience']].map(([number, title]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>Created for a considered, memorable experience.</p></div>)}</div></section></main><footer id="enquire"><div className="page-width footer-main"><div><a className="wordmark" href="#top">VELORA JEWELS</a><p className="footer-intro">A modern setting for pieces that become part of your story.</p><button className="footer-enquire" onClick={() => setEnquiryProduct(null)}>Make an Enquiry <Icon name="arrow" size={15}/></button></div><div><h3>Collections</h3>{['Gold','Diamond','Jadau','Bridal','Rings'].map(x => <a href="#collection" key={x}>{x}</a>)}</div><div><h3>Customer</h3>{['Contact','Enquiry','Store Locator','Appointments'].map(x => <a href="#enquire" key={x}>{x}</a>)}</div><div><h3>Social</h3><a href="#enquire">Instagram</a><a href="#enquire">Facebook</a><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp</a></div></div><div className="page-width footer-bottom"><span>© 2026 Velora Jewels</span><span>Demo website — fully customizable for your jewellery business.</span></div></footer><FilterDrawer open={showFilters} onClose={() => setShowFilters(false)} filters={filters} setFilters={setFilters} onClear={clearFilters}/><QuickViewModal product={selected} onClose={() => setSelected(null)} onEnquire={openEnquiry} wishlisted={selected && wishlist.includes(selected.id)} onToggleWish={toggleWish} onAddToCart={addToCart} onBuyNow={buyNow}/><CartDrawer open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} onQuantity={changeQuantity} onRemove={removeFromCart} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}/>{checkoutOpen && <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} onPlaced={() => setCart([])}/>} {enquiryProduct !== undefined && <EnquiryModal product={enquiryProduct} onClose={() => setEnquiryProduct(undefined)}/>}</>;
}

createRoot(document.getElementById('root')).render(<App/>);
