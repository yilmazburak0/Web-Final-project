// Import necessary classes or data
import { Course } from './Course.js';
import { getFromLocalStorage, saveToLocalStorage } from './localStorageUtils.js';

export function addCourse(name, gradingScale) {
    let courses = getFromLocalStorage("courses"); //retrieving courses list from local store
    const mainContent = document.querySelector(".main-content"); //getting main-content to show content
  
    // Normalize both existing course names and the new course name to lower case for comparison
    let existingCourseNames = courses.map((course) => course.name.toLowerCase());
    let newCourseNameLower = name.toLowerCase();
  
    // Check if the new course name already exists in the array
    if (existingCourseNames.includes(newCourseNameLower)) {
      alert(
        "A course with this name already exists. Please use a unique course name."
      );
      return;
    }
    let newCourse = new Course(name, gradingScale); //a new course object is created.
    courses.push(newCourse); //and pushed to courses list.
    saveToLocalStorage("courses", courses); //new list is sent to local storage
    mainContent.innerHTML = "<p>New course added!</p>"; //printing that a new course added to main-content
  }

export function deleteCourse(courseName) {
    let courses = getFromLocalStorage("courses"); //retrieving courses list from local store
    let students = getFromLocalStorage("students"); //retrieving students list from local store

  courses = courses.filter((course) => course.name !== courseName); //delete from courses that course using the name of the course by filtering.
  students.forEach((student) => {
    //Look at each student's course list and filter, that is, delete, if that course is on the student's list.
    student.courses = student.courses.filter(
      (course) => course.courseName !== courseName
    );
  });

  //send to the new lists to local storage.
  saveToLocalStorage("courses", courses);
  saveToLocalStorage("students", students);
}

export function addStudentToCourse(studentId, courseName, midtermScore, finalScore) {
    let courses = getFromLocalStorage("courses"); //retrieving courses list from local store
    let students = getFromLocalStorage("students"); //retrieving students list from local store
  
    //we find the index of the student and course, if it returns -1, it means that it is not in the list
    let studentIndex = students.findIndex((student) => student.id === studentId);
    let courseIndex = courses.findIndex((course) => course.name === courseName);
  
    if (studentIndex !== -1 && courseIndex !== -1) {
      // Add course details to the student's record
      students[studentIndex].courses.push({
        courseName,
        midtermScore,
        finalScore,
      });
  
      //a new course object is created.
      let course = new Course(
        courses[courseIndex].name,
        courses[courseIndex].gradingScale,
        courses[courseIndex].students
      );
  
      // Calculate GPA and letter grade
      const gpa = course.calculateGPA(midtermScore, finalScore);
      const letterGrade = course.calculateLetterGrade(gpa);
  
      // Check if the student already exists in the course, update if so
      let existingStudentIndex = course.students.findIndex(
        (s) => s.id === studentId
      );
      if (existingStudentIndex !== -1) {
        course.students[existingStudentIndex] = {
          id: studentId,
          GPA: gpa,
          letterGrade,
        };
      } else {
        // Add the student to the course
        course.students.push({ id: studentId, GPA: gpa, letterGrade });
      }
  
      //add the updated course to the list of courses
      courses[courseIndex] = course;
      //send to the new lists to local storage.
      saveToLocalStorage("students", students);
      saveToLocalStorage("courses", courses);
    }
  }
  
export function removeStudentFromCourse(studentId, courseName) {
    let courses = getFromLocalStorage("courses"); //retrieving courses list from local store
    let students = getFromLocalStorage("students"); //retrieving students list from local store
  
    //we find the index of the student and course, if it returns -1, it means that it is not in the list
    let studentIndex = students.findIndex((student) => student.id === studentId);
    let courseIndex = courses.findIndex((course) => course.name === courseName);
  
    if (studentIndex !== -1 && courseIndex !== -1) {
      // deleted that course from the student's course list.
      students[studentIndex].courses = students[studentIndex].courses.filter(
        (course) => course.courseName !== courseName
      );
  
      //a new course object is created.
      let course = new Course(
        courses[courseIndex].name,
        courses[courseIndex].gradingScale,
        courses[courseIndex].students
      );
      // deleted the student from the student list of that course
      course.removeStudent(studentId);
      //add the updated course to the list of courses
      courses[courseIndex] = course;
      //send to the new lists to local storage.
      saveToLocalStorage("students", students);
      saveToLocalStorage("courses", courses);
    }
  }
