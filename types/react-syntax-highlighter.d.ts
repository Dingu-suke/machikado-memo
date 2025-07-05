declare module "react-syntax-highlighter" {
  import { ComponentType } from 'react';
  
  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    PreTag?: string | ComponentType<any>;
    children: string;
    [key: string]: any;
  }
  
  export const Prism: ComponentType<SyntaxHighlighterProps>;
  export default ComponentType<SyntaxHighlighterProps>;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism/tomorrow" {
  const style: { [key: string]: React.CSSProperties };
  export default style;
}