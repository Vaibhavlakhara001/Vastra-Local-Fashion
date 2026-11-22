// VASTRA – Main Application Orchestrator & Router
(function() {
  const Icon = window.VastraIcon;

  function VastraApp() {
    const [state, setState] = React.useState(window.vastraStore.state);

    // Modals state
    const [isLocationModalOpen, setIsLocationModalOpen] = React.useState(false);
    const [isUserProfileModalOpen, setIsUserProfileModalOpen] = React.useState(false);
    const [isCartOpen, setIsCartOpen] = React.useState(false);
    const [isVisitStoreModalOpen, setIsVisitStoreModalOpen] = React.useState(false);
    const [visitStoreTarget, setVisitStoreTarget] = React.useState(null);
    const [isReserveModalOpen, setIsReserveModalOpen] = React.useState(false);
    const [reserveProductTarget, setReserveProductTarget] = React.useState(null);
    const [isProductDetailOpen, setIsProductDetailOpen] = React.useState(false);
    const [detailProductTarget, setDetailProductTarget] = React.useState(null);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = React.useState(false);
    const [trackingTargetId, setTrackingTargetId] = React.useState(state.activeTrackingOrderId);

    // Subscribe to state updates
    React.useEffect(() => {
      const unsubscribe = window.vastraStore.subscribe((newState) => {
        setState({ ...newState });
      });
      return unsubscribe;
    }, []);

    // Handlers
    const handleNavigate = (view, params = {}) => {
      window.vastraStore.navigateTo(view, params);
    };

    const handleOpenShop = (shopId) => {
      window.vastraStore.navigateTo('shop-profile', { activeShopId: shopId });
    };

    const handleOpenProduct = (productId) => {
      const prod = state.products.find(p => p.id === productId);
      if (prod) {
        setDetailProductTarget(prod);
        setIsProductDetailOpen(true);
      }
    };

    const handleVisitStore = (shop) => {
      setVisitStoreTarget(shop);
      setIsVisitStoreModalOpen(true);
    };

    const handleReserveProduct = (product) => {
      const shop = state.shops.find(s => s.id === product.shopId);
      setReserveProductTarget(product);
      setVisitStoreTarget(shop);
      setIsReserveModalOpen(true);
    };

    const handleConfirmReservation = (resData) => {
      window.vastraStore.createStorePickupReservation(resData);
    };

    const handleAddToCart = (product, size, color, quantity) => {
      window.vastraStore.addToCart(product, size, color, quantity);
    };

    const handleToggleWishlist = (productId) => {
      window.vastraStore.toggleWishlist(productId);
    };

    const handleTrackOrder = (orderId) => {
      setTrackingTargetId(orderId);
      setIsTrackingModalOpen(true);
    };

    const handleRoleSwitch = (role) => {
      window.vastraStore.setRole(role);
      if (role === 'seller') {
        window.vastraStore.navigateTo('seller-dashboard');
      } else if (role === 'admin') {
        window.vastraStore.navigateTo('admin-dashboard');
      }
    };

    const handleSelectLocation = (city, area) => {
      window.vastraStore.setCity(city, area);
    };

    // Filtered data for Home page
    const featuredShops = state.shops.filter(s => s.featured);
    const trendingProducts = state.products.filter(p => p.isTrending).slice(0, 8);
    const currentCityObj = window.VASTRA_DATA.cities.find(c => c.name === state.selectedCity) || window.VASTRA_DATA.cities[0];

    return React.createElement('div', { className: 'min-h-screen flex flex-col font-sans text-stone-900 antialiased selection:bg-orange-800 selection:text-white' },
      
      // Toast notification
      state.toast && React.createElement('div', {
        className: 'fixed top-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center space-x-2 text-xs animate-bounce font-medium'
      },
        React.createElement(Icon, { name: 'sparkles', className: 'w-4 h-4 text-amber-400' }),
        React.createElement('span', null, state.toast.message)
      ),

      // Announcement Bar
      React.createElement(window.AnnouncementBar, {
        onAction: handleNavigate,
        currentUser: state.currentUser,
        onOpenUserProfile: () => setIsUserProfileModalOpen(true)
      }),

      // Sticky Navbar
      React.createElement(window.Navbar, {
        state,
        onNavigate: handleNavigate,
        onOpenLocationModal: () => setIsLocationModalOpen(true),
        onOpenCart: () => setIsCartOpen(true),
        onOpenUserProfile: () => setIsUserProfileModalOpen(true),
        onRoleSwitch: handleRoleSwitch
      }),

      // MAIN ROUTED CONTENT
      React.createElement('main', { className: 'flex-1' },
        
        // 1. HOME VIEW
        state.activeView === 'home' && React.createElement(React.Fragment, null,
          React.createElement(window.HeroSection, {
            onExploreShops: () => handleNavigate('directory'),
            onShopCollections: () => handleNavigate('products')
          }),

          // City Area Quick Filter Bar
          React.createElement(window.CityAreaPills, {
            areas: currentCityObj.areas,
            selectedArea: state.selectedArea,
            onSelectArea: (area) => handleSelectLocation(state.selectedCity, area)
          }),

          // Categories Showcase
          React.createElement(window.CategoryGrid, {
            categories: window.VASTRA_DATA.categories,
            onSelectCategory: (catName) => {
              window.vastraStore.setState({ activeFilterCategory: catName });
              handleNavigate('products');
            }
          }),

          // Featured Local Clothing Stores Near Customer
          React.createElement('section', { className: 'py-12 bg-white' },
            React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
              React.createElement('div', { className: 'flex items-center justify-between mb-8' },
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-[11px] font-bold uppercase tracking-widest text-orange-800' }, 'Physical Stores in Your City'),
                  React.createElement('h2', { className: 'font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5' }, 'Featured Neighborhood Boutiques')
                ),
                React.createElement('button', {
                  onClick: () => handleNavigate('directory'),
                  className: 'text-xs font-bold text-orange-800 hover:text-orange-950 flex items-center space-x-1'
                },
                  React.createElement('span', null, 'View All Stores'),
                  React.createElement(Icon, { name: 'arrowRight', className: 'w-3.5 h-3.5' })
                )
              ),
              React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
                featuredShops.map(shop =>
                  React.createElement(window.ShopCard, {
                    key: shop.id,
                    shop,
                    onVisitStore: handleVisitStore,
                    onOpenShop: handleOpenShop
                  })
                )
              )
            )
          ),

          // Trending Local Garments
          React.createElement('section', { className: 'py-12 bg-[#FAF7F2] border-t border-stone-200' },
            React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
              React.createElement('div', { className: 'flex items-center justify-between mb-8' },
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-[11px] font-bold uppercase tracking-widest text-orange-800' }, 'Curated from City Racks'),
                  React.createElement('h2', { className: 'font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5' }, 'Trending Local Pieces')
                ),
                React.createElement('button', {
                  onClick: () => handleNavigate('products'),
                  className: 'text-xs font-bold text-orange-800 hover:text-orange-950 flex items-center space-x-1'
                },
                  React.createElement('span', null, 'Explore All'),
                  React.createElement(Icon, { name: 'arrowRight', className: 'w-3.5 h-3.5' })
                )
              ),
              React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6' },
                trendingProducts.map(product =>
                  React.createElement(window.ProductCard, {
                    key: product.id,
                    product,
                    onOpenProduct: handleOpenProduct,
                    onAddToCart: handleAddToCart,
                    onToggleWishlist: handleToggleWishlist,
                    isWishlisted: state.wishlist.includes(product.id)
                  })
                )
              )
            )
          ),

          // Benefits Section
          React.createElement(window.BenefitsSection, null),

          // Festive Trunk Show Banner
          React.createElement(window.TrunkShowBanner, { onAction: handleNavigate })
        ),

        // 2. DIRECTORY VIEW ("Explore Local Shops")
        state.activeView === 'directory' && React.createElement(window.ExploreShopsDirectoryPage, {
          state,
          onOpenShop: handleOpenShop,
          onVisitStore: handleVisitStore
        }),

        // 3. INDIVIDUAL SHOP PROFILE VIEW
        state.activeView === 'shop-profile' && React.createElement(window.IndividualShopProfilePage, {
          shopId: state.activeShopId || 'shop-1',
          state,
          onVisitStore: handleVisitStore,
          onOpenProduct: handleOpenProduct,
          onAddToCart: handleAddToCart,
          onToggleWishlist: handleToggleWishlist,
          onReserveProduct: handleReserveProduct
        }),

        // 4. ALL PRODUCTS VIEW
        state.activeView === 'products' && React.createElement(window.AllProductsCatalogPage, {
          state,
          onOpenProduct: handleOpenProduct,
          onAddToCart: handleAddToCart,
          onToggleWishlist: handleToggleWishlist
        }),

        // 5. CUSTOMER ACCOUNT VIEW
        state.activeView === 'account' && React.createElement(window.CustomerAccountView, {
          state,
          defaultTab: state.accountTab || 'orders',
          onTrackOrder: handleTrackOrder,
          onOpenProduct: handleOpenProduct,
          onAddToCart: handleAddToCart,
          onVisitStore: handleVisitStore
        }),

        // 6. WISHLIST VIEW
        state.activeView === 'wishlist' && React.createElement(window.CustomerAccountView, {
          state,
          defaultTab: 'wishlist',
          onTrackOrder: handleTrackOrder,
          onOpenProduct: handleOpenProduct,
          onAddToCart: handleAddToCart,
          onVisitStore: handleVisitStore
        }),

        // 7. SELLER DASHBOARD VIEW
        state.activeView === 'seller-dashboard' && React.createElement(window.SellerDashboard, {
          state,
          onOpenProduct: handleOpenProduct
        }),

        // 8. ADMIN DASHBOARD VIEW
        state.activeView === 'admin-dashboard' && React.createElement(window.AdminDashboard, {
          state
        }),

        // 9. BECOME A SELLER VIEW
        state.activeView === 'seller-reg' && React.createElement(window.BecomeSellerPage, {
          onComplete: () => handleNavigate('home')
        }),

        // 10. INFORMATIONAL VIEWS: About, Contact, FAQs, Terms
        state.activeView === 'about' && React.createElement(window.AboutUsPage, null),
        state.activeView === 'contact' && React.createElement(window.ContactUsPage, null),
        state.activeView === 'faqs' && React.createElement(window.FaqsPage, null),
        state.activeView === 'terms' && React.createElement(window.TermsPage, null)
      ),

      // Footer
      React.createElement(window.Footer, { onNavigate: handleNavigate }),

      // MODALS
      
      // Location Modal
      React.createElement(window.LocationModal, {
        isOpen: isLocationModalOpen,
        onClose: () => setIsLocationModalOpen(false),
        selectedCity: state.selectedCity,
        selectedArea: state.selectedArea,
        onSelectLocation: handleSelectLocation
      }),

      // User Profile & Account Modal (Custom Name, Email & Address without Database)
      React.createElement(window.UserProfileModal, {
        isOpen: isUserProfileModalOpen,
        onClose: () => setIsUserProfileModalOpen(false),
        state
      }),

      // Visit Store Modal (Offline details, directions, contact)
      React.createElement(window.VisitStoreModal, {
        isOpen: isVisitStoreModalOpen,
        onClose: () => setIsVisitStoreModalOpen(false),
        shop: visitStoreTarget,
        onReserveClick: (shop) => {
          const prod = state.products.find(p => p.shopId === shop.id) || state.products[0];
          handleReserveProduct(prod);
        }
      }),

      // Reserve for Store Pickup Modal
      React.createElement(window.ReservePickupModal, {
        isOpen: isReserveModalOpen,
        onClose: () => setIsReserveModalOpen(false),
        product: reserveProductTarget,
        shop: visitStoreTarget,
        currentUser: state.currentUser,
        onConfirmReservation: handleConfirmReservation
      }),

      // Product Details Modal
      React.createElement(window.ProductDetailModal, {
        isOpen: isProductDetailOpen,
        onClose: () => setIsProductDetailOpen(false),
        product: detailProductTarget,
        shop: state.shops.find(s => s.id === detailProductTarget?.shopId),
        onAddToCart: handleAddToCart,
        onReserveClick: handleReserveProduct,
        onVisitStore: handleVisitStore,
        onOpenShop: handleOpenShop,
        onToggleWishlist: handleToggleWishlist,
        isWishlisted: detailProductTarget && state.wishlist.includes(detailProductTarget.id)
      }),

      // Cart Drawer & Multi-step Checkout Modal
      React.createElement(window.CartAndCheckoutModal, {
        isOpen: isCartOpen,
        onClose: () => setIsCartOpen(false),
        state,
        onNavigate: handleNavigate,
        onTrackOrder: handleTrackOrder
      }),

      // Live Order Tracking Modal
      React.createElement(window.OrderTrackingModal, {
        isOpen: isTrackingModalOpen,
        onClose: () => setIsTrackingModalOpen(false),
        orderId: trackingTargetId,
        state
      }),

      // Floating Demo Role Switcher
      React.createElement(window.FloatingRoleSwitcher, {
        currentRole: (state.currentUser && state.currentUser.role) || 'customer',
        onRoleSwitch: handleRoleSwitch
      })
    );
  }

  // Robust Error Boundary
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
      console.error('VASTRA Error Boundary caught:', error, errorInfo);
    }
    render() {
      if (this.state.hasError) {
        return React.createElement('div', {
          className: 'min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6'
        },
          React.createElement('div', {
            className: 'max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-stone-200 text-center space-y-4'
          },
            React.createElement('div', { className: 'text-4xl' }, '🛍️'),
            React.createElement('h2', { className: 'font-serif text-2xl font-bold text-stone-900' }, 'Something went wrong'),
            React.createElement('p', { className: 'text-xs text-stone-500' }, 'A temporary rendering glitch occurred. You can safely return to the home screen or reload.'),
            React.createElement('div', { className: 'flex justify-center gap-3 pt-2' },
              React.createElement('button', {
                onClick: () => {
                  this.setState({ hasError: false });
                  window.location.reload();
                },
                className: 'px-4 py-2 bg-orange-800 text-white font-bold rounded-xl text-xs hover:bg-orange-900 transition'
              }, 'Reload Application'),
              React.createElement('button', {
                onClick: () => {
                  try { localStorage.clear(); } catch(e) {}
                  window.location.reload();
                },
                className: 'px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs hover:bg-stone-200 transition'
              }, 'Reset Cache & Reload')
            )
          )
        );
      }
      return this.props.children;
    }
  }

  // Mount React App
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      React.createElement(ErrorBoundary, null, React.createElement(VastraApp))
    );
  }
})();
