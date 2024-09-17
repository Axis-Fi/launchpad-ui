import type { PropsWithChildren } from "react";
import { Routes, Route } from "react-router-dom";
import { EditProfileDialog } from "pages/points/edit-profile-dialog";
import { LinkWalletDialog } from "pages/points/link-wallet-dialog";

export function DialogProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Routes>
        <Route path="/points/link-wallet" element={<LinkWalletDialog />} />
        <Route path="/profile/link-wallet" element={<LinkWalletDialog />} />
        <Route path="/profile/edit" element={<EditProfileDialog />} />
        <Route path="/points/edit" element={<EditProfileDialog />} />
      </Routes>
    </>
  );
}
