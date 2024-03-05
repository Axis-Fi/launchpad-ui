import { ReachOutMessage } from "modules/app/reach-out";

export function TransactionErrorDialog(props: { error: Error }) {
  console.error(props.error?.message);
  return (
    <div className="flex flex-col items-center gap-y-2">
      <p>Something went wrong with your transaction:</p>
      <div className="mt-2 flex flex-col items-center overflow-scroll ">
        {props.error?.name}

        <p className="text-xs">Check the console for more info</p>
      </div>
      <ReachOutMessage className="mt-6" />
    </div>
  );
}
