import Footer from './Footer';
import NavBar from './NavBar';

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <div>{children}</div>
      <Footer />
    </>
  );
}
