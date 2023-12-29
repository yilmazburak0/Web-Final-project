console.log("app.js");
import { initialStudentsData } from './studentsData.js';
import { initialCoursesData } from './coursesData.js';
import { addCourse, deleteCourse,addStudentToCourse,removeStudentFromCourse } from './courseUtils.js';
import { addStudent, deleteStudent } from './studentUtils.js';
import { saveToLocalStorage, getFromLocalStorage } from './localStorageUtils.js';
import { Course } from './Course.js';

// to send the initial values of student and course data to local storage
saveToLocalStorage("students",initialStudentsData.students)
saveToLocalStorage("courses",initialCoursesData.courses)

document.addEventListener("DOMContentLoaded", function () {
  // When the courses button is clicked, courses will be listed
  document.getElementById("coursesBtn").addEventListener("click", function () {
    const mainContent = document.querySelector(".main-content"); //getting main-content to show content
    // we create input to search and div to hold all courses
    mainContent.innerHTML = `
        <input type="text" id="courseSearchInput" placeholder="Search courses...">
        <div id="courseList"></div>
    `;

    function renderCourses(filter = "") {
      //filter's value is empty by default because all courses are made to appear when the page is first rendered
      const coursesData = getFromLocalStorage("courses") //retrieving courses list from local store
      const courseList = document.getElementById("courseList"); //select the div which created to hold all the courses

      courseList.innerHTML = ""; //content of div emptied

      // we list the courses containing the entered letters. For Search operation
      const filteredCourses = coursesData.filter((course) =>
        course.name.toLowerCase().includes(filter.toLowerCase())
      );

      // we show all the filtered courses in a certain order and add buttons to all of them for actions to be performed on the courses
      filteredCourses.forEach((course) => {
        const courseContainer = document.createElement("div"); //div will hold all the information of the course
        const courseTitle = document.createElement("h2"); //will hold the title of the course h2
        courseTitle.textContent = `${course.name} (${course.gradingScale})`;
        courseContainer.appendChild(courseTitle);

        //we create the buttons that will provide functionality and add them to the course container
        const deleteCourseButton = document.createElement("button");
        deleteCourseButton.textContent = "Delete course";
        const allStudentsButton = document.createElement("button");
        allStudentsButton.textContent = "All Students";
        const passedButton = document.createElement("button");
        passedButton.textContent = "Passed Students";
        const failedButton = document.createElement("button");
        failedButton.textContent = "Failed Students";
        const statsButton = document.createElement("button");
        statsButton.textContent = "Detailed Statistics";

        courseContainer.appendChild(deleteCourseButton);
        courseContainer.appendChild(allStudentsButton);
        courseContainer.appendChild(passedButton);
        courseContainer.appendChild(failedButton);
        courseContainer.appendChild(statsButton);

        // Determine the functions to be triggered when the buttons are clicked
        deleteCourseButton.addEventListener("click", () => {
          deleteCourse(course.name);
          renderCourses(); // Re-render the courses after deletion
        });
        allStudentsButton.addEventListener("click", () =>
          showAllStudents(course, courseContainer)
        );
        passedButton.addEventListener("click", () =>
          showPassedStudents(course, courseContainer)
        );
        failedButton.addEventListener("click", () =>
          showFailedStudents(course, courseContainer)
        );
        statsButton.addEventListener("click", () =>
          showDetailedStats(course, courseContainer)
        );

        courseList.appendChild(courseContainer); //we add all the content of the course to the div that will hold all courses

        showAllStudents(course, courseContainer); // Initially show all students
      });
    }

    // The renderCourses function is called for each value entered in the input where we search for courses, because the courses shown in each entered letter should change
    document
      .getElementById("courseSearchInput")
      .addEventListener("input", function (e) {
        renderCourses(e.target.value);
      });

    // The renderCourses function is called to display all courses during the first load of the page.
    renderCourses();
  });

  function showAllStudents(course, courseContainer) {
    //According to the name of the course, we list all the students taking that course under the name of that course.
    const studentList = document.createElement("ul");

    course.students.forEach((studentEntry) => {
      //for all students taking that course
      const studentItem = document.createElement("li");

      let students = getFromLocalStorage("students") //getting all students from local storage
      const { name, surname } = students.find(
        (student) => student.id === studentEntry.id
      ); //we only took the name and surname part from the student object because these are the only fields we need
      const fullName = `${name} ${surname}`;

      // Showing detailed information of the student
      studentItem.textContent = `Student ID: ${studentEntry.id},Student: ${fullName}, GPA: ${studentEntry.GPA}, Grade: ${studentEntry.letterGrade}`;
      studentList.appendChild(studentItem);
    });
    // Clear the previous list and append the new list
    clearStudentList(courseContainer);
    courseContainer.appendChild(studentList);
  }

  function showPassedStudents(course, courseContainer) {
    const passedStudents = course.students.filter((s) => s.letterGrade !== "F"); //students without a letter grade of F, that is, passed students are taken
    updateStudentList(passedStudents, courseContainer); //passed students is sent to the updateStudentList function to update the student list
  }

  function showFailedStudents(course, courseContainer) {
    const failedStudents = course.students.filter((s) => s.letterGrade === "F"); //Students with a letter grade of F, that is, failing the course, are selected.
    updateStudentList(failedStudents, courseContainer); //failed students is sent to the updateStudentList function to update the student list
  }

  function showDetailedStats(course, courseContainer) {
    const numPassed = course.students.filter(
      //number of student passed course
      (s) => s.letterGrade !== "F"
    ).length;
    const numFailed = course.students.filter(
      //number of student faied course
      (s) => s.letterGrade === "F"
    ).length;
    const meanScore = //calculated mean score of all students take the course
      course.students.reduce((acc, curr) => acc + parseFloat(curr.GPA), 0) /
      course.students.length;
    const statsText = `
                Number of passed students: ${numPassed}  /
                Number of failed students: ${numFailed}  /
                Mean score of the entire class: ${meanScore.toFixed(2)}
            `;
    const statsPara = document.createElement("p");
    statsPara.textContent = statsText;

    // Clear the previous list/stats and append the new stats
    clearStudentList(courseContainer);
    courseContainer.appendChild(statsPara);
  }

  // Function to update the student list for each course
  function updateStudentList(students, courseContainer) {
    const studentList = document.createElement("ul");

    students.forEach((student) => {
      //shows the information of the students in the incoming student list
      const studentItem = document.createElement("li");
      
      let studentsForName = getFromLocalStorage("students") //getting all students from local storage
      const { name, surname } = studentsForName.find(
        (studentEntry) => student.id === studentEntry.id
      ); //we only took the name and surname part from the student object because these are the only fields we need
      const fullName = `${name} ${surname}`;

      studentItem.textContent = `Student ID: ${student.id} ,Student: ${fullName} , GPA: ${student.GPA}, Grade: ${student.letterGrade}`;
      studentList.appendChild(studentItem);
    });

    // Clear the previous list/stats and append the new list
    clearStudentList(courseContainer);
    courseContainer.appendChild(studentList);
  }

  // Function to clear the student list or stats paragraph
  function clearStudentList(courseContainer) {
    courseContainer.querySelectorAll("ul, p").forEach((el) => el.remove());
  }

  // Add an event listener for the "Students" button click.
  document.getElementById("studentsBtn").addEventListener("click", function () {
    // Select the main content area and set its HTML to include a student search input and a container for the student list.
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = `
        <input type="text" id="studentSearchInput" placeholder="Search students...">
        <div id="studentList"></div>
    `;

    // Function to delete a student, takes the student's ID as a parameter.
    function handleDeleteStudent(studentId) {
      deleteStudent(studentId);
      renderStudents(); // Call this function to re-render the student list
    }

    // Function to update a student's information. Accepts original ID, new ID, name, and surname as parameters.
    function updateStudent(originalId, newId, name, surname) {
      // Retrieve the list of students from local storage.
      let students = getFromLocalStorage("students");
      let courses = getFromLocalStorage("courses");

      // console.log(typeof  originalId); //string
      // Check if the new ID is unique, excluding the student with the original ID.
      if (
        newId !== parseInt(originalId) &&
        students.some((student) => parseInt(student.id) === newId)//Since ids are kept as string in student object, they should be converted to integer
      ) {
        alert("A student with this ID already exists. Please use a unique ID.");
        return;
      }

      // Find the index of the student with the original ID.
      let studentIndex = students.findIndex(
        (student) => student.id === originalId
      );

      // If the student is found, update their details.
      if (studentIndex !== -1) {
        students[studentIndex].id = newId;
        students[studentIndex].name = name;
        students[studentIndex].surname = surname;

        // Update courses with the new student ID
    courses = courses.map((course) => {
      course.students = course.students.map((s) => {
        if (s.id === originalId) {
          return { ...s, id: newId }; // Spread the existing object and overwrite the id property
        }
        return s;
      });
      return course;
    });
    
        // Update local storage with the updated list of students.
        saveToLocalStorage("students",students);
        saveToLocalStorage("courses", courses);

        // Re-render the students list to reflect the changes.
        renderStudents(); // Ensure this function is defined to update the UI.
      } else {
        alert("Student not found.");
      }
    }

    // Function to update the grades for a student in a specific course.
    function updateCourseGrades(
      studentId,
      courseName,
      newMidtermScore,
      newFinalScore
    ) {
      // Retrieve the lists of students and courses from local storage.
      let students = getFromLocalStorage("students")
      let courses = getFromLocalStorage("courses")

      // Find the index of the student with the given ID.
      let studentIndex = students.findIndex(
        (student) => student.id === studentId
      );

      // If the student is found, update their course grades.
      if (studentIndex !== -1) {
        // Find the index of the course in the student's course list.
        let courseIndexInStudent = students[studentIndex].courses.findIndex(
          (course) => course.courseName === courseName
        );

        // If the course is found, update the student's grades for that course.
        if (courseIndexInStudent !== -1) {
          students[studentIndex].courses[courseIndexInStudent].midtermScore =
            newMidtermScore;
          students[studentIndex].courses[courseIndexInStudent].finalScore =
            newFinalScore;
        }

        // Find the course in the list of courses and update the student's GPA and letter grade.
        let courseIndexInCourses = courses.findIndex(
          (course) => course.name === courseName
        );
        if (courseIndexInCourses !== -1) {
          // Find the student in the course's student list.
          let studentInCourseIndex = courses[
            courseIndexInCourses
          ].students.findIndex((s) => s.id === studentId);

          // If the student is enrolled in the course, calculate the new GPA and letter grade.
          if (studentInCourseIndex !== -1) {
            let course = new Course(
              courses[courseIndexInCourses].name,
              courses[courseIndexInCourses].gradingScale,
              courses[courseIndexInCourses].students
            );
            let newGPA = course.calculateGPA(newMidtermScore, newFinalScore);
            let newLetterGrade = course.calculateLetterGrade(newGPA);

            // Update the student's record in the course with the new GPA and letter grade.
            courses[courseIndexInCourses].students[studentInCourseIndex].GPA =
              newGPA;
            courses[courseIndexInCourses].students[
              studentInCourseIndex
            ].letterGrade = newLetterGrade;
          }
        }

        // Save the updated data back to local storage.
        saveToLocalStorage("students",students)
        saveToLocalStorage("courses",courses)

        // Re-render the updated students list.
        renderStudents();
      }
    }

    // Function to display the grade update form for a specific student and course.
    function showGradeUpdateForm(student, course, courseItem) {
      // Create a new div element to contain the grade update form.
      const gradeUpdateForm = document.createElement("div");
      // Set the inner HTML of the form with input fields for midterm and final scores and a submit button.
      gradeUpdateForm.innerHTML = `
            <input type="number" id="newMidtermScore" value="${course.midtermScore}">
            <input type="number" id="newFinalScore" value="${course.finalScore}">
            <button id="submitGradeUpdate">OK</button>
        `;
      // Append the form to the course item in the list.
      courseItem.appendChild(gradeUpdateForm);

      // Add a click event listener to the submit button for grade update.
      document.getElementById("submitGradeUpdate").onclick = () => {
        // Retrieve the new scores from the form input fields.
        const newMidtermScore = parseInt(
          document.getElementById("newMidtermScore").value,
          10
        );
        const newFinalScore = parseInt(
          document.getElementById("newFinalScore").value,
          10
        );
        // Call the function to update course grades with the new scores.
        updateCourseGrades(
          student.id,
          course.courseName,
          newMidtermScore,
          newFinalScore
        );
      };
    }

    // Function to display the student update form.
    function showUpdateForm(student, studentContainer) {
      // Create a new div element to contain the update form.
      const updateForm = document.createElement("div");
      // Set the inner HTML of the form with input fields for ID, name, surname, and a submit button.
      updateForm.innerHTML = `
            <input type="number" id="updateId" value="${student.id}">
            <input type="text" id="updateName" value="${student.name}">
            <input type="text" id="updateSurname" value="${student.surname}">
            <button id="submitUpdate">OK</button>
        `;
      // Append the form to the student container.
      studentContainer.appendChild(updateForm);

      // Add a click event listener to the submit button for student update.
      document.getElementById("submitUpdate").onclick = () => {
        // Retrieve the updated student information from the form input fields.
        const updatedId = parseInt(
          document.getElementById("updateId").value,
          10
        );
        const updatedName = document.getElementById("updateName").value;
        const updatedSurname = document.getElementById("updateSurname").value;
        // Check if the new ID is a valid number before updating the student.
        if (!isNaN(updatedId)) {
          // Call the function to update the student with the new information.
          updateStudent(student.id, updatedId, updatedName, updatedSurname);
        } else {
          alert("Please enter a valid number for the ID.");
        }
      };
    }

    // Function to render the list of students. Can be filtered by a search string.
    function renderStudents(filter = "") {
      // Retrieve the list of students from local storage.
      const studentsData = getFromLocalStorage("students")
      // Select the container where the student list will be rendered.
      const studentList = document.getElementById("studentList");
      // Reset the inner HTML of the student list to clear previous items.
      studentList.innerHTML = "";

      // Filter the list of students based on the search string.
      const filteredStudents = studentsData.filter((student) =>
        `${student.id} ${student.name} ${student.surname}`
          .toLowerCase()
          .includes(filter.toLowerCase())
      );

      // Iterate over the filtered list of students and create HTML elements for each.
      filteredStudents.forEach((student) => {
        // Create a container div for each student.
        const studentContainer = document.createElement("div");
        // Create a div to display student information.
        const studentInfo = document.createElement("div");
        studentInfo.textContent = `${student.id} / ${student.name} ${student.surname}`;
        studentContainer.appendChild(studentInfo);

        // Create buttons for deleting and updating the student.
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteStudentButton")
        deleteButton.textContent = "Delete Student";
        deleteButton.onclick = () => handleDeleteStudent(student.id);
        studentContainer.appendChild(deleteButton);

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update Student";
        updateButton.onclick = () => showUpdateForm(student, studentContainer);
        studentContainer.appendChild(updateButton);

        // Create a list to display the student's courses and grades.
        const coursesWithGradeUpdateList = document.createElement("ul");
        student.courses.forEach((course) => {
          const courseItem = document.createElement("li");
          courseItem.textContent = `${course.courseName} - Midterm: ${course.midtermScore}, Final: ${course.finalScore}`;

          // Add a button for updating the student's grade for each course.
          const gradeUpdateButton = document.createElement("button");
          gradeUpdateButton.classList.add("gradeUpdateButton")
          gradeUpdateButton.textContent = "Grade Update";
          gradeUpdateButton.onclick = () =>
            showGradeUpdateForm(student, course, courseItem);
          courseItem.appendChild(gradeUpdateButton);

          coursesWithGradeUpdateList.appendChild(courseItem);
        });
        studentContainer.appendChild(coursesWithGradeUpdateList);

        // Append the student container to the student list in the DOM.
        studentList.appendChild(studentContainer);
      });
    }

    // Add an input event listener to the student search input field to re-render the student list based on the search filter.
    document
      .getElementById("studentSearchInput")
      .addEventListener("input", function (e) {
        renderStudents(e.target.value);
      });

    // Initially render the student list with no filter.
    renderStudents();
  });
});

