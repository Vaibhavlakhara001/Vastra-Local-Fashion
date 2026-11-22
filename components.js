// VASTRA – Reusable UI Components
(function() {
  const Icon = window.VastraIcon;

  // 1. Top Announcement Bar
  window.AnnouncementBar = function({ onAction, currentUser, onOpenUserProfile }) {
    return React.createElement('div', {
      className: 'bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800'
    },
      React.createElement('div', { className: 'max-w-7xl mx-auto flex items-center justify-between' },
        React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('span', { className: 'bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide' }, 'LOCAL LOVE'),
          React.createElement('span', { className: 'hidden sm:inline font-medium' },
            '✨ Flat ₹100 Off with code: '
          ),
          React.createElement('span', { className: 'font-bold text-amber-400 tracking-wider' }, 'VASTRA100')
        ),
        React.createElement('div', { className: 'flex items-center space-x-4 text-[11px]' },
          currentUser && React.createElement('button', {
            onClick: onOpenUserProfile,
            className: 'text-amber-300 hover:text-white flex items-center space-x-1 font-semibold'
          },
            React.createElement(Icon, { name: 'user', className: 'w-3.5 h-3.5 text-amber-400' }),
            React.createElement('span', null, `Shopping as: ${currentUser.name.split(' ')[0]}`)
          ),
          React.createElement('span', { className: 'text-stone-600 hidden sm:inline' }, '|'),
          React.createElement('button', {
            onClick: () => onAction('seller-reg'),
            className: 'text-stone-300 hover:text-white underline underline-offset-4 flex items-center space-x-1'
          },
            React.createElement(Icon, { name: 'store', className: 'w-3.5 h-3.5' }),
            React.createElement('span', null, 'Become a Seller')
          ),
          React.createElement('span', { className: 'text-stone-600 hidden md:inline' }, '|'),
          React.createElement('div', { className: 'hidden md:flex items-center space-x-1 text-stone-300' },
            React.createElement(Icon, { name: 'truck', className: 'w-3.5 h-3.5 text-amber-400' }),
            React.createElement('span', null, 'Same-Day City Delivery')
          )
        )
      )
    );
  };

  // 2. Navigation Bar
  window.Navbar = function({ state, onNavigate, onOpenLocationModal, onOpenCart, onOpenUserProfile, onRoleSwitch }) {
    const [searchVal, setSearchVal] = React.useState('');
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = state.wishlist.length;

    const userInitials = (state.currentUser && state.currentUser.name)
      ? state.currentUser.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
      : 'U';

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (searchVal.trim()) {
        window.vastraStore.setState({ searchQuery: searchVal.trim() });
        onNavigate('products');
      }
    };

    return React.createElement('header', { className: 'sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200 shadow-sm' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex items-center justify-between h-20 gap-4' },
          
          // Brand Logo
          React.createElement('div', {
            onClick: () => onNavigate('home'),
            className: 'cursor-pointer flex flex-col justify-center'
          },
            React.createElement('div', { className: 'flex items-center space-x-2' },
              React.createElement('span', { className: 'font-serif text-3xl font-extrabold tracking-widest text-stone-900' }, 'VASTRA'),
              React.createElement('span', { className: 'text-xs bg-orange-800 text-stone-100 font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider' }, 'LOCAL')
            ),
            React.createElement('span', { className: 'text-[10px] text-stone-500 font-medium tracking-tight -mt-0.5' }, 'Har Local Dukaan, Ab Online')
          ),

          // Location Selector Pill
          React.createElement('button', {
            onClick: onOpenLocationModal,
            className: 'hidden lg:flex items-center space-x-2 bg-stone-100 hover:bg-stone-200/80 px-3 py-1.5 rounded-full border border-stone-300/70 text-xs text-stone-800 font-medium transition'
          },
            React.createElement(Icon, { name: 'mappin', className: 'w-4 h-4 text-orange-700' }),
            React.createElement('div', { className: 'text-left leading-tight' },
              React.createElement('div', { className: 'text-[10px] text-stone-500' }, 'Shopping in'),
              React.createElement('div', { className: 'font-semibold' }, `${state.selectedArea === 'All Areas' ? state.selectedCity : state.selectedArea}`)
            ),
            React.createElement(Icon, { name: 'chevronDown', className: 'w-3.5 h-3.5 text-stone-400' })
          ),

          // Search Bar
          React.createElement('form', {
            onSubmit: handleSearchSubmit,
            className: 'flex-1 max-w-lg hidden sm:block relative'
          },
            React.createElement('div', { className: 'relative' },
              React.createElement('input', {
                type: 'text',
                value: searchVal,
                onChange: (e) => setSearchVal(e.target.value),
                placeholder: 'Search "Banarasi saree", "Chikankari kurti", "Sharma Clothing"...',
                className: 'w-full bg-white pl-10 pr-10 py-2.5 rounded-full border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent transition placeholder-stone-400'
              }),
              React.createElement('div', { className: 'absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400' },
                React.createElement(Icon, { name: 'search', className: 'w-4 h-4' })
              ),
              searchVal && React.createElement('button', {
                type: 'button',
                onClick: () => setSearchVal(''),
                className: 'absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600'
              },
                React.createElement(Icon, { name: 'x', className: 'w-4 h-4' })
              )
            )
          ),

          // Action Buttons: Directory, Wishlist, Cart, Role / Account
          React.createElement('div', { className: 'flex items-center space-x-2 sm:space-x-4' },
            
            // Explore Shops Button
            React.createElement('button', {
              onClick: () => onNavigate('directory'),
              className: 'hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:text-orange-800 hover:bg-stone-100 transition'
            },
              React.createElement(Icon, { name: 'store', className: 'w-4 h-4 text-orange-700' }),
              React.createElement('span', null, 'Explore Shops')
            ),

            // All Products
            React.createElement('button', {
              onClick: () => onNavigate('products'),
              className: 'hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:text-orange-800 hover:bg-stone-100 transition'
            },
              React.createElement('span', null, 'Collections')
            ),

            // Wishlist Icon
            React.createElement('button', {
              onClick: () => onNavigate('wishlist'),
              className: 'relative p-2 text-stone-700 hover:text-orange-800 hover:bg-stone-100 rounded-full transition',
              title: 'Wishlist'
            },
              React.createElement(Icon, { name: 'heart', className: 'w-5 h-5' }),
              wishlistCount > 0 && React.createElement('span', {
                className: 'absolute top-0.5 right-0.5 bg-orange-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center'
              }, wishlistCount)
            ),

            // Cart Icon
            React.createElement('button', {
              onClick: onOpenCart,
              className: 'relative p-2 text-stone-700 hover:text-orange-800 hover:bg-stone-100 rounded-full transition',
              title: 'Shopping Bag'
            },
              React.createElement(Icon, { name: 'bag', className: 'w-5 h-5' }),
              cartCount > 0 && React.createElement('span', {
                className: 'absolute top-0.5 right-0.5 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center'
              }, cartCount)
            ),

            // Account & Role Dropdown
            React.createElement('div', { className: 'relative' },
              React.createElement('button', {
                onClick: () => setIsProfileOpen(!isProfileOpen),
                className: 'flex items-center space-x-2 p-1.5 rounded-full hover:bg-stone-100 border border-stone-300/70 transition'
              },
                React.createElement('div', { className: 'w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs' },
                  userInitials
                ),
                React.createElement('div', { className: 'hidden xl:block text-left text-xs pr-1' },
                  React.createElement('div', { className: 'font-semibold text-stone-800' }, state.currentUser.name.split(' ')[0]),
                  React.createElement('div', { className: 'text-[10px] text-orange-700 font-bold uppercase' }, state.currentUser.role)
                ),
                React.createElement(Icon, { name: 'chevronDown', className: 'w-3.5 h-3.5 text-stone-400' })
              ),

              // Dropdown Menu
              isProfileOpen && React.createElement('div', {
                className: 'absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-fade-in'
              },
                React.createElement('div', { className: 'px-4 py-2 border-b border-stone-100' },
                  React.createElement('p', { className: 'text-xs text-stone-500' }, 'Current User:'),
                  React.createElement('p', { className: 'text-sm font-bold text-stone-900 truncate' }, state.currentUser.name),
                  React.createElement('p', { className: 'text-xs text-stone-500 truncate' }, state.currentUser.email),
                  React.createElement('button', {
                    onClick: () => { onOpenUserProfile(); setIsProfileOpen(false); },
                    className: 'mt-1.5 text-xs text-orange-800 hover:underline font-bold flex items-center space-x-1'
                  },
                    React.createElement(Icon, { name: 'user', className: 'w-3 h-3' }),
                    React.createElement('span', null, 'Change Name / Address')
                  )
                ),
                
                // Switch Demo Roles
                React.createElement('div', { className: 'px-3 py-2 bg-stone-50 border-b border-stone-100 text-xs' },
                  React.createElement('p', { className: 'text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5' }, 'Demo Role Switcher'),
                  React.createElement('div', { className: 'grid grid-cols-3 gap-1' },
                    ['customer', 'seller', 'admin'].map(r => 
                      React.createElement('button', {
                        key: r,
                        onClick: () => {
                          onRoleSwitch(r);
                          setIsProfileOpen(false);
                        },
                        className: `py-1 text-[11px] rounded font-semibold capitalize transition ${state.currentUser.role === r ? 'bg-stone-900 text-white' : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'}`
                      }, r)
                    )
                  )
                ),

                React.createElement('div', { className: 'py-1 text-xs' },
                  React.createElement('button', {
                    onClick: () => { onNavigate('account'); setIsProfileOpen(false); },
                    className: 'w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center space-x-2 text-stone-700 font-semibold'
                  },
                    React.createElement(Icon, { name: 'user', className: 'w-4 h-4' }),
                    React.createElement('span', null, 'My Profile & Addresses')
                  ),
                  React.createElement('button', {
                    onClick: () => { onNavigate('account', { accountTab: 'orders' }); setIsProfileOpen(false); },
                    className: 'w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center space-x-2 text-stone-700'
                  },
                    React.createElement(Icon, { name: 'bag', className: 'w-4 h-4' }),
                    React.createElement('span', null, 'My Orders')
                  ),
                  React.createElement('button', {
                    onClick: () => { onNavigate('account', { accountTab: 'reservations' }); setIsProfileOpen(false); },
                    className: 'w-full text-left px-4 py-2 hover:bg-stone-50 flex items-center space-x-2 text-stone-700'
                  },
                    React.createElement(Icon, { name: 'store', className: 'w-4 h-4' }),
                    React.createElement('span', null, 'Store Pickup Reservations')
                  ),
                  
                  // Seller Dashboard link
                  state.currentUser.role === 'seller' && React.createElement('button', {
                    onClick: () => { onNavigate('seller-dashboard'); setIsProfileOpen(false); },
                    className: 'w-full text-left px-4 py-2 bg-orange-50 text-orange-900 hover:bg-orange-100 flex items-center space-x-2 font-medium'
                  },
                    React.createElement(Icon, { name: 'store', className: 'w-4 h-4 text-orange-700' }),
                    React.createElement('span', null, 'Seller Dashboard')
                  ),

                  // Admin Dashboard link
                  state.currentUser.role === 'admin' && React.createElement('button', {
                    onClick: () => { onNavigate('admin-dashboard'); setIsProfileOpen(false); },
                    className: 'w-full text-left px-4 py-2 bg-purple-50 text-purple-900 hover:bg-purple-100 flex items-center space-x-2 font-medium'
                  },
                    React.createElement(Icon, { name: 'shield', className: 'w-4 h-4 text-purple-700' }),
                    React.createElement('span', null, 'Admin Portal')
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // 3. Hero Section
  window.HeroSection = function({ onExploreShops, onShopCollections }) {
    return React.createElement('section', { className: 'relative bg-[#FAF7F2] border-b border-stone-200 overflow-hidden' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20' },
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-12 items-center' },
          
          // Hero Text Content
          React.createElement('div', { className: 'lg:col-span-7 space-y-6 text-center lg:text-left' },
            React.createElement('div', { className: 'inline-flex items-center space-x-2 bg-orange-100/80 text-orange-900 px-3.5 py-1.5 rounded-full text-xs font-semibold' },
              React.createElement(Icon, { name: 'sparkles', className: 'w-3.5 h-3.5 text-orange-700' }),
              React.createElement('span', null, 'Connecting You Directly to Local Boutiques & Artisans')
            ),
            React.createElement('h1', { className: 'font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-bold leading-tight' },
              'Discover Your City’s ',
              React.createElement('span', { className: 'italic text-orange-800' }, 'Best Clothing Stores')
            ),
            React.createElement('p', { className: 'text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed' },
              'Explore complete collections from verified neighborhood boutiques, traditional saree emporiums, and designer studios. Order online for same-day delivery, or reserve your favorites to try in person at the shop.'
            ),
            
            // Action Buttons
            React.createElement('div', { className: 'flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2' },
              React.createElement('button', {
                onClick: onExploreShops,
                className: 'px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition flex items-center space-x-2'
              },
                React.createElement(Icon, { name: 'store', className: 'w-4 h-4' }),
                React.createElement('span', null, 'Explore Local Shops')
              ),
              React.createElement('button', {
                onClick: onShopCollections,
                className: 'px-7 py-3.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 rounded-xl font-semibold transition flex items-center space-x-2'
              },
                React.createElement(Icon, { name: 'bag', className: 'w-4 h-4 text-orange-700' }),
                React.createElement('span', null, 'Shop Collections')
              )
            ),

            // Trust Metrics
            React.createElement('div', { className: 'grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 text-left' },
              React.createElement('div', null,
                React.createElement('div', { className: 'font-serif text-2xl font-bold text-stone-900' }, '100%'),
                React.createElement('div', { className: 'text-xs text-stone-500 font-medium' }, 'Authentic Racks')
              ),
              React.createElement('div', null,
                React.createElement('div', { className: 'font-serif text-2xl font-bold text-stone-900' }, '0-Risk'),
                React.createElement('div', { className: 'text-xs text-stone-500 font-medium' }, 'In-Store Trial')
              ),
              React.createElement('div', null,
                React.createElement('div', { className: 'font-serif text-2xl font-bold text-stone-900' }, 'Same-Day'),
                React.createElement('div', { className: 'text-xs text-stone-500 font-medium' }, 'City Delivery')
              )
            )
          ),

          // Hero Visual Banner
          React.createElement('div', { className: 'lg:col-span-5 relative' },
            React.createElement('div', { className: 'relative mx-auto max-w-md' },
              // Main Image Card
              React.createElement('div', { className: 'rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]' },
                React.createElement('img', {
                  src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                  alt: 'Indian Ethnic Fashion',
                  className: 'w-full h-full object-cover object-top'
                })
              ),

              // Floating Badge 1: Shop Tag
              React.createElement('div', { className: 'absolute -bottom-6 -left-6 bg-white p-3.5 rounded-xl shadow-xl border border-stone-100 flex items-center space-x-3' },
                React.createElement('div', { className: 'w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-800' },
                  React.createElement(Icon, { name: 'store', className: 'w-5 h-5' })
                ),
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-xs font-bold text-stone-900' }, 'Sharma Clothing Store'),
                  React.createElement('div', { className: 'text-[11px] text-stone-500' }, 'Johari Bazar · 1.2 km away')
                )
              ),

              // Floating Badge 2: Trial Room Pickup
              React.createElement('div', { className: 'absolute -top-4 -right-4 bg-stone-900 text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium' },
                React.createElement(Icon, { name: 'check', className: 'w-4 h-4 text-emerald-400' }),
                React.createElement('span', null, 'Try Offline Before Buying')
              )
            )
          )
        )
      )
    );
  };

  // 4. City Area Pills
  window.CityAreaPills = function({ areas, selectedArea, onSelectArea }) {
    return React.createElement('div', { className: 'bg-white py-3 border-b border-stone-200' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex items-center space-x-2 overflow-x-auto no-scrollbar py-1' },
          React.createElement('span', { className: 'text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center space-x-1 shrink-0' },
            React.createElement(Icon, { name: 'mappin', className: 'w-3.5 h-3.5 text-orange-700' }),
            React.createElement('span', null, 'Areas:')
          ),
          ['All Areas', ...areas].map(area =>
            React.createElement('button', {
              key: area,
              onClick: () => onSelectArea(area),
              className: `text-xs px-3 py-1.5 rounded-full font-medium shrink-0 transition ${selectedArea === area ? 'bg-orange-800 text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`
            }, area)
          )
        )
      )
    );
  };

  // 5. Category Showcase Grid
  window.CategoryGrid = function({ categories, onSelectCategory }) {
    return React.createElement('section', { className: 'py-12 bg-stone-50' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex items-center justify-between mb-8' },
          React.createElement('div', null,
            React.createElement('h2', { className: 'font-serif text-2xl sm:text-3xl font-bold text-stone-900' }, 'Shop by Category'),
            React.createElement('p', { className: 'text-xs sm:text-sm text-stone-500 mt-1' }, 'Handpicked collections from master weavers and designers in your city')
          )
        ),
        React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4' },
          categories.map(cat =>
            React.createElement('div', {
              key: cat.id,
              onClick: () => onSelectCategory(cat.name),
              className: 'group cursor-pointer bg-white rounded-xl p-3 border border-stone-200 hover:border-orange-700/50 hover:shadow-md transition text-center'
            },
              React.createElement('div', { className: 'w-full aspect-square rounded-lg overflow-hidden mb-2.5 bg-stone-100' },
                React.createElement('img', {
                  src: cat.image,
                  alt: cat.name,
                  className: 'w-full h-full object-cover group-hover:scale-105 transition duration-300'
                })
              ),
              React.createElement('h3', { className: 'text-xs font-bold text-stone-800 line-clamp-1 group-hover:text-orange-800' }, cat.name),
              React.createElement('span', { className: 'text-[10px] text-stone-400 font-medium' }, `${cat.count}+ garments`)
            )
          )
        )
      )
    );
  };

  // 6. Shop Card (Grid & List View)
  window.ShopCard = function({ shop, onVisitStore, onOpenShop, layout = 'grid' }) {
    if (layout === 'list') {
      return React.createElement('div', {
        className: 'bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row'
      },
        React.createElement('div', { className: 'sm:w-64 h-48 sm:h-auto relative shrink-0' },
          React.createElement('img', {
            src: shop.banner,
            alt: shop.name,
            className: 'w-full h-full object-cover'
          }),
          React.createElement('span', {
            className: 'absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1'
          },
            React.createElement(Icon, { name: 'star', className: 'w-3 h-3 text-amber-500 fill-amber-500' }),
            React.createElement('span', null, shop.rating)
          )
        ),
        React.createElement('div', { className: 'p-5 flex-1 flex flex-col justify-between' },
          React.createElement('div', null,
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('h3', {
                onClick: () => onOpenShop(shop.id),
                className: 'font-serif text-xl font-bold text-stone-900 hover:text-orange-800 cursor-pointer'
              }, shop.name),
              shop.verified && React.createElement('span', { className: 'text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1' },
                React.createElement(Icon, { name: 'check', className: 'w-3 h-3' }),
                React.createElement('span', null, 'Verified Shop')
              )
            ),
            React.createElement('p', { className: 'text-xs text-orange-800 font-medium mt-0.5' }, shop.tagline),
            React.createElement('p', { className: 'text-xs text-stone-500 mt-2 line-clamp-2' }, shop.description),
            
            // Location & Hours
            React.createElement('div', { className: 'mt-3 flex flex-wrap gap-y-1 gap-x-4 text-xs text-stone-600' },
              React.createElement('div', { className: 'flex items-center space-x-1' },
                React.createElement(Icon, { name: 'mappin', className: 'w-3.5 h-3.5 text-stone-400' }),
                React.createElement('span', null, `${shop.area}, ${shop.city} (${shop.distanceKm} km away)`)
              ),
              React.createElement('div', { className: 'flex items-center space-x-1' },
                React.createElement(Icon, { name: 'clock', className: 'w-3.5 h-3.5 text-stone-400' }),
                React.createElement('span', null, shop.openHours)
              )
            ),

            // Amenities Tags
            React.createElement('div', { className: 'mt-3 flex flex-wrap gap-1.5' },
              (shop.amenities || []).slice(0, 4).map(amenity =>
                React.createElement('span', {
                  key: amenity,
                  className: 'text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium'
                }, amenity)
              )
            )
          ),

          // Actions
          React.createElement('div', { className: 'mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3' },
            React.createElement('button', {
              onClick: () => onVisitStore(shop),
              className: 'px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition'
            },
              React.createElement(Icon, { name: 'mappin', className: 'w-3.5 h-3.5 text-orange-700' }),
              React.createElement('span', null, 'Visit Store & Directions')
            ),
            React.createElement('button', {
              onClick: () => onOpenShop(shop.id),
              className: 'px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition'
            }, 'Browse Collection →')
          )
        )
      );
    }

    // Grid View
    return React.createElement('div', {
      className: 'bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition duration-200 flex flex-col'
    },
      React.createElement('div', { className: 'relative aspect-[16/10] bg-stone-100 overflow-hidden' },
        React.createElement('img', {
          src: shop.banner,
          alt: shop.name,
          className: 'w-full h-full object-cover group-hover:scale-105 transition duration-300'
        }),
        React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' }),
        
        // Rating Badge
        React.createElement('div', {
          className: 'absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1'
        },
          React.createElement(Icon, { name: 'star', className: 'w-3 h-3 text-amber-500 fill-amber-500' }),
          React.createElement('span', null, shop.rating),
          React.createElement('span', { className: 'text-[10px] text-stone-400 font-normal' }, `(${shop.reviewCount})`)
        ),

        // Distance Badge
        React.createElement('div', {
          className: 'absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-0.5 rounded-full'
        }, `${shop.distanceKm} km away`),

        // Shop Title on Banner
        React.createElement('div', { className: 'absolute bottom-3 left-3 right-3 text-white' },
          React.createElement('div', { className: 'flex items-center space-x-1.5' },
            React.createElement('h3', {
              onClick: () => onOpenShop(shop.id),
              className: 'font-serif text-lg font-bold hover:underline cursor-pointer drop-shadow-sm'
            }, shop.name),
            shop.verified && React.createElement(Icon, { name: 'checkCircle', className: 'w-4 h-4 text-emerald-400 shrink-0' })
          ),
          React.createElement('p', { className: 'text-xs text-stone-200 drop-shadow-sm line-clamp-1' }, `${shop.area}, ${shop.city}`)
        )
      ),

      React.createElement('div', { className: 'p-4 flex-1 flex flex-col justify-between space-y-4' },
        React.createElement('div', null,
          React.createElement('p', { className: 'text-xs text-stone-600 line-clamp-2' }, shop.description),
          
          // Available Services Pills
          React.createElement('div', { className: 'mt-3 flex flex-wrap gap-1.5' },
            shop.allowStorePickup && React.createElement('span', { className: 'text-[10px] bg-orange-50 text-orange-800 font-semibold px-2 py-0.5 rounded' }, '🛍️ In-Store Trial'),
            shop.allowOnlineDelivery && React.createElement('span', { className: 'text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded' }, '⚡ Same-Day Delivery')
          ),

          // Hours
          React.createElement('div', { className: 'mt-2 text-[11px] text-stone-500 flex items-center space-x-1' },
            React.createElement(Icon, { name: 'clock', className: 'w-3 h-3 text-stone-400' }),
            React.createElement('span', null, `${shop.openHours}`)
          )
        ),

        // Card Footer Buttons
        React.createElement('div', { className: 'grid grid-cols-2 gap-2 pt-2 border-t border-stone-100' },
          React.createElement('button', {
            onClick: () => onVisitStore(shop),
            className: 'w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg text-center transition'
          }, 'Visit Store'),
          React.createElement('button', {
            onClick: () => onOpenShop(shop.id),
            className: 'w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg text-center transition'
          }, 'Collection →')
        )
      )
    );
  };

  // 7. Product Card
  window.ProductCard = function({ product, onOpenProduct, onAddToCart, onToggleWishlist, isWishlisted }) {
    return React.createElement('div', {
      className: 'group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col'
    },
      // Image Container
      React.createElement('div', {
        className: 'relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer',
        onClick: () => onOpenProduct(product.id)
      },
        React.createElement('img', {
          src: product.images[0],
          alt: product.title,
          className: 'w-full h-full object-cover group-hover:scale-105 transition duration-300'
        }),

        // Discount Tag
        product.discountPercent > 0 && React.createElement('span', {
          className: 'absolute top-3 left-3 bg-orange-700 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow'
        }, `${product.discountPercent}% OFF`),

        // Wishlist Button
        React.createElement('button', {
          onClick: (e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          },
          className: `absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition ${isWishlisted ? 'bg-orange-800 text-white' : 'bg-white/90 text-stone-600 hover:bg-white'}`
        },
          React.createElement(Icon, { name: 'heart', className: 'w-4 h-4' })
        ),

        // In-Store Trial Badge
        React.createElement('div', {
          className: 'absolute bottom-2 left-2 right-2 bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[10px] font-medium py-1 px-2 rounded flex items-center justify-between'
        },
          React.createElement('span', { className: 'truncate' }, `📍 ${product.shopName}`),
          React.createElement('span', { className: 'text-amber-400 shrink-0 font-bold' }, 'Try Offline')
        )
      ),

      // Product Details
      React.createElement('div', { className: 'p-4 flex-1 flex flex-col justify-between space-y-3' },
        React.createElement('div', null,
          React.createElement('div', { className: 'text-[11px] text-stone-400 font-semibold uppercase tracking-wider' }, product.category),
          React.createElement('h3', {
            onClick: () => onOpenProduct(product.id),
            className: 'text-sm font-bold text-stone-900 hover:text-orange-800 line-clamp-1 cursor-pointer mt-0.5'
          }, product.title),
          React.createElement('p', { className: 'text-[11px] text-stone-500 line-clamp-1 mt-0.5' }, `Fabric: ${product.fabric}`),

          // Price Row
          React.createElement('div', { className: 'mt-2 flex items-baseline space-x-2' },
            React.createElement('span', { className: 'text-base font-extrabold text-stone-900' }, `₹${product.price.toLocaleString('en-IN')}`),
            product.originalPrice > product.price && React.createElement('span', { className: 'text-xs text-stone-400 line-through' }, `₹${product.originalPrice.toLocaleString('en-IN')}`)
          ),

          // Available Sizes Chips
          React.createElement('div', { className: 'mt-2 flex items-center space-x-1 overflow-x-auto no-scrollbar' },
            React.createElement('span', { className: 'text-[10px] text-stone-400 font-medium' }, 'Sizes:'),
            (product.sizes || []).slice(0, 4).map(s =>
              React.createElement('span', {
                key: s,
                className: 'text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-semibold'
              }, s)
            )
          )
        ),

        // Action Buttons: Quick View / Add to Cart
        React.createElement('div', { className: 'pt-2 flex items-center gap-2' },
          React.createElement('button', {
            onClick: () => onOpenProduct(product.id),
            className: 'flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg text-center transition'
          }, 'View Details'),
          React.createElement('button', {
            onClick: () => onAddToCart(product),
            className: 'p-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition',
            title: 'Add to Cart'
          },
            React.createElement(Icon, { name: 'bag', className: 'w-4 h-4' })
          )
        )
      )
    );
  };

  // 8. Interactive City Map View (Visual Map with Boutique Pins)
  window.InteractiveMapView = function({ shops, onOpenShop, onVisitStore }) {
    const [selectedShop, setSelectedShop] = React.useState(shops[0] || null);

    return React.createElement('div', { className: 'bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm' },
      React.createElement('div', { className: 'p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Interactive Local Clothing Map'),
          React.createElement('p', { className: 'text-xs text-stone-500' }, 'Click on any shop pin to see directions, trial rooms, and live collections')
        ),
        React.createElement('span', { className: 'text-xs bg-orange-100 text-orange-900 font-semibold px-2.5 py-1 rounded-full' },
          `${shops.length} verified stores nearby`
        )
      ),

      React.createElement('div', { className: 'relative grid grid-cols-1 lg:grid-cols-12 min-h-[460px]' },
        
        // Graphical Map Canvas
        React.createElement('div', {
          className: 'lg:col-span-8 relative bg-[#ECE6DF] min-h-[350px] p-6 overflow-hidden flex items-center justify-center select-none'
        },
          // Map Background Grid & Landmark Accents
          React.createElement('div', {
            className: 'absolute inset-0 opacity-20 pointer-events-none',
            style: {
              backgroundImage: 'radial-gradient(#C2410C 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }
          }),
          
          // Simulated Road Lines
          React.createElement('svg', { className: 'absolute inset-0 w-full h-full pointer-events-none stroke-stone-300 stroke-[3]' },
            React.createElement('line', { x1: '10%', y1: '20%', x2: '90%', y2: '80%' }),
            React.createElement('line', { x1: '30%', y1: '80%', x2: '70%', y2: '20%' }),
            React.createElement('line', { x1: '0%', y1: '50%', x2: '100%', y2: '50%' })
          ),

          // Central Customer Location Marker
          React.createElement('div', {
            className: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1 z-10 animate-pulse'
          },
            React.createElement('span', { className: 'w-2 h-2 bg-white rounded-full' }),
            React.createElement('span', null, 'Your Location')
          ),

          // Boutique Pins on Map
          shops.map(shop => {
            const isSelected = selectedShop?.id === shop.id;
            const x = shop.coordinates?.x || 50;
            const y = shop.coordinates?.y || 50;

            return React.createElement('div', {
              key: shop.id,
              onClick: () => setSelectedShop(shop),
              style: { left: `${x}%`, top: `${y}%` },
              className: `absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition transform hover:scale-110 z-20`
            },
              React.createElement('div', {
                className: `px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1.5 text-xs font-bold border transition ${isSelected ? 'bg-orange-800 text-white border-orange-900 scale-105' : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'}`
              },
                React.createElement(Icon, { name: 'store', className: 'w-3.5 h-3.5' }),
                React.createElement('span', { className: 'truncate max-w-[110px]' }, shop.name.split(' ')[0]),
                React.createElement('span', { className: 'text-[10px] font-normal opacity-80' }, `${shop.distanceKm}k`)
              )
            );
          })
        ),

        // Sidebar for Selected Shop Preview
        React.createElement('div', { className: 'lg:col-span-4 p-5 bg-white border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-between' },
          selectedShop ? React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', { className: 'aspect-video rounded-xl overflow-hidden bg-stone-100 relative' },
              React.createElement('img', {
                src: selectedShop.banner,
                alt: selectedShop.name,
                className: 'w-full h-full object-cover'
              }),
              React.createElement('div', { className: 'absolute bottom-2 left-2 bg-stone-900/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded' },
                `⭐ ${selectedShop.rating} (${selectedShop.reviewCount} reviews)`
              )
            ),
            React.createElement('div', null,
              React.createElement('h4', { className: 'font-serif text-lg font-bold text-stone-900' }, selectedShop.name),
              React.createElement('p', { className: 'text-xs text-orange-800 font-medium' }, selectedShop.tagline),
              React.createElement('p', { className: 'text-xs text-stone-500 mt-2' }, selectedShop.address),
              React.createElement('div', { className: 'mt-2 text-xs text-stone-600 flex items-center space-x-1' },
                React.createElement(Icon, { name: 'clock', className: 'w-3.5 h-3.5 text-stone-400' }),
                React.createElement('span', null, selectedShop.openHours)
              )
            ),
            React.createElement('div', { className: 'flex flex-wrap gap-1' },
              (selectedShop.amenities || []).map(a =>
                React.createElement('span', { key: a, className: 'text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded' }, a)
              )
            )
          ) : React.createElement('div', { className: 'text-center py-12 text-stone-400 text-xs' }, 'Select a shop pin on the map'),

          selectedShop && React.createElement('div', { className: 'pt-4 border-t border-stone-100 grid grid-cols-2 gap-2' },
            React.createElement('button', {
              onClick: () => onVisitStore(selectedShop),
              className: 'py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg text-center transition'
            }, 'Directions & Timings'),
            React.createElement('button', {
              onClick: () => onOpenShop(selectedShop.id),
              className: 'py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg text-center transition'
            }, 'View Racks →')
          )
        )
      )
    );
  };

  // 9. Benefits Section
  window.BenefitsSection = function() {
    const benefits = [
      {
        icon: 'store',
        title: 'Touch, Feel & Try Offline',
        desc: 'Reserve pieces online with one click. Walk into your local store, try them in the trial room, and buy with 100% confidence.'
      },
      {
        icon: 'truck',
        title: 'Same-Day City Delivery',
        desc: 'Why wait 5 days for couriers when your neighborhood boutique is 20 minutes away? Get lightning-fast local doorstep delivery.'
      },
      {
        icon: 'scissors',
        title: 'On-the-Spot Master Alterations',
        desc: 'Need a kurti tucked or saree fall-pico done? Local boutique master tailors offer perfect fitting right at the store counter.'
      },
      {
        icon: 'shield',
        title: 'Support Local Karigars & Dukaan',
        desc: 'Every single order supports authentic neighborhood clothing stores and weavers directly. Zero counterfeits, 100% genuine fabric.'
      }
    ];

    return React.createElement('section', { className: 'py-16 bg-[#FDFBF7] border-y border-stone-200' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'text-center max-w-2xl mx-auto mb-12' },
          React.createElement('span', { className: 'text-xs font-bold uppercase tracking-widest text-orange-800' }, 'The Vastra Promise'),
          React.createElement('h2', { className: 'font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1' }, 'Why Shop Local With VASTRA?'),
          React.createElement('p', { className: 'text-sm text-stone-500 mt-2' }, 'Combining the boundless discovery of an online marketplace with the comfort of neighborhood shopping.')
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' },
          benefits.map(b =>
            React.createElement('div', {
              key: b.title,
              className: 'bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition text-left space-y-3'
            },
              React.createElement('div', { className: 'w-12 h-12 rounded-xl bg-orange-100/70 text-orange-800 flex items-center justify-center' },
                React.createElement(Icon, { name: b.icon, className: 'w-6 h-6' })
              ),
              React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, b.title),
              React.createElement('p', { className: 'text-xs text-stone-600 leading-relaxed' }, b.desc)
            )
          )
        )
      )
    );
  };

  // 10. Trunk Show & Seasonal Banner
  window.TrunkShowBanner = function({ onAction }) {
    return React.createElement('section', { className: 'py-12 bg-stone-900 text-stone-100 overflow-hidden relative' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10' },
        React.createElement('div', { className: 'flex flex-col md:flex-row items-center justify-between gap-8' },
          React.createElement('div', { className: 'space-y-3 text-center md:text-left' },
            React.createElement('span', { className: 'bg-amber-500 text-stone-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider' },
              'Festive Trunk Show'
            ),
            React.createElement('h2', { className: 'font-serif text-3xl sm:text-4xl font-bold text-white' },
              'Handcrafted Wedding & Silk Trunk Show'
            ),
            React.createElement('p', { className: 'text-stone-300 text-sm max-w-xl' },
              'Explore exclusive ceremonial collections from premier city boutiques. Up to 35% off on handloom Banarasis, bridal lehengas, and royal bandhgalas.'
            )
          ),
          React.createElement('div', { className: 'flex flex-col sm:flex-row items-center gap-3 shrink-0' },
            React.createElement('div', { className: 'bg-stone-800 border border-stone-700 px-4 py-2.5 rounded-xl text-center' },
              React.createElement('div', { className: 'text-[10px] text-stone-400 font-bold tracking-wider' }, 'USE COUPON'),
              React.createElement('div', { className: 'text-base font-extrabold text-amber-400 tracking-wider' }, 'FESTIVE')
            ),
            React.createElement('button', {
              onClick: () => onAction('products'),
              className: 'px-6 py-3 bg-white text-stone-900 hover:bg-stone-100 font-bold text-sm rounded-xl transition shadow-lg'
            }, 'Shop Festive Edit →')
          )
        )
      )
    );
  };

  // 11. Footer
  window.Footer = function({ onNavigate }) {
    return React.createElement('footer', { className: 'bg-stone-950 text-stone-400 text-xs pt-16 pb-12 border-t border-stone-800' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12' },
          
          // Brand Info
          React.createElement('div', { className: 'lg:col-span-2 space-y-4' },
            React.createElement('div', { className: 'flex items-center space-x-2' },
              React.createElement('span', { className: 'font-serif text-3xl font-extrabold text-white tracking-wider' }, 'VASTRA'),
              React.createElement('span', { className: 'text-[10px] bg-orange-700 text-white font-bold px-1.5 py-0.5 rounded' }, 'LOCAL')
            ),
            React.createElement('p', { className: 'text-stone-400 text-xs leading-relaxed max-w-sm' },
              'VASTRA is India’s premier local clothing marketplace connecting authentic garment shops, saree emporiums, and designer boutiques directly with city fashion lovers.'
            ),
            React.createElement('div', { className: 'pt-2 flex items-center space-x-3 text-stone-300' },
              React.createElement('span', { className: 'text-xs text-stone-500' }, 'Follow local weavers:'),
              React.createElement('span', { className: 'hover:text-white cursor-pointer' }, 'Instagram'),
              React.createElement('span', { className: 'hover:text-white cursor-pointer' }, 'Facebook'),
              React.createElement('span', { className: 'hover:text-white cursor-pointer' }, 'YouTube')
            )
          ),

          // Quick Links
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('h4', { className: 'text-sm font-bold text-white uppercase tracking-wider' }, 'Discover'),
            React.createElement('ul', { className: 'space-y-2' },
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('directory'), className: 'hover:text-white' }, 'All Local Clothing Shops')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('products'), className: 'hover:text-white' }, 'Complete Catalog')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('products', { category: 'Sarees & Handlooms' }), className: 'hover:text-white' }, 'Handloom Sarees')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('products', { category: 'Menswear & Bandhgalas' }), className: 'hover:text-white' }, 'Royal Menswear')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('directory', { viewMode: 'map' }), className: 'hover:text-white' }, 'City Store Map'))
            )
          ),

          // For Shop Owners
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('h4', { className: 'text-sm font-bold text-white uppercase tracking-wider' }, 'For Retailers'),
            React.createElement('ul', { className: 'space-y-2' },
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('seller-reg'), className: 'text-orange-400 hover:text-orange-300 font-semibold' }, 'Become a Verified Seller')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('seller-dashboard'), className: 'hover:text-white' }, 'Seller Portal')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('faqs'), className: 'hover:text-white' }, 'Seller FAQs')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('contact'), className: 'hover:text-white' }, 'Dukaan Support'))
            )
          ),

          // Company & Trust
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('h4', { className: 'text-sm font-bold text-white uppercase tracking-wider' }, 'About & Legal'),
            React.createElement('ul', { className: 'space-y-2' },
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('about'), className: 'hover:text-white' }, 'About VASTRA')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('contact'), className: 'hover:text-white' }, 'Contact Customer Care')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('faqs'), className: 'hover:text-white' }, 'FAQs & Help')),
              React.createElement('li', null, React.createElement('button', { onClick: () => onNavigate('terms'), className: 'hover:text-white' }, 'Terms & Privacy Policy'))
            )
          )
        ),

        // Bottom Bar
        React.createElement('div', { className: 'pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-[11px]' },
          React.createElement('p', null, '© 2026 VASTRA Fashion Marketplace. Made with pride for Indian local shopkeepers.'),
          React.createElement('p', { className: 'mt-2 sm:mt-0' }, 'Har Local Dukaan, Ab Online · Jaipur · Delhi · Mumbai · Ahmedabad')
        )
      )
    );
  };
})();
