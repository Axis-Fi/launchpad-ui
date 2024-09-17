import {
  useRef,
  useState,
  useMemo,
  useEffect,
  type default as React,
} from "react";
import { useForm } from "react-hook-form";
import debounce from "debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  FormField,
  FormItemWrapper,
  Form,
  Avatar,
} from "@/components";
import {
  type ProfileForm,
  schema,
  useProfile,
} from "modules/points/hooks/use-profile";
import { ConnectedWallet } from "./connected-wallet";
import type { FullUserProfile } from "@repo/points";

const FORM_DEBOUNCE_TIME = 600; // ms

export function ProfileForm({
  profile,
  header,
  submitText,
  children,
  onSubmit,
  isLoading = false,
}: React.PropsWithChildren<{
  profile?: FullUserProfile;
  header?: React.ReactNode;
  submitText: string;
  onSubmit?: (data: ProfileForm) => void;
  isLoading?: boolean;
}>) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile?.profileImageUrl ?? null,
  );
  const { usernameCheck } = useProfile();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: profile?.username ?? "",
    },
  });

  useEffect(() => {
    if (usernameCheck.data === false) {
      form.setError("username", {
        type: "manual",
        message: "Username is already taken",
      });
    }
  }, [usernameCheck.data, form]);

  const avatarRef = useRef<HTMLInputElement>(null);

  const handleUsernameChanged = useMemo(
    () =>
      debounce((username: string) => {
        if (schema.safeParse({ username }).success === false) return;

        usernameCheck.fetch(username);
      }, FORM_DEBOUNCE_TIME),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

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
    return onSubmit?.(data);
  };

  return (
    <Form {...form}>
      {header}

      <form className="gap-lg grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="gap-x-md mt-md flex items-end">
          <Avatar
            src={
              avatarPreview && avatarPreview.length
                ? avatarPreview
                : "/placeholder-img.png"
            }
            alt="Profile image"
            className="h-[140px] w-[140px] rounded-none border-transparent"
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
              <Input
                {...field}
                placeholder="Enter Display Name"
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  field.onChange(e);
                  handleUsernameChanged(e.target.value);
                }}
              />
            </FormItemWrapper>
          )}
        />
        <ConnectedWallet />

        {children}

        <Button
          disabled={
            !form.formState.isValid || usernameCheck.isLoading || isLoading
          }
          type="submit"
          className="mt-3 w-full"
        >
          {submitText}
        </Button>
      </form>
    </Form>
  );
}