// When the document content is fully loaded, the following functions will be ready to execute.
document.addEventListener("DOMContentLoaded", function () {

  // Add an event listener to the "Add Course" button.
  document.getElementById("addCourseBtn").addEventListener("click", function () {
    // Select the main content area and set its inner HTML to include input fields for course name and grading scale, and a submit button.
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = `
      <input type="text" id="courseNameInput" placeholder="Enter course name">
      <select id="courseGradingScaleInput">
        <option value="10-point">10-point</option>
        <option value="7-point">7-point</option>
      </select>
      <button id="submitCourseBtn">OK</button>
    `;

    // Add an event listener to the "OK" button for submitting the new course.
    document.getElementById("submitCourseBtn").addEventListener("click", function () {
      // Retrieve and trim the course name input by the user.
      const courseName = document.getElementById("courseNameInput").value.trim();
      // Retrieve the selected grading scale.
      const courseGradingScale = document.getElementById("courseGradingScaleInput").value;

      // Define a regular expression to match non-numeric characters only.
      const nonNumericRegex = /^[^\d]+$/;

      // Validate the course name to ensure it contains only non-numeric characters.
      if (!nonNumericRegex.test(courseName)) {
        // Alert the user and stop the function if the course name contains numbers.
        alert("The course name should contain only letters and characters, no numbers.");
        return;
      }

      // Proceed to add the course if a course name has been entered.
      if (courseName) {
        addCourse(courseName, courseGradingScale);
      } else {
        // Alert the user if the course name is empty.
        alert("Please enter the course name.");
      }
    });
  });
});

