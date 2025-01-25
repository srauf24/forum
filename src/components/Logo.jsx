import React from 'react';

function Logo() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="128" fill="#6366F1"/>
      <path d="M156 256C156 238.327 170.327 224 188 224H324C341.673 224 356 238.327 356 256V304C356 321.673 341.673 336 324 336H188C170.327 336 156 321.673 156 304V256Z" fill="white"/>
      <path d="M188 176H324C341.673 176 356 190.327 356 208V208C356 225.673 341.673 240 324 240H188C170.327 240 156 225.673 156 208V208C156 190.327 170.327 176 188 176Z" fill="white" fillOpacity="0.7"/>
      <circle cx="256" cy="280" r="16" fill="#6366F1"/>
      <circle cx="208" cy="280" r="16" fill="#6366F1"/>
      <circle cx="304" cy="280" r="16" fill="#6366F1"/>
    </svg>
  );
}

export default Logo;