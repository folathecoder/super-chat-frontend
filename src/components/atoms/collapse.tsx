import React from 'react';
import type { Variants } from 'motion/react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CollapseProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const collapseVariant: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2 },
    },
  },
};

const Collapse = ({ children, isOpen }: CollapseProps) => {
  return (
    <CollapseContainer
      initial={true}
      animate={isOpen ? 'open' : 'closed'}
      variants={collapseVariant}
    >
      {children}
    </CollapseContainer>
  );
};

const CollapseContainer = styled(motion.div)`
  overflow: hidden;
`;

export default Collapse;
