import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProvider as Form } from "react-hook-form";
import { useWriteContract } from "wagmi";
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
import { metadataRegistryAbi } from "modules/auction/hooks/axis-metadata-registry";
import { baseSepolia } from "viem/chains";

const curatorSchema = z.object({
  name: z.string(),
  address: z.string(),
  banner: z.string(),
  avatar: z.string(),
  description: z.string(),
  website: z.string(),
});

type CuratorForm = z.infer<typeof curatorSchema>;

const curatorRegistryAddress = "0x75da61536510ba0bca0c9af21311a1fc035dcf4e";

export function CuratorProfileForm() {
  const { toast } = useToast();
  const twitter = useVerifyTwitter();
  const navigate = useNavigate();
  const { writeContract } = useWriteContract();

  const form = useForm<CuratorForm>({
    resolver: zodResolver(curatorSchema),
    mode: "onChange",
  });

  const curator = form.getValues();

  React.useEffect(() => {
    if (!twitter.isLoading && !twitter.isVerified) {
      navigate("/curator-authenticate");
    }
  }, [navigate, twitter.isLoading, twitter.isVerified]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

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
        chainId: baseSepolia.id,
        abi: metadataRegistryAbi,
        address: curatorRegistryAddress,
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

            <Button
              className="col-span-2 mt-4"
              type="submit"
              onClick={handleSubmit}
            >
              Register
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
