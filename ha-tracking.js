/* Safe in-memory store for sandboxed environments */
var _safeStore = {};
var _safeStorage = { getItem: function(k) { return _safeStore[k] || null; }, setItem: function(k,v) { _safeStore[k] = v; }, removeItem: function(k) { delete _safeStore[k]; } };
/* === Hotel Accelerator — Tracking & Analytics Layer === */
/* Config-driven: reads IDs from window.__HA_CONFIG */
/* global fbq */

var _HA_GA4_ID = (window.__HA_CONFIG && window.__HA_CONFIG.ga4_id) || '';
var _HA_META_PIXEL_ID = (window.__HA_CONFIG && window.__HA_CONFIG.meta_pixel_id) || '';
var _HA_GTM_SERVER_URL = (window.__HA_CONFIG && window.__HA_CONFIG.gtm_server_url) || '';
var _HA_DISCOUNT_CODE = (window.__HA_CONFIG && window.__HA_CONFIG.discount_code) || 'WELCOME10';

/* ------------------------------------------------------------------ */
/*  Consent Helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Check if marketing consent (Meta, GA4, Klaviyo) is granted.
 * consent.js must be loaded before tracking.js.
 */
function shHasMarketingConsent() {
  return !!(window.__consent && window.__consent.marketing);
}

/**
 * Safe fbq wrapper — only fires if marketing consent is granted.
 */
function shFbq() {
  if (shHasMarketingConsent() && typeof fbq === 'function') {
    fbq.apply(null, arguments);
  }
}

/**
 * Safe gtag wrapper — only fires if marketing consent is granted.
 */
function shGtag() {
  if (shHasMarketingConsent() && typeof gtag === 'function') {
    gtag.apply(null, arguments);
  }
}

/* ------------------------------------------------------------------ */
/*  0. Persistent Visitor Identity (365-day cookie)                    */
/* ------------------------------------------------------------------ */

function getOrCreateShUid() {
  var clientUid = document.cookie.split('; ').find(function(c) { return c.startsWith('_sh_uid='); });
  if (clientUid) return clientUid.split('=')[1];
  var newUid = crypto.randomUUID();
  document.cookie = '_sh_uid=' + newUid + '; path=/; max-age=' + (365*24*60*60) + '; SameSite=Lax; Secure';
  return newUid;
}
var shUid = getOrCreateShUid();

/* ------------------------------------------------------------------ */
/*  1. UTM Parameter Capture & First-Party Cookies                     */
/* ------------------------------------------------------------------ */

function shGetCookie(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function shSetCookie(name, value, days) {
  var d = new Date();
  d.setTime(d.getTime() + (days || 30) * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + encodeURIComponent(value) +
    ';expires=' + d.toUTCString() +
    ';path=/;SameSite=Lax';
}

function shCaptureUTM() {
  var params = new URLSearchParams(window.location.search);
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var clickIds = ['gclid', 'fbclid', 'gbraid', 'wbraid', 'ttclid', 'msclkid'];
  var hasNewUTM = false;
  var hasClickId = false;

  utmKeys.forEach(function(key) {
    if (params.get(key)) hasNewUTM = true;
  });
  clickIds.forEach(function(key) {
    if (params.get(key)) hasClickId = true;
  });

  if (!hasNewUTM && !hasClickId) return;

  clickIds.forEach(function(key) {
    var val = params.get(key);
    if (val) {
      shSetCookie('sh_' + key, val, 90);
    }
  });

  var fbclid = params.get('fbclid') || null;
  var gclid = params.get('gclid') || null;
  if (fbclid) document.cookie = '_sh_fbclid=' + fbclid + '; path=/; max-age=' + (7*24*60*60) + '; SameSite=Lax; Secure';
  if (gclid) document.cookie = '_sh_gclid=' + gclid + '; path=/; max-age=' + (7*24*60*60) + '; SameSite=Lax; Secure';

  if (!hasNewUTM && hasClickId) {
    if (fbclid) {
      shSetCookie('sh_utm_source', 'fb', 30);
      shSetCookie('sh_utm_medium', 'paid', 30);
    } else if (gclid || params.get('gbraid') || params.get('wbraid')) {
      shSetCookie('sh_utm_source', 'google', 30);
      shSetCookie('sh_utm_medium', 'cpc', 30);
    } else if (params.get('ttclid')) {
      shSetCookie('sh_utm_source', 'tiktok', 30);
      shSetCookie('sh_utm_medium', 'paid', 30);
    } else if (params.get('msclkid')) {
      shSetCookie('sh_utm_source', 'bing', 30);
      shSetCookie('sh_utm_medium', 'cpc', 30);
    }
  }

  var existingSource = shGetCookie('sh_utm_source');
  if (!existingSource || hasClickId) {
    utmKeys.forEach(function(key) {
      var val = params.get(key);
      if (val) {
        shSetCookie('sh_' + key, val, 30);
      }
    });

    shSetCookie('sh_landing_page', window.location.pathname, 30);
    shSetCookie('sh_referrer', document.referrer || '(direct)', 30);
  }

  var utmData = {};
  utmKeys.concat(clickIds).forEach(function(key) {
    var val = params.get(key) || shGetCookie('sh_' + key);
    if (val) utmData[key] = val;
  });

  if (Object.keys(utmData).length > 0) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'utm_captured', utm_data: utmData });
  }
}

