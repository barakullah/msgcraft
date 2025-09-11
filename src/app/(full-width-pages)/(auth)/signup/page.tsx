import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | MsgCraft - Whatsapp Automation Service ",
  description: "SignUp Page | MsgCraft - Whatsapp Automation Service",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
