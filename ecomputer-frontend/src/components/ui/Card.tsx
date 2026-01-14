 
import React from 'react';

 
export interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  className = '',
  children,
  onClick,
}) => {
  const baseClasses = 'bg-[var(--card-bg)] rounded-lg shadow-md overflow-hidden border border-[var(--border-color)]';
  const hoverClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-[var(--accent-color)]' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

 
export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className = '',
}) => {
  const classes = `w-full h-48 object-cover ${className}`;
  const [imgSrc, setImgSrc] = React.useState(src);
  const [imgError, setImgError] = React.useState(false);
 
  const handleError = () => {
    if (!imgError) {
 
      setImgSrc('/file.svg');
      setImgError(true);
    }
  };
  
  return (
    <div className="relative">
      <img 
        src={imgSrc} 
        alt={alt} 
        className={classes} 
        onError={handleError}
      />
    </div>
  );
};

 
export interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className = '',
  children,
}) => {
  const classes = `p-4 ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

 
export interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  className = '',
  children,
}) => {
  const classes = `text-lg font-semibold mb-2 text-[var(--text-primary)] ${className}`;
  
  return (
    <h3 className={classes}>
      {children}
    </h3>
  );
};

 
export interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  className = '',
  children,
}) => {
  const classes = `text-[var(--text-secondary)] ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

 
export interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className = '',
  children,
}) => {
  const classes = `p-4 border-t border-[var(--border-color)] ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};
