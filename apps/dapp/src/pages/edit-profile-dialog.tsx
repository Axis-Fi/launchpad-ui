import { useRef, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { ShareIcon } from "lucide-react";

const schema = z.object({
  username: z.string().min(3),
  avatar: z.instanceof(File).optional(),
});

type EditProfileForm = z.infer<typeof schema>;

export function EditProfileDialog() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<EditProfileForm>({
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

  const handleSubmit = (data: EditProfileForm) => {
    console.log("Form submitted:", data);
  };

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)} externalDialog>
      <DialogContent className="bg-surface sm:max-w-[448px]">
        <DialogHeader className="items-start">
          <Text
            mono
            size="md"
            uppercase
            className="leading-none tracking-[0.1em]"
          >
            Edit profile
          </Text>
        </DialogHeader>
        <Form {...form}>
          <form
            className="gap-md grid py-4"
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
                <FormItem className="gap-y-xs flex flex-col">
                  <FormLabel>
                    <Text color="secondary" mono uppercase size="md" spaced>
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
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
