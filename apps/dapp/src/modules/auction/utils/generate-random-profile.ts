import blockies from "ethereum-blockies";
import animalHash from "angry-purple-tiger";
import { ProfileForm } from "modules/points/hooks/use-profile";

const generateRandomAvatar = (): File => {
  const canvas: HTMLCanvasElement = blockies.create({
    seed: Math.random().toString(),
  });
  const fileName = "avatar.jpg";

  const dataURI = canvas.toDataURL();
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], fileName, { type: mimeString });
};

const genereateRandomUsername = () => {
  const randomName = animalHash(Math.random().toString(), {
    separator: "-",
    style: "lowercase",
  }).split("-");

  // Ignore the color part of the name to prevent overly long usernames
  return `${randomName[0]}-${randomName[2]}`;
};

export const generateRandomProfile = (): ProfileForm => {
  return {
    username: genereateRandomUsername(),
    avatar: generateRandomAvatar(),
  };
};
