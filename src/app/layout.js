import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import SessionProvider from "@/components/SessionProvider";

export const metadata = {
  title: "Supellex",
  description: "Your premium ecommerce destination",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionProvider>
          <NavbarWrapper />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
