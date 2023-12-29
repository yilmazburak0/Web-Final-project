export class Student {
    constructor(id, name, surname, courses = []) {
      //When a new student is added, the courses list is empty by default because he/she has not enrolled in any course yet.
      this.id = id;
      this.name = name;
      this.surname = surname;
      this.courses = courses;
    }
  }
  