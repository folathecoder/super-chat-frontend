import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return <LoaderContainer className="loader" />;
};

const LoaderContainer = styled.div`
  height: 10px;
  aspect-ratio: 5;
  --_g: no-repeat
    radial-gradient(farthest-side, var(--accent-tertiary) 94%, #0000);
  background: var(--_g), var(--_g), var(--_g), var(--_g);
  background-size: 20% 100%;
  animation: l40-1 0.75s infinite alternate, l40-2 1.5s infinite alternate;

  @keyframes l40-1 {
    0%,
    10% {
      background-position: 0 0, 0 0, 0 0, 0 0;
    }
    33% {
      background-position: 0 0, calc(100% / 3) 0, calc(100% / 3) 0,
        calc(100% / 3) 0;
    }
    66% {
      background-position: 0 0, calc(100% / 3) 0, calc(2 * 100% / 3) 0,
        calc(2 * 100% / 3) 0;
    }
    90%,
    100% {
      background-position: 0 0, calc(100% / 3) 0, calc(2 * 100% / 3) 0, 100% 0;
    }
  }
  @keyframes l40-2 {
    0%,
    49.99% {
      transform: scale(1);
    }
    50%,
    100% {
      transform: scale(-1);
    }
  }
`;

export default Loader;
