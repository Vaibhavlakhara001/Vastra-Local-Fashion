// VASTRA – Modals, Dedicated Pages & Dashboards
(function() {
  const Icon = window.VastraIcon;

  // 1. Location Selector Modal
  window.LocationModal = function({ isOpen, onClose, selectedCity, selectedArea, onSelectLocation }) {
    if (!isOpen) return null;
    const cities = window.VASTRA_DATA.cities;
    const currentCityObj = cities.find(c => c.name === selectedCity) || cities[0];

    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in' },
      React.createElement('div', { className: 'bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5' },
        React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-stone-100' },
          React.createElement('div', { className: 'flex items-center space-x-2' },
            React.createElement(Icon, { name: 'mappin', className: 'w-5 h-5 text-orange-700' }),
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Select Your City & Area')
          ),
          React.createElement('button', { onClick: onClose, className: 'p-1 text-stone-400 hover:text-stone-600 rounded-lg' },
            React.createElement(Icon, { name: 'x', className: 'w-5 h-5' })
          )
        ),

        // Auto-detect GPS simulation
        React.createElement('button', {
          onClick: () => {
            onSelectLocation('Jaipur', 'C-Scheme');
            onClose();
          },
          className: 'w-full py-2.5 px-4 bg-orange-50 hover:bg-orange-100/80 text-orange-900 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition border border-orange-200'
        },
          React.createElement(Icon, { name: 'navigation', className: 'w-4 h-4 text-orange-700' }),
          React.createElement('span', null, 'Detect Current GPS Location (Jaipur, C-Scheme)')
        ),

        // City Selector
        React.createElement('div', null,
          React.createElement('label', { className: 'text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2' }, 'Choose City:'),
          React.createElement('div', { className: 'grid grid-cols-3 gap-2' },
            cities.map(c =>
              React.createElement('button', {
                key: c.id,
                onClick: () => onSelectLocation(c.name, 'All Areas'),
                className: `py-2 px-3 text-xs rounded-xl font-medium border text-center transition ${selectedCity === c.name ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'}`
              }, c.name)
            )
          )
        ),

        // Area Selector for Chosen City
        React.createElement('div', null,
          React.createElement('label', { className: 'text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2' }, `Popular Areas in ${selectedCity}:`),
          React.createElement('div', { className: 'flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1' },
            ['All Areas', ...currentCityObj.areas].map(area =>
              React.createElement('button', {
                key: area,
                onClick: () => {
                  onSelectLocation(selectedCity, area);
                  onClose();
                },
                className: `text-xs px-3 py-1.5 rounded-lg font-medium border transition ${selectedArea === area ? 'bg-orange-800 text-white border-orange-900' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'}`
              }, area)
            )
          )
        )
      )
    );
  };

  // 2. Visit Store Modal (Offline Shopping & Directions)
  window.VisitStoreModal = function({ isOpen, onClose, shop, onReserveClick }) {
    if (!isOpen || !shop) return null;

    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in' },
      React.createElement('div', { className: 'bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]' },
        
        // Modal Header Banner
        React.createElement('div', { className: 'relative h-44 bg-stone-900' },
          React.createElement('img', {
            src: shop.banner,
            alt: shop.name,
            className: 'w-full h-full object-cover opacity-85'
          }),
          React.createElement('button', {
            onClick: onClose,
            className: 'absolute top-3 right-3 p-1.5 bg-black/50 text-white hover:bg-black/80 rounded-full'
          },
            React.createElement(Icon, { name: 'x', className: 'w-4 h-4' })
          ),
          React.createElement('div', { className: 'absolute bottom-3 left-4 right-4 text-white' },
            React.createElement('h3', { className: 'font-serif text-2xl font-bold drop-shadow' }, shop.name),
            React.createElement('p', { className: 'text-xs text-stone-200 drop-shadow' }, `Owner: ${shop.owner} · Est. ${shop.establishedYear}`)
          )
        ),

        // Content
        React.createElement('div', { className: 'p-6 overflow-y-auto space-y-5 text-xs text-stone-700' },
          
          // Complete Physical Address
          React.createElement('div', { className: 'bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5' },
            React.createElement('div', { className: 'font-bold text-stone-900 text-sm flex items-center space-x-1.5' },
              React.createElement(Icon, { name: 'mappin', className: 'w-4 h-4 text-orange-700' }),
              React.createElement('span', null, 'Store Address & Location')
            ),
            React.createElement('p', { className: 'text-stone-700 font-medium' }, shop.address),
            React.createElement('p', { className: 'text-stone-500' }, `Landmark: ${shop.landmark}`),
            React.createElement('div', { className: 'pt-2 flex items-center space-x-3 text-orange-800 font-semibold' },
              React.createElement('a', {
                href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + ' ' + shop.address)}`,
                target: '_blank',
                rel: 'noreferrer',
                className: 'underline underline-offset-4 flex items-center space-x-1 hover:text-orange-950'
              },
                React.createElement(Icon, { name: 'navigation', className: 'w-3.5 h-3.5' }),
                React.createElement('span', null, 'Open in Google Maps Directions')
              )
            )
          ),

          // Hours & Contact
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', { className: 'border border-stone-200 p-3 rounded-xl' },
              React.createElement('div', { className: 'text-stone-400 font-semibold uppercase text-[10px]' }, 'Operating Hours'),
              React.createElement('div', { className: 'font-bold text-stone-900 text-xs mt-0.5' }, shop.openHours),
              React.createElement('div', { className: 'text-[11px] text-emerald-700 font-medium mt-0.5' }, shop.openDays)
            ),
            React.createElement('div', { className: 'border border-stone-200 p-3 rounded-xl' },
              React.createElement('div', { className: 'text-stone-400 font-semibold uppercase text-[10px]' }, 'Contact Desk'),
              React.createElement('div', { className: 'font-bold text-stone-900 text-xs mt-0.5' }, shop.phone),
              React.createElement('div', { className: 'text-[11px] text-stone-500' }, shop.email)
            )
          ),

          // Amenities Checklist
          React.createElement('div', null,
            React.createElement('div', { className: 'font-bold text-stone-900 uppercase tracking-wider text-[10px] mb-2' }, 'In-Store Trial & Amenities:'),
            React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
              (shop.amenities || []).map(a =>
                React.createElement('div', { key: a, className: 'flex items-center space-x-2 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-100' },
                  React.createElement(Icon, { name: 'check', className: 'w-3.5 h-3.5 text-emerald-600 shrink-0' }),
                  React.createElement('span', { className: 'font-medium text-stone-800' }, a)
                )
              )
            )
          ),

          // Direct WhatsApp Inquiry
          React.createElement('div', { className: 'flex items-center justify-between p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200' },
            React.createElement('div', null,
              React.createElement('p', { className: 'font-bold text-xs' }, 'Ask shopkeeper directly on WhatsApp'),
              React.createElement('p', { className: 'text-[11px] text-emerald-800' }, 'Check real-time size availability or video call')
            ),
            React.createElement('a', {
              href: `https://wa.me/919829012345?text=${encodeURIComponent(`Namaste ${shop.name}, I am browsing your collection on VASTRA.`)}`,
              target: '_blank',
              rel: 'noreferrer',
              className: 'px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1'
            },
              React.createElement(Icon, { name: 'whatsapp', className: 'w-3.5 h-3.5' }),
              React.createElement('span', null, 'Chat Now')
            )
          )
        ),

        // Footer Actions
        React.createElement('div', { className: 'p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between' },
          React.createElement('button', {
            onClick: onClose,
            className: 'px-4 py-2 border border-stone-300 hover:bg-stone-100 rounded-lg font-semibold text-xs text-stone-700'
          }, 'Close'),
          React.createElement('button', {
            onClick: () => {
              onClose();
              if (onReserveClick) onReserveClick(shop);
            },
            className: 'px-5 py-2 bg-orange-800 hover:bg-orange-900 text-white font-semibold rounded-lg text-xs flex items-center space-x-1.5 shadow'
          },
            React.createElement(Icon, { name: 'store', className: 'w-3.5 h-3.5' }),
            React.createElement('span', null, 'Reserve Garment for In-Store Trial')
          )
        )
      )
    );
  };

  // 3. Reserve for Store Pickup Modal (Select product, size, date, time)
  window.ReservePickupModal = function({ isOpen, onClose, product, shop, currentUser, onConfirmReservation }) {
    if (!isOpen || !product) return null;

    const [selectedSize, setSelectedSize] = React.useState(product.sizes[0] || 'Free Size');
    const [selectedColor, setSelectedColor] = React.useState(product.colors[0]?.name || 'Standard');
    const [pickupDate, setPickupDate] = React.useState('Today');
    const [pickupSlot, setPickupSlot] = React.useState('5:00 PM – 8:00 PM');
    const [customerName, setCustomerName] = React.useState(currentUser?.name || 'Priya Sharma');
    const [customerPhone, setCustomerPhone] = React.useState(currentUser?.phone || '+91 98200 45678');

    const handleConfirm = (e) => {
      e.preventDefault();
      onConfirmReservation({
        product,
        shopId: product.shopId,
        shopName: product.shopName,
        shopAddress: shop?.address || product.shopArea,
        shopPhone: shop?.phone || '+91 98290 12345',
        size: selectedSize,
        color: selectedColor,
        pickupDate,
        pickupTimeSlot: pickupSlot,
        customerName,
        customerPhone
      });
      onClose();
    };

    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in' },
      React.createElement('div', { className: 'bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto' },
        
        React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-stone-100' },
          React.createElement('div', null,
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Reserve for In-Store Pickup'),
            React.createElement('p', { className: 'text-xs text-orange-800 font-medium' }, `Hold piece at ${product.shopName} counter`)
          ),
          React.createElement('button', { onClick: onClose, className: 'p-1 text-stone-400 hover:text-stone-600' },
            React.createElement(Icon, { name: 'x', className: 'w-5 h-5' })
          )
        ),

        // Product Summary Box
        React.createElement('div', { className: 'flex items-center space-x-3 p-3 bg-stone-50 rounded-xl border border-stone-200' },
          React.createElement('img', {
            src: product.images[0],
            alt: product.title,
            className: 'w-16 h-20 object-cover rounded-lg'
          }),
          React.createElement('div', { className: 'text-xs flex-1' },
            React.createElement('h4', { className: 'font-bold text-stone-900 line-clamp-1' }, product.title),
            React.createElement('p', { className: 'text-stone-500' }, `📍 ${product.shopName}`),
            React.createElement('p', { className: 'text-sm font-extrabold text-stone-900 mt-1' }, `₹${product.price.toLocaleString('en-IN')}`)
          )
        ),

        React.createElement('form', { onSubmit: handleConfirm, className: 'space-y-4 text-xs' },
          // Size Chooser
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold text-stone-700 mb-1.5' }, 'Select Size to Reserve:'),
            React.createElement('div', { className: 'flex flex-wrap gap-2' },
              (product.sizes || []).map(s =>
                React.createElement('button', {
                  key: s,
                  type: 'button',
                  onClick: () => setSelectedSize(s),
                  className: `px-3 py-1.5 rounded-lg border font-semibold transition ${selectedSize === s ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-700 border-stone-300'}`
                }, s)
              )
            )
          ),

          // Color Chooser
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold text-stone-700 mb-1.5' }, 'Select Color:'),
            React.createElement('div', { className: 'flex flex-wrap gap-2' },
              (product.colors || []).map(c =>
                React.createElement('button', {
                  key: c.name,
                  type: 'button',
                  onClick: () => setSelectedColor(c.name),
                  className: `px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition ${selectedColor === c.name ? 'bg-orange-800 text-white border-orange-800' : 'bg-white text-stone-700 border-stone-300'}`
                },
                  React.createElement('span', { className: 'w-2.5 h-2.5 rounded-full border border-black/20', style: { backgroundColor: c.hex } }),
                  React.createElement('span', null, c.name)
                )
              )
            )
          ),

          // Pickup Schedule
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Pickup Day:'),
              React.createElement('select', {
                value: pickupDate,
                onChange: (e) => setPickupDate(e.target.value),
                className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg font-medium'
              },
                React.createElement('option', { value: 'Today' }, 'Today'),
                React.createElement('option', { value: 'Tomorrow' }, 'Tomorrow'),
                React.createElement('option', { value: 'Day After Tomorrow' }, 'Day After Tomorrow')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Preferred Time Slot:'),
              React.createElement('select', {
                value: pickupSlot,
                onChange: (e) => setPickupSlot(e.target.value),
                className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg font-medium'
              },
                React.createElement('option', { value: '11:00 AM – 2:00 PM' }, '11:00 AM – 2:00 PM'),
                React.createElement('option', { value: '2:00 PM – 5:00 PM' }, '2:00 PM – 5:00 PM'),
                React.createElement('option', { value: '5:00 PM – 8:00 PM' }, '5:00 PM – 8:00 PM')
              )
            )
          ),

          // Customer Contact Info
          React.createElement('div', { className: 'grid grid-cols-2 gap-3 pt-2' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Your Name:'),
              React.createElement('input', {
                type: 'text',
                required: true,
                value: customerName,
                onChange: (e) => setCustomerName(e.target.value),
                className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Mobile Number:'),
              React.createElement('input', {
                type: 'tel',
                required: true,
                value: customerPhone,
                onChange: (e) => setCustomerPhone(e.target.value),
                className: 'w-full p-2 bg-stone-50 border border-stone-300 rounded-lg'
              })
            )
          ),

          // Clarification Notice
          React.createElement('div', { className: 'p-3 bg-amber-50 rounded-xl text-amber-900 border border-amber-200 space-y-1' },
            React.createElement('p', { className: 'font-bold' }, '💡 How offline store reservation works:'),
            React.createElement('p', { className: 'text-[11px]' },
              'No advance payment required. The seller will hold this exact piece in your name for 24 hours. You can try it on at their trial room and choose to buy offline or online.'
            )
          ),

          // Submit Button
          React.createElement('div', { className: 'pt-3 flex items-center justify-end space-x-3' },
            React.createElement('button', {
              type: 'button',
              onClick: onClose,
              className: 'px-4 py-2 border border-stone-300 hover:bg-stone-100 rounded-lg font-semibold text-stone-700'
            }, 'Cancel'),
            React.createElement('button', {
              type: 'submit',
              className: 'px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg flex items-center space-x-2 shadow-md'
            },
              React.createElement(Icon, { name: 'store', className: 'w-4 h-4 text-amber-400' }),
              React.createElement('span', null, 'Generate Pickup Code')
            )
          )
        )
      )
    );
  };

  // 4. Size Guide Modal
  window.SizeGuideModal = function({ isOpen, onClose }) {
    if (!isOpen) return null;

    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in' },
      React.createElement('div', { className: 'bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4' },
        React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-stone-100' },
          React.createElement('div', null,
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Standard Indian Garment Size Guide'),
            React.createElement('p', { className: 'text-xs text-stone-500' }, 'All measurements in inches (in) and centimeters (cm)')
          ),
          React.createElement('button', { onClick: onClose, className: 'p-1 text-stone-400 hover:text-stone-600' },
            React.createElement(Icon, { name: 'x', className: 'w-5 h-5' })
          )
        ),

        // Size Chart Table
        React.createElement('div', { className: 'overflow-x-auto' },
          React.createElement('table', { className: 'w-full text-xs text-left border-collapse' },
            React.createElement('thead', { className: 'bg-stone-100 text-stone-700 font-bold uppercase' },
              React.createElement('tr', null,
                React.createElement('th', { className: 'p-2.5 border border-stone-200' }, 'Size'),
                React.createElement('th', { className: 'p-2.5 border border-stone-200' }, 'Bust / Chest (in)'),
                React.createElement('th', { className: 'p-2.5 border border-stone-200' }, 'Waist (in)'),
                React.createElement('th', { className: 'p-2.5 border border-stone-200' }, 'Hip (in)'),
                React.createElement('th', { className: 'p-2.5 border border-stone-200' }, 'Kurta Length (in)')
              )
            ),
            React.createElement('tbody', { className: 'text-stone-600' },
              [
                { size: 'XS', bust: '32', waist: '26', hip: '36', len: '42' },
                { size: 'S', bust: '34', waist: '28', hip: '38', len: '44' },
                { size: 'M', bust: '36', waist: '30', hip: '40', len: '44' },
                { size: 'L', bust: '38', waist: '32', hip: '42', len: '45' },
                { size: 'XL', bust: '40', waist: '34', hip: '44', len: '45' },
                { size: 'XXL', bust: '42', waist: '36', hip: '46', len: '46' }
              ].map(row =>
                React.createElement('tr', { key: row.size, className: 'hover:bg-stone-50 font-medium' },
                  React.createElement('td', { className: 'p-2.5 border border-stone-200 font-bold text-stone-900' }, row.size),
                  React.createElement('td', { className: 'p-2.5 border border-stone-200' }, row.bust),
                  React.createElement('td', { className: 'p-2.5 border border-stone-200' }, row.waist),
                  React.createElement('td', { className: 'p-2.5 border border-stone-200' }, row.hip),
                  React.createElement('td', { className: 'p-2.5 border border-stone-200' }, row.len)
                )
              )
            )
          )
        ),

        React.createElement('div', { className: 'p-3 bg-stone-50 rounded-xl text-stone-600 text-[11px] space-y-1' },
          React.createElement('p', { className: 'font-bold text-stone-800' }, 'Need custom alterations?'),
          React.createElement('p', null, 'Local partner boutiques offer complimentary in-store alteration for sleeves, waist, and length when you visit the shop!')
        )
      )
    );
  };

  // 5. Product Details Modal / View
  window.ProductDetailModal = function({ isOpen, onClose, product, shop, onAddToCart, onReserveClick, onVisitStore, onOpenShop, onToggleWishlist, isWishlisted }) {
    if (!isOpen || !product) return null;

    const [activeImg, setActiveImg] = React.useState(product.images[0]);
    const [selectedSize, setSelectedSize] = React.useState(product.sizes[0] || 'Free Size');
    const [selectedColor, setSelectedColor] = React.useState(product.colors[0]?.name || 'Standard');
    const [quantity, setQuantity] = React.useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);

    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in' },
      React.createElement('div', { className: 'bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row' },
        
        // Left Column: Image Gallery
        React.createElement('div', { className: 'md:w-1/2 p-6 bg-stone-50 flex flex-col justify-between overflow-y-auto' },
          React.createElement('div', null,
            React.createElement('div', { className: 'aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-200 relative' },
              React.createElement('img', {
                src: activeImg,
                alt: product.title,
                className: 'w-full h-full object-cover object-top'
              }),
              product.discountPercent > 0 && React.createElement('span', {
                className: 'absolute top-3 left-3 bg-orange-700 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow'
              }, `${product.discountPercent}% OFF`)
            ),

            // Thumbnail strip
            Array.isArray(product.images) && product.images.length > 1 && React.createElement('div', { className: 'flex space-x-2 mt-3' },
              product.images.map(img =>
                React.createElement('button', {
                  key: img,
                  onClick: () => setActiveImg(img),
                  className: `w-14 h-16 rounded-lg overflow-hidden border-2 transition ${activeImg === img ? 'border-orange-800 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`
                },
                  React.createElement('img', { src: img, alt: '', className: 'w-full h-full object-cover' })
                )
              )
            )
          ),

          // In-Store Trial Guarantee Pill
          React.createElement('div', { className: 'mt-4 p-3 bg-white rounded-xl border border-stone-200 flex items-center space-x-3 text-xs' },
            React.createElement('div', { className: 'w-9 h-9 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center shrink-0' },
              React.createElement(Icon, { name: 'store', className: 'w-4 h-4' })
            ),
            React.createElement('div', null,
              React.createElement('p', { className: 'font-bold text-stone-900' }, 'Hanging in physical store:'),
              React.createElement('p', { className: 'text-stone-500' }, `${product.inStoreAvailability || 'Ready on rack'}`)
            )
          )
        ),

        // Right Column: Details & Actions
        React.createElement('div', { className: 'md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6 text-xs' },
          React.createElement('div', { className: 'space-y-4' },
            
            // Header Row
            React.createElement('div', { className: 'flex items-start justify-between' },
              React.createElement('div', null,
                React.createElement('button', {
                  onClick: () => { onClose(); onOpenShop(product.shopId); },
                  className: 'text-orange-800 font-bold hover:underline flex items-center space-x-1 uppercase tracking-wider text-[11px]'
                },
                  React.createElement(Icon, { name: 'store', className: 'w-3.5 h-3.5' }),
                  React.createElement('span', null, product.shopName)
                ),
                React.createElement('h2', { className: 'font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1 leading-snug' }, product.title),
                React.createElement('p', { className: 'text-stone-500 text-[11px] mt-0.5' }, `Category: ${product.category} · Fabric: ${product.fabric}`)
              ),
              React.createElement('button', { onClick: onClose, className: 'p-1.5 text-stone-400 hover:text-stone-600 rounded-lg' },
                React.createElement(Icon, { name: 'x', className: 'w-5 h-5' })
              )
            ),

            // Price & Stock
            React.createElement('div', { className: 'flex items-baseline space-x-3' },
              React.createElement('span', { className: 'text-2xl font-extrabold text-stone-900' }, `₹${product.price.toLocaleString('en-IN')}`),
              product.originalPrice > product.price && React.createElement('span', { className: 'text-sm text-stone-400 line-through' }, `₹${product.originalPrice.toLocaleString('en-IN')}`),
              React.createElement('span', { className: 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold' },
                `In Stock (${product.stockQuantity} pieces left)`
              )
            ),

            // Size Selector
            React.createElement('div', null,
              React.createElement('div', { className: 'flex items-center justify-between mb-1.5' },
                React.createElement('span', { className: 'font-bold text-stone-800' }, 'Available Sizes:'),
                React.createElement('button', {
                  onClick: () => setIsSizeGuideOpen(true),
                  className: 'text-orange-800 underline font-semibold flex items-center space-x-1'
                },
                  React.createElement(Icon, { name: 'scissors', className: 'w-3 h-3' }),
                  React.createElement('span', null, 'Size Guide Chart')
                )
              ),
              React.createElement('div', { className: 'flex flex-wrap gap-2' },
                (product.sizes || []).map(s =>
                  React.createElement('button', {
                    key: s,
                    onClick: () => setSelectedSize(s),
                    className: `px-3.5 py-2 rounded-xl font-bold border transition ${selectedSize === s ? 'bg-stone-900 text-white border-stone-900 shadow-sm' : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'}`
                  }, s)
                )
              )
            ),

            // Color Selector
            React.createElement('div', null,
              React.createElement('span', { className: 'font-bold text-stone-800 block mb-1.5' }, `Color: ${selectedColor}`),
              React.createElement('div', { className: 'flex flex-wrap gap-2' },
                (product.colors || []).map(c =>
                  React.createElement('button', {
                    key: c.name,
                    onClick: () => setSelectedColor(c.name),
                    className: `px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 font-semibold transition ${selectedColor === c.name ? 'border-orange-800 bg-orange-50 text-orange-950 ring-1 ring-orange-800' : 'border-stone-200 bg-white text-stone-700'}`
                  },
                    React.createElement('span', { className: 'w-3 h-3 rounded-full border border-black/20', style: { backgroundColor: c.hex } }),
                    React.createElement('span', null, c.name)
                  )
                )
              )
            ),

            // Description & Care
            React.createElement('div', { className: 'space-y-2 pt-2 border-t border-stone-100 text-stone-600' },
              React.createElement('p', { className: 'leading-relaxed' }, product.description),
              React.createElement('div', { className: 'bg-stone-50 p-3 rounded-xl space-y-1' },
                React.createElement('p', null, React.createElement('strong', { className: 'text-stone-900' }, 'Weave/Craft: '), product.weave),
                React.createElement('p', null, React.createElement('strong', { className: 'text-stone-900' }, 'Care: '), product.care),
                React.createElement('p', null, React.createElement('strong', { className: 'text-stone-900' }, 'Returns: '), product.returnPolicy)
              )
            )
          ),

          // Two-Way Shopping CTA (Online vs Offline Store Trial)
          React.createElement('div', { className: 'pt-4 border-t border-stone-200 space-y-2.5' },
            React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
              
              // Online Order Button
              React.createElement('button', {
                onClick: () => {
                  onAddToCart(product, selectedSize, selectedColor, quantity);
                  onClose();
                },
                className: 'py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow transition'
              },
                React.createElement(Icon, { name: 'bag', className: 'w-4 h-4 text-amber-400' }),
                React.createElement('span', null, 'Order Online')
              ),

              // Offline Store Pickup / Trial Button
              React.createElement('button', {
                onClick: () => {
                  onClose();
                  onReserveClick(product);
                },
                className: 'py-3 px-4 bg-orange-800 hover:bg-orange-900 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow transition'
              },
                React.createElement(Icon, { name: 'store', className: 'w-4 h-4' }),
                React.createElement('span', null, 'Try Offline at Shop')
              )
            ),

            // Secondary Buttons: Visit Store & Wishlist
            React.createElement('div', { className: 'flex items-center justify-between text-stone-500 pt-1' },
              React.createElement('button', {
                onClick: () => {
                  onClose();
                  if (shop) onVisitStore(shop);
                },
                className: 'hover:text-stone-900 flex items-center space-x-1 font-semibold'
              },
                React.createElement(Icon, { name: 'mappin', className: 'w-3.5 h-3.5 text-orange-700' }),
                React.createElement('span', null, 'Visit Physical Store & Directions')
              ),
              React.createElement('button', {
                onClick: () => onToggleWishlist(product.id),
                className: 'hover:text-orange-800 flex items-center space-x-1 font-semibold'
              },
                React.createElement(Icon, { name: 'heart', className: `w-3.5 h-3.5 ${isWishlisted ? 'text-orange-700 fill-orange-700' : ''}` }),
                React.createElement('span', null, isWishlisted ? 'In Wishlist' : 'Save to Wishlist')
              )
            )
          )
        )
      ),

      // Size Guide Modal child
      React.createElement(window.SizeGuideModal, {
        isOpen: isSizeGuideOpen,
        onClose: () => setIsSizeGuideOpen(false)
      })
    );
  };

  // 6. User Profile & Account Settings Modal (Custom Name, Email, Address entry without DB)
  window.UserProfileModal = function({ isOpen, onClose, state }) {
    if (!isOpen) return null;

    const [name, setName] = React.useState(state.currentUser.name || '');
    const [email, setEmail] = React.useState(state.currentUser.email || '');
    const [phone, setPhone] = React.useState(state.currentUser.phone || '');
    const [city, setCity] = React.useState(state.currentUser.city || state.selectedCity || 'Jaipur');
    const [address, setAddress] = React.useState(state.currentUser.addresses[0]?.line || '');
    const [pincode, setPincode] = React.useState(state.currentUser.addresses[0]?.pincode || '302001');

    const handleSave = (e) => {
      e.preventDefault();
      if (!name.trim() || !email.trim()) return;
      window.vastraStore.registerOrLogin({
        name,
        email,
        phone,
        city,
        address,
        pincode
      });
      onClose();
    };

    return React.createElement('div', { className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in' },
      React.createElement('div', { className: 'bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 text-xs' },
        
        // Modal Header
        React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-stone-100' },
          React.createElement('div', null,
            React.createElement('div', { className: 'text-[10px] text-orange-800 font-bold uppercase tracking-wider' }, 'Customer Account'),
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900 mt-0.5' }, 'Set Your Name, Address & Email')
          ),
          React.createElement('button', { onClick: onClose, className: 'p-1 text-stone-400 hover:text-stone-600' },
            React.createElement(Icon, { name: 'x', className: 'w-5 h-5' })
          )
        ),

        // Zero DB Notice
        React.createElement('div', { className: 'p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] flex items-center space-x-2 font-medium' },
          React.createElement(Icon, { name: 'shield', className: 'w-4 h-4 text-emerald-700 shrink-0' }),
          React.createElement('span', null, 'Zero database required! Your personal information is safely remembered directly in your browser.')
        ),

        // Form
        React.createElement('form', { onSubmit: handleSave, className: 'space-y-3.5' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Your Full Name *'),
            React.createElement('input', {
              type: 'text',
              required: true,
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: 'e.g. Rahul Sharma',
              className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium'
            })
          ),

          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Email Address *'),
              React.createElement('input', {
                type: 'email',
                required: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: 'e.g. rahul@gmail.com',
                className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Mobile Phone *'),
              React.createElement('input', {
                type: 'tel',
                required: true,
                value: phone,
                onChange: (e) => setPhone(e.target.value),
                placeholder: '+91 98765 43210',
                className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium'
              })
            )
          ),

          React.createElement('div', null,
            React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'Delivery Address *'),
            React.createElement('textarea', {
              rows: 2,
              required: true,
              value: address,
              onChange: (e) => setAddress(e.target.value),
              placeholder: 'Flat/House no, Street, Colony...',
              className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium'
            })
          ),

          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'City:'),
              React.createElement('input', {
                type: 'text',
                required: true,
                value: city,
                onChange: (e) => setCity(e.target.value),
                className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold text-stone-700 mb-1' }, 'PIN Code:'),
              React.createElement('input', {
                type: 'text',
                value: pincode,
                onChange: (e) => setPincode(e.target.value),
                placeholder: '302001',
                className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium'
              })
            )
          ),

          React.createElement('div', { className: 'pt-2 flex items-center justify-end space-x-2' },
            React.createElement('button', {
              type: 'button',
              onClick: onClose,
              className: 'px-4 py-2.5 border border-stone-300 hover:bg-stone-50 rounded-xl font-semibold'
            }, 'Cancel'),
            React.createElement('button', {
              type: 'submit',
              className: 'px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow'
            }, 'Save Details')
          )
        )
      )
    );
  };
})();
