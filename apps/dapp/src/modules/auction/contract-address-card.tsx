import { Skeleton } from "@repo/ui";
import { Address } from "viem";

type ContractAddressCard = {
  addresses: Array<[string, Address]>;
  isLoading?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function ContractAddressCard({
  addresses,
  isLoading,
  ...props
}: ContractAddressCard) {
  return (
    <div {...props}>
      <h3>Contract Addresses</h3>
      <div className="mt-2">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          addresses.map(([name, address]) => (
            <div key={address} className="flex">
              <p>
                {name}: {address}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
