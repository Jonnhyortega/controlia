import "./globals.css";

export const metadata = {
  title: "Controlia",
  description: "Sistema de gestión comercial",
};



export default function RootLayout({ children } : any) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
