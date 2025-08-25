import { ComponentType } from 'react';

declare module '*.tsx' {
  const Component: ComponentType<any>;
  export default Component;
}

declare module '*.ts' {
  const value: any;
  export default value;
}
