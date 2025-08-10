import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { postResume, ResumeRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Dummy data for prefilling the form
const dummyData: ResumeRequest = {
  career_objective: "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable web applications and leading development teams. Proven track record of delivering high-quality software solutions and mentoring junior developers.",
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL", "Git", "REST APIs"],
  educational_institution_name: ["Stanford University", "University of California, Berkeley"],
  degree_names: ["Master of Science in Computer Science", "Bachelor of Science in Computer Science"],
  passing_years: ["2020", "2018"],
  educational_results: ["3.9 GPA", "3.8 GPA"],
  result_types: ["GPA", "GPA"],
  major_field_of_studies: ["Computer Science", "Computer Science"],
  professional_company_names: ["Google", "Microsoft", "Amazon"],
};

interface CVUploadFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CVUploadForm({ onClose, onSuccess }: CVUploadFormProps) {
  const [formData, setFormData] = useState<ResumeRequest>(dummyData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ResumeRequest, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field: keyof ResumeRequest, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as string[])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: keyof ResumeRequest) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""]
    }));
  };

  const removeArrayItem = (field: keyof ResumeRequest, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(',').map(s => s.trim()).filter(s => s);
    handleInputChange('skills', skills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await postResume(formData);
      toast({
        title: "Success!",
        description: "Your resume has been uploaded successfully.",
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload resume",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Upload Your CV</CardTitle>
          <CardDescription>
            Fill in your professional information. All fields are prefilled with sample data that you can edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Career Objective */}
            <div className="space-y-2">
              <Label htmlFor="career_objective">Career Objective</Label>
              <Textarea
                id="career_objective"
                value={formData.career_objective}
                onChange={(e) => handleInputChange('career_objective', e.target.value)}
                placeholder="Describe your career goals and professional summary..."
                rows={4}
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="JavaScript, React, Python, AWS..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Education</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('educational_institution_name')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
              
              {formData.educational_institution_name.map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input
                      value={formData.educational_institution_name[index]}
                      onChange={(e) => handleArrayFieldChange('educational_institution_name', index, e.target.value)}
                      placeholder="University name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input
                      value={formData.degree_names[index]}
                      onChange={(e) => handleArrayFieldChange('degree_names', index, e.target.value)}
                      placeholder="Degree name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      value={formData.passing_years[index]}
                      onChange={(e) => handleArrayFieldChange('passing_years', index, e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Major Field</Label>
                    <Input
                      value={formData.major_field_of_studies[index]}
                      onChange={(e) => handleArrayFieldChange('major_field_of_studies', index, e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <Input
                      value={formData.educational_results?.[index] || ''}
                      onChange={(e) => handleArrayFieldChange('educational_results', index, e.target.value)}
                      placeholder="3.8 GPA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Result Type</Label>
                    <Input
                      value={formData.result_types?.[index] || ''}
                      onChange={(e) => handleArrayFieldChange('result_types', index, e.target.value)}
                      placeholder="GPA"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('educational_institution_name', index)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Experience */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Professional Experience</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('professional_company_names')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </div>
              
              {formData.professional_company_names.map((company, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={company}
                    onChange={(e) => handleArrayFieldChange('professional_company_names', index, e.target.value)}
                    placeholder="Company name"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('professional_company_names', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 justify-end pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload Resume"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
