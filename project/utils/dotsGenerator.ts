export const useDots = () => {
    const calculateDots = (
      containerWidth: number, 
      labelWidth: number, 
      valueWidth: number
    ) => {
      const SAFE_PADDING = 32;
      const DOT_WIDTH = 8;
      const maxDots = Math.floor(
        (containerWidth - labelWidth - valueWidth - SAFE_PADDING) / DOT_WIDTH
      );
      
      return maxDots > 3 ? '.'.repeat(maxDots) : '...';
    };
  
    return { calculateDots };
  };