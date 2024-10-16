import blockies from "ethereum-blockies";
import animalHash from "angry-purple-tiger";
import { ProfileForm } from "modules/points/hooks/use-profile";

const generateRandomAvatar = async (): Promise<File> => {
  // blockies lib has a bug where the first generated blockie is always black
  // so we genereate two and ignore the first one
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canvasUnused: HTMLCanvasElement = blockies.create();
  const canvas: HTMLCanvasElement = blockies.create();
  const fileName = "avatar.jpg";

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], fileName, { type: "image/png" }));
      }
    }, "image/png");
  });
};

const genereateRandomUsername = () => {
  const randomName = animalHash(Math.random().toString(), {
    separator: "-",
    style: "lowercase",
  }).split("-");

  // Ignore the color part of the name to prevent overly long usernames
  return `${randomName[0]}-${randomName[2]}`;
};

export const generateRandomProfile = async (): Promise<ProfileForm> => {
  return {
    username: genereateRandomUsername(),
    avatar: await generateRandomAvatar(),
  };
};
