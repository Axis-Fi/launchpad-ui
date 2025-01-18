import { Router } from "express";
import passport from "passport";
import { resolveTwitterShortUrl } from "./utils";

const router = Router();

router.get("/verify-twitter-handle", passport.authenticate("twitter"));

router.get(
  "/twitter-callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  (_, res) => res.redirect(`${process.env.DAPP_URL}/#/curator-verified`),
);

router.get("/is-verified", async (req, res) => {
  const website = await resolveTwitterShortUrl(req.user?._json.url);
  res.send({
    success: req.isAuthenticated && req.isAuthenticated(),
    user: {
      id: req.user?.id,
      name: req.user?.displayName,
      username: req.user?.username,
      description: req.user?._json.description,
      banner: req.user?._json.profile_banner_url,
      website,
      // replace "normal" with "400x400" to use higher res image
      avatar: req.user?._json.profile_image_url_https.replace(
        "_normal",
        "_400x400",
      ),
    },
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Error logging out.");
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).send("Error destroying session.");
      }

      res.redirect("https://app.axis.finance");
    });
  });
});

export { router };
