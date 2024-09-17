import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, useToast } from "@/components";
import { ProfileForm } from "modules/points/profile-form";
import { useProfile } from "modules/points/hooks/use-profile";
import { PointsHeader } from "modules/points/claim-points-header";

export function EditProfileDialog() {
  const navigate = useNavigate();
  const { updateProfile, profile } = useProfile();
  const { toast } = useToast();

  const handleProfileUpdated = () => {
    navigate(-1);

    toast({
      title: (
        <div className="flex items-center gap-x-2">
          <Check size="16" /> Profile successfully updated
        </div>
      ),
    });
  };

  if (profile == null) return null;

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)} externalDialog>
      <DialogContent className="bg-surface sm:max-w-[384px]">
        <ProfileForm
          profile={profile}
          header={<PointsHeader subtitle="Edit profile" />}
          submitText="Save changes"
          onSubmit={(data) => {
            updateProfile.mutate(data, {
              onSuccess: handleProfileUpdated,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
