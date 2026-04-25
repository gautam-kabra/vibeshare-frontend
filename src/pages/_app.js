import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import Head from "next/head";

const clerkAppearance = {
  variables: {
    colorPrimary: "#2D5FF7",
    colorBackground: "#0d0d0f",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
    colorInputBackground: "#1e1e24",
    colorInputText: "#f8fafc",
    borderRadius: "0.75rem",
    colorDanger: "#ef4444",
  },
  elements: {
    formButtonPrimary: {
      background: "linear-gradient(135deg, #2d5ff7 0%, #6366f1 100%)",
      border: "none",
      boxShadow: "0 0 20px rgba(45, 95, 247, 0.2)",
      fontWeight: 700,
      textTransform: "none",
    },
    card: {
      background: "#0d0d0f",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    },
    headerTitle: {
      color: "#f8fafc",
      fontSize: "1.5rem",
      fontWeight: 800,
    },
    headerSubtitle: {
      color: "#94a3b8",
    },
    socialButtonsBlockButton: {
      background: "#1e1e24",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      color: "#f8fafc",
      "&:hover": {
        background: "#2d2d35",
      },
    },
    footer: {
      background: "#0d0d0f",
    },
    footerActionLink: {
      color: "#6366f1",
      "&:hover": {
        color: "#818cf8",
      },
    },
    formFieldLabel: {
      color: "#94a3b8",
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    formFieldInput: {
      background: "#1e1e24",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      color: "#f8fafc",
    },
    dividerLine: {
      background: "rgba(255, 255, 255, 0.1)",
    },
    dividerText: {
      color: "#64748b",
    }
  },
};

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider appearance={clerkAppearance} {...pageProps}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
