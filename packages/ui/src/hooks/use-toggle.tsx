import React, {
  type ReactNode,
  createContext,
  useState,
  useContext,
} from "react";

type ToggleContextType = {
  isToggled: boolean;
  toggle: () => void;
};

const ToggleContext = createContext<ToggleContextType>({
  isToggled: false,
  toggle: () => {},
});

const ToggleProvider: React.FC<{
  initialIsToggled?: boolean;
  children: ReactNode;
}> = ({ initialIsToggled = false, children }) => {
  const [isToggled, setIsToggled] = useState(initialIsToggled);

  const toggle = () => {
    setIsToggled((prevIsToggled: boolean) => !prevIsToggled);
  };

  return (
    <ToggleContext.Provider value={{ isToggled, toggle }}>
      {children}
    </ToggleContext.Provider>
  );
};

const useToggle = () => {
  return useContext(ToggleContext);
};

export { ToggleProvider, useToggle };
