
-- Create a profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for the profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create tables for the assignment management system
CREATE TABLE public.teachers (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.students (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  usn TEXT UNIQUE NOT NULL,
  semester INTEGER NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_marks INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  marks INTEGER,
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id),
  UNIQUE(assignment_id, student_id)
);

-- Enable RLS on all tables
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Policies for teachers table
CREATE POLICY "Teachers can view their own data" 
  ON public.teachers 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Teachers can update their own data" 
  ON public.teachers 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policies for students table
CREATE POLICY "Students can view their own data" 
  ON public.students 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Students can update their own data" 
  ON public.students 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policies for assignments table
CREATE POLICY "Teachers can manage their assignments" 
  ON public.assignments 
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM public.teachers WHERE id = auth.uid()
    ) AND teacher_id = auth.uid()
  );

CREATE POLICY "Students can view assignments" 
  ON public.assignments 
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM public.students WHERE id = auth.uid()
    )
  );

-- Policies for submissions table
CREATE POLICY "Students can manage their submissions" 
  ON public.submissions 
  FOR ALL 
  USING (
    auth.uid() IN (
      SELECT id FROM public.students WHERE id = auth.uid()
    ) AND student_id = auth.uid()
  );

CREATE POLICY "Teachers can view submissions for their assignments" 
  ON public.submissions 
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT t.id FROM public.teachers t 
      JOIN public.assignments a ON a.teacher_id = t.id 
      WHERE a.id = assignment_id AND t.id = auth.uid()
    )
  );

CREATE POLICY "Teachers can grade submissions" 
  ON public.submissions 
  FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT t.id FROM public.teachers t 
      JOIN public.assignments a ON a.teacher_id = t.id 
      WHERE a.id = assignment_id AND t.id = auth.uid()
    )
  );

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  RETURN new;
END;
$$;

-- Trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