function shGetAttribution() {
  return {
    utm_source:   shGetCookie('sh_utm_source')   || '',
    utm_medium:   shGetCookie('sh_utm_medium')    || '',
    utm_campaign: shGetCookie('sh_utm_campaign')  || '',
    utm_content:  shGetCookie('sh_utm_content')   || '',
    utm_term:     shGetCookie('sh_utm_term')      || '',
    gclid:        shGetCookie('sh_gclid')         || '',
    fbclid:       shGetCookie('sh_fbclid')        || '',
    gbraid:       shGetCookie('sh_gbraid')        || '',
    wbraid:       shGetCookie('sh_wbraid')        || '',
    ttclid:       shGetCookie('sh_ttclid')        || '',
    msclkid:      shGetCookie('sh_msclkid')       || '',
    landing_page: shGetCookie('sh_landing_page')  || '',
    referrer:     shGetCookie('sh_referrer')       || ''
  };
}


/* ------------------------------------------------------------------ */
/*  2. GA4 (gtag.js) — Global Site Tag (gated on marketing consent)    */
/* ------------------------------------------------------------------ */

window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}

if (shHasMarketingConsent() && _HA_GA4_ID) {
  gtag('js', new Date());
  var ga4Config = {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure'
  };
  if (_HA_GTM_SERVER_URL) {
    ga4Config.server_container_url = _HA_GTM_SERVER_URL;
  }
  gtag('config', _HA_GA4_ID, ga4Config);

  // Load gtag.js asynchronously
  (function() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + _HA_GA4_ID;
    document.head.appendChild(s);
  })();
}


/* ------------------------------------------------------------------ */
/*  3. Meta Pixel (gated on marketing consent)                         */
/* ------------------------------------------------------------------ */

var _shPageViewId = shEventId();

if (shHasMarketingConsent() && _HA_META_PIXEL_ID) {
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', _HA_META_PIXEL_ID);
  fbq('track', 'PageView', {}, { eventID: _shPageViewId });
  gtag('event', 'page_view', { event_id: _shPageViewId });
}


/* ------------------------------------------------------------------ */
/*  4. Event Deduplication & User Data for CAPI                        */
/* ------------------------------------------------------------------ */

