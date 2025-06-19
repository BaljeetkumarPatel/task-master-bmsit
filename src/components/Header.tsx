
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      });
      navigate('/');
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleAbout = () => {
    // Create a simple about page or show information
    toast({
      title: "About BMSIT&M",
      description: "BMS Institute of Technology and Management - Assignment Portal for seamless academic collaboration.",
    });
  };

  const handleFeatures = () => {
    toast({
      title: "Features",
      description: "Assignment submission, grading, student-teacher communication, and progress tracking.",
    });
  };

  const handleSupport = () => {
    toast({
      title: "Support",
      description: "For technical support, contact: support@bmsit.in or call +91-80-12345678",
    });
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => handleNavigation('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BMSIT&M
              </h1>
              <p className="text-xs text-gray-600">Assignment Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={handleAbout}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={handleFeatures}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={handleSupport}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Support
            </button>
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="ml-4"
              >
                Sign Out
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button 
              onClick={() => handleNavigation('/')}
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
            >
              Home
            </button>
            <button 
              onClick={handleAbout}
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
            >
              About
            </button>
            <button 
              onClick={handleFeatures}
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
            >
              Features
            </button>
            <button 
              onClick={handleSupport}
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
            >
              Support
            </button>
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="mt-2"
              >
                Sign Out
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
