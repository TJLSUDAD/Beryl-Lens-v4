import React from 'react';

export function BerylLogo({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="berylGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(45, 95%, 65%)" />
          <stop offset="25%" stopColor="hsl(45, 95%, 54%)" />
          <stop offset="50%" stopColor="hsl(45, 95%, 48%)" />
          <stop offset="75%" stopColor="hsl(45, 95%, 54%)" />
          <stop offset="100%" stopColor="hsl(45, 95%, 65%)" />
        </linearGradient>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(45, 95%, 65%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(45, 95%, 48%)" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="metallic">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="6"
            specularConstant=".85"
            specularExponent="25"
            lightingColor="#ffffff"
            result="specular"
          >
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular" />
          <feComposite
            in="SourceGraphic"
            in2="specular"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>
      </defs>

      {/* Enhanced Background Glow */}
      <circle cx="20" cy="20" r="18" fill="url(#glowGradient)" filter="blur(8px)">
        <animate
          attributeName="opacity"
          values="0.6;0.4;0.6"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Main Circle with Enhanced Metallic Effect */}
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="url(#berylGradient)"
        filter="url(#metallic)"
      >
        <animate
          attributeName="filter"
          values="url(#metallic);url(#metallic) brightness(1.1);url(#metallic)"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Professional Woman Silhouette with Enhanced Detail */}
      <path
        d="M20 10c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 12c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
        fill="hsl(160, 25%, 5%)"
        fillOpacity="0.95"
      />

      {/* Enhanced Hair Detail */}
      <path
        d="M20 10c-1.4 0-2.6.6-3.5 1.5.9-.6 2.2-1 3.5-1 1.3 0 2.6.4 3.5 1-.9-.9-2.1-1.5-3.5-1.5z"
        fill="hsl(160, 25%, 5%)"
        fillOpacity="0.95"
      />

      {/* Dynamic Circuit Lines with Enhanced Animation */}
      <g stroke="hsl(160, 25%, 5%)" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.9" filter="url(#glow)">
        <path d="M12 20l-2-2m20 2l2-2" strokeDasharray="4 6">
          <animate
            attributeName="strokeDashoffset"
            values="0;20"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M14 24l-2 2m14-2l2 2" strokeDasharray="4 6">
          <animate
            attributeName="strokeDashoffset"
            values="20;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M10 18c0-5.5 4.5-10 10-10" strokeDasharray="3 4">
          <animate
            attributeName="strokeDashoffset"
            values="0;21"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path d="M30 18c0-5.5-4.5-10-10-10" strokeDasharray="3 4">
          <animate
            attributeName="strokeDashoffset"
            values="21;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Subtle Accent Details */}
      <circle cx="20" cy="20" r="15" stroke="url(#berylGradient)" strokeWidth="0.5" strokeOpacity="0.3" />
      <circle cx="20" cy="20" r="14" stroke="url(#berylGradient)" strokeWidth="0.25" strokeOpacity="0.2" />
    </svg>
  );
}