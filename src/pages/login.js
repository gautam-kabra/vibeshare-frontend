import Head from "next/head";
import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createUser } from "@/lib/api";

function generateUsername(email) {
  const base = email.split("@")[0];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  const hex = Math.abs(hash).toString(16);
  const suffix = `${hex[0]}${hex[1]}${hex[hex.length - 1]}`;
  return `${base}_${suffix}`;
}

export default function LoginPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function syncUser() {
      if (isSignedIn && user) {
        try {
          const email = user.primaryEmailAddress?.emailAddress || "";
          const name = user.fullName || user.firstName || "User";
          const username = generateUsername(email);
          const pfp = user.imageUrl || "";
          await createUser({ name, username, email, pfp, clerkId: user.id });
        } catch (err) {
          console.error("Failed to sync user:", err);
        }
        router.push("/explore");
      }
    }
    syncUser();
  }, [isSignedIn, user, router]);

  return (
    <>
      <Head>
        <title>Sign In — VibeShare</title>
        <meta name="description" content="Sign in to VibeShare — The Digital Pulse." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="login-page">
        {/* Background orbs */}
        <div className="login-bg-orbs">
          <div className="login-orb login-orb-1"></div>
          <div className="login-orb login-orb-2"></div>
        </div>

        <div className="login-container">
          {/* Brand header */}
          <div className="login-hero">
            <h1 className="login-logo">VibeShare</h1>
            <p className="login-tagline">The Digital Pulse</p>
          </div>

          {/* Login card */}
          <div className="login-form-wrapper">
            <h2 className="login-form-title">Welcome back</h2>
            <SignIn
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "clerk-root",
                  card: "clerk-card",
                  headerTitle: { display: "none" },
                  headerSubtitle: { display: "none" },
                  socialButtonsBlockButton: {
                    background: "rgba(37,37,45,0.4)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(72,71,77,0.15)",
                    color: "#f9f5fd",
                    borderRadius: "0.5rem",
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.3s",
                  },
                  socialButtonsBlockButtonText: {
                    letterSpacing: "0.02em",
                  },
                  formFieldInput: {
                    background: "rgba(19,19,25,0.5)",
                    border: "1px solid rgba(72,71,77,0.2)",
                    color: "#f9f5fd",
                    borderRadius: "0.5rem",
                    padding: "12px 16px",
                    fontSize: "0.875rem",
                  },
                  formFieldLabel: {
                    color: "#acaab1",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  },
                  formButtonPrimary: {
                    background: "linear-gradient(to right, #a3a6ff, #c180ff)",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "14px",
                    fontWeight: 700,
                    boxShadow: "0 0 15px rgba(163,166,255,0.2)",
                  },
                  dividerLine: {
                    background: "linear-gradient(to right, transparent, rgba(72,71,77,0.3), transparent)",
                  },
                  dividerText: {
                    color: "#acaab1",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                  },
                  footerActionLink: {
                    color: "#a3a6ff",
                  },
                  footerActionText: {
                    color: "#acaab1",
                  },
                  rootBox: "clerk-root",
                  card: {
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                    width: "100%",
                    maxWidth: "100%",
                  },
                },
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
