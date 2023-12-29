// Import necessary classes or data
import { Student } from './student.js';
import { getFromLocalStorage, saveToLocalStorage } from './localStorageUtils.js';

export function addStudent(id, name, surname, courses = []) {
    let newStudent = new Student(id, name, surname, courses); // Yeni bir öğrenci nesnesi oluşturuluyor
    let students = getFromLocalStorage("students"); // localStorage'dan öğrenci listesi alınıyor
    students.push(newStudent); // Yeni nesne öğrenci listesine ekleniyor
    saveToLocalStorage("students", students); // Güncellenmiş liste localStorage'a kaydediliyor
}

export function deleteStudent(studentId) {
    // Retrieve students and courses from local storage.
    let students = getFromLocalStorage("students");
    let courses = getFromLocalStorage("courses")
    // Filter out the student with the given ID from the students array.
    students = students.filter((student) => student.id !== studentId);

    // For each course, also remove the student from their enrolled courses.
    courses.forEach((course) => {
      course.students = course.students.filter(
        (student) => student.id !== studentId
      );
    });

    // Update local storage with the new lists.
    saveToLocalStorage("students", students);
    saveToLocalStorage("courses", courses);
  }