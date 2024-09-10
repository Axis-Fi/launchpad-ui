import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "context/auth-provider";

export const schema = z.object({
  username: z.string().min(3),
  referrer: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export type ProfileForm = z.infer<typeof schema>;

export function useProfile() {
  const auth = useAuth();
  const referrer = undefined; // TODO: referre for points progam != referer of a launch

  const mutation = useMutation({
    // TODO: avatar param needs to be the S3 URL of the avatar
    mutationFn: async (profile: ProfileForm) =>
      auth.register(profile.username, referrer, profile.avatar),
  });

  const register = (profile: ProfileForm) => {
    try {
      schema.parse(profile);
      return mutation.mutate(profile);
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error("Validation failed: ", e.issues[0]);
      } else {
        console.error("Unexpected error: ", e);
      }
    }
  };

  return {
    register,
    isUsernameAvailable: auth.isUsernameAvailable,
  };
}
