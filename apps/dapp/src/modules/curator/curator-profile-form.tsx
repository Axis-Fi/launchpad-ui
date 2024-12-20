import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProvider as Form } from "react-hook-form";
import {
  Button,
  Text,
  Input,
  FormField,
  FormItemWrapper,
  Textarea,
} from "@repo/ui";
import { CuratorBanner } from "./curator-banner";

const curatorSchema = z.object({
  name: z.string(),
  address: z.string(),
  banner: z.string(),
  description: z.string(),
  website: z.string(),
  twitter: z.string(),
});

type CuratorForm = z.infer<typeof curatorSchema>;

export function CuratorProfileForm() {
  const form = useForm<CuratorForm>({
    resolver: zodResolver(curatorSchema),
    mode: "onChange",
  });

  const curator = form.getValues();
  console.log({ curator });
  return (
    <div className="mx-auto">
      <CuratorBanner curator={curator} />
      <div className="max-w-limit mx-auto mt-5 ">
        <Text size="xl">Edit your profile</Text>
        <div className="mt-3 grid grid-cols-2 justify-items-center gap-y-4">
          <Form {...form}>
            <FormField
              name="name"
              render={({ field }) => (
                <FormItemWrapper label="Display Name">
                  <Input placeholder="Axis" {...field} type="text" />
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
                <FormItemWrapper label="Banner">
                  <Input placeholder="" {...field} type="text" />
                </FormItemWrapper>
              )}
            />

            <FormField
              name="website"
              render={({ field }) => (
                <FormItemWrapper label="Website">
                  <Input {...field} type="text" />
                </FormItemWrapper>
              )}
            />
            <FormField
              name="twitter"
              render={({ field }) => (
                <FormItemWrapper label="Twitter">
                  <Input {...field} type="text" />
                </FormItemWrapper>
              )}
            />
            <FormField
              name="description"
              render={({ field }) => (
                <FormItemWrapper label="Description">
                  <Textarea {...field} />
                </FormItemWrapper>
              )}
            />

            <Button className="col-span-2 mt-4" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