// Similar event setup when the document is fully loaded for adding a student.
document.addEventListener("DOMContentLoaded", function () {
  // Add an event listener to the "Add Student" button.
  document.getElementById("addStudentBtn").addEventListener("click", function () {
    // Set the inner HTML of the main content area to include input fields for student ID, name, surname, and a submit button.
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = `
      <input type="number" id="studentIdInput" placeholder="Enter student's ID" min="1">
      <input type="text" id="studentNameInput" placeholder="Enter student's name" pattern="[A-Za-zçğıöşüÇĞİÖŞÜ\s]+"">
      <input type="text" id="studentSurnameInput" placeholder="Enter student's surname" pattern="[A-Za-zçğıöşüÇĞİÖŞÜ\s]+">
      <button id="submitStudentBtn">OK</button>
    `;

    // Add an event listener to the "OK" button for submitting the new student.
    document.getElementById("submitStudentBtn").addEventListener("click", function () {
      // Retrieve and trim the student ID, name, and surname inputs by the user.
      const studentId = document.getElementById("studentIdInput").value.trim();
      const studentName = document.getElementById("studentNameInput").value.trim();
      const studentSurname = document.getElementById("studentSurnameInput").value.trim();

      // Retrieve the existing students from local storage and check if the entered student ID already exists.
      const students = getFromLocalStorage("students");
      if (students.some((student) => student.id === studentId)) {
        // Alert the user if the student ID is already in use.
        alert("A student with this ID already exists.");
        return;
      }

      // Validate the name and surname fields based on the specified patterns.
      if (!document.getElementById("studentNameInput").checkValidity()) {
        // Alert the user if the name input is invalid.
        alert("The student name should contain only letters.");
        return;
      }

      if (!document.getElementById("studentSurnameInput").checkValidity()) {
        // Alert the user if the surname input is invalid.
        alert("The student surname should contain only letters.");
        return;
      }

      // If all validations pass, proceed to add the student.
      if (studentId && studentName && studentSurname) {
        // Call the addStudent function with the provided details.
        addStudent(studentId, studentName, studentSurname);
        // Notify the user that the student has been added by updating the main content.
        mainContent.innerHTML = "<p>New student added!</p>";
      } else {
        // Alert the user if any of the fields are not filled in correctly.
        alert("Please fill in all fields correctly.");
      }
    });
  });
});


