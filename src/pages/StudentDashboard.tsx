
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Calendar, FileText, LogOut, Menu, X, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  submitted: boolean;
  grade?: string;
  submissionDate?: string;
}

const branches = ["AIML", "CSBS", "CSE", "CIVIL", "ECE", "ETE", "EEE", "ISE", "MECH"];
const sections = ["A", "B", "C", "D"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    semester: "",
    branch: "",
    section: ""
  });
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Data Structures Assignment",
      description: "Implement Binary Search Tree with insertion, deletion, and traversal operations",
      subject: "Data Structures",
      dueDate: "2024-01-15",
      submitted: false
    },
    {
      id: "2",
      title: "Database Design Project",
      description: "Design a complete database schema for a library management system",
      subject: "Database Management",
      dueDate: "2024-01-20",
      submitted: true,
      grade: "A",
      submissionDate: "2024-01-18"
    }
  ]);

  const navigate = useNavigate();

  const handleSubmitAssignment = (assignmentId: string, file: File) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, submitted: true, submissionDate: new Date().toISOString().split('T')[0] }
        : assignment
    ));

    toast({
      title: "Assignment Submitted",
      description: "Your assignment has been successfully submitted.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const daysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between p-4 border-b lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "assignments" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("assignments")}
            >
              <Upload className="w-4 h-4 mr-2" />
              My Assignments
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("profile")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Separator className="my-4" />
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile Menu Button */}
          <div className="lg:hidden p-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          <main className="p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Student Dashboard
                  </h1>
                  <Badge variant="secondary" className="text-sm">
                    Welcome, Student
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Total Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{assignments.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Submitted</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {assignments.filter(a => a.submitted).length}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {assignments.filter(a => !a.submitted).length}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Average Grade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">A-</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>Assignments due soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignments.filter(a => !a.submitted).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <div>
                              <h3 className="font-semibold">{assignment.title}</h3>
                              <p className="text-sm text-gray-600">{assignment.subject}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              Due: {assignment.dueDate}
                            </p>
                            <p className="text-xs text-gray-500">
                              {daysUntilDue(assignment.dueDate)} days left
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Assignments
                </h1>

                <div className="grid gap-6">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{assignment.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {assignment.submitted ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Submitted
                              </Badge>
                            ) : isOverdue(assignment.dueDate) ? (
                              <Badge variant="destructive">Overdue</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                            {assignment.grade && (
                              <Badge variant="secondary">Grade: {assignment.grade}</Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription>{assignment.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>Due: {assignment.dueDate}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span>Subject: {assignment.subject}</span>
                            </div>
                            {assignment.submissionDate && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Submitted: {assignment.submissionDate}</span>
                              </div>
                            )}
                          </div>

                          {!assignment.submitted && !isOverdue(assignment.dueDate) && (
                            <div className="space-y-2">
                              <Label htmlFor={`file-${assignment.id}`}>Upload Assignment</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id={`file-${assignment.id}`}
                                  type="file"
                                  accept=".pdf,.doc,.docx,.txt"
                                  className="flex-1"
                                />
                                <Button 
                                  onClick={() => {
                                    const fileInput = document.getElementById(`file-${assignment.id}`) as HTMLInputElement;
                                    const file = fileInput?.files?.[0];
                                    if (file) {
                                      handleSubmitAssignment(assignment.id, file);
                                    } else {
                                      toast({
                                        title: "No File Selected",
                                        description: "Please select a file to submit.",
                                        variant: "destructive"
                                      });
                                    }
                                  }}
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Submit
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Profile Settings
                </h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                    <CardDescription>Update your academic details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Select value={studentInfo.semester} onValueChange={(value) => setStudentInfo(prev => ({ ...prev, semester: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semesters.map((sem) => (
                              <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Select value={studentInfo.branch} onValueChange={(value) => setStudentInfo(prev => ({ ...prev, branch: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="section">Section</Label>
                        <Select value={studentInfo.section} onValueChange={(value) => setStudentInfo(prev => ({ ...prev, section: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            {sections.map((section) => (
                              <SelectItem key={section} value={section}>{section}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
