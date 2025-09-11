import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page | MsgCraft - Whatsapp Automation Service ",
  description: "SignIn Page | MsgCraft - Whatsapp Automation Service",
};

export default function SignIn() {
  return <SignInForm />;
}
