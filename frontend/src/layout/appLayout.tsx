import { Toaster } from "react-hot-toast";
import Navbar from "../components/navbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <main className="p-6">{children}</main>
    </>
  );
};

export default AppLayout;
