"use client"
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });

  const sections = {
    Product: ["Features", "Pricing", "API", "Integrations"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Documentation", "Guides", "Support", "Community"],
    Legal: ["Privacy", "Terms", "Cookie Policy", "GDPR"],
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setModalContent({
      title: "Subscription Successful",
      description: `Thank you for subscribing with ${email}. We'll keep you updated with our latest news and features.`,
    });
    setOpenModal(true);
    setEmail("");
  };

  const handleLinkClick = (link: string) => {
    switch (link) {
      case "API":
        router.push("/api-docs");
        break;
      case "Careers":
        setModalContent({
          title: "Careers",
          description: "We're hiring! Check out our careers page for open positions.",
        });
        setOpenModal(true);
        break;
      case "Documentation":
        setModalContent({
          title: "Documentation",
          description: "Explore our comprehensive documentation to get started with Eventify.",
        });
        setOpenModal(true);
        break;
      case "Support":
        setModalContent({
          title: "Support",
          description: "Need help? Contact our support team at support@eventify.com",
        });
        setOpenModal(true);
        break;
      case "Privacy":
        setModalContent({
          title: "Privacy Policy",
          description: "We respect your privacy. Read our full privacy policy to understand how we handle your data.",
        });
        setOpenModal(true);
        break;
      case "Terms":
        setModalContent({
          title: "Terms of Service",
          description: "By using our service, you agree to our terms and conditions.",
        });
        setOpenModal(true);
        break;
      default:
        setModalContent({
          title: link,
          description: `This is a demo of the ${link} section. In a real application, this would link to the appropriate page.`,
        });
        setOpenModal(true);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-2xl bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent">
                Eventify
              </span>
            </div>
            <p className="text-gray-600 text-lg">
              The complete solution for event organization and discovery.
            </p>
            
            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <h4 className="font-medium text-gray-900">Stay updated</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 border-gray-300 focus:ring-2 focus:ring-[#FF6B6B]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit"
                  className="hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                We'll never spam you. Unsubscribe anytime.
              </p>
            </form>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4"> 
              <a 
                href="https://www.instagram.com/aman_.x._11/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#FF6B6B] transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/aman-galoliya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#FF6B6B] transition-colors"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/Amankumar-G" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#FF6B6B] transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(sections).map(([sectionTitle, links], i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  {sectionTitle}
                </h3>
                <ul className="space-y-3">
                  {links.map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleLinkClick(item)}
                        className="text-gray-600 hover:text-[#FF6B6B] transition-colors flex items-center group w-full text-left"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {item}
                        </span>
                        {item === "API" && (
                          <FaExternalLinkAlt className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Eventify. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => handleLinkClick("Privacy")}
              className="text-gray-500 hover:text-[#FF6B6B] text-sm transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleLinkClick("Terms")}
              className="text-gray-500 hover:text-[#FF6B6B] text-sm transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => handleLinkClick("Cookie Policy")}
              className="text-gray-500 hover:text-[#FF6B6B] text-sm transition-colors"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalContent.title}</DialogTitle>
            <DialogDescription className="pt-4">
              {modalContent.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => setOpenModal(false)}
              className="hover:opacity-90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}