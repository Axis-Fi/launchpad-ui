import {
  useRef,
  useState,
  useMemo,
  useEffect,
  type default as React,
} from "react";
import { useForm } from "react-hook-form";
import debounce from "debounce";
import { ShareIcon } from "lucide-react";
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

const FORM_DEBOUNCE_TIME = 600; // ms

export function EditProfile({
  create,
  onSuccess,
  children,
}: React.PropsWithChildren<{
  create?: boolean;
  onSuccess?: () => void;
}>) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { register, usernameCheck } = useProfile();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "",
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
    register.mutate(data, { onSuccess, onError: (e) => console.error({ e }) });
  };

  return (
    <Form {...form}>
      <form className="gap-lg grid" onSubmit={form.handleSubmit(handleSubmit)}>
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
          disabled={!form.formState.isValid || usernameCheck.isLoading}
          type="submit"
          className="mt-3 w-full"
        >
          {create ? "Save profile" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