function shEventId() {
  return 'sh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

function shGetFbp() {
  return shGetCookie('_fbp') || '';
}

function shGetFbc() {
  return shGetCookie('_fbc') || '';
}


/* ------------------------------------------------------------------ */
/*  5. Meta CAPI Server-Side Forwarding                                */
/* ------------------------------------------------------------------ */

var _SH_CAPI_ENDPOINT = '/api/capi';
var _SH_COLLECT_ENDPOINT = '/api/collect';
var _SH_SESSION_ENDPOINT = '/api/session';
var _SH_TOUCHPOINT_ENDPOINT = '/api/touchpoint';
var _SH_DISCOUNT_ENDPOINT = '/api/discount-capture';

// Klaviyo email click capture: check URL for _kl_email parameter
var _shKlEmail = (function() {
  var params = new URLSearchParams(window.location.search);
  var kl = params.get('_kl_email') || params.get('_kx') || null;
  if (kl) {
    params.delete('_kl_email');
    params.delete('_kx');
    var cleanSearch = params.toString();
    var cleanUrl = window.location.pathname + (cleanSearch ? '?' + cleanSearch : '') + window.location.hash;
    try { history.replaceState(null, '', cleanUrl); } catch(e) {}
  }
  return kl;
})();

function shSendCollect(eventType, extra) {
  var attribution = shGetAttribution();
  var payload = {
    event_type: eventType,
    session_id: shGetSessionId(),
    sh_uid: shUid,
    ga_client_id: shGetGAClientId(),
    url: window.location.href,
    referrer: document.referrer || '',
    utm_source: attribution.utm_source || null,
    utm_medium: attribution.utm_medium || null,
    utm_campaign: attribution.utm_campaign || null,
    utm_content: attribution.utm_content || null,
    utm_term: attribution.utm_term || null,
    fbclid: attribution.fbclid || shGetCookie('_sh_fbclid') || null,
    gclid: attribution.gclid || shGetCookie('_sh_gclid') || null,
    device: shGetDevice(),
    pages_viewed: parseInt(shGetCookie('sh_pages_viewed') || '0', 10) + 1,
    landing_page: attribution.landing_page || window.location.pathname,
    consent_analytics: !!(window.__consent && window.__consent.analytics),
    consent_marketing: !!(window.__consent && window.__consent.marketing)
  };
  if (_shKlEmail && shHasMarketingConsent()) payload._kl_email = _shKlEmail;
  if (extra) {
    for (var key in extra) {
      if (extra.hasOwnProperty(key)) payload[key] = extra[key];
    }
  }
  return fetch(_SH_COLLECT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).then(function(resp) {
    return resp.json();
  }).then(function(data) {
    if (data && data.sh_uid) shUid = data.sh_uid;
    return data;
  });
}

function shSendCAPI(eventName, eventId, userData, customData) {
  if (!shHasMarketingConsent()) return;

  var payload = {
    events: [{
      event_name: eventName,
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      action_source: 'website',
      user_data: {
        email: (userData && userData.email) || '',
        phone: (userData && userData.phone) || '',
        first_name: (userData && userData.first_name) || '',
        last_name: (userData && userData.last_name) || '',
        fbp: shGetFbp(),
        fbc: shGetFbc()
      },
      custom_data: customData || {}
    }]
  };

  fetch(_SH_CAPI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(function(err) {
    console.warn('CAPI proxy error:', err);
  });
}


/* ------------------------------------------------------------------ */
/*  6. Session & Touchpoint Tracking → Supabase                        */
/* ------------------------------------------------------------------ */

function shGetSessionId() {
  var sid = shGetCookie('sh_session_id');
  if (!sid) {
    sid = 'sh_sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    document.cookie = 'sh_session_id=' + encodeURIComponent(sid) + ';path=/;SameSite=Lax';
  }
  return sid;
}

function shGetGAClientId() {
  var ga = shGetCookie('_ga');
  if (ga) {
    var parts = ga.split('.');
    if (parts.length >= 4) return parts[2] + '.' + parts[3];
  }
  return '';
}

function shGetDevice() {
  var w = window.innerWidth || document.documentElement.clientWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function shTrackSession() {
  var pagesViewed = parseInt(shGetCookie('sh_pages_viewed') || '0', 10) + 1;
  document.cookie = 'sh_pages_viewed=' + pagesViewed + ';path=/;SameSite=Lax';

  shSendCollect('page_view').catch(function() {
    var attribution = shGetAttribution();
    fetch(_SH_SESSION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: shGetSessionId(),
        sh_uid: shUid,
        ga_client_id: shGetGAClientId(),
        utm_source: attribution.utm_source || null,
        utm_medium: attribution.utm_medium || null,
        utm_campaign: attribution.utm_campaign || null,
        utm_content: attribution.utm_content || null,
        utm_term: attribution.utm_term || null,
        landing_page: attribution.landing_page || window.location.pathname,
        gclid: attribution.gclid || null,
        fbclid: attribution.fbclid || null,
        device: shGetDevice(),
        pages_viewed: pagesViewed
      }),
      keepalive: true
    }).catch(function(err) {
      console.warn('Session tracking error:', err);
    });
  });
}

