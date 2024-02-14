import metadata from "config/metadata";
import { Link } from "@repo/ui";

export function TransactionErrorDialog(props: { error: Error }) {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <p>Something went wrong with your transaction:</p>
      <div className="mt-2 flex max-h-[30%] flex-col items-center overflow-scroll px-4">
        {props.error?.name}
        {": "}
        {props.error?.message}
      </div>
      <p className="mt-6">
        If the problem persists, reach out in our{" "}
        <Link className="text-primary" href={metadata.discord}>
          Discord
        </Link>
      </p>
    </div>
  );
}
