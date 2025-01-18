import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProvider as Form } from "react-hook-form";
import { useAccount, useWriteContract } from "wagmi";
import { type Address } from "viem";
import { Check, CircleX } from "lucide-react";
import {
  Button,
  Input,
  FormField,
  FormItemWrapper,
  Textarea,
  useToast,
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
});

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
    },
  });

  useEffect(() => {
    (
      ["name", "address", "website", "description", "avatar", "banner"] as const
    ).forEach((key) => {
      if (twitter.user?.[key] && form.getValues(key) === "") {
        form.setValue(key, twitter.user[key]);
        form.trigger(key); // validate the field when its autopopulated
      }
    });
  }, [twitter.user]);

  const curator = form.watch();

  useEffect(() => {
    if (!twitter.isLoading && !twitter.isVerified) {
      navigate("/curator-authenticate");
    }
  }, [navigate, twitter.isLoading, twitter.isVerified]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsPending(true);

    const { ipfsCid, signature } = await storeCuratorProfile({
      id: twitter.user!.id,
      name: curator.name,
      description: curator.description,
      address: curator.address,
      links: {
        banner: curator.banner,
        avatar: curator.avatar,
        website: curator.website,
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
            ipfsCID: ipfsCid,
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

          navigate(`/curator/${twitter.user!.id}`);
        },
        onError: (e: Error) => {
          setIsPending(false);
          console.log(e);
          toast({
            title: (
              <div className="flex items-center gap-x-2">
                <CircleX size="16" /> Failed to create profile
              </div>
            ),
          });
        },
      },
    );
  };

  return (
    <div className="mx-auto">
      <CuratorBanner curator={curator} />
      <div className="max-w-limit mx-auto mt-5 ">
        <div className="mt-3 grid grid-cols-2 justify-items-center gap-y-4">
          <Form {...form}>
            <FormField
              name="name"
              render={({ field }) => (
                <FormItemWrapper label="Display Name">
                  <Input
                    placeholder="Your curator name"
                    {...field}
                    type="text"
                  />
                </FormItemWrapper>
              )}
            />
            <FormField
              name="address"
              render={({ field }) => (
                <FormItemWrapper label="Address">
                  <Input placeholder="0x0000..." {...field} type="text" />
                </FormItemWrapper>
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

            <FormField
              name="avatar"
              render={({ field }) => (
                <FormItemWrapper label="Avatar Image URL">
                  <Input placeholder="http://..." {...field} type="text" />
                </FormItemWrapper>
              )}
            />

            <FormField
              name="website"
              render={({ field }) => (
                <FormItemWrapper label="Website URL">
                  <Input placeholder="http://..." {...field} type="text" />
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
                  />
                </FormItemWrapper>
              )}
            />

            <div className="col-span-2 flex w-[300px] justify-center">
              <RequiresChain chainId={curatorRegistryDeployment.chainId}>
                <Button
                  className="col-span-2 mt-4 w-[200px]"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isPending}
                >
                  Register{" "}
                </Button>
              </RequiresChain>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