function shTrackTouchpoint() {
  var attribution = shGetAttribution();

  if (!attribution.utm_source && !attribution.gclid && !attribution.fbclid) return;

  if (shGetCookie('sh_touchpoint_sent')) return;
  document.cookie = 'sh_touchpoint_sent=1;path=/;SameSite=Lax';

  shSendCollect('session_start').catch(function() {
    fetch(_SH_TOUCHPOINT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: shGetSessionId(),
        sh_uid: shUid,
        source: attribution.utm_source || null,
        medium: attribution.utm_medium || null,
        campaign: attribution.utm_campaign || null,
        landing_page: attribution.landing_page || window.location.pathname,
        converted: false,
        discount_captured: false,
        fbclid: attribution.fbclid || shGetCookie('_sh_fbclid') || null,
        gclid: attribution.gclid || shGetCookie('_sh_gclid') || null
      }),
      keepalive: true
    }).catch(function(err) {
      console.warn('Touchpoint tracking error:', err);
    });
  });
}

function shTrackDiscountCapture(data) {
  shSendCollect('discount_capture', {
    email: data.email,
    first_name: data.firstName || null,
    phone: data.phone || null,
    sms_consent: data.smsConsent || false,
    code: _HA_DISCOUNT_CODE,
    ab_variant: data.abVariant || (function(){try{return _safeStorage.getItem('sh_ab_variant')}catch(e){return null}})() || null
  }).catch(function() {
    var attribution = shGetAttribution();
    fetch(_SH_DISCOUNT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        first_name: data.firstName || null,
        phone: data.phone || null,
        sms_consent: data.smsConsent || false,
        code: _HA_DISCOUNT_CODE,
        utm_source: attribution.utm_source || null,
        utm_campaign: attribution.utm_campaign || null,
        session_id: shGetSessionId(),
        sh_uid: shUid,
        fbclid: shGetCookie('_sh_fbclid') || null,
        gclid: shGetCookie('_sh_gclid') || null,
        ab_variant: data.abVariant || (function(){try{return _safeStorage.getItem('sh_ab_variant')}catch(e){return null}})() || null
      }),
      keepalive: true
    }).catch(function(err) {
      console.warn('Discount capture error:', err);
    });
  });
}


/* ------------------------------------------------------------------ */
/*  7. Conversion Event Helpers                                        */
/* ------------------------------------------------------------------ */

function shTrackInterstitialShown(variant) {
  var abVariant = variant || (function(){try{return _safeStorage.getItem('sh_ab_variant')}catch(e){return null}})() || 'A';
  var eid = shEventId();
  shGtag('event', 'interstitial_shown', {
    event_category: 'engagement',
    event_label: 'mystery_discount',
    ab_variant: abVariant,
    event_id: eid
  });
  shFbq('trackCustom', 'InterstitialShown', { ab_variant: abVariant }, { eventID: eid });
  window.dataLayer.push({ event: 'interstitial_shown', event_id: eid, ab_variant: abVariant });
}

function shTrackMysteryDiscountSubmit(data) {
  var attribution = shGetAttribution();
  var abVariant = data.abVariant || (function(){try{return _safeStorage.getItem('sh_ab_variant')}catch(e){return null}})() || 'A';

  var leadEventId = shEventId();

  shGtag('event', 'generate_lead', {
    event_category: 'conversion',
    event_label: 'mystery_discount',
    currency: 'USD',
    value: 0,
    method: 'mystery_discount_interstitial',
    ab_variant: abVariant,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    event_id: leadEventId
  });

  shFbq('track', 'Lead', {
    content_name: 'Mystery Discount',
    content_category: 'Booking',
    currency: 'USD',
    value: 0,
    ab_variant: abVariant
  }, { eventID: leadEventId });

  shSendCAPI('Lead', leadEventId,
    { email: data.email, phone: data.phone, first_name: data.firstName },
    { content_name: 'Mystery Discount', content_category: 'Booking', currency: 'USD', value: 0, ab_variant: abVariant }
  );

  shTrackDiscountCapture(data);

  window.dataLayer.push({
    event: 'mystery_discount_submitted',
    event_id: leadEventId,
    ab_variant: abVariant,
    user_email: data.email || '',
    user_first_name: data.firstName || '',
    user_phone: data.phone || '',
    fbp: shGetFbp(),
    fbc: shGetFbc(),
    attribution: attribution
  });
}

