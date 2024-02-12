import { Address } from "viem";

type ContractAddressCard = {
  addresses: Array<[string, Address]>;
} & React.HTMLAttributes<HTMLDivElement>;

export function ContractAddressCard({
  addresses,
  ...props
}: ContractAddressCard) {
  return (
    <div {...props}>
      <h3>Contract Addresses</h3>
      <div className="mt-2">
        {addresses.map(([name, address]) => (
          <div key={address} className="flex">
            <p>
              {name}: {address}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
