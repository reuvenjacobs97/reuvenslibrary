export const metadata = {
  title: "Reuven's Library",
  description: "A personal book library, shared with friends and family.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
