// VASTRA – Core Pages, Dashboards & Interactive Routing Views
(function() {
  const Icon = window.VastraIcon;

  // 1. Explore Local Clothing Shops Directory
  window.ExploreShopsDirectoryPage = function({ state, onOpenShop, onVisitStore }) {
    const [viewMode, setViewMode] = React.useState('grid'); // 'grid' | 'list' | 'map'
    const [searchShop, setSearchShop] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [filterDelivery, setFilterDelivery] = React.useState('all'); // 'all' | 'delivery' | 'pickup'
    const [minRating, setMinRating] = React.useState(0);
    const [maxDistance, setMaxDistance] = React.useState(15);

    // Filter logic
    const filteredShops = state.shops.filter(shop => {
      // City check
      if (state.selectedCity && shop.city.toLowerCase() !== state.selectedCity.toLowerCase()) {
        return false;
      }
      // Area check
      if (state.selectedArea && state.selectedArea !== 'All Areas' && shop.area.toLowerCase() !== state.selectedArea.toLowerCase()) {
        return false;
      }
      // Text search
      if (searchShop.trim()) {
        const q = searchShop.toLowerCase();
        const matchesName = shop.name.toLowerCase().includes(q);
        const matchesArea = shop.area.toLowerCase().includes(q);
        const matchesSpec = shop.tagline.toLowerCase().includes(q) || shop.description.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesSpec) return false;
      }
      // Category check
      if (selectedCategory !== 'All') {
        if (!shop.categories.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()))) {
          return false;
        }
      }
      // Rating check
      if (shop.rating < minRating) return false;
      // Distance check
      if (shop.distanceKm > maxDistance) return false;
      // Delivery availability
      if (filterDelivery === 'delivery' && !shop.allowOnlineDelivery) return false;
      if (filterDelivery === 'pickup' && !shop.allowStorePickup) return false;

      return true;
    });

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-8 sm:py-12' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8' },
        
        // Page Header
        React.createElement('div', { className: 'flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200' },
          React.createElement('div', null,
            React.createElement('div', { className: 'inline-flex items-center space-x-2 text-xs font-bold text-orange-800 uppercase tracking-widest mb-1' },
              React.createElement(Icon, { name: 'store', className: 'w-4 h-4' }),
              React.createElement('span', null, `Verified Clothing Shops in ${state.selectedCity}`)
            ),
            React.createElement('h1', { className: 'font-serif text-3xl sm:text-4xl font-bold text-stone-900' }, 'Local Clothing Stores Directory'),
            React.createElement('p', { className: 'text-xs sm:text-sm text-stone-500 mt-1' },
              `Discover ${filteredShops.length} neighborhood boutiques, heritage silk emporiums, and designer studios near you.`
            )
          ),

          // View Mode Switcher
          React.createElement('div', { className: 'flex items-center space-x-1.5 bg-stone-200/80 p-1 rounded-xl self-start md:self-auto' },
            React.createElement('button', {
              onClick: () => setViewMode('grid'),
              className: `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${viewMode === 'grid' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`
            },
              React.createElement(Icon, { name: 'grid', className: 'w-3.5 h-3.5' }),
              React.createElement('span', null, 'Grid')
            ),
            React.createElement('button', {
              onClick: () => setViewMode('list'),
              className: `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${viewMode === 'list' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`
            },
              React.createElement(Icon, { name: 'list', className: 'w-3.5 h-3.5' }),
              React.createElement('span', null, 'List')
            ),
            React.createElement('button', {
              onClick: () => setViewMode('map'),
              className: `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${viewMode === 'map' ? 'bg-orange-800 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'}`
            },
              React.createElement(Icon, { name: 'map', className: 'w-3.5 h-3.5' }),
              React.createElement('span', null, 'City Map')
            )
          )
        ),

        // Search & Filters Toolbar
        React.createElement('div', { className: 'bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4' },
          React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
            
            // Search Input
            React.createElement('div', { className: 'relative' },
              React.createElement('input', {
                type: 'text',
                placeholder: 'Search shop name or area...',
                value: searchShop,
                onChange: (e) => setSearchShop(e.target.value),
                className: 'w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-800 focus:outline-none'
              }),
              React.createElement('div', { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400' },
                React.createElement(Icon, { name: 'search', className: 'w-3.5 h-3.5' })
              )
            ),

            // Category Filter
            React.createElement('select', {
              value: selectedCategory,
              onChange: (e) => setSelectedCategory(e.target.value),
              className: 'p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800'
            },
              React.createElement('option', { value: 'All' }, 'All Clothing Categories'),
              React.createElement('option', { value: 'Sarees' }, 'Sarees & Handlooms'),
              React.createElement('option', { value: 'Kurtas' }, 'Kurtas & Anarkalis'),
              React.createElement('option', { value: 'Lehengas' }, 'Lehengas & Bridal'),
              React.createElement('option', { value: 'Menswear' }, 'Menswear & Bandhgalas'),
              React.createElement('option', { value: 'Indo-Western' }, 'Indo-Western & Co-ords'),
              React.createElement('option', { value: 'Kids' }, 'Kids Festive & Ethnic')
            ),

            // Delivery vs Store Pickup
            React.createElement('select', {
              value: filterDelivery,
              onChange: (e) => setFilterDelivery(e.target.value),
              className: 'p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800'
            },
              React.createElement('option', { value: 'all' }, 'All Shopping Modes (Online + Offline)'),
              React.createElement('option', { value: 'pickup' }, '🛍️ In-Store Trial & Pickup Available'),
              React.createElement('option', { value: 'delivery' }, '⚡ Same-Day Delivery Available')
            ),

            // Rating Filter
            React.createElement('select', {
              value: minRating,
              onChange: (e) => setMinRating(Number(e.target.value)),
              className: 'p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800'
            },
              React.createElement('option', { value: 0 }, 'All Ratings'),
              React.createElement('option', { value: 4.5 }, '⭐ 4.5 Stars & Above'),
              React.createElement('option', { value: 4.8 }, '⭐ 4.8 Stars (Top Rated)')
            )
          ),

          // Distance Slider Row
          React.createElement('div', { className: 'flex flex-wrap items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600' },
            React.createElement('div', { className: 'flex items-center space-x-3' },
              React.createElement('span', { className: 'font-semibold' }, `Max Distance from you: ${maxDistance} km`),
              React.createElement('input', {
                type: 'range',
                min: 1,
                max: 20,
                value: maxDistance,
                onChange: (e) => setMaxDistance(Number(e.target.value)),
                className: 'w-36 accent-orange-800 cursor-pointer'
              })
            ),
            React.createElement('div', { className: 'text-[11px] text-stone-400' },
              `Showing ${filteredShops.length} of ${state.shops.length} local clothing stores`
            )
          )
        ),

        // Main Display Area
        viewMode === 'map' ? React.createElement(window.InteractiveMapView, {
          shops: filteredShops,
          onOpenShop,
          onVisitStore
        }) : (
          filteredShops.length > 0 ? React.createElement('div', {
            className: viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'
          },
            filteredShops.map(shop =>
              React.createElement(window.ShopCard, {
                key: shop.id,
                shop,
                onVisitStore,
                onOpenShop,
                layout: viewMode
              })
            )
          ) : React.createElement('div', { className: 'text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3' },
            React.createElement(Icon, { name: 'store', className: 'w-12 h-12 text-stone-300 mx-auto' }),
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-800' }, 'No stores match your selected filters'),
            React.createElement('p', { className: 'text-xs text-stone-500' }, 'Try broadening your distance slider or selecting "All Areas" to see more local boutiques.')
          )
        )
      )
    );
  };

  // 2. Individual Shop Profile Page (Sharma Clothing Store, Royal Fashion Boutique, etc.)
  window.IndividualShopProfilePage = function({ shopId, state, onVisitStore, onOpenProduct, onAddToCart, onToggleWishlist, onReserveProduct }) {
    const shop = state.shops.find(s => s.id === shopId) || state.shops[0];
    const shopProducts = state.products.filter(p => p.shopId === shop.id);
    const shopReviews = state.reviews.filter(r => r.shopId === shop.id);

    const [activeTab, setActiveTab] = React.useState('collection'); // 'collection' | 'about' | 'reviews'
    const [shopCategoryFilter, setShopCategoryFilter] = React.useState('All');
    const [shopSearch, setShopSearch] = React.useState('');
    const [reviewText, setReviewText] = React.useState('');
    const [reviewRating, setReviewRating] = React.useState(5);

    // Sub-filtered collection strictly for this shop
    const displayedProducts = shopProducts.filter(p => {
      if (shopCategoryFilter !== 'All' && p.category !== shopCategoryFilter) return false;
      if (shopSearch.trim() && !p.title.toLowerCase().includes(shopSearch.toLowerCase()) && !p.fabric.toLowerCase().includes(shopSearch.toLowerCase())) return false;
      return true;
    });

    const handleAddReview = (e) => {
      e.preventDefault();
      if (!reviewText.trim()) return;
      window.vastraStore.addReview({
        shopId: shop.id,
        userName: state.currentUser.name || 'Verified Customer',
        rating: reviewRating,
        comment: reviewText.trim()
      });
      setReviewText('');
    };

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] pb-16' },
      
      // Store Header Banner & Profile
      React.createElement('div', { className: 'bg-white border-b border-stone-200' },
        
        // Cover Photo
        React.createElement('div', { className: 'relative h-60 sm:h-80 w-full overflow-hidden bg-stone-900' },
          React.createElement('img', {
            src: shop.banner,
            alt: shop.name,
            className: 'w-full h-full object-cover opacity-85'
          }),
          React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' }),
          
          // Verified & Rating Floating Badge
          React.createElement('div', { className: 'absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center space-x-2' },
            React.createElement('span', { className: 'bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow flex items-center space-x-1' },
              React.createElement(Icon, { name: 'star', className: 'w-3.5 h-3.5 text-amber-500 fill-amber-500' }),
              React.createElement('span', null, `${shop.rating} (${shop.reviewCount} reviews)`)
            )
          )
        ),

        // Shop Info Header Bar
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6' },
          React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-6' },
            
            // Left: Name, Badges & Address
            React.createElement('div', { className: 'space-y-2' },
              React.createElement('div', { className: 'flex items-center space-x-3' },
                React.createElement('h1', { className: 'font-serif text-3xl sm:text-4xl font-bold text-stone-900' }, shop.name),
                shop.verified && React.createElement('span', { className: 'text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-emerald-300' },
                  React.createElement(Icon, { name: 'check', className: 'w-3 h-3' }),
                  React.createElement('span', null, 'Verified Merchant')
                )
              ),
              React.createElement('p', { className: 'text-sm text-orange-800 font-semibold' }, shop.tagline),
              React.createElement('div', { className: 'flex flex-wrap gap-y-1 gap-x-4 text-xs text-stone-600' },
                React.createElement('span', { className: 'flex items-center space-x-1' },
                  React.createElement(Icon, { name: 'mappin', className: 'w-3.5 h-3.5 text-stone-400' }),
                  React.createElement('span', null, shop.address)
                ),
                React.createElement('span', { className: 'flex items-center space-x-1' },
                  React.createElement(Icon, { name: 'clock', className: 'w-3.5 h-3.5 text-stone-400' }),
                  React.createElement('span', null, `${shop.openHours} (${shop.openDays})`)
                )
              )
            ),

            // Right: Primary Offline / Online Actions
            React.createElement('div', { className: 'flex flex-wrap items-center gap-3 shrink-0' },
              React.createElement('button', {
                onClick: () => onVisitStore(shop),
                className: 'px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center space-x-2 border border-stone-300 transition'
              },
                React.createElement(Icon, { name: 'mappin', className: 'w-4 h-4 text-orange-700' }),
                React.createElement('span', null, 'Visit Store & Directions')
              ),
              React.createElement('a', {
                href: `https://wa.me/919829012345?text=${encodeURIComponent(`Hello ${shop.name}, I am exploring your collection on VASTRA.`)}`,
                target: '_blank',
                rel: 'noreferrer',
                className: 'px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow transition'
              },
                React.createElement(Icon, { name: 'whatsapp', className: 'w-4 h-4' }),
                React.createElement('span', null, 'WhatsApp Shop')
              )
            )
          ),

          // Tabs: Collection, About Store, Customer Reviews
          React.createElement('div', { className: 'flex space-x-8 mt-8 border-t border-stone-100 pt-3 text-xs font-bold uppercase tracking-wider' },
            [
              { id: 'collection', label: `Collection (${shopProducts.length})` },
              { id: 'about', label: 'Store Story & Amenities' },
              { id: 'reviews', label: `Customer Reviews (${shopReviews.length})` }
            ].map(tab =>
              React.createElement('button', {
                key: tab.id,
                onClick: () => setActiveTab(tab.id),
                className: `pb-3 transition relative ${activeTab === tab.id ? 'text-orange-800 border-b-2 border-orange-800' : 'text-stone-500 hover:text-stone-800'}`
              }, tab.label)
            )
          )
        )
      ),

      // Tab Content
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8' },
        
        // TAB 1: Collection
        activeTab === 'collection' && React.createElement('div', { className: 'space-y-6' },
          
          // In-store Catalog Filter Toolbar
          React.createElement('div', { className: 'bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4' },
            React.createElement('div', { className: 'flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0' },
              ['All', ...new Set(shopProducts.map(p => p.category))].map(cat =>
                React.createElement('button', {
                  key: cat,
                  onClick: () => setShopCategoryFilter(cat),
                  className: `text-xs px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${shopCategoryFilter === cat ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`
                }, cat)
              )
            ),
            React.createElement('div', { className: 'relative w-full sm:w-64' },
              React.createElement('input', {
                type: 'text',
                placeholder: `Search inside ${shop.name.split(' ')[0]}...`,
                value: shopSearch,
                onChange: (e) => setShopSearch(e.target.value),
                className: 'w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-800'
              }),
              React.createElement('div', { className: 'absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400' },
                React.createElement(Icon, { name: 'search', className: 'w-3.5 h-3.5' })
              )
            )
          ),

          // Product Grid
          displayedProducts.length > 0 ? React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6' },
            displayedProducts.map(product =>
              React.createElement(window.ProductCard, {
                key: product.id,
                product,
                onOpenProduct,
                onAddToCart,
                onToggleWishlist,
                isWishlisted: state.wishlist.includes(product.id)
              })
            )
          ) : React.createElement('div', { className: 'text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 text-stone-500 text-xs' },
            'No products found matching this filter.'
          )
        ),

        // TAB 2: About Store & Amenities
        activeTab === 'about' && React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
          React.createElement('div', { className: 'md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-5 text-xs text-stone-700' },
            React.createElement('h3', { className: 'font-serif text-xl font-bold text-stone-900' }, `About ${shop.name}`),
            React.createElement('p', { className: 'text-stone-600 leading-relaxed text-sm' }, shop.description),
            
            React.createElement('div', { className: 'pt-4 border-t border-stone-100' },
              React.createElement('h4', { className: 'font-bold text-stone-900 uppercase text-xs tracking-wider mb-3' }, 'In-Store Shopping Facilities:'),
              React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 gap-3' },
                (shop.amenities || []).map(a =>
                  React.createElement('div', { key: a, className: 'flex items-center space-x-2 p-2.5 bg-stone-50 rounded-xl border border-stone-100' },
                    React.createElement(Icon, { name: 'checkCircle', className: 'w-4 h-4 text-emerald-600' }),
                    React.createElement('span', { className: 'font-semibold text-stone-800' }, a)
                  )
                )
              )
            ),

            React.createElement('div', { className: 'pt-4 border-t border-stone-100' },
              React.createElement('h4', { className: 'font-bold text-stone-900 uppercase text-xs tracking-wider mb-2' }, 'Alteration & Fitting Guarantee:'),
              React.createElement('p', { className: 'text-stone-600' },
                'Our master tailor on premises guarantees exact sizing, blouse tightening, and length adjustments within 30 minutes of purchase or trial.'
              )
            )
          ),

          // Sidebar: Location & Contact Card
          React.createElement('div', { className: 'bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs' },
            React.createElement('h4', { className: 'font-bold text-stone-900 uppercase tracking-wider' }, 'Store Visit Information'),
            React.createElement('div', { className: 'space-y-1' },
              React.createElement('div', { className: 'font-bold text-stone-800' }, 'Full Physical Address:'),
              React.createElement('p', { className: 'text-stone-600' }, shop.address),
              React.createElement('p', { className: 'text-stone-500' }, `Landmark: ${shop.landmark}`)
            ),
            React.createElement('div', { className: 'space-y-1' },
              React.createElement('div', { className: 'font-bold text-stone-800' }, 'Direct Contact:'),
              React.createElement('p', { className: 'text-stone-600' }, `Phone: ${shop.phone}`),
              React.createElement('p', { className: 'text-stone-600' }, `Email: ${shop.email}`)
            ),
            React.createElement('button', {
              onClick: () => onVisitStore(shop),
              className: 'w-full py-2.5 bg-orange-800 hover:bg-orange-900 text-white font-bold rounded-xl text-center shadow transition'
            }, 'Get Directions on Map')
          )
        ),

        // TAB 3: Reviews
        activeTab === 'reviews' && React.createElement('div', { className: 'max-w-3xl space-y-8' },
          
          // Submit Review Box
          React.createElement('form', { onSubmit: handleAddReview, className: 'bg-white p-6 rounded-2xl border border-stone-200 space-y-4' },
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, `Write a Review for ${shop.name}`),
            React.createElement('div', { className: 'flex items-center space-x-2 text-xs' },
              React.createElement('span', { className: 'font-semibold text-stone-700' }, 'Your Rating:'),
              [1, 2, 3, 4, 5].map(star =>
                React.createElement('button', {
                  type: 'button',
                  key: star,
                  onClick: () => setReviewRating(star),
                  className: 'p-1'
                },
                  React.createElement(Icon, {
                    name: 'star',
                    className: `w-5 h-5 ${star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`
                  })
                )
              )
            ),
            React.createElement('textarea', {
              rows: 3,
              required: true,
              value: reviewText,
              onChange: (e) => setReviewText(e.target.value),
              placeholder: 'Share your experience about garment quality, trial room comfort, and shopkeeper hospitality...',
              className: 'w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-800'
            }),
            React.createElement('button', {
              type: 'submit',
              className: 'px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition'
            }, 'Submit Review')
          ),

          // Reviews List
          React.createElement('div', { className: 'space-y-4' },
            (shopReviews || []).map(r =>
              React.createElement('div', { key: r.id, className: 'bg-white p-5 rounded-xl border border-stone-200 space-y-2 text-xs' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', { className: 'flex items-center space-x-2' },
                    React.createElement('span', { className: 'font-bold text-stone-900' }, r.userName),
                    r.verified && React.createElement('span', { className: 'bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded' }, 'Verified Visit')
                  ),
                  React.createElement('span', { className: 'text-stone-400 text-[11px]' }, r.date)
                ),
                React.createElement('div', { className: 'flex text-amber-500' },
                  Array.from({ length: r.rating }).map((_, i) =>
                    React.createElement(Icon, { key: i, name: 'star', className: 'w-3.5 h-3.5 fill-amber-500' })
                  )
                ),
                React.createElement('p', { className: 'text-stone-600 leading-relaxed' }, r.comment)
              )
            )
          )
        )
      )
    );
  };

  // 3. All Products Catalog Page (Faceted Filtering)
  window.AllProductsCatalogPage = function({ state, onOpenProduct, onAddToCart, onToggleWishlist }) {
    const [selectedCategory, setSelectedCategory] = React.useState(state.activeFilterCategory || 'All');
    const [selectedGender, setSelectedGender] = React.useState('All');
    const [selectedShop, setSelectedShop] = React.useState('All');
    const [priceRange, setPriceRange] = React.useState(35000);
    const [sortBy, setSortBy] = React.useState('featured'); // 'featured' | 'low-high' | 'high-low' | 'rating'
    const [onlyInStore, setOnlyInStore] = React.useState(false);

    // Filter Logic
    let filtered = state.products.filter(p => {
      if (state.searchQuery && !p.title.toLowerCase().includes(state.searchQuery.toLowerCase()) && !p.fabric.toLowerCase().includes(state.searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedGender !== 'All' && p.gender !== selectedGender) return false;
      if (selectedShop !== 'All' && p.shopId !== selectedShop) return false;
      if (p.price > priceRange) return false;
      if (onlyInStore && !p.storePickupAvailable) return false;
      return true;
    });

    // Sorting
    if (sortBy === 'low-high') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'high-low') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-8 sm:py-12' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8' },
        
        // Header
        React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200' },
          React.createElement('div', null,
            React.createElement('h1', { className: 'font-serif text-3xl sm:text-4xl font-bold text-stone-900' }, 'All Clothing Collections'),
            React.createElement('p', { className: 'text-xs sm:text-sm text-stone-500 mt-1' },
              `Browse ${filtered.length} garments from local fashion boutiques across your city`
            )
          ),
          
          // Sort Dropdown
          React.createElement('div', { className: 'flex items-center space-x-2 text-xs' },
            React.createElement('span', { className: 'text-stone-500 font-medium' }, 'Sort by:'),
            React.createElement('select', {
              value: sortBy,
              onChange: (e) => setSortBy(e.target.value),
              className: 'p-2 bg-white border border-stone-300 rounded-xl font-semibold text-stone-800'
            },
              React.createElement('option', { value: 'featured' }, 'Featured & Trending'),
              React.createElement('option', { value: 'low-high' }, 'Price: Low to High'),
              React.createElement('option', { value: 'high-low' }, 'Price: High to Low'),
              React.createElement('option', { value: 'rating' }, 'Highest Customer Rating')
            )
          )
        ),

        // 2-Column Layout: Sidebar Filters + Products Grid
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-4 gap-8' },
          
          // Sidebar Filter Card
          React.createElement('div', { className: 'lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm h-fit text-xs' },
            React.createElement('div', { className: 'flex items-center justify-between font-bold text-stone-900 pb-3 border-b border-stone-100 text-sm' },
              React.createElement('span', null, 'Filters'),
              React.createElement('button', {
                onClick: () => {
                  setSelectedCategory('All');
                  setSelectedGender('All');
                  setSelectedShop('All');
                  setPriceRange(35000);
                  setOnlyInStore(false);
                },
                className: 'text-orange-800 font-semibold hover:underline text-xs'
              }, 'Reset All')
            ),

            // Gender Filter
            React.createElement('div', { className: 'space-y-2' },
              React.createElement('label', { className: 'font-bold text-stone-700 uppercase tracking-wider text-[11px]' }, 'Gender:'),
              React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
                ['All', 'Women', 'Men', 'Kids'].map(g =>
                  React.createElement('button', {
                    key: g,
                    onClick: () => setSelectedGender(g),
                    className: `px-3 py-1.5 rounded-lg border font-semibold transition ${selectedGender === g ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-700'}`
                  }, g)
                )
              )
            ),

            // Category Filter
            React.createElement('div', { className: 'space-y-2' },
              React.createElement('label', { className: 'font-bold text-stone-700 uppercase tracking-wider text-[11px]' }, 'Category:'),
              React.createElement('div', { className: 'space-y-1 max-h-48 overflow-y-auto pr-1' },
                ['All', 'Sarees & Handlooms', 'Kurtas & Anarkalis', 'Lehengas & Bridal', 'Menswear & Bandhgalas', 'Indo-Western & Co-ords', 'Kids Festive & Ethnic', 'Pure Khadi & Cotton'].map(c =>
                  React.createElement('button', {
                    key: c,
                    onClick: () => setSelectedCategory(c),
                    className: `w-full text-left px-2.5 py-1.5 rounded-md font-medium transition ${selectedCategory === c ? 'bg-orange-50 text-orange-950 font-bold' : 'text-stone-600 hover:bg-stone-50'}`
                  }, c)
                )
              )
            ),

            // Specific Shop Filter
            React.createElement('div', { className: 'space-y-2' },
              React.createElement('label', { className: 'font-bold text-stone-700 uppercase tracking-wider text-[11px]' }, 'Clothing Shop:'),
              React.createElement('select', {
                value: selectedShop,
                onChange: (e) => setSelectedShop(e.target.value),
                className: 'w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800'
              },
                React.createElement('option', { value: 'All' }, 'All Registered Shops'),
                (state.shops || []).map(s =>
                  React.createElement('option', { key: s.id, value: s.id }, s.name)
                )
              )
            ),

            // Price Range Slider
            React.createElement('div', { className: 'space-y-2 pt-2 border-t border-stone-100' },
              React.createElement('div', { className: 'flex justify-between font-bold text-stone-700' },
                React.createElement('span', null, 'Max Price:'),
                React.createElement('span', { className: 'text-orange-800' }, `₹${priceRange.toLocaleString('en-IN')}`)
              ),
              React.createElement('input', {
                type: 'range',
                min: 1500,
                max: 35000,
                step: 500,
                value: priceRange,
                onChange: (e) => setPriceRange(Number(e.target.value)),
                className: 'w-full accent-orange-800 cursor-pointer'
              })
            ),

            // Store Trial Only Toggle
            React.createElement('div', { className: 'pt-2 border-t border-stone-100' },
              React.createElement('label', { className: 'flex items-center space-x-2 cursor-pointer font-medium text-stone-700' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: onlyInStore,
                  onChange: (e) => setOnlyInStore(e.target.checked),
                  className: 'accent-orange-800 w-4 h-4 rounded'
                }),
                React.createElement('span', null, 'Show only items ready for in-store trial')
              )
            )
          ),

          // Products Grid
          React.createElement('div', { className: 'lg:col-span-3' },
            filtered.length > 0 ? React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 gap-6' },
              filtered.map(product =>
                React.createElement(window.ProductCard, {
                  key: product.id,
                  product,
                  onOpenProduct,
                  onAddToCart,
                  onToggleWishlist,
                  isWishlisted: state.wishlist.includes(product.id)
                })
              )
            ) : React.createElement('div', { className: 'text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 space-y-3' },
              React.createElement(Icon, { name: 'bag', className: 'w-12 h-12 text-stone-300 mx-auto' }),
              React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-800' }, 'No products match these criteria'),
              React.createElement('p', { className: 'text-xs text-stone-500' }, 'Try clearing filters or search query.')
            )
          )
        )
      )
    );
  };
})();
