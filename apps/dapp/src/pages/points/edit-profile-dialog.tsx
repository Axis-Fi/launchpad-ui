import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, Text, DialogHeader } from "@/components";
import { EditProfile } from "modules/points/edit-profile";

export function EditProfileDialog() {
  const navigate = useNavigate();

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)} externalDialog>
      <DialogContent className="bg-surface sm:max-w-[448px]">
        <DialogHeader className="items-start">
          <Text
            mono
            size="sm"
            uppercase
            className="leading-none tracking-[0.1em]"
          >
            Edit profile
          </Text>
        </DialogHeader>

        <EditProfile />
      </DialogContent>
    </Dialog>
  );
}
