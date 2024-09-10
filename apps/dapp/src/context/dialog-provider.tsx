import type { PropsWithChildren } from "react";
import { Routes, Route } from "react-router-dom";
import { EditProfileDialog } from "pages/points/edit-profile-dialog";
import { RegisterProfileDialog } from "pages/points/register-profile-dialog";

export function DialogProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <Routes>
        <Route path="/points/register" element={<RegisterProfileDialog />} />
        <Route path="/profile/edit" element={<EditProfileDialog />} />
        <Route path="/points/edit" element={<EditProfileDialog />} />
      </Routes>
    </>
  );
}
