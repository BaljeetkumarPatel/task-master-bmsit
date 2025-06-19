
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Upload, Users, Calendar, FileText, LogOut, Menu, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Assignment {
  id: string;
  title: string;
  description: string;
  semester: string;
  branch: string;
  section: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
}

const branches = ["AIML", "CSBS", "CSE", "CIVIL", "ECE", "ETE", "EEE", "ISE", "MECH"];
const sections = ["A", "B", "C", "D"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Data Structures Assignment",
      description: "Implement Binary Search Tree",
      semester: "3",
      branch: "CSE",
      section: "A",
      dueDate: "2024-01-15",
      submissions: 25,
      totalStudents: 60
    }
  ]);

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    semester: "",
    branch: "",
    section: "",
    dueDate: "",
    file: null as File | null
  });

  const navigate = useNavigate();

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.semester || !newAssignment.branch || !newAssignment.section || !newAssignment.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const assignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title: newAssignment.title,
      description: newAssignment.description,
      semester: newAssignment.semester,
      branch: newAssignment.branch,
      section: newAssignment.section,
      dueDate: newAssignment.dueDate,
      submissions: 0,
      totalStudents: Math.floor(Math.random() * 60) + 40
    };

    setAssignments(prev => [...prev, assignment]);
    setNewAssignment({
      title: "",
      description: "",
      semester: "",
      branch: "",
      section: "",
      dueDate: "",
      file: null
    });

    toast({
      title: "Assignment Created",
      description: "Your assignment has been successfully created.",
    });
    setActiveTab("assignments");
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
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
              <Users className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "create" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("create")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
            <Button
              variant={activeTab === "assignments" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("assignments")}
            >
              <FileText className="w-4 h-4 mr-2" />
              My Assignments
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
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Teacher Dashboard
                  </h1>
                  <Badge variant="secondary" className="text-sm">
                    Welcome, Professor
                  </Badge>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Total Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{assignments.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Total Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {assignments.reduce((sum, a) => sum + a.submissions, 0)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Pending Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {assignments.reduce((sum, a) => sum + a.submissions, 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Assignments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Assignments</CardTitle>
                    <CardDescription>Your latest created assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assignments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No assignments created yet</p>
                    ) : (
                      <div className="space-y-4">
                        {assignments.slice(0, 3).map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold">{assignment.title}</h3>
                              <p className="text-sm text-gray-600">
                                {assignment.branch} - Sem {assignment.semester} - Section {assignment.section}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Due: {assignment.dueDate}</p>
                              <p className="text-sm">
                                {assignment.submissions}/{assignment.totalStudents} submitted
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "create" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Create New Assignment
                </h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Details</CardTitle>
                    <CardDescription>Fill in the details for your new assignment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Assignment Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter assignment title"
                          value={newAssignment.title}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newAssignment.dueDate}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Select value={newAssignment.semester} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, semester: value }))}>
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
                        <Select value={newAssignment.branch} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, branch: value }))}>
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
                        <Select value={newAssignment.section} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, section: value }))}>
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

                    <div className="space-y-2">
                      <Label htmlFor="description">Assignment Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter assignment description and instructions"
                        rows={4}
                        value={newAssignment.description}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Upload Assignment File (Optional)</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                      />
                    </div>

                    <Button onClick={handleCreateAssignment} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assignment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Assignments
                </h1>

                {assignments.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No assignments yet</h3>
                      <p className="text-gray-500 mb-4">Create your first assignment to get started</p>
                      <Button onClick={() => setActiveTab("create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Assignment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {assignments.map((assignment) => (
                      <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{assignment.title}</CardTitle>
                            <Badge variant="outline">
                              {assignment.branch} - S{assignment.semester} - {assignment.section}
                            </Badge>
                          </div>
                          <CardDescription>{assignment.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">Due: {assignment.dueDate}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">
                                {assignment.submissions}/{assignment.totalStudents} submitted
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Upload className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">
                                {((assignment.submissions / assignment.totalStudents) * 100).toFixed(0)}% completion
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <Button variant="outline" size="sm">
                              View Submissions
                            </Button>
                            <Button variant="outline" size="sm">
                              Grade Students
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;
