import { Button, Text } from "@/components";

export function RegisterPage() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[url('/images/points-bg.png')] bg-cover bg-center bg-no-repeat opacity-65"></div>
      <div className="axis-rainbow absolute inset-0 opacity-90"></div>
      <div className="relative z-10 flex h-full flex-col justify-center">
        <div className="flex w-full flex-col items-center">
          <div className="flex w-[43%] flex-col gap-4">
            <Text mono size="2xl" className="leading-none">
              Register to claim your points
            </Text>
            <Text className="text-left">
              See the points you&apos;ve earend from bidding on launches and
              referring friends
            </Text>
            <Button className="w-[344px]">Register</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
