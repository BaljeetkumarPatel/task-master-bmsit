
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            BMSIT&M Assignment Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A comprehensive assignment management system for BMS Institute of Technology & Management. 
            Streamline your academic workflow with our modern, intuitive platform.
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">8</h3>
              <p className="text-gray-600">Semesters</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">9</h3>
              <p className="text-gray-600">Branches</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">4</h3>
              <p className="text-gray-600">Sections</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">100%</h3>
              <p className="text-gray-600">Digital</p>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Choose Your Portal</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Teacher Portal */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold">Teacher Portal</CardTitle>
                <CardDescription className="text-blue-100">
                  Create assignments, manage submissions, and grade students
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6 text-blue-100">
                  <li>• Create and manage assignments</li>
                  <li>• Set due dates and requirements</li>
                  <li>• Grade student submissions</li>
                  <li>• Track class progress</li>
                </ul>
                <Button 
                  onClick={() => navigate('/teacher-login')} 
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 transition-colors"
                >
                  Access Teacher Portal
                </Button>
              </CardContent>
            </Card>

            {/* Student Portal */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
                <CardDescription className="text-purple-100">
                  View assignments, submit work, and track your progress
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6 text-purple-100">
                  <li>• View assigned tasks</li>
                  <li>• Submit assignments online</li>
                  <li>• Check grades and feedback</li>
                  <li>• Track submission deadlines</li>
                </ul>
                <Button 
                  onClick={() => navigate('/student-login')} 
                  className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold py-3 transition-colors"
                >
                  Access Student Portal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Assignments</h3>
              <p className="text-gray-600">Create and manage assignments digitally with document uploads and text-based tasks.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Class Management</h3>
              <p className="text-gray-600">Organize by semester, branch, and section for precise assignment distribution.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Grading</h3>
              <p className="text-gray-600">Streamlined grading system with marks allocation and progress tracking.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
