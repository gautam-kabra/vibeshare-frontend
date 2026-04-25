import Head from "next/head";
import Link from "next/link";
import { useSafeUser } from "@/lib/clerk-hooks";
import { useClerk } from "@clerk/nextjs";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const { isSignedIn } = useSafeUser();
  const { signOut } = useClerk();

  return (
    <>
      <Head>
        <title>VibeShare — The Digital Pulse</title>
        <meta
          name="description"
          content="Experience a new dimension of connection. Dive into curated spaces, premium networking, and real-time social analytics."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.landing}>
        {/* Immersive Background */}
        <div className={styles.visuals}>
          <div className={styles.gridLayer}></div>
          <div className={styles.glowLayer}></div>
          <div className={styles.bgOrbs}>
            <div className={styles.orb1}></div>
            <div className={styles.orb2}></div>
            <div className={styles.orb3}></div>
          </div>
        </div>

        {/* TopNav */}
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <span>VibeShare</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/explore" className={styles.navLink}>
              Discover
            </Link>
            {isSignedIn ? (
              <>
                <button onClick={() => signOut()} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  Logout
                </button>
                <Link href="/profile" className={styles.ctaBtn}>
                  Dashboard
                </Link>
              </>
            ) : (
              <Link href="/login" className={styles.ctaBtn}>
                Enter the Void
              </Link>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.statusBadge}>
              <span className={styles.pulsePoint}></span>
              SYSTEM STATUS: FULLY OPERATIONAL
            </div>
            <h1 className={styles.heroTitle}>
              THE <br />
              <span className={styles.gradient}>DIGITAL PULSE</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Experience a new dimension of connection. Dive into curated
              spaces, premium networking, and real-time social analytics in an
              environment designed for depth.
            </p>
            <div className={styles.heroCta}>
              {isSignedIn ? (
                <Link href="/explore" className={styles.primaryBtn}>
                  Launch Pulse
                  <span className="material-symbols-outlined">trending_flat</span>
                </Link>
              ) : (
                <Link href="/login" className={styles.primaryBtn}>
                  Get Early Access
                  <span className="material-symbols-outlined">trending_flat</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className={styles.features}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Engineered for Connection</h2>
            <p className={styles.sectionSubtitle}>A social ecosystem designed for those who seek more than just noise.</p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Row 1: 2 columns + 1 column */}
            <div className={`${styles.featureCard} ${styles.cardLarge}`}>
              <div className={styles.cardGlow}></div>
              <div className={styles.featureIcon}>
                <span className="material-symbols-outlined">insights</span>
              </div>
              <div className={styles.cardContent}>
                <h3>Social Analytics</h3>
                <p>Real-time metrics and deep engagement insights to understand your audience&apos;s digital heartbeat.</p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.cardGlow}></div>
              <div className={styles.featureIcon}>
                <span className="material-symbols-outlined">hub</span>
              </div>
              <div className={styles.cardContent}>
                <h3>Networking</h3>
                <p>Connect with high-value individuals.</p>
              </div>
            </div>

            {/* Row 2: 1 column + 2 columns */}
            <div className={styles.featureCard}>
              <div className={styles.cardGlow}></div>
              <div className={styles.featureIcon} style={{ color: "var(--primary)" }}>
                <span className="material-symbols-outlined">blur_on</span>
              </div>
              <div className={styles.cardContent}>
                <h3>Spaces</h3>
                <p>Communities that align with you.</p>
              </div>
            </div>

            <div className={`${styles.featureCard} ${styles.cardLarge} ${styles.cardEmerald}`}>
              <div className={styles.cardGlow}></div>
              <div className={styles.featureIcon}>
                <span className="material-symbols-outlined">security</span>
              </div>
              <div className={styles.cardContent}>
                <h3>Decentralized Identity</h3>
                <p>Own your data. Control your presence. Navigate the void with complete privacy and security.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={styles.footerLogo}>VibeShare</span>
            <p>© 2026 The Digital Pulse. All rights reserved.</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </footer>
      </main>
    </>
  );
}
