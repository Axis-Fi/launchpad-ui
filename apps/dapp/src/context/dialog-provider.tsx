import type { PropsWithChildren } from "react";
import { Routes, Route } from "react-router-dom";
import { EditProfileDialog } from "pages/points/edit-profile-dialog";
import { LinkWalletDialog } from "pages/points/link-wallet-dialog";
import { ReferralLinkDialog } from "modules/referral/referral-link-dialog";

export function DialogProvider({
  children,
  disabled,
}: PropsWithChildren & { disabled?: boolean }) {
  if (disabled) return children;

  return (
    <>
      {children}
      <Routes>
        <Route path="/points/link-wallet" element={<LinkWalletDialog />} />
        <Route path="/profile/link-wallet" element={<LinkWalletDialog />} />
        <Route path="/profile/edit" element={<EditProfileDialog />} />
        <Route path="/points/edit" element={<EditProfileDialog />} />
        <Route path="/profile/refer" element={<ReferralLinkDialog />} />
        <Route path="/points/refer" element={<ReferralLinkDialog />} />
      </Routes>
    </>
  );
}
