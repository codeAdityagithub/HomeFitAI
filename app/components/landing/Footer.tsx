import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground rounded ssm:mx-6 lg:mx-0">
      <div className="mx-auto grid grid-cols-4 ssm:grid-cols-3 place-items-center ssm:place-items-start">
        {/* Links Section */}
        <div className="flex gap-2 sm:gap-6 sm:pl-2">
          <Button
            variant="link"
            className="px-2"
            asChild
          >
            <a
              href="https://www.linkedin.com/in/aditya-082085228/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
            </a>
          </Button>
          <Button
            variant="link"
            className="px-2"
            asChild
          >
            <a
              href="https://github.com/codeAdityagithub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={20} />
            </a>
          </Button>
        </div>

        <p className="text-center text-sm col-span-3 ssm:col-span-2 place-self-start self-center">
          &copy; 2024 HomeFitAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