function shTrackInterstitialSkipped(variant) {
  var abVariant = variant || (function(){try{return _safeStorage.getItem('sh_ab_variant')}catch(e){return null}})() || 'A';
  var eid = shEventId();
  shGtag('event', 'interstitial_skipped', {
    event_category: 'engagement',
    event_label: 'mystery_discount',
    ab_variant: abVariant,
    event_id: eid
  });
  shFbq('trackCustom', 'InterstitialSkipped', { ab_variant: abVariant }, { eventID: eid });
  window.dataLayer.push({ event: 'interstitial_skipped', event_id: eid, ab_variant: abVariant });
}

function shTrackDateSearch(checkIn, checkOut, guests, roomType) {
  var attribution = shGetAttribution();
  var eid = shEventId();

  // Send to collect endpoint for Supabase persistence
  shSendCollect('date_search', {
    check_in_date: checkIn || null,
    check_out_date: checkOut || null,
    guests_count: guests || null,
    room_type: roomType || null
  });

  // Push to dataLayer for GTM/GA4
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'date_search',
    event_id: eid,
    check_in_date: checkIn || '',
    check_out_date: checkOut || '',
    guests_count: guests || '',
    room_type: roomType || '',
    attribution: attribution
  });

  // Fire gtag event
  shGtag('event', 'date_search', {
    event_category: 'engagement',
    event_label: 'booking_search',
    check_in_date: checkIn || '',
    check_out_date: checkOut || '',
    guests_count: guests || '',
    room_type: roomType || '',
    event_id: eid
  });

  // Fire Meta custom event
  shFbq('trackCustom', 'DateSearch', {
    check_in_date: checkIn || '',
    check_out_date: checkOut || '',
    guests_count: guests || '',
    room_type: roomType || ''
  }, { eventID: eid });
}

function shTrackBookingStarted() {
  var attribution = shGetAttribution();
  var checkoutEventId = shEventId();

  shGtag('event', 'begin_checkout', {
    event_category: 'conversion',
    event_label: 'mews_booking',
    currency: 'USD',
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    event_id: checkoutEventId
  });
  shFbq('track', 'InitiateCheckout', {
    content_category: 'Hotel Booking',
    currency: 'USD'
  }, { eventID: checkoutEventId });

  shSendCAPI('InitiateCheckout', checkoutEventId,
    null,
    { content_category: 'Hotel Booking', currency: 'USD' }
  );

  shSendCollect('booking_initiated').catch(function() {});

  window.dataLayer.push({
    event: 'booking_started',
    event_id: checkoutEventId,
    fbp: shGetFbp(),
    fbc: shGetFbc(),
    attribution: attribution
  });
}

function shTrackNewsletterSignup() {
  var eid = shEventId();
  shGtag('event', 'sign_up', {
    event_category: 'engagement',
    event_label: 'newsletter',
    method: 'footer_form',
    event_id: eid
  });

  shFbq('trackCustom', 'NewsletterSignup', {}, { eventID: eid });

  window.dataLayer.push({ event: 'newsletter_signup', event_id: eid });
}

function shTrackContactSubmit(data) {
  var contactEventId = shEventId();

  shGtag('event', 'contact', {
    event_category: 'engagement',
    event_label: 'contact_form',
    event_id: contactEventId
  });
  shFbq('track', 'Contact', {}, { eventID: contactEventId });

  shSendCAPI('Contact', contactEventId,
    { email: data.email, first_name: data.name ? data.name.split(' ')[0] : '' },
    {}
  );

  window.dataLayer.push({
    event: 'contact_form_submitted',
    event_id: contactEventId,
    user_email: data.email || '',
    fbp: shGetFbp(),
    fbc: shGetFbc()
  });
}

function shTrackOutboundClick(linkType, destination) {
  var eid = shEventId();
  shGtag('event', 'click', {
    event_category: 'outbound',
    event_label: linkType,
    link_url: destination,
    event_id: eid
  });

  window.dataLayer.push({
    event: 'outbound_click',
    event_id: eid,
    link_type: linkType,
    link_destination: destination
  });
}


/* ------------------------------------------------------------------ */
/*  8. Initialize on Page Load                                         */
/* ------------------------------------------------------------------ */

// Expose date search tracker for Mews widget integration
window.shTrackDateSearch = shTrackDateSearch;

// Capture UTMs immediately (before DOMContentLoaded)
shCaptureUTM();

// Track session and touchpoint after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    shTrackSession();
    shTrackTouchpoint();
  });
} else {
  shTrackSession();
  shTrackTouchpoint();
}