// Wait until the DOM is fully loaded before running the script.
document.addEventListener("DOMContentLoaded", function () {
  
  // Add an event listener to the 'Add Student to Course' button.
  document.getElementById("addStudentToCourseBtn").addEventListener("click", function () {
    // Select the main content area of the document.
    const mainContent = document.querySelector(".main-content");
    // Retrieve the list of students and courses from local storage, or use an empty array if none found.
    const students = getFromLocalStorage("students");
    const courses = getFromLocalStorage("courses");

    // Generate option elements for each student, containing their ID, name, and surname.
    let studentOptions = students.map(student => `<option value="${student.id}">${student.name} ${student.surname}</option>`).join("");

    // Generate option elements for each course, containing the course name.
    let courseOptions = courses.map(course => `<option value="${course.name}">${course.name}</option>`).join("");

    // Update the main content area with a form consisting of two dropdowns for selecting a student and a course, input fields for midterm and final grades, and an 'OK' button to submit the form.
    mainContent.innerHTML = `
      <select id="studentSelect">${studentOptions}</select>
      <select id="courseSelect">${courseOptions}</select>
      <input type="number" id="midtermGrade" placeholder="Enter midterm grade">
      <input type="number" id="finalGrade" placeholder="Enter final grade">
      <button id="submitGradeBtn">OK</button>
    `;

    // Add an event listener to the 'OK' button for submitting the grades.
    document.getElementById("submitGradeBtn").addEventListener("click", function () {
      // Get the selected student ID and course name from the form.
      const studentId = document.getElementById("studentSelect").value;
      const courseName = document.getElementById("courseSelect").value;
      // Parse the entered midterm and final grades as integers.
      const midtermGrade = parseInt(document.getElementById("midtermGrade").value, 10);
      const finalGrade = parseInt(document.getElementById("finalGrade").value, 10);

      // Validate that the grades are within the 0-100 range.
      if (midtermGrade < 0 || midtermGrade > 100 || finalGrade < 0 || finalGrade > 100) {
        alert("Please enter grades that are between 0 and 100.");
        return; // If the grades are not within range, exit the function without proceeding.
      }

      // Check if both midterm and final grades are numbers to proceed.
      if (!isNaN(midtermGrade) && !isNaN(finalGrade)) {
        // Call the function to add the student to the course with the entered grades.
        addStudentToCourse(studentId, courseName, midtermGrade, finalGrade);
        // Update the main content area to notify the user that the grades have been added.
        mainContent.innerHTML = "<p>Student grades added to course!</p>";
      } else {
        // If either grade is not a valid number, alert the user.
        alert("Please enter valid grades for midterm and final.");
      }
    });
  });
});


