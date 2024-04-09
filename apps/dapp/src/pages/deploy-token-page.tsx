import { Button, FormField, FormItemWrapper, Input } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import { useDeployToken } from "modules/token/use-deploy-token";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string(),
  symbol: z.string(),
  supply: z.coerce.number(),
});

export type TokenConfig = z.infer<typeof schema>;

export function DeployTokenPage() {
  const deploy = useDeployToken();
  const form = useForm<TokenConfig>({
    resolver: zodResolver(schema),
  });

  return (
    <PageContainer title="Token Deployment">
      <div className="flex ">
        <div className="flex w-1/2 flex-col items-center gap-y-2">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(deploy.handleDeploy)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItemWrapper label="Name">
                    <Input {...field} />
                  </FormItemWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItemWrapper label="Symbol">
                    <Input {...field} />
                  </FormItemWrapper>
                )}
              />
              <FormField
                control={form.control}
                name="supply"
                render={({ field }) => (
                  <FormItemWrapper label="Supply">
                    <Input {...field} />
                  </FormItemWrapper>
                )}
              />
              <Button type="submit" className="mt-4 w-1/2">
                DEPLOY
              </Button>
            </form>
          </FormProvider>
        </div>
        <div className="flex w-1/2 max-w-sm flex-col text-wrap">
          <h4>Status</h4>
          {deploy.mutation.isPending && "Waiting signature..."}
          {deploy.receipt.isSuccess && "Token Deployed"}
          <div className="overflow-x-scroll">
            {deploy.mutation.isError && deploy.mutation.error.message}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
