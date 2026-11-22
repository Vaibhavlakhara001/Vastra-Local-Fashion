// VASTRA – In-Memory Reactive Data Service & Store with Local Storage Persistence (No Database Needed)
(function() {
  const data = window.VASTRA_DATA;

  // Safe client-side storage helpers
  function getStored(key, fallback) {
    try {
      const v = localStorage.getItem('vastra_' + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStored(key, val) {
    try {
      localStorage.setItem('vastra_' + key, JSON.stringify(val));
    } catch (e) {}
  }

  const defaultUser = {
    id: 'user-default',
    name: 'Priya Sharma',
    email: 'priya@vastra.in',
    phone: '+91 98200 45678',
    role: 'customer', // 'customer' | 'seller' | 'admin' | 'guest'
    city: 'Jaipur',
    area: 'C-Scheme',
    sellerShopId: 'shop-1',
    addresses: [
      {
        id: 'addr-1',
        name: 'Priya Sharma',
        phone: '+91 98200 45678',
        line: 'Flat 402, Royal Residency, C-Scheme',
        landmark: 'Near Statue Circle',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001',
        type: 'Home',
        isDefault: true
      }
    ]
  };

  class VastraStore {
    constructor() {
      this.listeners = [];

      let initialUser = getStored('currentUser', defaultUser);
      if (!initialUser || typeof initialUser !== 'object') initialUser = defaultUser;
      if (!Array.isArray(initialUser.addresses)) initialUser.addresses = defaultUser.addresses;
      const initialOrders = getStored('orders', JSON.parse(JSON.stringify(data.initialOrders)));
      const initialReservations = getStored('reservations', JSON.parse(JSON.stringify(data.initialReservations)));
      const initialWishlist = getStored('wishlist', ['prod-1', 'prod-2', 'prod-8']);
      const initialCart = getStored('cart', [
        {
          id: 'cart-1',
          productId: 'prod-4',
          shopId: 'shop-2',
          shopName: 'Royal Fashion Boutique',
          title: 'Lucknowi Hand Chikankari Modal Silk Kurti with Mukaish Highlights',
          price: 3199,
          originalPrice: 4499,
          size: 'M',
          color: 'Terracotta Peach',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=400&q=80',
          inStock: 6
        }
      ]);

      this.state = {
        currentUser: initialUser,
        selectedCity: initialUser.city || 'Jaipur',
        selectedArea: 'All Areas',
        searchQuery: '',
        activeView: 'home',
        activeShopId: null,
        activeProductId: null,
        activeTrackingOrderId: initialOrders[0]?.id || 'VAS-2026-8941',
        activeFilterCategory: 'All',
        cart: initialCart,
        wishlist: initialWishlist,
        shops: JSON.parse(JSON.stringify(data.shops)),
        products: JSON.parse(JSON.stringify(data.products)),
        orders: initialOrders,
        reservations: initialReservations,
        reviews: JSON.parse(JSON.stringify(data.initialReviews)),
        sellerApplications: [
          {
            id: 'app-101',
            shopName: 'Marwar Silk & Heritage Weaves',
            ownerName: 'Gajendra Rathore',
            phone: '+91 98299 11223',
            city: 'Jaipur',
            area: 'Hawa Mahal Bazar',
            pincode: '302002',
            category: 'Sarees & Handlooms',
            status: 'pending',
            date: 'Today, 11:20 AM',
            address: 'Shop 18, Opp. Wind View Cafe, Hawa Mahal Bazar, Jaipur'
          }
        ],
        appliedCoupon: null,
        discountAmount: 0,
        toast: null
      };
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }

    notify() {
      this.listeners.forEach(l => l(this.state));
    }

    setState(partial) {
      this.state = { ...this.state, ...partial };
      this.notify();
    }

    showToast(message, type = 'success') {
      this.setState({ toast: { message, type } });
      setTimeout(() => {
        if (this.state.toast && this.state.toast.message === message) {
          this.setState({ toast: null });
        }
      }, 3500);
    }

    // Role switcher
    setRole(role, sellerShopId = 'shop-1') {
      const user = { ...this.state.currentUser, role };
      if (role === 'customer') {
        // Keep whatever custom user is saved or fallback
        const savedCust = getStored('custom_customer_profile', null);
        if (savedCust) {
          user.name = savedCust.name;
          user.email = savedCust.email;
          user.phone = savedCust.phone;
          user.city = savedCust.city || 'Jaipur';
        }
      } else if (role === 'seller') {
        const shop = this.state.shops.find(s => s.id === sellerShopId) || this.state.shops[0];
        user.name = shop.owner;
        user.email = shop.email;
        user.sellerShopId = shop.id;
      } else if (role === 'admin') {
        user.name = 'Vastra Superadmin';
        user.email = 'admin@vastra.in';
      } else {
        user.role = 'guest';
      }
      this.setState({ currentUser: user });
      setStored('currentUser', user);
      this.showToast(`Switched active view to: ${role.toUpperCase()}`, 'info');
    }

    // ==========================================
    // CUSTOM USER PROFILE & ADDRESS MANAGEMENT
    // (Stores locally in browser, zero database needed)
    // ==========================================

    // 1. Update Profile (Name, Email, Phone, City, Area)
    updateProfile(profileData) {
      const updatedUser = {
        ...this.state.currentUser,
        name: profileData.name ? profileData.name.trim() : this.state.currentUser.name,
        email: profileData.email ? profileData.email.trim() : this.state.currentUser.email,
        phone: profileData.phone ? profileData.phone.trim() : this.state.currentUser.phone,
        city: profileData.city ? profileData.city.trim() : this.state.currentUser.city,
        area: profileData.area ? profileData.area.trim() : this.state.currentUser.area
      };

      // Also remember this custom profile
      setStored('custom_customer_profile', updatedUser);
      setStored('currentUser', updatedUser);
      this.setState({ currentUser: updatedUser });
      this.showToast('Profile details updated successfully! ✨');
    }

    // 2. Add a New Delivery Address
    addAddress(addressData) {
      const currentAddrs = Array.isArray(this.state.currentUser?.addresses) ? this.state.currentUser.addresses : [];
      const newAddrId = 'addr-' + Date.now();
      const isDefault = addressData.isDefault || currentAddrs.length === 0;

      let updatedAddresses = currentAddrs.map(a => 
        isDefault ? { ...a, isDefault: false } : a
      );

      const newAddress = {
        id: newAddrId,
        name: addressData.name || this.state.currentUser?.name || 'Customer',
        phone: addressData.phone || this.state.currentUser?.phone || '+91 98200 45678',
        line: addressData.line || addressData.address || '',
        landmark: addressData.landmark || '',
        city: addressData.city || this.state.currentUser?.city || 'Jaipur',
        state: addressData.state || 'Rajasthan',
        pincode: addressData.pincode || '302001',
        type: addressData.type || 'Home',
        isDefault: isDefault
      };

      updatedAddresses.push(newAddress);

      const updatedUser = {
        ...(this.state.currentUser || defaultUser),
        addresses: updatedAddresses
      };

      setStored('currentUser', updatedUser);
      setStored('custom_customer_profile', updatedUser);
      this.setState({ currentUser: updatedUser });
      this.showToast('New delivery address saved to your address book!');
      return newAddress;
    }

    // 3. Update an Existing Address
    updateAddress(addressId, addressData) {
      const currentAddrs = Array.isArray(this.state.currentUser?.addresses) ? this.state.currentUser.addresses : [];
      const isDefault = !!addressData.isDefault;

      const updatedAddresses = currentAddrs.map(a => {
        if (a.id === addressId) {
          return {
            ...a,
            ...addressData,
            isDefault: isDefault ? true : a.isDefault
          };
        }
        return isDefault ? { ...a, isDefault: false } : a;
      });

      const updatedUser = {
        ...(this.state.currentUser || defaultUser),
        addresses: updatedAddresses
      };

      setStored('currentUser', updatedUser);
      setStored('custom_customer_profile', updatedUser);
      this.setState({ currentUser: updatedUser });
      this.showToast('Address updated successfully!');
    }

    // 4. Delete an Address
    deleteAddress(addressId) {
      const currentAddrs = Array.isArray(this.state.currentUser?.addresses) ? this.state.currentUser.addresses : [];
      let updatedAddresses = currentAddrs.filter(a => a.id !== addressId);
      
      // If we deleted the default address, make the first remaining address the default
      if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }

      const updatedUser = {
        ...(this.state.currentUser || defaultUser),
        addresses: updatedAddresses
      };

      setStored('currentUser', updatedUser);
      setStored('custom_customer_profile', updatedUser);
      this.setState({ currentUser: updatedUser });
      this.showToast('Address deleted from address book', 'info');
    }

    // 5. Set Default Address
    setDefaultAddress(addressId) {
      const currentAddrs = Array.isArray(this.state.currentUser?.addresses) ? this.state.currentUser.addresses : [];
      const updatedAddresses = currentAddrs.map(a => ({
        ...a,
        isDefault: a.id === addressId
      }));

      const updatedUser = {
        ...(this.state.currentUser || defaultUser),
        addresses: updatedAddresses
      };

      setStored('currentUser', updatedUser);
      setStored('custom_customer_profile', updatedUser);
      this.setState({ currentUser: updatedUser });
      this.showToast('Default delivery address updated!');
    }

    // 6. User Login or Registration with Custom Name, Email & Address
    registerOrLogin(userData) {
      const newAddress = userData.line || userData.address ? {
        id: 'addr-' + Date.now(),
        name: userData.name,
        phone: userData.phone,
        line: userData.line || userData.address,
        landmark: userData.landmark || '',
        city: userData.city || 'Jaipur',
        state: userData.state || 'Rajasthan',
        pincode: userData.pincode || '',
        type: 'Home',
        isDefault: true
      } : null;

      const existingAddresses = this.state.currentUser.addresses || [];
      const updatedAddresses = newAddress ? [newAddress, ...existingAddresses.filter(a => a.id !== 'addr-1')] : existingAddresses;

      const updatedUser = {
        id: 'user-' + Date.now(),
        name: userData.name.trim(),
        email: userData.email.trim(),
        phone: userData.phone ? userData.phone.trim() : '+91 98200 45678',
        role: 'customer',
        city: userData.city || this.state.selectedCity,
        area: userData.area || 'All Areas',
        addresses: updatedAddresses
      };

      setStored('currentUser', updatedUser);
      setStored('custom_customer_profile', updatedUser);
      this.setState({ currentUser: updatedUser });
      this.showToast(`Welcome, ${userData.name}! Your account is active. 🛍️`);
      return updatedUser;
    }

    // ==========================================
    // OTHER STORE ACTIONS
    // ==========================================

    // Navigation
    navigateTo(view, params = {}) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.setState({
        activeView: view,
        ...params
      });
    }

    // City & Location
    setCity(city, area = 'All Areas') {
      this.setState({ selectedCity: city, selectedArea: area });
      this.showToast(`Location set to: ${area === 'All Areas' ? city : `${area}, ${city}`}`, 'info');
    }

    // Cart Operations
    addToCart(product, size, color, quantity = 1) {
      const existingIndex = this.state.cart.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
      );

      let newCart = [...this.state.cart];
      if (existingIndex > -1) {
        newCart[existingIndex].quantity += quantity;
      } else {
        newCart.push({
          id: 'cart-' + Date.now(),
          productId: product.id,
          shopId: product.shopId,
          shopName: product.shopName,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          size: size || (product.sizes && product.sizes[0]) || 'Free Size',
          color: color || (product.colors && product.colors[0]?.name) || 'Standard',
          quantity: quantity,
          image: product.images[0],
          inStock: product.stockQuantity
        });
      }

      setStored('cart', newCart);
      this.setState({ cart: newCart });
      this.showToast(`Added "${product.title.slice(0, 24)}..." to cart!`);
    }

    updateCartQuantity(cartId, delta) {
      let newCart = this.state.cart.map(item => {
        if (item.id === cartId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);

      setStored('cart', newCart);
      this.setState({ cart: newCart });
    }

    removeFromCart(cartId) {
      const newCart = this.state.cart.filter(item => item.id !== cartId);
      setStored('cart', newCart);
      this.setState({ cart: newCart });
      this.showToast('Item removed from cart', 'info');
    }

    clearCart() {
      setStored('cart', []);
      this.setState({ cart: [], appliedCoupon: null, discountAmount: 0 });
    }

    // Wishlist Operations
    toggleWishlist(productId) {
      let newWishlist = [...this.state.wishlist];
      if (newWishlist.includes(productId)) {
        newWishlist = newWishlist.filter(id => id !== productId);
        this.showToast('Removed from your wishlist', 'info');
      } else {
        newWishlist.push(productId);
        this.showToast('Saved to your wishlist! ❤️');
      }
      setStored('wishlist', newWishlist);
      this.setState({ wishlist: newWishlist });
    }

    // Coupons
    applyCoupon(code) {
      const coupon = window.VASTRA_DATA.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
      if (!coupon) {
        this.showToast('Invalid coupon code. Try VASTRA100 or LOCAL15', 'error');
        return false;
      }
      const subtotal = this.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (subtotal < coupon.minOrder) {
        this.showToast(`Minimum order value of ₹${coupon.minOrder} required for ${coupon.code}`, 'error');
        return false;
      }

      let discount = 0;
      if (coupon.discount) {
        discount = coupon.discount;
      } else if (coupon.discountPercent) {
        discount = Math.min(Math.round((subtotal * coupon.discountPercent) / 100), coupon.maxDiscount || 9999);
      }

      this.setState({ appliedCoupon: coupon, discountAmount: discount });
      this.showToast(`Coupon applied! Saved ₹${discount}`);
      return true;
    }

    removeCoupon() {
      this.setState({ appliedCoupon: null, discountAmount: 0 });
    }

    // Order Placement (Updates inventory, connects customer and shop)
    placeOrder(orderDetails) {
      const orderId = 'VAS-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        shopId: orderDetails.shopId || this.state.cart[0]?.shopId || 'shop-1',
        shopName: orderDetails.shopName || this.state.cart[0]?.shopName || 'Local Shop',
        shopAddress: orderDetails.shopAddress || 'Local Partner Store',
        shopPhone: '+91 98290 12345',
        customerName: orderDetails.customerName,
        customerPhone: orderDetails.customerPhone,
        customerEmail: orderDetails.customerEmail || this.state.currentUser.email,
        deliveryAddress: orderDetails.deliveryAddress,
        deliveryType: orderDetails.deliveryType,
        paymentMethod: orderDetails.paymentMethod,
        paymentStatus: orderDetails.paymentMethod === 'Cash on Delivery (COD)' ? 'Pending on Delivery' : 'Paid (Demo Verified)',
        status: 'Order Placed',
        riderName: 'Vikram Gurjar (Assigned Local Partner)',
        riderPhone: '+91 98288 77665',
        estimatedDelivery: orderDetails.deliveryType.includes('Express') ? 'Today within 4 hours' : 'Tomorrow by 6:00 PM',
        trackingSteps: [
          { title: 'Order Placed', time: 'Just now', completed: true, note: 'Order sent to local boutique' },
          { title: 'Confirmed by Shop', time: 'Pending', completed: false, note: 'Shopkeeper stock verification' },
          { title: 'Inspected & Packed', time: 'Pending', completed: false, note: 'Quality check at shop counter' },
          { title: 'Out for Delivery', time: 'Pending', completed: false, note: 'Assigned to city delivery partner' },
          { title: 'Delivered', time: 'Pending', completed: false, note: 'Doorstep handoff' }
        ],
        items: [...this.state.cart],
        subtotal: orderDetails.subtotal,
        discount: orderDetails.discount,
        couponCode: this.state.appliedCoupon ? this.state.appliedCoupon.code : null,
        deliveryFee: orderDetails.deliveryFee,
        total: orderDetails.total
      };

      // Deduct inventory
      let updatedProducts = [...this.state.products];
      this.state.cart.forEach(cartItem => {
        const pIndex = updatedProducts.findIndex(p => p.id === cartItem.productId);
        if (pIndex > -1) {
          const currentStock = updatedProducts[pIndex].stockQuantity;
          updatedProducts[pIndex].stockQuantity = Math.max(0, currentStock - cartItem.quantity);
        }
      });

      const updatedOrders = [newOrder, ...this.state.orders];
      setStored('orders', updatedOrders);
      setStored('cart', []);

      this.setState({
        orders: updatedOrders,
        products: updatedProducts,
        cart: [],
        appliedCoupon: null,
        discountAmount: 0,
        activeTrackingOrderId: orderId
      });

      this.showToast(`Order #${orderId} placed successfully!`);
      return orderId;
    }

    // Store Pickup Reservation
    createStorePickupReservation(resData) {
      const resCode = 'RES-' + Math.floor(1000 + Math.random() * 9000);
      const newReservation = {
        id: resCode,
        date: new Date().toISOString(),
        shopId: resData.shopId,
        shopName: resData.shopName,
        shopAddress: resData.shopAddress,
        shopPhone: resData.shopPhone,
        customerName: resData.customerName || this.state.currentUser.name,
        customerPhone: resData.customerPhone || this.state.currentUser.phone,
        pickupDate: resData.pickupDate,
        pickupTimeSlot: resData.pickupTimeSlot,
        status: 'Confirmed by Shop (Piece Kept Aside)',
        reservationCode: resCode,
        items: [
          {
            productId: resData.product.id,
            title: resData.product.title,
            size: resData.size,
            color: resData.color,
            price: resData.product.price,
            image: resData.product.images[0]
          }
        ],
        trialRoomAssigned: 'Priority Trial Room Reserved',
        instructions: `Show reservation code ${resCode} at ${resData.shopName} counter. Your chosen garment is reserved for physical trial!`
      };

      const updatedReservations = [newReservation, ...this.state.reservations];
      setStored('reservations', updatedReservations);
      this.setState({ reservations: updatedReservations });
      this.showToast(`Reservation ${resCode} confirmed! Piece held at shop. 🛍️`);
      return resCode;
    }

    // Seller & Admin: Update Order Status
    updateOrderStatus(orderId, newStatus) {
      const updatedOrders = this.state.orders.map(o => {
        if (o.id === orderId) {
          const steps = [...o.trackingSteps];
          if (newStatus === 'Confirmed by Shop') {
            steps[1] = { ...steps[1], completed: true, time: 'Just now' };
          } else if (newStatus === 'Inspected & Packed') {
            steps[1] = { ...steps[1], completed: true };
            steps[2] = { ...steps[2], completed: true, time: 'Just now' };
          } else if (newStatus === 'Out for Delivery') {
            steps[1] = { ...steps[1], completed: true };
            steps[2] = { ...steps[2], completed: true };
            steps[3] = { ...steps[3], completed: true, time: 'Just now' };
          } else if (newStatus === 'Delivered') {
            steps.forEach(s => s.completed = true);
            steps[4].time = 'Just now';
          }
          return { ...o, status: newStatus, trackingSteps: steps };
        }
        return o;
      });
      setStored('orders', updatedOrders);
      this.setState({ orders: updatedOrders });
      this.showToast(`Order status updated to: ${newStatus}`);
    }

    // Seller: Update Reservation Status
    updateReservationStatus(resId, newStatus) {
      const updated = this.state.reservations.map(r => {
        if (r.id === resId) {
          return { ...r, status: newStatus };
        }
        return r;
      });
      setStored('reservations', updated);
      this.setState({ reservations: updated });
      this.showToast(`Reservation marked as: ${newStatus}`);
    }

    // Seller: Add New Product
    addProduct(productData) {
      const newProduct = {
        id: 'prod-' + (this.state.products.length + 1) + '-' + Date.now().toString().slice(-4),
        ...productData,
        rating: 5.0,
        reviewCount: 1,
        isTrending: false,
        isBestSeller: false,
        isNewArrival: true
      };
      const updatedProducts = [newProduct, ...this.state.products];
      this.setState({ products: updatedProducts });
      this.showToast(`Product "${productData.title.slice(0, 20)}..." published!`);
    }

    // Seller: Delete Product
    deleteProduct(productId) {
      const updated = this.state.products.filter(p => p.id !== productId);
      this.setState({ products: updated });
      this.showToast('Product removed from catalog', 'info');
    }

    // Seller Registration (Onboarding)
    registerSeller(shopData) {
      const newShop = {
        id: 'shop-' + (this.state.shops.length + 1),
        verified: false,
        featured: false,
        rating: 5.0,
        reviewCount: 0,
        distanceKm: 2.5,
        establishedYear: new Date().getFullYear(),
        allowOnlineDelivery: true,
        allowStorePickup: true,
        logo: shopData.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
        banner: shopData.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        coordinates: { x: 50, y: 50 },
        amenities: ['Trial Rooms', 'Air Conditioned', 'UPI/Cards', 'Alteration Available'],
        ...shopData
      };

      const newApp = {
        id: 'app-' + Date.now().toString().slice(-4),
        shopName: shopData.name,
        ownerName: shopData.owner,
        phone: shopData.phone,
        city: shopData.city,
        area: shopData.area,
        pincode: shopData.pincode,
        category: (shopData.categories && shopData.categories[0]) || 'General Ethnic Wear',
        status: 'pending',
        date: 'Just now',
        address: shopData.address
      };

      const updatedShops = [...this.state.shops, newShop];
      const updatedApps = [newApp, ...this.state.sellerApplications];

      this.setState({
        shops: updatedShops,
        sellerApplications: updatedApps
      });
      this.showToast('Seller application submitted! Pending admin verification.');
    }

    // Admin: Approve Seller Application
    approveSeller(appId) {
      const app = this.state.sellerApplications.find(a => a.id === appId);
      if (!app) return;

      const updatedApps = this.state.sellerApplications.map(a => 
        a.id === appId ? { ...a, status: 'approved' } : a
      );

      const updatedShops = this.state.shops.map(s => {
        if (s.name.toLowerCase() === app.shopName.toLowerCase()) {
          return { ...s, verified: true, featured: true };
        }
        return s;
      });

      this.setState({
        sellerApplications: updatedApps,
        shops: updatedShops
      });
      this.showToast(`Verified and activated store: ${app.shopName}!`);
    }

    // Admin: Toggle Feature Shop
    toggleFeatureShop(shopId) {
      const updated = this.state.shops.map(s => {
        if (s.id === shopId) return { ...s, featured: !s.featured };
        return s;
      });
      this.setState({ shops: updated });
      this.showToast('Updated shop featured status');
    }

    // Reviews: Add customer review
    addReview(reviewData) {
      const newReview = {
        id: 'rev-' + Date.now(),
        date: 'Just now',
        verified: true,
        ...reviewData
      };
      this.setState({ reviews: [newReview, ...this.state.reviews] });
      this.showToast('Thank you for your review! ⭐');
    }
  }

  window.vastraStore = new VastraStore();
})();
