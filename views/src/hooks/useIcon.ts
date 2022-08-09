import React from 'react';

import { ICON_ELEMENT_ID } from '~/utils/constants';

import iconSvg from '~/assets/images/icons.svg?raw';

export default function useIcon() {
  React.useEffect(() => {
    let div = document.querySelector(`#${ICON_ELEMENT_ID}`);

    if (div) {
      return;
    }

    div = document.createElement('div');
    div.setAttribute('id', ICON_ELEMENT_ID);
    div.innerHTML = iconSvg;
    const svg = div.querySelector('svg');
    if (svg) {
      svg.style.position = 'absolute';
      svg.style.width = '0';
      svg.style.height = '0';
      svg.style.overflow = 'hidden';
      svg.style.pointerEvents = 'none';
      svg.setAttribute('aria-hidden', 'true');
    }

    document.body.insertAdjacentElement('afterbegin', div);
  });
}
