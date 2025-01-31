import React from 'react';
import { Card as CardStyles } from './styles';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardComposition {
  Header: React.FC<CardProps>;
  Body: React.FC<CardProps>;
  Footer: React.FC<CardProps>;
}

export const Card: React.FC<CardProps> & CardComposition = ({ children, className }) => {
  return (
    <div className={clsx(CardStyles.container, className)}>
      {children}
    </div>
  );
};

Card.Header = function CardHeader({ children, className }) {
  return (
    <div className={clsx(CardStyles.header, className)}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className }) {
  return (
    <div className={clsx(CardStyles.body, className)}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className }) {
  return (
    <div className={clsx(CardStyles.footer, className)}>
      {children}
    </div>
  );
}; 