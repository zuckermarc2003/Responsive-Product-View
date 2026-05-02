import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

export type IconName =
  | 'home' | 'home-outline'
  | 'grid' | 'grid-outline'
  | 'cart' | 'cart-outline'
  | 'heart' | 'heart-outline' | 'heart-dislike-outline'
  | 'person' | 'person-outline'
  | 'search' | 'search-outline'
  | 'star' | 'star-outline' | 'star-half'
  | 'checkmark-circle' | 'checkmark-circle-outline'
  | 'chevron-forward' | 'chevron-back' | 'chevron-down'
  | 'close' | 'add'
  | 'arrow-forward' | 'arrow-back'
  | 'notifications-outline'
  | 'language-outline'
  | 'location-outline'
  | 'time-outline'
  | 'call-outline'
  | 'logo-instagram'
  | 'document-text-outline'
  | 'shield-outline'
  | 'information-circle-outline'
  | 'trash-outline'
  | 'bag-check-outline' | 'bag-outline'
  | 'share-outline'
  | 'filter' | 'filter-outline'
  | 'storefront-outline'
  | 'alert-circle-outline'
  | 'refresh-outline'
  | 'wifi-outline'
  | 'eye-outline' | 'eye-off-outline';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  style?: object;
}

export function AppIcon({ name, size = 24, color = '#000', style }: Props) {
  const s = size;
  const strokeProps = {
    stroke: color,
    strokeWidth: s * 0.083,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  const fillProps = { fill: color };

  const vb = `0 0 24 24`;

  switch (name) {
    // ── HOME ──────────────────────────────────────────
    case 'home':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...fillProps} d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </Svg>
      );
    case 'home-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </Svg>
      );

    // ── GRID ──────────────────────────────────────────
    case 'grid':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...fillProps} d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </Svg>
      );
    case 'grid-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </Svg>
      );

    // ── CART ──────────────────────────────────────────
    case 'cart':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...fillProps} d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </Svg>
      );
    case 'cart-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </Svg>
      );

    // ── HEART ──────────────────────────────────────────
    case 'heart':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...fillProps} d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </Svg>
      );
    case 'heart-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </Svg>
      );
    case 'heart-dislike-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          <Path {...strokeProps} d="M6 6l12 12" />
        </Svg>
      );

    // ── PERSON ──────────────────────────────────────────
    case 'person':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...fillProps} d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 17a6.974 6.974 0 01-4.696-1.81z" />
        </Svg>
      );
    case 'person-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </Svg>
      );

    // ── SEARCH ──────────────────────────────────────────
    case 'search':
    case 'search-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </Svg>
      );

    // ── STAR ──────────────────────────────────────────
    case 'star':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...fillProps} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </Svg>
      );
    case 'star-outline':
    case 'star-half':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </Svg>
      );

    // ── CHECKMARK CIRCLE ────────────────────────────────
    case 'checkmark-circle':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...fillProps} d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        </Svg>
      );
    case 'checkmark-circle-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </Svg>
      );

    // ── CHEVRONS ──────────────────────────────────────
    case 'chevron-forward':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M9 5l7 7-7 7" />
        </Svg>
      );
    case 'chevron-back':
    case 'arrow-back':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M15 19l-7-7 7-7" />
        </Svg>
      );
    case 'chevron-down':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M19 9l-7 7-7-7" />
        </Svg>
      );

    // ── CLOSE / ADD / ARROW ─────────────────────────────
    case 'close':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M6 18L18 6M6 6l12 12" />
        </Svg>
      );
    case 'add':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M12 4v16m8-8H4" />
        </Svg>
      );
    case 'arrow-forward':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </Svg>
      );

    // ── NOTIFICATIONS ─────────────────────────────────
    case 'notifications-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </Svg>
      );

    // ── LANGUAGE / GLOBE ──────────────────────────────
    case 'language-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </Svg>
      );

    // ── LOCATION ──────────────────────────────────────
    case 'location-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <Path {...strokeProps} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </Svg>
      );

    // ── TIME / CLOCK ───────────────────────────────────
    case 'time-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </Svg>
      );

    // ── CALL / PHONE ───────────────────────────────────
    case 'call-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </Svg>
      );

    // ── INSTAGRAM ─────────────────────────────────────
    case 'logo-instagram':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Rect x="2" y="2" width="20" height="20" rx="5" ry="5" {...strokeProps} />
          <Circle cx="12" cy="12" r="4" {...strokeProps} />
          <Circle cx="17.5" cy="6.5" r="1" fill={color} />
        </Svg>
      );

    // ── DOCUMENT ──────────────────────────────────────
    case 'document-text-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </Svg>
      );

    // ── SHIELD ────────────────────────────────────────
    case 'shield-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </Svg>
      );

    // ── INFO CIRCLE ────────────────────────────────────
    case 'information-circle-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </Svg>
      );

    // ── TRASH ─────────────────────────────────────────
    case 'trash-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </Svg>
      );

    // ── BAG ───────────────────────────────────────────
    case 'bag-check-outline':
    case 'bag-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          {name === 'bag-check-outline' && (
            <Path {...strokeProps} d="M9 13l2 2 4-4" />
          )}
        </Svg>
      );

    // ── SHARE ─────────────────────────────────────────
    case 'share-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </Svg>
      );

    // ── FILTER ────────────────────────────────────────
    case 'filter':
    case 'filter-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </Svg>
      );

    // ── STOREFRONT ────────────────────────────────────
    case 'storefront-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <Path {...strokeProps} d="M9 22V12h6v10" />
        </Svg>
      );

    // ── MISC ──────────────────────────────────────────
    case 'alert-circle-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </Svg>
      );
    case 'refresh-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </Svg>
      );
    case 'wifi-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </Svg>
      );
    case 'eye-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <Path {...strokeProps} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </Svg>
      );
    case 'eye-off-outline':
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </Svg>
      );

    // ── REMOVE (minus) ────────────────────────────────
    case 'remove' as IconName:
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M20 12H4" />
        </Svg>
      );

    // ── CHECKMARK ─────────────────────────────────────
    case 'checkmark' as IconName:
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M5 13l4 4L19 7" />
        </Svg>
      );

    // ── CLOSE-CIRCLE ──────────────────────────────────
    case 'close-circle' as IconName:
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </Svg>
      );

    // ── FLASH / LIGHTNING ─────────────────────────────
    case 'flash' as IconName:
    case 'flash-outline' as IconName:
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path
            {...(name === 'flash' ? fillProps : strokeProps)}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </Svg>
      );

    // ── SHIELD-CHECKMARK ──────────────────────────────
    case 'shield-checkmark-outline' as IconName:
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </Svg>
      );

    // ── CAR / DELIVERY ────────────────────────────────
    case 'car-outline' as IconName:
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <Path {...strokeProps} d="M13 16H6a2 2 0 01-2-2V6a2 2 0 012-2h5l2 3h4a2 2 0 012 2v3" />
        </Svg>
      );

    // ── OPTIONS / SLIDERS ─────────────────────────────
    case 'options-outline' as IconName:
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Path {...strokeProps} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </Svg>
      );

    default:
      return (
        <Svg width={s} height={s} viewBox={vb} style={style}>
          <Circle cx="12" cy="12" r="10" {...strokeProps} />
        </Svg>
      );
  }
}
