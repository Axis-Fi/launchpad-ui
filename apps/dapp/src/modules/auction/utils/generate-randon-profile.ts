import blockies from "ethereum-blockies";
import { animalHash } from "angry-purple-tiger";
import { ProfileForm } from "modules/points/hooks/use-profile";

const generateRandomAvatar = (): File => {
  const canvas: HTMLCanvasElement = blockies.create({
    seed: Math.random().toString(),
  });

  const ctx = canvas.getContext("2d")!;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const blob = new Blob([imageData.data.buffer], { type: "image/png" });

  const fileName = "avatar.png";

  return new File([blob], fileName, { type: "image/png" });
};

const genereateRandomUsername = () => {
  return animalHash(Math.random().toString());
};

export const generateRandomProfile = (): ProfileForm => {
  return {
    username: genereateRandomUsername(),
    avatar: generateRandomAvatar(),
  };
};
