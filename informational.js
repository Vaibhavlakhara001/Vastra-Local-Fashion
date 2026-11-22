// VASTRA – Seller Registration Wizard & Informational Views
(function() {
  const Icon = window.VastraIcon;

  // 1. "Become a Seller" Multi-Step Registration Page
  window.BecomeSellerPage = function({ onComplete }) {
    const [step, setStep] = React.useState(1);
    const [shopName, setShopName] = React.useState('');
    const [ownerName, setOwnerName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [city, setCity] = React.useState('Jaipur');
    const [area, setArea] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [category, setCategory] = React.useState('Sarees & Handlooms');
    const [openHours, setOpenHours] = React.useState('10:30 AM – 8:30 PM');
    const [description, setDescription] = React.useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      window.vastraStore.registerSeller({
        name: shopName,
        tagline: 'Neighborhood Clothing Specialist',
        owner: ownerName,
        phone,
        email,
        city,
        area: area || 'Central Market',
        pincode: '302001',
        address,
        landmark: 'Main Market Road',
        openHours,
        openDays: 'Mon – Sat',
        categories: [category],
        description: description || `Welcome to ${shopName}. Offering verified traditional and modern fashion collections.`
      });
      if (onComplete) onComplete();
    };

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-12 text-xs' },
      React.createElement('div', { className: 'max-w-2xl mx-auto px-4 space-y-6' },
        React.createElement('div', { className: 'text-center space-y-2' },
          React.createElement('span', { className: 'text-[11px] font-bold text-orange-800 uppercase tracking-widest' }, 'Retailer Onboarding'),
          React.createElement('h1', { className: 'font-serif text-3xl font-bold text-stone-900' }, 'Become a Verified Seller on VASTRA'),
          React.createElement('p', { className: 'text-stone-500 max-w-lg mx-auto' },
            'List your clothing shop or boutique. Connect with thousands of local shoppers in your city for both online delivery and in-store walk-in trials.'
          )
        ),

        React.createElement('form', { onSubmit: handleSubmit, className: 'bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6' },
          
          // Progress Bar
          React.createElement('div', { className: 'flex justify-between border-b border-stone-100 pb-4 font-bold' },
            React.createElement('span', { className: step >= 1 ? 'text-orange-800' : 'text-stone-400' }, '1. Shop Details'),
            React.createElement('span', { className: step >= 2 ? 'text-orange-800' : 'text-stone-400' }, '2. Location & Hours'),
            React.createElement('span', { className: step >= 3 ? 'text-orange-800' : 'text-stone-400' }, '3. Review & Submit')
          ),

          step === 1 && React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold mb-1' }, 'Store / Boutique Name:'),
              React.createElement('input', {
                type: 'text',
                required: true,
                value: shopName,
                onChange: (e) => setShopName(e.target.value),
                placeholder: 'e.g. Maharani Silks & Boutiques',
                className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
              })
            ),
            React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'Owner / Manager Name:'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  value: ownerName,
                  onChange: (e) => setOwnerName(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'Primary Garment Category:'),
                React.createElement('select', {
                  value: category,
                  onChange: (e) => setCategory(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
                },
                  React.createElement('option', null, 'Sarees & Handlooms'),
                  React.createElement('option', null, 'Kurtas & Anarkalis'),
                  React.createElement('option', null, 'Lehengas & Bridal'),
                  React.createElement('option', null, 'Menswear & Bandhgalas'),
                  React.createElement('option', null, 'Indo-Western & Co-ords')
                )
              )
            ),
            React.createElement('div', { className: 'flex justify-end' },
              React.createElement('button', {
                type: 'button',
                onClick: () => { if (shopName && ownerName) setStep(2); },
                className: 'px-6 py-2.5 bg-stone-900 text-white rounded-xl font-bold'
              }, 'Next: Address & Timings →')
            )
          ),

          step === 2 && React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'City:'),
                React.createElement('input', {
                  type: 'text',
                  value: city,
                  onChange: (e) => setCity(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'Neighborhood / Market Area:'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  value: area,
                  onChange: (e) => setArea(e.target.value),
                  placeholder: 'e.g. Johari Bazar, C-Scheme',
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
                })
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold mb-1' }, 'Complete Shop Address:'),
              React.createElement('textarea', {
                rows: 2,
                required: true,
                value: address,
                onChange: (e) => setAddress(e.target.value),
                placeholder: 'Shop number, lane, landmark...',
                className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
              })
            ),
            React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'Mobile Phone:'),
                React.createElement('input', {
                  type: 'tel',
                  required: true,
                  value: phone,
                  onChange: (e) => setPhone(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block font-bold mb-1' }, 'Operating Hours:'),
                React.createElement('input', {
                  type: 'text',
                  value: openHours,
                  onChange: (e) => setOpenHours(e.target.value),
                  className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
                })
              )
            ),
            React.createElement('div', { className: 'flex justify-between' },
              React.createElement('button', {
                type: 'button',
                onClick: () => setStep(1),
                className: 'px-4 py-2 border rounded-xl font-bold'
              }, '← Back'),
              React.createElement('button', {
                type: 'button',
                onClick: () => { if (address && phone) setStep(3); },
                className: 'px-6 py-2.5 bg-stone-900 text-white rounded-xl font-bold'
              }, 'Next: Final Review →')
            )
          ),

          step === 3 && React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', { className: 'bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2' },
              React.createElement('h4', { className: 'font-bold text-stone-900' }, 'Review Registration Details:'),
              React.createElement('p', null, `Store: ${shopName} (${category})`),
              React.createElement('p', null, `Owner: ${ownerName} · Phone: ${phone}`),
              React.createElement('p', null, `Address: ${address}, ${area}, ${city}`)
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block font-bold mb-1' }, 'Brief Store Heritage / Bio:'),
              React.createElement('textarea', {
                rows: 2,
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: 'Tell local customers about your fabric specialties, weavers, or tailoring amenities...',
                className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl'
              })
            ),
            React.createElement('div', { className: 'flex justify-between pt-2' },
              React.createElement('button', {
                type: 'button',
                onClick: () => setStep(2),
                className: 'px-4 py-2 border rounded-xl font-bold'
              }, '← Back'),
              React.createElement('button', {
                type: 'submit',
                className: 'px-6 py-2.5 bg-orange-800 hover:bg-orange-900 text-white rounded-xl font-bold shadow'
              }, 'Submit Application')
            )
          )
        )
      )
    );
  };

  // 2. FAQs Page with Accordion
  window.FaqsPage = function() {
    const faqs = [
      {
        q: 'How does reserving for "In-Store Pickup" work?',
        a: 'When you find a garment you love, click "Try Offline at Shop". You select your size and preferred pickup date. A reservation code is generated, and the local shopkeeper keeps that exact piece aside at the counter for 24 hours. You can walk in, try it in their trial room, and decide to buy with no obligation.'
      },
      {
        q: 'Are the prices on VASTRA the same as physical shop prices?',
        a: 'Yes, 100%! VASTRA guarantees exact physical store pricing with zero markup. You also get access to exclusive online promo coupons like VASTRA100.'
      },
      {
        q: 'How fast is Same-Day City Delivery?',
        a: 'Since our partner clothing shops are located right in your city, express orders placed before 4:00 PM are delivered within 4 hours by local riders.'
      },
      {
        q: 'Can I get free alterations at the local boutique?',
        a: 'Yes! Almost all our verified boutiques (like Sharma Clothing Store and Royal Fashion) have master tailors on premises to provide complimentary sleeve, waist, and length alterations.'
      },
      {
        q: 'How do local shop owners join VASTRA?',
        a: 'Local retailers can click "Become a Seller" on the top bar, enter their shop address and categories. Our city team verifies the physical shop and activates their digital storefront within 24 hours.'
      }
    ];

    const [openIdx, setOpenIdx] = React.useState(0);

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-12 text-xs' },
      React.createElement('div', { className: 'max-w-3xl mx-auto px-4 space-y-8' },
        React.createElement('div', { className: 'text-center space-y-2' },
          React.createElement('h1', { className: 'font-serif text-3xl font-bold text-stone-900' }, 'Frequently Asked Questions'),
          React.createElement('p', { className: 'text-stone-500' }, 'Everything you need to know about shopping online & offline with local boutiques.')
        ),
        React.createElement('div', { className: 'space-y-3' },
          faqs.map((f, idx) =>
            React.createElement('div', { key: f.q, className: 'bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm' },
              React.createElement('button', {
                onClick: () => setOpenIdx(openIdx === idx ? -1 : idx),
                className: 'w-full p-4 text-left font-bold text-stone-900 flex justify-between items-center text-sm'
              },
                React.createElement('span', null, f.q),
                React.createElement(Icon, { name: openIdx === idx ? 'chevronDown' : 'chevronRight', className: 'w-4 h-4 text-stone-400 shrink-0' })
              ),
              openIdx === idx && React.createElement('div', { className: 'px-4 pb-4 text-stone-600 leading-relaxed' },
                f.a
              )
            )
          )
        )
      )
    );
  };

  // 3. About Us Page
  window.AboutUsPage = function() {
    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-12 text-xs' },
      React.createElement('div', { className: 'max-w-4xl mx-auto px-4 space-y-8' },
        React.createElement('div', { className: 'text-center space-y-3' },
          React.createElement('span', { className: 'text-[11px] font-bold text-orange-800 uppercase tracking-widest' }, 'Our Story & Purpose'),
          React.createElement('h1', { className: 'font-serif text-4xl font-bold text-stone-900' }, 'Har Local Dukaan, Ab Online.'),
          React.createElement('p', { className: 'text-stone-600 max-w-2xl mx-auto text-sm leading-relaxed' },
            'India’s greatest fashion treasures don’t sit in mega warehouses—they reside in the vibrant alleys of Johari Bazar, Lajpat Nagar, Linking Road, and Commercial Street.'
          )
        ),
        React.createElement('div', { className: 'bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-stone-700 leading-relaxed text-sm' },
          React.createElement('p', null,
            'For generations, local family-run clothing shops and boutiques have built trust through authentic fabrics, personal warmth, and fair pricing. Yet, modern shoppers often struggled to know what was hanging on their neighborhood racks without physically walking from store to store.'
          ),
          React.createElement('p', null,
            'VASTRA was born to bridge this divide. We empower every local garment retailer with a world-class digital storefront while preserving the irreplaceable touch-and-feel of physical trial rooms.'
          )
        )
      )
    );
  };

  // 4. Contact Us Page
  window.ContactUsPage = function() {
    const [submitted, setSubmitted] = React.useState(false);

    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-12 text-xs' },
      React.createElement('div', { className: 'max-w-3xl mx-auto px-4 space-y-8' },
        React.createElement('div', { className: 'text-center space-y-2' },
          React.createElement('h1', { className: 'font-serif text-3xl font-bold text-stone-900' }, 'Contact VASTRA Local Care'),
          React.createElement('p', { className: 'text-stone-500' }, 'Questions about an order, store pickup, or registering your shop? We are here to help.')
        ),
        React.createElement('div', { className: 'bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6' },
          submitted ? React.createElement('div', { className: 'text-center py-8 space-y-2' },
            React.createElement('div', { className: 'w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto' },
              React.createElement(Icon, { name: 'check', className: 'w-6 h-6' })
            ),
            React.createElement('h3', { className: 'font-serif text-lg font-bold text-stone-900' }, 'Message Sent Successfully!'),
            React.createElement('p', { className: 'text-stone-500' }, 'Our city support team will reply within 2 hours.')
          ) : React.createElement('form', {
            onSubmit: (e) => { e.preventDefault(); setSubmitted(true); },
            className: 'space-y-4'
          },
            React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
              React.createElement('input', { type: 'text', placeholder: 'Your Name', required: true, className: 'p-2.5 bg-stone-50 border border-stone-300 rounded-xl' }),
              React.createElement('input', { type: 'tel', placeholder: 'Mobile Phone', required: true, className: 'p-2.5 bg-stone-50 border border-stone-300 rounded-xl' })
            ),
            React.createElement('input', { type: 'email', placeholder: 'Email Address', required: true, className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl' }),
            React.createElement('textarea', { rows: 4, placeholder: 'How can we help you?', required: true, className: 'w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl' }),
            React.createElement('button', { type: 'submit', className: 'px-6 py-3 bg-stone-900 text-white font-bold rounded-xl' }, 'Send Message')
          )
        )
      )
    );
  };

  // 5. Terms & Privacy
  window.TermsPage = function() {
    return React.createElement('div', { className: 'min-h-screen bg-[#FAF7F2] py-12 text-xs' },
      React.createElement('div', { className: 'max-w-4xl mx-auto px-4 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-stone-700 leading-relaxed text-sm' },
        React.createElement('h1', { className: 'font-serif text-3xl font-bold text-stone-900' }, 'Terms of Service & In-Store Policies'),
        React.createElement('p', null,
          '1. In-Store Pickup Reservations: Reservations hold garments at physical partner counters for 24 hours. No financial obligation is created upon reservation.'
        ),
        React.createElement('p', null,
          '2. Local Delivery & Returns: 7-day exchange is honored either by visiting the physical boutique or scheduling a doorstep courier exchange.'
        ),
        React.createElement('p', null,
          '3. Authenticity Guarantee: All registered shops are physically verified by VASTRA local representatives.'
        )
      )
    );
  };
})();
