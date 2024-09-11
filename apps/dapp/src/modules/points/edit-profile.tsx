import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Text,
  Button,
  Input,
  FormField,
  FormItemWrapper,
  Form,
  Avatar,
} from "@/components";
import { useForm } from "react-hook-form";
import { ShareIcon } from "lucide-react";
import {
  type ProfileForm,
  schema,
  useProfile,
} from "modules/points/hooks/use-profile";
import { useAccount } from "wagmi";
import { trimAddress } from "@repo/ui";
import React from "react";

export function EditProfile({
  create,
  onSuccess,
  children,
}: React.PropsWithChildren<{
  create?: boolean;
  onSuccess?: () => void;
}>) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { address } = useAccount();

  const {
    register,
    mutation: profileMutation,
    isUsernameAvailable,
  } = useProfile();

  const refinedSchema = React.useMemo(() => {
    return schema.refine(async (data) => isUsernameAvailable(data.username), {
      path: ["username"],
      message: "Username already taken",
    });
  }, []);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(refinedSchema, { async: true }),
    mode: "onBlur", //TODO: add a debouncer to isUsernameAvailable instead?
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

  const handleSubmit = (data: ProfileForm) => {
    console.log("submit called");
    register(data);
  };

  React.useEffect(() => {
    console.log({ profileMutation });
    if (profileMutation.isSuccess) {
      onSuccess?.();
    }
  });

  return (
    <Form {...form}>
      <form
        className="gap-lg grid py-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="gap-x-md flex items-end">
          <Avatar
            src={avatarPreview ?? "/placeholder-img.png"}
            alt="User profile image"
            className="h-[88px] w-[88px] rounded-none border-transparent"
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
                    className="gap-x-sm w-full "
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
            <FormItemWrapper className="flex flex-col gap-y-1">
              <Input {...field} placeholder="Enter Display Name" type="text" />
            </FormItemWrapper>
          )}
        />
        <Text className="text-foreground-tertiary text-center">
          Connected Wallet <br />
          {trimAddress(address!, 16)}
        </Text>

        {children}

        <Button
          disabled={!form.formState.isValid}
          type="submit"
          className="mt-3 w-full max-w-[320px]"
        >
          {create ? "Save profile and claim your Points" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
