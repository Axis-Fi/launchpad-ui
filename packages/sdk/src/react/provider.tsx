import { createContext, type ReactNode } from "react";
import { OriginSdk } from "..";

const OriginSdkContext = createContext<OriginSdk | null>(null);

const OriginSdkProvider: React.FC<{ sdk: OriginSdk; children: ReactNode }> = ({
  sdk,
  children,
}) => (
  <OriginSdkContext.Provider value={sdk}>{children}</OriginSdkContext.Provider>
);

export { OriginSdkContext, OriginSdkProvider };
