import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ShareIcon } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  Text,
  DialogFooter,
  DialogHeader,
  Input,
  FormField,
  FormItemWrapper,
  Form,
  Avatar,
  FormItem,
  FormLabel,
} from "@/components";
import {
  type ProfileForm,
  schema,
  useProfile,
} from "modules/points/hooks/use-profile";

export function RegisterProfileDialog() {
  const profile = useProfile();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  const avatarRef = useRef<HTMLInputElement>(null);

  const handleUploadAvatarPressed = (e: React.MouseEvent) => {
    e.preventDefault();
    avatarRef.current?.click();
  };

  const handleAvatarUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (data: ProfileForm) => {
    const isAvailable = await profile.isUsernameAvailable(data.username);
    if (!isAvailable) {
      return console.log("Username is not available"); // TODO
    }
    return profile.register(data);
  };

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
            Create profile
          </Text>
        </DialogHeader>
        <Form {...form}>
          <form
            className="gap-lg grid py-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="gap-x-md flex items-end">
              <Avatar
                src={avatarPreview ?? "/placeholder-img.jpg"}
                alt="User profile image"
                className="h-[88px] w-[88px] rounded-none"
              />
              <FormField
                name="avatar"
                render={() => {
                  return (
                    <FormItemWrapper>
                      <Input
                        type="file"
                        className="hidden"
                        onChange={handleAvatarUploaded}
                        accept="image/*"
                        ref={avatarRef}
                      />
                      <Button
                        className="gap-x-sm w-full"
                        size="md"
                        variant="secondary"
                        onClick={handleUploadAvatarPressed}
                      >
                        Upload avatar
                        <ShareIcon />
                      </Button>
                    </FormItemWrapper>
                  );
                }}
              />
            </div>

            <FormField
              name="username"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1">
                  <FormLabel>
                    <Text color="secondary" mono uppercase size="sm" spaced>
                      Username
                    </Text>
                  </FormLabel>
                  <Input {...field} placeholder="Enter username" type="text" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                className="w-full"
                size="md"
                onClick={form.handleSubmit(handleSubmit)}
              >
                Save profile
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
