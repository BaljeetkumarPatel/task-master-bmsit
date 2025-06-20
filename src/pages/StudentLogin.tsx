
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const StudentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    usn: "",
    semester: "",
    department: "",
    yearOfAdmission: ""
  });
  
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Check if user is a student
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (studentError) {
          console.error('Error checking student status:', studentError);
          toast({
            title: "Error",
            description: "Failed to verify student status.",
            variant: "destructive"
          });
        } else if (studentData) {
          toast({
            title: "Login Successful",
            description: "Welcome to the Student Dashboard!",
          });
          navigate('/student-dashboard');
        } else {
          toast({
            title: "Access Denied",
            description: "You are not registered as a student.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Signup Failed",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName || !signupData.usn || !signupData.semester || !signupData.department || !signupData.yearOfAdmission) {
      toast({
        title: "Signup Failed",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const semesterNum = parseInt(signupData.semester);
    const yearNum = parseInt(signupData.yearOfAdmission);
    
    if (semesterNum < 1 || semesterNum > 8) {
      toast({
        title: "Signup Failed",
        description: "Semester must be between 1 and 8.",
        variant: "destructive"
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    if (yearNum < 2000 || yearNum > currentYear + 1) {
      toast({
        title: "Signup Failed",
        description: "Please enter a valid year of admission.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUp(signupData.email, signupData.password, {
        first_name: signupData.firstName,
        last_name: signupData.lastName
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Check if we have a user from the signup response
      if (data.user) {
        // Create student record with the user's ID
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            id: data.user.id,
            usn: signupData.usn.toUpperCase(),
            semester: semesterNum,
            department: signupData.department,
            year_of_admission: yearNum
          });

        if (studentError) {
          console.error('Student creation error:', studentError);
          toast({
            title: "Signup Error",
            description: "Failed to create student profile. Please contact support.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Signup Successful",
            description: "Account created successfully! Please check your email to verify your account.",
          });
          // Clear the form
          setSignupData({
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            usn: "",
            semester: "",
            department: "",
            yearOfAdmission: ""
          });
        }
      } else {
        toast({
          title: "Signup Error",
          description: "Failed to create user account. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Student Portal
            </CardTitle>
            <CardDescription>
              Sign in to your account or create a new student account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@bmsit.in"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Login to Dashboard"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email Address</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="student@bmsit.in"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usn">USN (University Seat Number)</Label>
                    <Input
                      id="usn"
                      type="text"
                      placeholder="1BM21CS001"
                      value={signupData.usn}
                      onChange={(e) => setSignupData(prev => ({ ...prev, usn: e.target.value.toUpperCase() }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Input
                        id="semester"
                        type="number"
                        placeholder="1"
                        min="1"
                        max="8"
                        value={signupData.semester}
                        onChange={(e) => setSignupData(prev => ({ ...prev, semester: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearOfAdmission">Year of Admission</Label>
                      <Input
                        id="yearOfAdmission"
                        type="number"
                        placeholder="2024"
                        min="2000"
                        max={new Date().getFullYear() + 1}
                        value={signupData.yearOfAdmission}
                        onChange={(e) => setSignupData(prev => ({ ...prev, yearOfAdmission: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="Computer Science"
                      value={signupData.department}
                      onChange={(e) => setSignupData(prev => ({ ...prev, department: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Enter your password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Student Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default StudentLogin;