// Wait for the DOM content to be fully loaded before executing the following code.
document.addEventListener("DOMContentLoaded", function () {
  // ... (other event listeners)

  // Event listener for when the 'Delete Student from Course' button is clicked.
  document.getElementById("deleteStudentFromCourseBtn").addEventListener("click", function () {
    // Select the main content area of the HTML document.
    const mainContent = document.querySelector(".main-content");
    // Retrieve the list of students from local storage or use an empty array if there's nothing stored.
    const students = getFromLocalStorage("students");

    // Create dropdown options for each student using their id, name, and surname.
    let studentOptions = students.map(student => `<option value="${student.id}">${student.name} ${student.surname}</option>`).join("");

    // Update the main content area with a dropdown for students, a placeholder for courses, and an 'OK' button.
    mainContent.innerHTML = `
      <select id="studentSelect">${studentOptions}</select>
      <select id="courseSelect"></select>
      <button id="removeStudentCourseBtn">OK</button>
    `;

    // Function to populate the courses dropdown based on the selected student's id.
    function populateCourses(studentId) {
      // Find the selected student by their id.
      const selectedStudent = students.find(student => student.id === studentId);
      // If the selected student exists, create dropdown options for their courses.
      if (selectedStudent) {
        let courseOptions = selectedStudent.courses.map(course => `<option value="${course.courseName}">${course.courseName}</option>`).join("");
        // Update the courses dropdown with the course options.
        document.getElementById("courseSelect").innerHTML = courseOptions;
      }
    }

    // Initially populate the courses dropdown with the first student's courses.
    if (students.length > 0) populateCourses(students[0].id);

    // Add an event listener to the students dropdown to update the courses dropdown when a different student is selected.
    document.getElementById("studentSelect").addEventListener("change", function (e) {
      populateCourses(e.target.value);
    });

    // Add an event listener to the 'OK' button to remove the selected student from the selected course.
    document.getElementById("removeStudentCourseBtn").addEventListener("click", function () {
      // Get the selected student's id and the selected course name from the dropdowns.
      const studentId = document.getElementById("studentSelect").value;
      const courseName = document.getElementById("courseSelect").value;

      // Call the function to remove the student from the selected course.
      removeStudentFromCourse(studentId, courseName);
      // Update the main content area to indicate the student has been removed.
      mainContent.innerHTML = "<p>Student removed from course!</p>";
      // Optionally, this is where you could re-render the course list if needed.
    });
  });


});

