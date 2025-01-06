import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/verify-twitter-handle", passport.authenticate("twitter"));

router.get(
  "/twitter-callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  (_, res) => res.redirect(`${process.env.DAPP_URL}/#/curator-verified`),
);

router.get("/is-verified", (req, res) => {
  res.send({
    success: req.isAuthenticated && req.isAuthenticated(),
    user: { id: req.user?.id, name: req.user?.username },
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
