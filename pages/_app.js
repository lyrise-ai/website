/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/style-prop-object */
/* eslint-disable react/self-closing-comp */
/* eslint-disable jsx-a11y/iframe-has-title */
import * as React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Script from 'next/script'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import TagManager from 'react-gtm-module'
// import ReactGA from 'react-ga'
import theme from '../src/theme'
import createEmotionCache from '../src/utilities/createEmotionCache'
import '../styles/global.css'
import { initAmplitude } from '../src/utilities/amplitude'
import useScript from '../src/utilities/useScript'
import LenisProvider from '../src/components/LenisProvider'

import { SessionProvider } from 'next-auth/react'
import useSectionsContent from '../src/hooks/useSectionsContent'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props) {
  const { getMetadata } = useSectionsContent()
  const { title, description, keywords } = getMetadata()
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props

  useScript(
    null,
    true,
    // eslint-disable-next-line sonarjs/no-duplicate-string
    'text/javascript',
    process.env.NEXT_PUBLIC_ENV === 'production'
      ? `_linkedin_partner_id = "4006001";window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l) {if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s = document.getElementsByTagName("script")[0];var b = document.createElement("script");b.type = "text/javascript";b.async = true;b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b, s);})(window.lintrk);`
      : '',
  )

  useScript(
    null,
    true,
    'text/javascript',
    process.env.NEXT_PUBLIC_ENV === 'production'
      ? ` window._mfq = window._mfq || [];
    (function() {
      var mf = document.createElement("script");
      mf.type = "text/javascript"; mf.defer = true;
      mf.src = "//cdn.mouseflow.com/projects/c6bafb03-8327-4bb0-b6f2-4d7fe7b06450.js";
      document.getElementsByTagName("head")[0].appendChild(mf);
    })();`
      : '',
  )

  useScript(
    null,
    true,
    'text/javascript',
    process.env.NEXT_PUBLIC_ENV === 'production'
      ? `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
       fbq('init', '3278159452308220');
      fbq('track', 'PageView');`
      : '',
  )
  useScript(
    null,
    true,
    'text/javascript',
    process.env.NEXT_PUBLIC_ENV === 'production'
      ? ` (function () {
    var zi = document.createElement('script');
    zi.referrerPolicy = 'unsafe-url';
    zi.src = 'https://ws.zoominfo.com/pixel/6342a65c13a47623635c4f40';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(zi, s);
  })();`
      : '',
  )

  if (
    process.env.NEXT_PUBLIC_ENV === 'production' &&
    typeof window !== 'undefined'
  ) {
    // ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID)
    TagManager.initialize({
      gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    })
  }

  if (
    process.env.NEXT_PUBLIC_ENV === 'production' &&
    typeof window !== 'undefined'
  ) {
    initAmplitude()
  }

  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <Script id="mf-script-loader">
          var mouseflowPath = window.location.host + window.location.pathname;
        </Script>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GTM-MF93SZM"
        />

        {/* Google Ads Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-10840230589"
        />
        <Script type="text/javascript" id="google-ads-script">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-10840230589');
          `}
        </Script>

        {/* <script type="text/javascript">
          window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
          heap.load("3331170087");
        </script> */}

        <Script type="text/javascript" id="heap-script-loader">
          {`
            window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
            heap.load("3331170087");
            // heap.identify('unique_identifier'); // use this to enable user identities
          `}
        </Script>

        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link rel="icon" href="/images/LogoIcon.ico" />
          <meta name="theme-color" content="#6666ff" />
          <title>
            {title || 'LyRise AI: The Platform For Companies To 3X Profits'}
          </title>
          <meta
            name="description"
            content={`${description ||
              'Helping you Adopt AI, by either developing your AI Solutions or Hiring The Top AI Developers for you!'
              }`}
          />
          <meta
            property="og:title"
            content={`${title || 'LyRise AI: The Platform For Companies To 3X Profits'
              }`}
          />
          <meta
            property="og:description"
            content={`${description || 'LyRise AI: The Platform For Companies To 3X Profits'
              }`}
          />
          <meta
            property="og:image"
            content="https://i.ibb.co/VYtV50zn/lyrise-logo.jpg"
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://lyrise.ai/" />
          <link
            rel="apple-touch-icon"
            href="https://i.ibb.co/VYtV50zn/lyrise-logo.jpg"
          />
          <link rel="manifest" href="manifest.json" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-MF93SZM"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          <noscript>
            <img
              src="https://ws.zoominfo.com/pixel/6342a65c13a47623635c4f40"
              width="1"
              height="1"
              style={{ display: 'none' }}
              alt="websights"
            />
          </noscript>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
}

MyApp.defaultProps = {
  emotionCache: clientSideEmotionCache,
}
