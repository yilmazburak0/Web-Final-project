export class Course {
    constructor(name, gradingScale, students = []) {
      //when a new course is added, the students list is empty by default because no student has enrolled in the course yet
      this.name = name;
      this.gradingScale = gradingScale;
      this.students = students;
    }
  
    addStudent(studentId, midtermScore, finalScore) {
      const gpa = this.calculateGPA(midtermScore, finalScore); //the Grade Points Average for that course is calculated using the student's midterm and final exam grades
      this.students.push({ id: studentId, GPA: gpa }); //The id of the student and the GPA for that course are put into an object and pushed to the student array of that course.
    }
  
    removeStudent(studentId) {
      this.students = this.students.filter((student) => student.id !== studentId); //filter that student using the id of the student and make the new array the students array of the course.
    }
  
    calculateGPA(midtermScore, finalScore) {
      //The Grade Points Average of the student is calculated as 40% of the midterm and 60% of the final grade.
      return (midtermScore * 0.4 + finalScore * 0.6).toFixed(2);
    }
  
    calculateLetterGrade(gpa) {
      //Using the grading scale of that course, the letter grade of the student whose GPA is known is calculated.
      gpa = parseFloat(gpa);
      switch (this.gradingScale) {
        case "10-point":
          if (gpa >= 90) return "A";
          if (gpa >= 80) return "B";
          if (gpa >= 70) return "C";
          if (gpa >= 60) return "D";
          return "F";
        case "7-point":
          if (gpa >= 93) return "A";
          if (gpa >= 85) return "B";
          if (gpa >= 77) return "C";
          if (gpa >= 70) return "D";
          return "F";
        default:
          return "N/A"; // For unrecognized grading scales
      }
    }
  }