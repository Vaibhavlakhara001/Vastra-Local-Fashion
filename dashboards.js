// VASTRA – Cart, Checkout, Dashboards, Account & Informational Pages
(function() {
  const Icon = window.VastraIcon;

  // 1. Cart Drawer & Checkout Modal
  window.CartAndCheckoutModal = function({ isOpen, onClose, state, onNavigate, onTrackOrder }) {
    if (!isOpen) return null;

    const [checkoutStep, setCheckoutStep] = React.useState('cart'); // 'cart' | 'address' | 'delivery' | 'payment' | 'confirmation'
    const [couponInput, setCouponInput] = React.useState('');
    const [lastCreatedOrderId, setLastCreatedOrderId] = React.useState(null);

    // Saved Addresses & Selection
    const savedAddresses = state.currentUser.addresses || [];
    const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0] || {};
    
    const [selectedAddressId, setSelectedAddressId] = React.useState(defaultAddr.id || 'custom');
    const [isAddingNewAddress, setIsAddingNewAddress] = React.useState(savedAddresses.length === 0);

    // Form Fields
    const [fullName, setFullName] = React.useState(defaultAddr.name || state.currentUser.name || '');
    const [phone, setPhone] = React.useState(defaultAddr.phone || state.currentUser.phone || '');
    const [email, setEmail] = React.useState(state.currentUser.email || '');
    const [addressLine, setAddressLine] = React.useState(defaultAddr.line || '');
    const [landmark, setLandmark] = React.useState(defaultAddr.landmark || '');
    const [city, setCity] = React.useState(defaultAddr.city || state.selectedCity || 'Jaipur');
    const [pincode, setPincode] = React.useState(defaultAddr.pincode || '302001');
    const [saveAddressToProfile, setSaveAddressToProfile] = React.useState(true);

    // Sync when user selects a saved address card
    const handleSelectSavedAddress = (addr) => {
      setSelectedAddressId(addr.id);
      setIsAddingNewAddress(false);
      setFullName(addr.name || state.currentUser.name);
      setPhone(addr.phone || state.currentUser.phone);
      setAddressLine(addr.line);
      setLandmark(addr.landmark || '');
      setCity(addr.city || 'Jaipur');
      setPincode(addr.pincode || '');
    };

    // Delivery & Payment
    const [deliveryType, setDeliveryType] = React.useState('Express Same-Day Delivery (within 4 hours)');
    const [paymentMethod, setPaymentMethod] = React.useState('Cash on Delivery (COD)');

    // Calculations
    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = deliveryType.includes('Store Pickup') || subtotal > 999 ? 0 : 49;
    const discount = state.discountAmount || 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

    const handleApplyCoupon = (e) => {
      e.preventDefault();
      if (couponInput) {
        window.vastraStore.applyCoupon(couponInput);
        setCouponInput('');
      }
    };

    const handlePlaceOrder = () => {
      if (!fullName.trim() || !phone.trim() || !addressLine.trim()) {
        alert('Please fill in your Name, Phone Number, and Delivery Address.');
        return;
      }

      // If user wants to save this address or it's a new address
      if (saveAddressToProfile) {
        // Update user profile info
        window.vastraStore.updateProfile({
          name: fullName,
          email: email || state.currentUser.email,
          phone: phone,
          city: city
        });

        // If it was custom or new address, save to addresses
        if (isAddingNewAddress || selectedAddressId === 'custom') {
          window.vastraStore.addAddress({
            name: fullName,
            phone: phone,
            line: addressLine,
            landmark: landmark,
            city: city,
            pincode: pincode,
            type: 'Home',
            isDefault: savedAddresses.length === 0
          });
        }
      }

      const orderId = window.vastraStore.placeOrder({
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email || state.currentUser.email,
        deliveryAddress: `${addressLine}, ${landmark ? landmark + ', ' : ''}${city} - ${pincode}`,
        deliveryType,
        paymentMethod,
        subtotal,
        discount,
        deliveryFee,
        total: finalTotal
      });

      setLastCreatedOrderId(orderId);
      setCheckoutStep('confirmation');
    };

    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in' },
      React.createElement('div', { className: 'bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]' },
        
        // Modal Header
        React.createElement('div', { className: 'p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between' },
          React.createElement('div', { className: 'flex items-center space-x-2' },
            React.createElement(Icon, { name: 'bag', className: 'w-5 h-5 text-orange-800' }),
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' },
              checkoutStep === 'cart' ? `Your Shopping Bag (${state.cart.length} items)` :
              checkoutStep === 'confirmation' ? 'Order Confirmed!' : 'Checkout & Local Delivery'
            )
          ),
          React.createElement('button', { onClick: onClose, className: 'p-1 text-stone-400 hover:text-stone-600 rounded-lg' },
            React.createElement(Icon, { name: 'x', className: 'w-5 h-5' })
          )
        ),

        // STEP 1: CART VIEW
        checkoutStep === 'cart' && React.createElement('div', { className: 'p-6 overflow-y-auto space-y-6 flex-1 text-xs' },
          state.cart.length > 0 ? React.createElement('div', { className: 'space-y-4' },
            
            // Items List
            state.cart.map(item =>
              React.createElement('div', {
                key: item.id,
                className: 'flex items-start space-x-4 p-3.5 bg-stone-50/70 rounded-2xl border border-stone-200'
              },
                React.createElement('img', {
                  src: item.image,
                  alt: item.title,
                  className: 'w-16 h-20 object-cover rounded-xl shrink-0'
                }),
                React.createElement('div', { className: 'flex-1 space-y-1' },
                  React.createElement('div', { className: 'text-[10px] text-orange-800 font-bold uppercase' }, `Sold by: ${item.shopName}`),
                  React.createElement('h4', { className: 'font-bold text-stone-900 text-sm line-clamp-1' }, item.title),
                  React.createElement('div', { className: 'text-stone-500 text-[11px] flex space-x-3' },
                    React.createElement('span', null, `Size: ${item.size}`),
                    React.createElement('span', null, `Color: ${item.color}`)
                  ),
                  React.createElement('div', { className: 'flex items-center justify-between pt-2' },
                    React.createElement('div', { className: 'font-extrabold text-stone-900 text-sm' }, `₹${(item.price * item.quantity).toLocaleString('en-IN')}`),
                    
                    // Quantity Stepper
                    React.createElement('div', { className: 'flex items-center space-x-2 bg-white border border-stone-300 rounded-lg px-2 py-0.5' },
                      React.createElement('button', {
                        onClick: () => window.vastraStore.updateCartQuantity(item.id, -1),
                        className: 'text-stone-500 hover:text-stone-900 font-bold px-1'
                      }, '−'),
                      React.createElement('span', { className: 'font-bold text-stone-800 px-1' }, item.quantity),
                      React.createElement('button', {
                        onClick: () => window.vastraStore.updateCartQuantity(item.id, 1),
                        className: 'text-stone-500 hover:text-stone-900 font-bold px-1'
                      }, '+')
                    )
                  )
                ),
                React.createElement('button', {
                  onClick: () => window.vastraStore.removeFromCart(item.id),
                  className: 'text-stone-400 hover:text-red-600 p-1'
                },
                  React.createElement(Icon, { name: 'trash', className: 'w-4 h-4' })
                )
              )
            ),

            // Coupon Code Form
            React.createElement('form', { onSubmit: handleApplyCoupon, className: 'flex space-x-2 pt-2' },
              React.createElement('input', {
                type: 'text',
                placeholder: 'Enter coupon (VASTRA100, LOCAL15, FESTIVE)',
                value: couponInput,
                onChange: (e) => setCouponInput(e.target.value),
                className: 'flex-1 p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs uppercase tracking-wider font-semibold focus:outline-none focus:ring-1 focus:ring-orange-800'
              }),
              React.createElement('button', {
                type: 'submit',
                className: 'px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold'
              }, 'Apply')
            ),

            // Applied Coupon Pill
            state.appliedCoupon && React.createElement('div', {
              className: 'flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200'
            },
              React.createElement('span', { className: 'font-bold' }, `✓ Coupon "${state.appliedCoupon.code}" applied: ₹${discount} off`),
              React.createElement('button', {
                onClick: () => window.vastraStore.removeCoupon(),
                className: 'text-xs text-red-600 underline font-semibold'
              }, 'Remove')
            ),

            // Price Breakdown
            React.createElement('div', { className: 'bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-stone-600' },
              React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', null, 'Bag Subtotal:'),
                React.createElement('span', { className: 'font-semibold text-stone-900' }, `₹${subtotal.toLocaleString('en-IN')}`)
              ),
              React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', null, 'City Delivery Fee:'),
                React.createElement('span', { className: 'text-emerald-700 font-semibold' }, deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`)
              ),
              discount > 0 && React.createElement('div', { className: 'flex justify-between text-orange-800 font-semibold' },
                React.createElement('span', null, 'Coupon Discount:'),
                React.createElement('span', null, `- ₹${discount.toLocaleString('en-IN')}`)
              ),
              React.createElement('div', { className: 'flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-stone-900' },
                React.createElement('span', null, 'Total Payable:'),
                React.createElement('span', null, `₹${finalTotal.toLocaleString('en-IN')}`)
              )
            )
          ) : React.createElement('div', { className: 'text-center py-12 space-y-3' },
            React.createElement(Icon, { name: 'bag', className: 'w-12 h-12 text-stone-300 mx-auto' }),
            React.createElement('h4', { className: 'font-serif text-base font-bold text-stone-800' }, 'Your bag is empty'),
            React.createElement('p', { className: 'text-stone-500' }, 'Discover garments from local boutiques and add to your bag!')
          )
        ),

        // STEP 2: CUSTOMER DETAILS & DELIVERY ADDRESS (No database required)
        checkoutStep === 'address' && React.createElement('div', { className: 'p-6 overflow-y-auto space-y-5 flex-1 text-xs' },
          
          // Privacy & Local Storage Badge
          React.createElement('div', { className: 'p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-900 flex items-center justify-between text-[11px]' },
            React.createElement('span', { className: 'font-semibold' }, '👤 You are shopping as: ' + (fullName || state.currentUser.name)),
            React.createElement('span', { className: 'text-[10px] bg-white px-2 py-0.5 rounded border border-orange-200 font-bold' }, 'Saved in Browser · No DB Required')
          ),

          // Saved Addresses Selection
          savedAddresses.length > 0 && React.createElement('div', { className: 'space-y-2' },
            React.createElement('div', { className: 'flex justify-between items-center' },
              React.createElement('h4', { className: 'font-bold text-stone-900 uppercase tracking-wider text-[11px]' }, 'Choose Saved Delivery Address:'),
              React.createElement('button', {
                type: 'button',
                onClick: () => {
                  setIsAddingNewAddress(true);
                  setSelectedAddressId('custom');
                  setAddressLine('');
                  setLandmark('');
                },
                className: 'text-orange-800 font-bold hover:underline'
              }, '+ Add New Address')
            ),
            React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-2' },
              (savedAddresses || []).map(addr =>
                React.createElement('div', {
                  key: addr.id,
                  onClick: () => handleSelectSavedAddress(addr),
                  className: `p-3 rounded-xl border cursor-pointer transition ${selectedAddressId === addr.id && !isAddingNewAddress ? 'border-orange-800 bg-orange-50/70 shadow-sm' : 'border-stone-200 bg-white hover:bg-stone-50'}`
                },
                  React.createElement('div', { className: 'flex justify-between items-center font-bold text-stone-900' },
                    React.createElement('span', null, `${addr.name} (${addr.type || 'Home'})`),
                    addr.isDefault && React.createElement('span', { className: 'text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded' }, 'DEFAULT')
                  ),
                  React.createElement('p', { className: 'text-stone-600 line-clamp-1 mt-0.5' }, addr.line),
                  React.createElement('p', { className: 'text-stone-500 text-[10px]' }, `${addr.city} · ${addr.phone}`)
                )
              )
            )
          ),

          // Custom / New Address Input Form
          (isAddingNewAddress || savedAddresses.length === 0) && React.createElement('div', { className: 'space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200' },
            React.createElement('h4', { className: 'font-bold text-stone-900 uppercase tracking-wider text-[11px]' }, 'Enter Your Name & Delivery Address:'),
            
            // Name & Phone
            React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-semibold text-stone-700 mb-1' }, 'Your Full Name *'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  placeholder: 'e.g. Rahul Verma',
                  value: fullName,
                  onChange: (e) => setFullName(e.target.value),
                  className: 'w-full p-2.5 bg-white border border-stone-300 rounded-xl'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-semibold text-stone-700 mb-1' }, 'Mobile Phone *'),
                React.createElement('input', {
                  type: 'tel',
                  required: true,
                  placeholder: 'e.g. +91 98765 43210',
                  value: phone,
                  onChange: (e) => setPhone(e.target.value),
                  className: 'w-full p-2.5 bg-white border border-stone-300 rounded-xl'
                })
              )
            ),

            // Email
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-semibold text-stone-700 mb-1' }, 'Your Email Address *'),
              React.createElement('input', {
                type: 'email',
                required: true,
                placeholder: 'e.g. rahul@gmail.com',
                value: email,
                onChange: (e) => setEmail(e.target.value),
                className: 'w-full p-2.5 bg-white border border-stone-300 rounded-xl'
              })
            ),

            // Street Address
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-semibold text-stone-700 mb-1' }, 'House / Flat / Street Address *'),
              React.createElement('input', {
                type: 'text',
                required: true,
                placeholder: 'e.g. Flat 302, Green Park Apartments, MI Road',
                value: addressLine,
                onChange: (e) => setAddressLine(e.target.value),
                className: 'w-full p-2.5 bg-white border border-stone-300 rounded-xl'
              })
            ),

            // Landmark, City, Pincode
            React.createElement('div', { className: 'grid grid-cols-3 gap-3' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-semibold text-stone-700 mb-1' }, 'Landmark'),
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Near City Mall',
                  value: landmark,
                  onChange: (e) => setLandmark(e.target.value),
                  className: 'w-full p-2.5 bg-white border border-stone-300 rounded-xl'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-semibold text-stone-700 mb-1' }, 'City *'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  value: city,
                  onChange: (e) => setCity(e.target.value),
                  className: 'w-full p-2.5 bg-white border border-stone-300 rounded-xl'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-semibold text-stone-700 mb-1' }, 'Pincode *'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  placeholder: '302001',
                  value: pincode,
                  onChange: (e) => setPincode(e.target.value),
                  className: 'w-full p-2.5 bg-white border border-stone-300 rounded-xl'
                })
              )
            ),

            // Save to profile checkbox
            React.createElement('label', { className: 'flex items-center space-x-2 pt-1 font-semibold text-stone-700 cursor-pointer' },
              React.createElement('input', {
                type: 'checkbox',
                checked: saveAddressToProfile,
                onChange: (e) => setSaveAddressToProfile(e.target.checked),
                className: 'accent-orange-800 w-4 h-4 rounded'
              }),
              React.createElement('span', null, 'Save this name and address to my browser profile for future orders')
            )
          ),

          // Delivery Speed Options
          React.createElement('div', { className: 'space-y-2 pt-2 border-t border-stone-100' },
            React.createElement('h4', { className: 'font-bold text-stone-900 uppercase tracking-wider text-[11px]' }, 'Choose Delivery Speed:'),
            [
              'Express Same-Day Delivery (within 4 hours)',
              'Standard City Delivery (1-2 days)',
              'Self Store Pickup (Free at Boutique Counter)'
            ].map(type =>
              React.createElement('label', {
                key: type,
                className: `flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${deliveryType === type ? 'border-orange-800 bg-orange-50/70 font-bold' : 'border-stone-200 bg-white'}`
              },
                React.createElement('input', {
                  type: 'radio',
                  name: 'deliveryType',
                  checked: deliveryType === type,
                  onChange: () => setDeliveryType(type),
                  className: 'accent-orange-800'
                }),
                React.createElement('span', null, type)
              )
            )
          ),

          // Payment Options (COD & Demo UPI Simulator)
          React.createElement('div', { className: 'space-y-2 pt-2 border-t border-stone-100' },
            React.createElement('h4', { className: 'font-bold text-stone-900 uppercase tracking-wider text-[11px]' }, 'Payment Method:'),
            [
              { name: 'Cash on Delivery (COD)', note: 'Pay cash or UPI directly to local rider upon doorstep delivery' },
              { name: 'Demo UPI / QR Code Simulator', note: 'Scan QR code simulation (Google Pay / PhonePe / Paytm)' },
              { name: 'Demo Netbanking / Card', note: 'Clearly labelled test transaction (No real money collected)' }
            ].map(pm =>
              React.createElement('label', {
                key: pm.name,
                className: `flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition ${paymentMethod === pm.name ? 'border-orange-800 bg-orange-50/70' : 'border-stone-200 bg-white'}`
              },
                React.createElement('input', {
                  type: 'radio',
                  name: 'paymentMethod',
                  checked: paymentMethod === pm.name,
                  onChange: () => setPaymentMethod(pm.name),
                  className: 'accent-orange-800 mt-0.5'
                }),
                React.createElement('div', null,
                  React.createElement('div', { className: 'font-bold text-stone-900' }, pm.name),
                  React.createElement('div', { className: 'text-[11px] text-stone-500' }, pm.note)
                )
              )
            )
          ),

          // Simulated QR Code display when UPI selected
          paymentMethod.includes('UPI') && React.createElement('div', { className: 'p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center space-x-4' },
            React.createElement('div', { className: 'w-20 h-20 bg-stone-900 text-white rounded-xl flex items-center justify-center font-mono text-[9px] text-center p-2' },
              '[DEMO UPI QR]'
            ),
            React.createElement('div', null,
              React.createElement('p', { className: 'font-bold text-stone-900' }, 'Demo UPI Simulator Active'),
              React.createElement('p', { className: 'text-stone-500 text-[11px]' }, 'Clicking Place Order will instantly verify this demo transaction safely.')
            )
          )
        ),

        // STEP 3: ORDER CONFIRMATION
        checkoutStep === 'confirmation' && React.createElement('div', { className: 'p-8 text-center space-y-4 flex-1 text-xs' },
          React.createElement('div', { className: 'w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto' },
            React.createElement(Icon, { name: 'check', className: 'w-8 h-8' })
          ),
          React.createElement('h3', { className: 'font-serif text-2xl font-bold text-stone-900' }, 'Order Placed Successfully!'),
          React.createElement('p', { className: 'text-stone-600 max-w-md mx-auto text-sm' },
            `Thank you, `,
            React.createElement('strong', { className: 'text-stone-900' }, fullName),
            `! Your order `,
            React.createElement('strong', { className: 'text-stone-900' }, `#${lastCreatedOrderId}`),
            ` has been sent to the shopkeeper. They will pack and dispatch it directly.`
          ),

          React.createElement('div', { className: 'p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-md mx-auto text-left space-y-2' },
            React.createElement('div', { className: 'flex justify-between' },
              React.createElement('span', { className: 'text-stone-500' }, 'Recipient:'),
              React.createElement('span', { className: 'font-bold text-stone-900' }, `${fullName} (${phone})`)
            ),
            React.createElement('div', { className: 'flex justify-between' },
              React.createElement('span', { className: 'text-stone-500' }, 'Delivery Address:'),
              React.createElement('span', { className: 'font-bold text-stone-900 text-right max-w-xs truncate' }, addressLine + ', ' + city)
            ),
            React.createElement('div', { className: 'flex justify-between' },
              React.createElement('span', { className: 'text-stone-500' }, 'Total Amount:'),
              React.createElement('span', { className: 'font-extrabold text-orange-800' }, `₹${finalTotal.toLocaleString('en-IN')}`)
            )
          ),

          React.createElement('div', { className: 'pt-4 flex justify-center space-x-3' },
            React.createElement('button', {
              onClick: () => {
                onClose();
                onTrackOrder(lastCreatedOrderId);
              },
              className: 'px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center space-x-2'
            },
              React.createElement(Icon, { name: 'truck', className: 'w-4 h-4 text-amber-400' }),
              React.createElement('span', null, 'Track Live Delivery')
            ),
            React.createElement('button', {
              onClick: () => {
                onClose();
                onNavigate('home');
              },
              className: 'px-5 py-3 border border-stone-300 hover:bg-stone-100 rounded-xl font-semibold'
            }, 'Continue Shopping')
          )
        ),

        // Footer Actions
        checkoutStep !== 'confirmation' && React.createElement('div', { className: 'p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs' },
          checkoutStep === 'cart' ? React.createElement(React.Fragment, null,
            React.createElement('button', {
              onClick: onClose,
              className: 'px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold'
            }, 'Close'),
            state.cart.length > 0 && React.createElement('button', {
              onClick: () => setCheckoutStep('address'),
              className: 'px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center space-x-2'
            },
              React.createElement('span', null, `Proceed to Checkout (₹${finalTotal.toLocaleString('en-IN')})`),
              React.createElement(Icon, { name: 'arrowRight', className: 'w-4 h-4' })
            )
          ) : React.createElement(React.Fragment, null,
            React.createElement('button', {
              onClick: () => setCheckoutStep('cart'),
              className: 'px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold'
            }, '← Back to Bag'),
            React.createElement('button', {
              onClick: handlePlaceOrder,
              className: 'px-6 py-2.5 bg-orange-800 hover:bg-orange-900 text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg'
            },
              React.createElement(Icon, { name: 'check', className: 'w-4 h-4' }),
              React.createElement('span', null, `Confirm & Place Order`)
            )
          )
        )
      )
    );
  };

  // 2. Live Order Tracking Modal / View
  window.OrderTrackingModal = function({ isOpen, onClose, orderId, state }) {
    if (!isOpen) return null;
    const order = state.orders.find(o => o.id === orderId) || state.orders[0];
    if (!order) return null;

    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in' },
      React.createElement('div', { className: 'bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-6 max-h-[92vh] overflow-y-auto text-xs' },
        
        // Header
        React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-stone-100' },
          React.createElement('div', null,
            React.createElement('div', { className: 'text-[10px] text-orange-800 font-bold uppercase tracking-wider' }, 'Live City Order Tracking'),
            React.createElement('h3', { className: 'font-serif text-xl font-bold text-stone-900 mt-0.5' }, `Order #${order.id}`)
          ),
          React.createElement('button', { onClick: onClose, className: 'p-1 text-stone-400 hover:text-stone-600' },
            React.createElement(Icon, { name: 'x', className: 'w-5 h-5' })
          )
        ),

        // Status Card
        React.createElement('div', { className: 'p-4 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between' },
          React.createElement('div', null,
            React.createElement('div', { className: 'text-[11px] text-orange-900 font-semibold' }, 'Current Status:'),
            React.createElement('div', { className: 'text-base font-extrabold text-orange-950 mt-0.5' }, order.status),
            React.createElement('div', { className: 'text-stone-500 text-[11px] mt-0.5' }, `ETA: ${order.estimatedDelivery}`)
          ),
          React.createElement('div', { className: 'w-12 h-12 rounded-full bg-orange-800 text-white flex items-center justify-center shrink-0' },
            React.createElement(Icon, { name: 'truck', className: 'w-6 h-6' })
          )
        ),

        // Live Progress Steps Timeline
        React.createElement('div', { className: 'space-y-4 px-2' },
          React.createElement('h4', { className: 'font-bold text-stone-900 uppercase tracking-wider text-[10px]' }, 'Fulfillment Journey:'),
          (order.trackingSteps || []).map((step, idx) =>
            React.createElement('div', { key: step.title, className: 'flex items-start space-x-3 relative' },
              idx < order.trackingSteps.length - 1 && React.createElement('div', {
                className: `absolute left-3 top-6 bottom-0 w-0.5 ${step.completed ? 'bg-orange-800' : 'bg-stone-200'}`
              }),
              React.createElement('div', {
                className: `w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${step.completed ? 'bg-orange-800 text-white' : 'bg-stone-200 text-stone-400'}`
              },
                step.completed ? React.createElement(Icon, { name: 'check', className: 'w-3.5 h-3.5' }) : (idx + 1)
              ),
              React.createElement('div', { className: 'flex-1 -mt-0.5 pb-4' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('span', { className: `font-bold ${step.completed ? 'text-stone-900' : 'text-stone-400'}` }, step.title),
                  React.createElement('span', { className: 'text-[10px] text-stone-400' }, step.time)
                ),
                React.createElement('p', { className: 'text-[11px] text-stone-500 mt-0.5' }, step.note)
              )
            )
          )
        ),

        // Shop & Rider Contacts
        React.createElement('div', { className: 'grid grid-cols-2 gap-3 pt-2 border-t border-stone-100' },
          React.createElement('div', { className: 'bg-stone-50 p-3 rounded-xl border border-stone-200' },
            React.createElement('p', { className: 'text-stone-400 font-bold uppercase text-[10px]' }, 'Origin Boutique:'),
            React.createElement('p', { className: 'font-bold text-stone-900 mt-0.5' }, order.shopName),
            React.createElement('p', { className: 'text-stone-500' }, order.shopPhone)
          ),
          React.createElement('div', { className: 'bg-stone-50 p-3 rounded-xl border border-stone-200' },
            React.createElement('p', { className: 'text-stone-400 font-bold uppercase text-[10px]' }, 'Local Rider:'),
            React.createElement('p', { className: 'font-bold text-stone-900 mt-0.5' }, order.riderName),
            React.createElement('p', { className: 'text-stone-500' }, order.riderPhone)
          )
        ),

        // Footer
        React.createElement('button', {
          onClick: onClose,
          className: 'w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold'
        }, 'Done')
      )
    );
  };

  // 3. Customer Account View (Profile, Address Book, Orders, Reservations, Wishlist)
  window.CustomerAccountView = function({ state, defaultTab = 'profile', onTrackOrder, onOpenProduct, onAddToCart, onVisitStore }) {
    const [tab, setTab] = React.useState(defaultTab);
    const myOrders = state.orders.filter(o => o.customerPhone === state.currentUser.phone || o.customerName === state.currentUser.name);
    const myReservations = state.reservations.filter(r => r.customerPhone === state.currentUser.phone || r.customerName === state.currentUser.name);
    const wishlistProducts = state.products.filter(p => state.wishlist.includes(p.id));

    // Profile Edit State
    const [editName, setEditName] = React.useState(state.currentUser.name);
    const [editEmail, setEditEmail] = React.useState(state.currentUser.email);
    const [editPhone, setEditPhone] = React.useState(state.currentUser.phone);
    const [editCity, setEditCity] = React.useState(state.currentUser.city || 'Jaipur');

    // Add Address Form State
    const [isAddingAddress, setIsAddingAddress] = React.useState(false);
    const [newAddrName, setNewAddrName] = React.useState(state.currentUser.name);
    const [newAddrPhone, setNewAddrPhone] = React.useState(state.currentUser.phone);
    const [newAddrLine, setNewAddrLine] = React.useState('');
    const [newAddrLandmark, setNewAddrLandmark] = React.useState('');
    const [newAddrCity, setNewAddrCity] = React.useState(state.currentUser.city || 'Jaipur');
    const [newAddrPincode, setNewAddrPincode] = React.useState('302001');
    const [newAddrType, setNewAddrType] = React.useState('Home');
    const [newAddrIsDefault, setNewAddrIsDefault] = React.useState(false);

    // Save profile handler
    const handleSaveProfile = (e) => {
      e.preventDefault();
      window.vastraStore.updateProfile({
        name: editName,
        email: editEmail,
        phone: editPhone,
        city: editCity
      });
    };

    // Add address handler
    const handleAddNewAddress = (e) => {
      e.preventDefault();
      if (!newAddrLine.trim()) return;
      window.vastraStore.addAddress({
        name: newAddrName,
        phone: newAddrPhone,
        line: newAddrLine,
        landmark: newAddrLandmark,
        city: newAddrCity,
        pincode: newAddrPincode,
        type: newAddrType,
        isDefault: newAddrIsDefault
      });
      setIsAddingAddress(false);
      setNewAddrLine('');
      setNewAddrLandmark('');
    };

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-8 sm:py-12 text-xs' },
      React.createElement('div', { className: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8' },
        
        // Account Header Bar
        React.createElement('div', { className: 'bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4' },
          React.createElement('div', { className: 'flex items-center space-x-4' },
            React.createElement('div', { className: 'w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-xl font-bold uppercase' },
              ((state.currentUser && state.currentUser.name) || 'User').slice(0, 2)
            ),
            React.createElement('div', null,
              React.createElement('h2', { className: 'font-serif text-xl font-bold text-stone-900' }, (state.currentUser && state.currentUser.name) || 'User'),
              React.createElement('p', { className: 'text-stone-500' }, `${(state.currentUser && state.currentUser.email) || ''} · ${(state.currentUser && state.currentUser.phone) || ''}`),
              React.createElement('span', { className: 'inline-block mt-1 bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded text-[10px]' },
                `Local City: ${(state.currentUser && state.currentUser.city) || state.selectedCity} (No DB Required)`
              )
            )
          ),
          React.createElement('div', { className: 'flex flex-wrap items-center gap-1.5' },
            [
              { id: 'profile', label: 'My Details & Addresses' },
              { id: 'orders', label: `My Orders (${myOrders.length})` },
              { id: 'reservations', label: `Store Holds (${myReservations.length})` },
              { id: 'wishlist', label: `Wishlist (${wishlistProducts.length})` }
            ].map(t =>
              React.createElement('button', {
                key: t.id,
                onClick: () => setTab(t.id),
                className: `px-3.5 py-2 rounded-xl font-bold transition ${tab === t.id ? 'bg-stone-900 text-white shadow' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`
              }, t.label)
            )
          )
        ),

        // TAB 1: Profile & Address Manager (Allows custom Name, Email, Address entry)
        tab === 'profile' && React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-8' },
          
          // Left: Edit Personal Details
          React.createElement('div', { className: 'lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5 h-fit' },
            React.createElement('div', null,
              React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Edit Your Details'),
              React.createElement('p', { className: 'text-stone-500 text-[11px]' },
                'Your name and email are saved in your browser storage. Zero database required!'
              )
            ),

            React.createElement('form', { onSubmit: handleSaveProfile, className: 'space-y-4' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Your Name:'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  value: editName,
                  onChange: (e) => setEditName(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-orange-800'
                })
              ),

              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Email Address:'),
                React.createElement('input', {
                  type: 'email',
                  required: true,
                  value: editEmail,
                  onChange: (e) => setEditEmail(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-orange-800'
                })
              ),

              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Mobile Phone:'),
                React.createElement('input', {
                  type: 'tel',
                  required: true,
                  value: editPhone,
                  onChange: (e) => setEditPhone(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-orange-800'
                })
              ),

              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'City:'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  value: editCity,
                  onChange: (e) => setEditCity(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-orange-800'
                })
              ),

              React.createElement('button', {
                type: 'submit',
                className: 'w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow transition'
              }, 'Save Profile Details')
            )
          ),

          // Right: Address Book (Add, Edit, Set Default, Delete)
          React.createElement('div', { className: 'lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6' },
            React.createElement('div', { className: 'flex justify-between items-center pb-2 border-b border-stone-100' },
              React.createElement('div', null,
                React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Saved Delivery Addresses'),
                React.createElement('p', { className: 'text-stone-500 text-[11px]' }, 'Manage your home, office, and store pickup addresses')
              ),
              React.createElement('button', {
                onClick: () => setIsAddingAddress(!isAddingAddress),
                className: 'px-3 py-1.5 bg-orange-800 hover:bg-orange-900 text-white font-bold rounded-xl text-xs flex items-center space-x-1'
              },
                React.createElement(Icon, { name: 'plus', className: 'w-3.5 h-3.5' }),
                React.createElement('span', null, isAddingAddress ? 'Cancel' : 'Add New Address')
              )
            ),

            // Form to Add New Address
            isAddingAddress && React.createElement('form', { onSubmit: handleAddNewAddress, className: 'bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3' },
              React.createElement('h4', { className: 'font-bold text-stone-900 uppercase tracking-wider text-[11px]' }, 'Add Delivery Address'),
              
              React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Full Name',
                  required: true,
                  value: newAddrName,
                  onChange: (e) => setNewAddrName(e.target.value),
                  className: 'p-2 bg-white border border-stone-300 rounded-lg'
                }),
                React.createElement('input', {
                  type: 'tel',
                  placeholder: 'Mobile Phone',
                  required: true,
                  value: newAddrPhone,
                  onChange: (e) => setNewAddrPhone(e.target.value),
                  className: 'p-2 bg-white border border-stone-300 rounded-lg'
                })
              ),

              React.createElement('input', {
                type: 'text',
                placeholder: 'Flat / House / Street Address',
                required: true,
                value: newAddrLine,
                onChange: (e) => setNewAddrLine(e.target.value),
                className: 'w-full p-2 bg-white border border-stone-300 rounded-lg'
              }),

              React.createElement('div', { className: 'grid grid-cols-3 gap-3' },
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Landmark',
                  value: newAddrLandmark,
                  onChange: (e) => setNewAddrLandmark(e.target.value),
                  className: 'p-2 bg-white border border-stone-300 rounded-lg'
                }),
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'City',
                  required: true,
                  value: newAddrCity,
                  onChange: (e) => setNewAddrCity(e.target.value),
                  className: 'p-2 bg-white border border-stone-300 rounded-lg'
                }),
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Pincode',
                  required: true,
                  value: newAddrPincode,
                  onChange: (e) => setNewAddrPincode(e.target.value),
                  className: 'p-2 bg-white border border-stone-300 rounded-lg'
                })
              ),

              React.createElement('div', { className: 'flex justify-between items-center pt-2' },
                React.createElement('div', { className: 'flex space-x-2' },
                  ['Home', 'Office', 'Other'].map(type =>
                    React.createElement('button', {
                      key: type,
                      type: 'button',
                      onClick: () => setNewAddrType(type),
                      className: `px-2.5 py-1 rounded-lg border font-semibold ${newAddrType === type ? 'bg-stone-900 text-white' : 'bg-white text-stone-700'}`
                    }, type)
                  )
                ),
                React.createElement('label', { className: 'flex items-center space-x-1.5 cursor-pointer text-stone-700 font-semibold' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: newAddrIsDefault,
                    onChange: (e) => setNewAddrIsDefault(e.target.checked),
                    className: 'accent-orange-800'
                  }),
                  React.createElement('span', null, 'Set as Default')
                )
              ),

              React.createElement('div', { className: 'pt-2 flex justify-end space-x-2' },
                React.createElement('button', {
                  type: 'button',
                  onClick: () => setIsAddingAddress(false),
                  className: 'px-4 py-2 border rounded-xl'
                }, 'Cancel'),
                React.createElement('button', {
                  type: 'submit',
                  className: 'px-5 py-2 bg-stone-900 text-white font-bold rounded-xl'
                }, 'Save Address')
              )
            ),

            // List of Saved Addresses
            React.createElement('div', { className: 'space-y-3' },
              (state.currentUser && Array.isArray(state.currentUser.addresses) && state.currentUser.addresses.length > 0) ? (
                state.currentUser.addresses.map(a =>
                  React.createElement('div', {
                    key: a.id,
                    className: `p-4 rounded-2xl border transition ${a.isDefault ? 'border-orange-800 bg-orange-50/40' : 'border-stone-200 bg-stone-50/50'}`
                  },
                    React.createElement('div', { className: 'flex justify-between items-center pb-1' },
                      React.createElement('div', { className: 'flex items-center space-x-2' },
                        React.createElement('span', { className: 'font-bold text-stone-900 text-sm' }, a.name),
                        React.createElement('span', { className: 'bg-stone-200 text-stone-700 font-semibold px-2 py-0.5 rounded text-[10px]' }, a.type || 'Home'),
                        a.isDefault && React.createElement('span', { className: 'bg-orange-800 text-white font-bold px-2 py-0.5 rounded text-[10px]' }, 'DEFAULT')
                      ),
                      React.createElement('div', { className: 'flex items-center space-x-2' },
                        !a.isDefault && React.createElement('button', {
                          onClick: () => window.vastraStore.setDefaultAddress(a.id),
                          className: 'text-orange-800 hover:underline font-semibold'
                        }, 'Make Default'),
                        React.createElement('button', {
                          onClick: () => window.vastraStore.deleteAddress(a.id),
                          className: 'text-red-600 hover:text-red-800 p-1'
                        }, React.createElement(Icon, { name: 'trash', className: 'w-4 h-4' }))
                      )
                    ),
                    React.createElement('p', { className: 'text-stone-700 mt-1' }, a.line),
                    a.landmark && React.createElement('p', { className: 'text-stone-500' }, `Landmark: ${a.landmark}`),
                    React.createElement('p', { className: 'text-stone-500' }, `${a.city}, ${a.state || 'Rajasthan'} - ${a.pincode}`),
                    React.createElement('p', { className: 'text-stone-500 mt-1 font-medium' }, `Phone: ${a.phone}`)
                  )
                )
              ) : React.createElement('div', { className: 'text-center py-8 text-stone-500' },
                'No addresses saved yet. Click "Add New Address" above.'
              )
            )
          )
        ),

        // TAB 2: My Orders
        tab === 'orders' && React.createElement('div', { className: 'space-y-4' },
          React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, `My Orders (${myOrders.length})`),
          myOrders.length > 0 ? myOrders.map(order =>
            React.createElement('div', { key: order.id, className: 'bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4' },
              React.createElement('div', { className: 'flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100' },
                React.createElement('div', null,
                  React.createElement('span', { className: 'font-bold text-stone-900' }, `Order #${order.id}`),
                  React.createElement('span', { className: 'text-stone-400 ml-2' }, `· ${new Date(order.date).toLocaleDateString()}`)
                ),
                React.createElement('span', { className: 'bg-orange-100 text-orange-900 font-bold px-2.5 py-1 rounded-full' }, order.status)
              ),
              React.createElement('div', { className: 'space-y-2' },
                (order.items || []).map((item, idx) =>
                  React.createElement('div', { key: idx, className: 'flex items-center justify-between' },
                    React.createElement('div', { className: 'flex items-center space-x-3' },
                      React.createElement('img', { src: item.image, alt: item.title, className: 'w-12 h-14 object-cover rounded-lg' }),
                      React.createElement('div', null,
                        React.createElement('p', { className: 'font-bold text-stone-800' }, item.title),
                        React.createElement('p', { className: 'text-stone-400 text-[11px]' }, `Qty: ${item.quantity} · Size: ${item.size} · Color: ${item.color}`)
                      )
                    ),
                    React.createElement('span', { className: 'font-extrabold text-stone-900' }, `₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
                  )
                )
              ),
              React.createElement('div', { className: 'pt-3 border-t border-stone-100 flex items-center justify-between' },
                React.createElement('span', { className: 'text-stone-500' }, `Shop: ${order.shopName}`),
                React.createElement('button', {
                  onClick: () => onTrackOrder(order.id),
                  className: 'px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold'
                }, 'Track Delivery →')
              )
            )
          ) : React.createElement('div', { className: 'bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500' },
            'No orders placed yet.'
          )
        ),

        // TAB 3: Store Pickup Reservations
        tab === 'reservations' && React.createElement('div', { className: 'space-y-4' },
          React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, `Store Pickup Reservations (${myReservations.length})`),
          myReservations.length > 0 ? myReservations.map(res =>
            React.createElement('div', { key: res.id, className: 'bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4' },
              React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-stone-100' },
                React.createElement('div', null,
                  React.createElement('span', { className: 'text-[10px] text-stone-400 uppercase font-bold' }, 'Reservation Code:'),
                  React.createElement('div', { className: 'font-mono text-base font-extrabold text-orange-800 tracking-wider' }, res.reservationCode)
                ),
                React.createElement('span', { className: 'bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200' }, res.status)
              ),
              React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  React.createElement('img', { src: res.items[0]?.image, alt: '', className: 'w-14 h-18 object-cover rounded-xl' }),
                  React.createElement('div', null,
                    React.createElement('p', { className: 'font-bold text-stone-900' }, res.items[0]?.title),
                    React.createElement('p', { className: 'text-stone-500' }, `Size: ${res.items[0]?.size} · Color: ${res.items[0]?.color}`),
                    React.createElement('p', { className: 'text-orange-800 font-bold mt-1' }, `₹${res.items[0]?.price.toLocaleString('en-IN')}`)
                  )
                ),
                React.createElement('div', { className: 'bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1' },
                  React.createElement('p', { className: 'font-bold text-stone-900' }, `📍 Pickup at: ${res.shopName}`),
                  React.createElement('p', { className: 'text-stone-600' }, res.shopAddress),
                  React.createElement('p', { className: 'text-emerald-800 font-semibold' }, `Reserved Day: ${res.pickupDate} (${res.pickupTimeSlot})`)
                )
              ),
              React.createElement('p', { className: 'text-[11px] text-stone-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200' },
                res.instructions
              )
            )
          ) : React.createElement('div', { className: 'bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500' },
            'No store pickup reservations currently active.'
          )
        ),

        // TAB 4: Wishlist
        tab === 'wishlist' && React.createElement('div', { className: 'space-y-4' },
          React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, `My Saved Garments (${wishlistProducts.length})`),
          wishlistProducts.length > 0 ? React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6' },
            wishlistProducts.map(p =>
              React.createElement(window.ProductCard, {
                key: p.id,
                product: p,
                onOpenProduct,
                onAddToCart,
                onToggleWishlist: () => window.vastraStore.toggleWishlist(p.id),
                isWishlisted: true
              })
            )
          ) : React.createElement('div', { className: 'bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500' },
            'Your wishlist is empty.'
          )
        )
      )
    );
  };

  // 4. Seller Dashboard (Shopkeeper Management Portal)
  window.SellerDashboard = function({ state, onOpenProduct }) {
    const shop = state.shops.find(s => s.id === state.currentUser.sellerShopId) || state.shops[0];
    const shopProducts = state.products.filter(p => p.shopId === shop.id);
    const shopOrders = state.orders.filter(o => o.shopId === shop.id || o.shopName === shop.name);
    const shopReservations = state.reservations.filter(r => r.shopId === shop.id || r.shopName === shop.name);

    const [activeTab, setActiveTab] = React.useState('products');
    const [isAddProductOpen, setIsAddProductOpen] = React.useState(false);

    // New product form
    const [newTitle, setNewTitle] = React.useState('');
    const [newCategory, setNewCategory] = React.useState('Kurtas & Anarkalis');
    const [newPrice, setNewPrice] = React.useState(2999);
    const [newOriginalPrice, setNewOriginalPrice] = React.useState(3999);
    const [newFabric, setNewFabric] = React.useState('Pure Chanderi Silk');
    const [newStock, setNewStock] = React.useState(8);
    const [newSizes, setNewSizes] = React.useState('S, M, L, XL');
    const [newImageUrl, setNewImageUrl] = React.useState('https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=800&q=80');

    const handleCreateProduct = (e) => {
      e.preventDefault();
      window.vastraStore.addProduct({
        shopId: shop.id,
        shopName: shop.name,
        shopArea: `${shop.area}, ${shop.city}`,
        title: newTitle,
        category: newCategory,
        gender: 'Women',
        price: Number(newPrice),
        originalPrice: Number(newOriginalPrice),
        discountPercent: Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100),
        fabric: newFabric,
        stockQuantity: Number(newStock),
        sizes: newSizes.split(',').map(s => s.trim()),
        colors: [{ name: 'Festive Terracotta', hex: '#B7410E' }],
        images: [newImageUrl],
        description: `${newTitle} curated exclusively at ${shop.name}.`,
        care: 'Dry clean recommended.',
        returnPolicy: '7-day easy exchange at store counter.',
        deliveryAvailable: true,
        storePickupAvailable: true
      });
      setIsAddProductOpen(false);
      setNewTitle('');
    };

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-8 sm:py-12 text-xs' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8' },
        
        // Seller Header Banner
        React.createElement('div', { className: 'bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4' },
          React.createElement('div', { className: 'flex items-center space-x-4' },
            React.createElement('img', { src: shop.logo, alt: shop.name, className: 'w-16 h-16 rounded-xl object-cover border border-stone-200' }),
            React.createElement('div', null,
              React.createElement('div', { className: 'flex items-center space-x-2' },
                React.createElement('h2', { className: 'font-serif text-2xl font-bold text-stone-900' }, shop.name),
                React.createElement('span', { className: 'bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded text-[10px]' }, 'Seller Portal')
              ),
              React.createElement('p', { className: 'text-stone-500' }, `Manager: ${shop.owner} · ${shop.address}`)
            )
          ),
          React.createElement('button', {
            onClick: () => setIsAddProductOpen(true),
            className: 'px-5 py-2.5 bg-orange-800 hover:bg-orange-900 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow'
          },
            React.createElement(Icon, { name: 'plus', className: 'w-4 h-4' }),
            React.createElement('span', null, 'Add New Garment to Rack')
          )
        ),

        // Metric Cards
        React.createElement('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' },
          [
            { label: 'Active Racks / Items', val: shopProducts.length, sub: 'In stock catalog' },
            { label: 'Customer Orders', val: shopOrders.length, sub: 'Direct from city' },
            { label: 'In-Store Pickup Holds', val: shopReservations.length, sub: 'Offline trials scheduled' },
            { label: 'Store Rating', val: `⭐ ${shop.rating}`, sub: `From ${shop.reviewCount} customers` }
          ].map(m =>
            React.createElement('div', { key: m.label, className: 'bg-white p-4 rounded-xl border border-stone-200 shadow-sm' },
              React.createElement('div', { className: 'text-stone-400 font-bold uppercase text-[10px]' }, m.label),
              React.createElement('div', { className: 'font-serif text-2xl font-bold text-stone-900 mt-1' }, m.val),
              React.createElement('div', { className: 'text-stone-500 text-[10px] mt-0.5' }, m.sub)
            )
          )
        ),

        // Tabs
        React.createElement('div', { className: 'flex space-x-3 border-b border-stone-200 pb-2' },
          [
            { id: 'products', label: `My Products (${shopProducts.length})` },
            { id: 'orders', label: `Customer Orders (${shopOrders.length})` },
            { id: 'reservations', label: `Store Reservations (${shopReservations.length})` }
          ].map(t =>
            React.createElement('button', {
              key: t.id,
              onClick: () => setActiveTab(t.id),
              className: `px-4 py-2 rounded-xl font-bold transition ${activeTab === t.id ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'}`
            }, t.label)
          )
        ),

        // TAB 1: Products Table
        activeTab === 'products' && React.createElement('div', { className: 'bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm' },
          React.createElement('div', { className: 'overflow-x-auto' },
            React.createElement('table', { className: 'w-full text-left' },
              React.createElement('thead', { className: 'bg-stone-50 text-stone-500 font-bold uppercase text-[10px]' },
                React.createElement('tr', null,
                  React.createElement('th', { className: 'p-3' }, 'Garment'),
                  React.createElement('th', { className: 'p-3' }, 'Category'),
                  React.createElement('th', { className: 'p-3' }, 'Price'),
                  React.createElement('th', { className: 'p-3' }, 'Stock Left'),
                  React.createElement('th', { className: 'p-3' }, 'Actions')
                )
              ),
              React.createElement('tbody', { className: 'divide-y divide-stone-100 text-stone-700 font-medium' },
                shopProducts.map(p =>
                  React.createElement('tr', { key: p.id, className: 'hover:bg-stone-50' },
                    React.createElement('td', { className: 'p-3 flex items-center space-x-3' },
                      React.createElement('img', { src: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', alt: '', className: 'w-10 h-12 object-cover rounded-lg' }),
                      React.createElement('div', null,
                        React.createElement('div', { className: 'font-bold text-stone-900' }, p.title),
                        React.createElement('div', { className: 'text-[10px] text-stone-400' }, p.fabric)
                      )
                    ),
                    React.createElement('td', { className: 'p-3' }, p.category),
                    React.createElement('td', { className: 'p-3 font-bold text-stone-900' }, `₹${p.price.toLocaleString('en-IN')}`),
                    React.createElement('td', { className: 'p-3 font-bold text-emerald-700' }, `${p.stockQuantity} pcs`),
                    React.createElement('td', { className: 'p-3' },
                      React.createElement('button', {
                        onClick: () => window.vastraStore.deleteProduct(p.id),
                        className: 'text-red-600 hover:text-red-800 font-bold'
                      }, 'Delete')
                    )
                  )
                )
              )
            )
          )
        ),

        // TAB 2: Orders Management
        activeTab === 'orders' && React.createElement('div', { className: 'space-y-4' },
          shopOrders.length > 0 ? shopOrders.map(order =>
            React.createElement('div', { key: order.id, className: 'bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3' },
              React.createElement('div', { className: 'flex justify-between items-center' },
                React.createElement('span', { className: 'font-bold text-stone-900' }, `Order #${order.id} · Customer: ${order.customerName}`),
                React.createElement('span', { className: 'bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded' }, order.status)
              ),
              React.createElement('p', { className: 'text-stone-500' }, `Delivery Address: ${order.deliveryAddress}`),
              React.createElement('div', { className: 'pt-2 flex items-center space-x-2' },
                React.createElement('span', { className: 'font-bold text-stone-700' }, 'Update Status:'),
                ['Confirmed by Shop', 'Inspected & Packed', 'Out for Delivery', 'Delivered'].map(status =>
                  React.createElement('button', {
                    key: status,
                    onClick: () => window.vastraStore.updateOrderStatus(order.id, status),
                    className: `px-2.5 py-1 rounded-lg border font-semibold ${order.status === status ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700 hover:bg-stone-100'}`
                  }, status)
                )
              )
            )
          ) : React.createElement('div', { className: 'bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500' },
            'No orders received yet.'
          )
        ),

        // TAB 3: Reservations Management
        activeTab === 'reservations' && React.createElement('div', { className: 'space-y-4' },
          shopReservations.length > 0 ? shopReservations.map(res =>
            React.createElement('div', { key: res.id, className: 'bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3' },
              React.createElement('div', { className: 'flex justify-between items-center' },
                React.createElement('span', { className: 'font-bold text-stone-900' }, `Reservation Code: ${res.reservationCode}`),
                React.createElement('span', { className: 'bg-emerald-50 text-emerald-900 font-bold px-2.5 py-1 rounded border border-emerald-200' }, res.status)
              ),
              React.createElement('p', { className: 'text-stone-700' },
                `Customer: ${res.customerName} (${res.customerPhone}) · Expected: ${res.pickupDate} (${res.pickupTimeSlot})`
              ),
              React.createElement('div', { className: 'flex items-center space-x-2 pt-2' },
                React.createElement('button', {
                  onClick: () => window.vastraStore.updateReservationStatus(res.id, 'Ready for Pickup at Counter'),
                  className: 'px-3 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg'
                }, 'Mark Ready on Counter'),
                React.createElement('button', {
                  onClick: () => window.vastraStore.updateReservationStatus(res.id, 'Completed (Purchased by Customer)'),
                  className: 'px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg'
                }, 'Mark Completed / Sold')
              )
            )
          ) : React.createElement('div', { className: 'bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500' },
            'No store pickup reservations right now.'
          )
        )
      ),

      // Add Product Modal
      isAddProductOpen && React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm' },
        React.createElement('div', { className: 'bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto' },
          React.createElement('div', { className: 'flex justify-between items-center pb-2 border-b border-stone-100' },
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Add New Garment to Store'),
            React.createElement('button', { onClick: () => setIsAddProductOpen(false) }, React.createElement(Icon, { name: 'x', className: 'w-4 h-4' }))
          ),
          React.createElement('form', { onSubmit: handleCreateProduct, className: 'space-y-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold mb-1' }, 'Garment Title:'),
              React.createElement('input', {
                type: 'text',
                required: true,
                value: newTitle,
                onChange: (e) => setNewTitle(e.target.value),
                placeholder: 'e.g. Pure Georgette Zari Kurti Set',
                className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg'
              })
            ),
            React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'Selling Price (₹):'),
                React.createElement('input', {
                  type: 'number',
                  required: true,
                  value: newPrice,
                  onChange: (e) => setNewPrice(e.target.value),
                  className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'MRP / Original Price (₹):'),
                React.createElement('input', {
                  type: 'number',
                  required: true,
                  value: newOriginalPrice,
                  onChange: (e) => setNewOriginalPrice(e.target.value),
                  className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg'
                })
              )
            ),
            React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'Fabric / Material:'),
                React.createElement('input', {
                  type: 'text',
                  value: newFabric,
                  onChange: (e) => setNewFabric(e.target.value),
                  className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'Quantity in Stock:'),
                React.createElement('input', {
                  type: 'number',
                  value: newStock,
                  onChange: (e) => setNewStock(e.target.value),
                  className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg'
                })
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold mb-1' }, 'Available Sizes (comma separated):'),
              React.createElement('input', {
                type: 'text',
                value: newSizes,
                onChange: (e) => setNewSizes(e.target.value),
                className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg'
              })
            ),
            React.createElement('div', { className: 'pt-2 flex justify-end space-x-2' },
              React.createElement('button', {
                type: 'button',
                onClick: () => setIsAddProductOpen(false),
                className: 'px-4 py-2 border rounded-lg'
              }, 'Cancel'),
              React.createElement('button', {
                type: 'submit',
                className: 'px-5 py-2 bg-stone-900 text-white rounded-lg font-bold'
              }, 'Publish to Racks')
            )
          )
        )
      )
    );
  };

  // 5. Admin Dashboard
  window.AdminDashboard = function({ state }) {
    const totalRevenue = state.orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-8 sm:py-12 text-xs' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8' },
        
        // Admin Header
        React.createElement('div', { className: 'bg-stone-900 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between' },
          React.createElement('div', null,
            React.createElement('div', { className: 'text-amber-400 font-bold uppercase tracking-widest text-[10px]' }, 'Platform Administration'),
            React.createElement('h2', { className: 'font-serif text-2xl font-bold mt-1' }, 'VASTRA Operations Command Center')
          ),
          React.createElement('span', { className: 'bg-stone-800 text-stone-300 px-3 py-1 rounded-full text-xs' },
            'Role: Superadmin'
          )
        ),

        // Metrics
        React.createElement('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' },
          [
            { label: 'Platform GMV', val: `₹${totalRevenue.toLocaleString('en-IN')}` },
            { label: 'Registered Shops', val: state.shops.length },
            { label: 'Total Garments', val: state.products.length },
            { label: 'Pending Seller Apps', val: state.sellerApplications.filter(a => a.status === 'pending').length }
          ].map(m =>
            React.createElement('div', { key: m.label, className: 'bg-white p-4 rounded-xl border border-stone-200 shadow-sm' },
              React.createElement('div', { className: 'text-stone-400 font-bold uppercase text-[10px]' }, m.label),
              React.createElement('div', { className: 'font-serif text-2xl font-bold text-stone-900 mt-1' }, m.val)
            )
          )
        ),

        // Section 1: Pending Seller Applications (Verification)
        React.createElement('div', { className: 'bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4' },
          React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Pending Seller Verification Applications'),
          (state.sellerApplications && state.sellerApplications.length > 0) ? React.createElement('div', { className: 'space-y-3' },
            state.sellerApplications.map(app =>
              React.createElement('div', { key: app.id, className: 'p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4' },
                React.createElement('div', null,
                  React.createElement('div', { className: 'font-bold text-stone-900 text-sm' }, app.shopName),
                  React.createElement('p', { className: 'text-stone-600' }, `Owner: ${app.ownerName} · Phone: ${app.phone}`),
                  React.createElement('p', { className: 'text-stone-500' }, `Address: ${app.address} (${app.city})`)
                ),
                React.createElement('div', { className: 'flex items-center space-x-2' },
                  app.status === 'approved' ? React.createElement('span', { className: 'bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full' }, 'Verified Merchant ✓') :
                  React.createElement('button', {
                    onClick: () => window.vastraStore.approveSeller(app.id),
                    className: 'px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold'
                  }, 'Approve & Verify Store')
                )
              )
            )
          ) : React.createElement('p', { className: 'text-stone-400' }, 'No pending applications.')
        ),

        // Section 2: Registered Shops Management
        React.createElement('div', { className: 'bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4' },
          React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Registered Clothing Stores Directory'),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
            (state.shops || []).map(s =>
              React.createElement('div', { key: s.id, className: 'p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2' },
                React.createElement('div', { className: 'flex justify-between items-center' },
                  React.createElement('h4', { className: 'font-bold text-stone-900' }, s.name),
                  React.createElement('span', { className: 'text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold' }, `${s.rating}★`)
                ),
                React.createElement('p', { className: 'text-stone-500' }, `${s.area}, ${s.city}`),
                React.createElement('div', { className: 'pt-2 flex justify-between items-center' },
                  React.createElement('span', { className: `text-[10px] font-bold ${s.featured ? 'text-amber-600' : 'text-stone-400'}` },
                    s.featured ? '★ Featured on Home' : 'Standard listing'
                  ),
                  React.createElement('button', {
                    onClick: () => window.vastraStore.toggleFeatureShop(s.id),
                    className: 'text-orange-800 font-bold hover:underline'
                  }, 'Toggle Feature')
                )
              )
            )
          )
        )
      )
    );
  };

  // 6. Floating Demo Role Switcher
  window.FloatingRoleSwitcher = function({ currentRole, onRoleSwitch }) {
    return React.createElement('div', {
      className: 'fixed bottom-4 right-4 z-40 bg-stone-900/95 backdrop-blur-md text-white p-2 rounded-2xl shadow-2xl border border-stone-700 flex items-center space-x-2 text-xs select-none'
    },
      React.createElement('span', { className: 'font-bold text-stone-400 uppercase tracking-wider text-[10px] pl-2' }, 'Switch Role:'),
      [
        { role: 'customer', label: 'Customer' },
        { role: 'seller', label: 'Seller' },
        { role: 'admin', label: 'Admin' }
      ].map(r =>
        React.createElement('button', {
          key: r.role,
          onClick: () => onRoleSwitch(r.role),
          className: `px-2.5 py-1 rounded-xl font-bold transition ${currentRole === r.role ? 'bg-orange-700 text-white shadow' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`
        }, r.label)
      )
    );
  };
})();
