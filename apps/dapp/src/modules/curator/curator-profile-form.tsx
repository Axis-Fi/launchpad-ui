import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProvider as Form } from "react-hook-form";
import { useAccount, useWriteContract } from "wagmi";
import { type Address, type BaseError } from "viem";
import { Check, CircleX } from "lucide-react";
import {
  Button,
  Input,
  FormField,
  FormItemWrapper,
  Textarea,
  useToast,
  Checkbox,
  Label,
} from "@repo/ui";
import { useVerifyTwitter } from "modules/auction/hooks/use-verify-twitter";
import { CuratorBanner } from "./curator-banner";
import { storeCuratorProfile } from "modules/app/ipfs-api";
import { curatorRegistryDeployment } from "./deployment";
import { RequiresChain } from "components/requires-chain";

const curatorSchema = z.object({
  name: z.string(),
  address: z.string(),
  banner: z.string(),
  avatar: z.string(),
  description: z
    .string()
    .min(170, "Must be at least 170 characters")
    .max(400, "Must be less than 400 characters"),
  website: z.string(),
  options: z.object({
    hideName: z.boolean().optional(),
  }),
});

const imageUriRegex =
  /^(?:(?:https?:\/\/)?[\w-]+(\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?|data:[\w/\-+.]+;base64,[A-Za-z0-9+/=]*$)/i;

const getErrorReason = (error: BaseError | Error | unknown): string =>
  typeof error === "string"
    ? error
    : ((error as BaseError)?.metaMessages?.[0] ??
      (error as Error)?.message ??
      "Unknown error");

type CuratorForm = z.infer<typeof curatorSchema>;

export function CuratorProfileForm() {
  const { address } = useAccount();
  const { toast } = useToast();
  const twitter = useVerifyTwitter();
  const navigate = useNavigate();
  const { writeContract } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<CuratorForm>({
    resolver: zodResolver(curatorSchema),
    mode: "onChange",
    defaultValues: {
      name: twitter.user?.name ?? "",
      address: address ?? "",
      description: twitter.user?.description ?? "",
      website: twitter.user?.website ?? "",
      avatar: twitter.user?.avatar ?? "",
      banner: twitter.user?.banner ?? "",
      options: {
        hideName: false,
      },
    },
  });

  // Handle connected wallet address change
  useEffect(() => {
    if (form.getValues("address") === address || address == null) return;
    form.setValue("address", address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // Handle Twitter user profile loaded
  useEffect(() => {
    (["name", "website", "description", "avatar", "banner"] as const).forEach(
      (key) => {
        if (twitter.user?.[key] && form.getValues(key) === "") {
          form.setValue(key, twitter.user[key]);
          form.trigger(key); // validate the field when its autopopulated
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twitter.user]);

  const curator = form.watch();

  useEffect(() => {
    if (!twitter.isLoading && !twitter.isVerified) {
      navigate("/curator-authenticate");
    }
  }, [navigate, twitter.isLoading, twitter.isVerified]);

  const handleError = (e: BaseError | Error | unknown) => {
    setIsPending(false);

    console.log("Failed to save curator profile:");
    console.error(e);

    toast({
      title: (
        <div className="gap-y-md flex flex-col">
          <div className="gap-x-md text-md flex items-center">
            <CircleX size="16" /> Failed to create profile
          </div>
          <div className="font-mono">{getErrorReason(e)}</div>
        </div>
      ),
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsPending(true);

    try {
      const { signature, ipfsCid } = await storeCuratorProfile({
        id: twitter.user!.id,
        name: curator.name,
        twitter: twitter.user!.username,
        description: curator.description,
        address: curator.address,
        links: {
          twitter: `https://x.com/${twitter.user?.username}`,
          banner: curator.banner,
          avatar: curator.avatar,
          website: curator.website,
        },
        options: {
          hideName: curator.options?.hideName,
        },
      });

      writeContract(
        {
          chainId: curatorRegistryDeployment.chainId,
          abi: curatorRegistryDeployment.abi,
          address: curatorRegistryDeployment.address,
          functionName: "registerCurator",
          args: [
            {
              curator: curator.address as Address,
              xId: BigInt(twitter.user!.id),
              ipfsCID: ipfsCid!,
            },
            signature as `0x${string}`,
          ],
        },
        {
          onSuccess: () => {
            setIsPending(false);
            toast({
              title: (
                <div className="flex items-center gap-x-2">
                  <Check size="16" /> Curator profile saved
                </div>
              ),
            });

            // navigate(`/curator/${twitter.user!.id}`);
            setTimeout(() => {
              navigate(`/curators`);
            }, 1000);
          },
          onError: handleError,
        },
      );
    } catch (e: unknown) {
      handleError(e);
    }
  };

  return (
    <div className="mx-auto">
      <CuratorBanner curator={curator} />
      <div className="mt-lg mx-auto max-w-5xl">
        <Form {...form}>
          <div className="flex flex-col">
            <div className="gap-x-sm flex flex-grow">
              {/* Left Column */}
              <div className="space-y-lg min-w-[300px] flex-1">
                <FormField
                  name="name"
                  render={({ field }) => (
                    <>
                      <FormItemWrapper label="Display Name">
                        <Input
                          placeholder="Your curator name"
                          {...field}
                          type="text"
                        />
                      </FormItemWrapper>
                      <FormField
                        name="options.hideName"
                        render={({ field }) => (
                          <FormItemWrapper>
                            <div className="gap-xs flex items-center">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="hide-name"
                              />
                              <Label htmlFor="hide-name">
                                Hide display name on banner?
                              </Label>
                            </div>
                          </FormItemWrapper>
                        )}
                      />
                    </>
                  )}
                />

                <FormField
                  name="avatar"
                  render={({ field }) => (
                    <div className="flex max-w-md items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                        {field.value && imageUriRegex.test(field.value) ? (
                          <img
                            src={field.value}
                            alt="Avatar preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200" />
                        )}
                      </div>
                      <FormItemWrapper label="Avatar Image URL">
                        <Input
                          placeholder="http://..."
                          {...field}
                          type="text"
                        />
                      </FormItemWrapper>
                    </div>
                  )}
                />

                <FormField
                  name="banner"
                  render={({ field }) => (
                    <FormItemWrapper label="Banner Image URL">
                      <Input placeholder="http://..." {...field} type="text" />
                    </FormItemWrapper>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-lg min-w-[300px] flex-1">
                <FormField
                  name="website"
                  render={({ field }) => (
                    <FormItemWrapper label="Website URL">
                      <Input placeholder="http://..." {...field} type="text" />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  name="address"
                  render={({ field }) => (
                    <FormItemWrapper label="Address">
                      <Input
                        disabled
                        placeholder="0x0000..."
                        {...field}
                        type="text"
                      />
                    </FormItemWrapper>
                  )}
                />

                <FormField
                  name="description"
                  render={({ field }) => (
                    <FormItemWrapper label="Description">
                      <Textarea
                        placeholder="Short description of who you are and what you do"
                        {...field}
                        rows={7}
                      />
                    </FormItemWrapper>
                  )}
                />
              </div>
            </div>

            {/* Button Container - Centered below form fields */}
            <div className="mt-8 flex justify-center">
              <RequiresChain
                className="w-[400px]"
                chainId={curatorRegistryDeployment.chainId}
              >
                <Button
                  className="w-[200px]"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isPending || !form.formState.isValid}
                >
                  Register
                </Button>
              </RequiresChain>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
