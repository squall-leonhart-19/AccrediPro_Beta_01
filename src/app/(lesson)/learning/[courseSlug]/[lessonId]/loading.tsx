export default function LessonLoading() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#fff", overflow: "hidden" }}>
      {/* LEFT SIDEBAR SKELETON - Desktop only */}
      <aside className="desktop-sidebar" style={{
        width: "300px",
        flexShrink: 0,
        borderRight: "1px solid #eee",
        height: "100vh",
        padding: "16px"
      }}>
        {/* Course Title Skeleton */}
        <div style={{
          height: "24px",
          background: "#f0f0f0",
          borderRadius: "6px",
          marginBottom: "24px",
          animation: "pulse 1.5s ease-in-out infinite"
        }} />

        {/* Module Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: "20px" }}>
            <div style={{
              height: "18px",
              background: "#f0f0f0",
              borderRadius: "4px",
              marginBottom: "12px",
              width: "70%",
              animation: "pulse 1.5s ease-in-out infinite"
            }} />
            {[1, 2, 3].map((j) => (
              <div key={j} style={{
                height: "14px",
                background: "#f5f5f5",
                borderRadius: "4px",
                marginBottom: "8px",
                marginLeft: "12px",
                width: `${60 + j * 10}%`,
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${j * 0.1}s`
              }} />
            ))}
          </div>
        ))}
      </aside>

      {/* MAIN CONTENT SKELETON */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflowY: "auto" }}>
        {/* Header Skeleton */}
        <header style={{
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}>
          <div style={{
            height: "32px",
            width: "60px",
            background: "#f0f0f0",
            borderRadius: "6px",
            animation: "pulse 1.5s ease-in-out infinite"
          }} />
          <div style={{
            height: "16px",
            flex: 1,
            maxWidth: "200px",
            background: "#f0f0f0",
            borderRadius: "6px",
            animation: "pulse 1.5s ease-in-out infinite"
          }} />
          <div style={{
            height: "32px",
            width: "80px",
            background: "#f0f0f0",
            borderRadius: "20px",
            animation: "pulse 1.5s ease-in-out infinite"
          }} />
        </header>

        {/* Content Skeleton */}
        <main style={{ flex: 1, padding: "32px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
          {/* Title */}
          <div style={{
            height: "36px",
            background: "#f0f0f0",
            borderRadius: "8px",
            marginBottom: "24px",
            width: "60%",
            animation: "pulse 1.5s ease-in-out infinite"
          }} />

          {/* Paragraphs */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div style={{
                height: "14px",
                background: "#f5f5f5",
                borderRadius: "4px",
                marginBottom: "8px",
                width: "100%",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`
              }} />
              <div style={{
                height: "14px",
                background: "#f5f5f5",
                borderRadius: "4px",
                marginBottom: "8px",
                width: "95%",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1 + 0.05}s`
              }} />
              <div style={{
                height: "14px",
                background: "#f5f5f5",
                borderRadius: "4px",
                width: "80%",
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.1 + 0.1}s`
              }} />
            </div>
          ))}

          {/* Video Placeholder */}
          <div style={{
            height: "360px",
            background: "linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)",
            borderRadius: "12px",
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 1.5s ease-in-out infinite"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              background: "rgba(0,0,0,0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                width: 0,
                height: 0,
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderLeft: "20px solid rgba(0,0,0,0.2)",
                marginLeft: "4px"
              }} />
            </div>
          </div>
        </main>

        {/* Footer Skeleton */}
        <footer style={{
          padding: "24px 16px",
          borderTop: "1px solid #eee",
          background: "#fafafa"
        }}>
          <div style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "12px"
          }}>
            <div style={{
              height: "44px",
              width: "100px",
              background: "#e0e0e0",
              borderRadius: "8px",
              animation: "pulse 1.5s ease-in-out infinite"
            }} />
            <div style={{
              height: "48px",
              width: "180px",
              background: "#722f37",
              opacity: 0.5,
              borderRadius: "50px",
              animation: "pulse 1.5s ease-in-out infinite"
            }} />
          </div>
        </footer>
      </div>

      {/* RIGHT CHAT PANEL SKELETON - Desktop XL only */}
      <aside className="desktop-chat" style={{
        width: "340px",
        flexShrink: 0,
        borderLeft: "1px solid #eee",
        height: "100vh",
        padding: "16px"
      }}>
        {/* Chat Header Skeleton */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          paddingBottom: "16px",
          borderBottom: "1px solid #eee",
          marginBottom: "16px"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "#f0f0f0",
            borderRadius: "50%",
            animation: "pulse 1.5s ease-in-out infinite"
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              height: "16px",
              background: "#f0f0f0",
              borderRadius: "4px",
              marginBottom: "6px",
              width: "80%",
              animation: "pulse 1.5s ease-in-out infinite"
            }} />
            <div style={{
              height: "12px",
              background: "#f5f5f5",
              borderRadius: "4px",
              width: "50%",
              animation: "pulse 1.5s ease-in-out infinite"
            }} />
          </div>
        </div>

        {/* Chat Messages Skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: i % 2 === 0 ? "flex-end" : "flex-start"
          }}>
            <div style={{
              height: "48px",
              background: i % 2 === 0 ? "#f0e6e8" : "#f5f5f5",
              borderRadius: "18px",
              width: `${50 + i * 10}%`,
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`
            }} />
          </div>
        ))}
      </aside>

      {/* Responsive CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Mobile first - hide desktop elements */
        .desktop-sidebar { display: none !important; }
        .desktop-chat { display: none !important; }

        /* Tablet (1024px+) - show sidebar */
        @media (min-width: 1024px) {
          .desktop-sidebar { display: block !important; }
        }

        /* Desktop XL (1280px+) - show chat panel */
        @media (min-width: 1280px) {
          .desktop-chat { display: block !important; }
        }
      `}</style>
    </div>
  );
}
