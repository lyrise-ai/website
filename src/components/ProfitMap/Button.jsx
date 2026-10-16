import React, { useState } from 'react'
import styles from './styles.module.css'

// Port of the LyRise design-system Button (components/core/Button.jsx),
// with the DS tokens resolved to their values. Renders an <a> when given
// an href so CTAs stay real links.

const EASE = 'cubic-bezier(.22,.61,.36,1)'
const TRANSITION = `background 200ms ${EASE}, color 200ms ${EASE}, border-color 200ms ${EASE}, box-shadow 200ms ${EASE}, transform 120ms ${EASE}`

const SIZES = {
  sm: { padding: '8px 16px', fontSize: 14, gap: '6px' },
  md: { padding: '13px 26px', fontSize: 16, gap: '8px' },
  lg: { padding: '17px 34px', fontSize: 18, gap: '10px' },
}

const VARIANTS = {
  primary: {
    background: '#6666ff',
    color: '#ffffff',
    border: '1px solid #6666ff',
    boxShadow: '0 12px 32px rgba(102,102,255,.28)',
  },
  secondary: {
    background: 'transparent',
    color: '#6666ff',
    border: '1px solid #6666ff',
  },
}

const HOVERS = {
  primary: { background: '#4200ff', borderColor: '#4200ff' },
  secondary: { background: '#f0f0ff' },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  href,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false)
  const [press, setPress] = useState(false)
  const Tag = href ? 'a' : 'button'

  return (
    <Tag
      href={href}
      type={href ? undefined : 'button'}
      className={styles.button}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false)
        setPress(false)
      }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        ...SIZES[size],
        fontFamily: 'inherit',
        fontWeight: 600,
        lineHeight: 1,
        borderRadius: 999,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: TRANSITION,
        letterSpacing: '-.01em',
        textDecoration: 'none',
        ...VARIANTS[variant],
        ...(hover ? HOVERS[variant] : null),
        transform: press ? 'scale(.97)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
