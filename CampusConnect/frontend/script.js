// script.js
// CampusConnect frontend logic — communicates with the Express/MongoDB backend
// using the native Fetch API (async/await). No jQuery, no XMLHttpRequest.

// ===================== CONFIG =====================
const API_BASE_URL = 'http://localhost:9001/api/students';

// ===================== DOM ELEMENTS =====================
const studentForm = document.getElementById('studentForm');
const studentIdInput = document.getElementById('studentId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const courseInput = document.getElementById('course');
const ageInput = document.getElementById('age');

const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const studentGrid = document.getElementById('studentGrid');
const studentCount = document.getElementById('studentCount');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const errorStateMessage = document.getElementById('errorStateMessage');
const retryBtn = document.getElementById('retryBtn');
const refreshBtn = document.getElementById('refreshBtn');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

const deleteModal = document.getElementById('deleteModal');
const deleteStudentName = document.getElementById('deleteStudentName');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// ===================== STATE =====================
let isEditMode = false;
let pendingDeleteId = null;
let toastTimeout = null;

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();
});

studentForm.addEventListener('submit', handleFormSubmit);
cancelEditBtn.addEventListener('click', resetForm);
refreshBtn.addEventListener('click', fetchStudents);
retryBtn.addEventListener('click', fetchStudents);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
deleteModal.addEventListener('click', (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});

// ===================== TOAST HELPER =====================
function showToast(message, type = 'success') {
  clearTimeout(toastTimeout);
  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');

  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

// ===================== UI STATE HELPERS =====================
function showLoading() {
  loadingIndicator.classList.remove('hidden');
  emptyState.classList.add('hidden');
  errorState.classList.add('hidden');
  studentGrid.classList.add('hidden');
}

function hideLoading() {
  loadingIndicator.classList.add('hidden');
}

function showEmptyState() {
  emptyState.classList.remove('hidden');
  studentGrid.classList.add('hidden');
  errorState.classList.add('hidden');
}

function showErrorState(message) {
  errorStateMessage.textContent = message;
  errorState.classList.remove('hidden');
  studentGrid.classList.add('hidden');
  emptyState.classList.add('hidden');
}

function showGrid() {
  studentGrid.classList.remove('hidden');
  emptyState.classList.add('hidden');
  errorState.classList.add('hidden');
}

// ===================== FIELD VALIDATION (CLIENT-SIDE) =====================
function clearFieldErrors() {
  ['name', 'email', 'course', 'age'].forEach((field) => {
    document.getElementById(`${field}Error`).textContent = '';
    document.getElementById(field).classList.remove('invalid');
  });
}

function setFieldError(field, message) {
  document.getElementById(`${field}Error`).textContent = message;
  document.getElementById(field).classList.add('invalid');
}

function validateForm() {
  clearFieldErrors();
  let isValid = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const course = courseInput.value.trim();
  const age = ageInput.value;

  if (name.length < 2) {
    setFieldError('name', 'Name must be at least 2 characters');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setFieldError('email', 'Enter a valid email address');
    isValid = false;
  }

  if (course.length < 2) {
    setFieldError('course', 'Course must be at least 2 characters');
    isValid = false;
  }

  if (!age || age < 15 || age > 100) {
    setFieldError('age', 'Age must be between 15 and 100');
    isValid = false;
  }

  return isValid;
}

// ===================== FETCH: GET ALL STUDENTS =====================
async function fetchStudents() {
  showLoading();

  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Students resource not found (404).');
      }
      if (response.status >= 500) {
        throw new Error('Server error occurred while fetching students (500).');
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();
    renderStudents(result.data || []);
  } catch (error) {
    console.error('fetchStudents error:', error);
    if (error instanceof TypeError) {
      // Typically a network error (server down / no internet / CORS)
      showErrorState('Network error: Unable to reach the server. Please check your connection or ensure the backend is running.');
    } else {
      showErrorState(error.message || 'Failed to load students.');
    }
  } finally {
    hideLoading();
  }
}

// ===================== RENDER STUDENT CARDS =====================
function renderStudents(students) {
  studentCount.textContent = students.length;

  if (!students || students.length === 0) {
    showEmptyState();
    studentGrid.innerHTML = '';
    return;
  }

  showGrid();

  const accents = ['#6c63ff', '#ff8fa6', '#3ecfa0', '#f5a524'];

  studentGrid.innerHTML = students
    .map((student, index) => {
      const initials = getInitials(student.name);
      const accent = accents[index % accents.length];
      const createdDate = new Date(student.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return `
        <div class="student-card" data-id="${student._id}" style="--accent:${accent}; animation-delay:${index * 60}ms">
          <div class="student-card-header">
            <div class="avatar">${initials}</div>
            <div>
              <div class="student-name">${escapeHtml(student.name)}</div>
              <div class="student-email">${escapeHtml(student.email)}</div>
            </div>
          </div>

          <span class="course-tag">${escapeHtml(student.course)}</span>

          <div class="student-info-row">
            <span class="student-info-label">Age</span>
            <span class="student-info-value">${student.age}</span>
          </div>
          <div class="student-info-row">
            <span class="student-info-label">Added On</span>
            <span class="student-info-value">${createdDate}</span>
          </div>

          <div class="student-card-footer">
            <button class="btn btn-outline btn-small edit-btn" data-id="${student._id}">✏️ Edit</button>
            <button class="btn btn-danger btn-small delete-btn" data-id="${student._id}" data-name="${escapeHtml(student.name)}">🗑️ Delete</button>
          </div>
        </div>
      `;
    })
    .join('');

  // Attach event listeners after rendering
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => startEditStudent(btn.dataset.id));
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => openDeleteModal(btn.dataset.id, btn.dataset.name));
  });
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  return initials.toUpperCase();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===================== FETCH: CREATE / UPDATE (FORM SUBMIT) =====================
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value.trim(),
    age: Number(ageInput.value),
  };

  setSubmitLoading(true);

  try {
    if (isEditMode) {
      await updateStudent(studentIdInput.value, payload);
    } else {
      await createStudent(payload);
    }
  } finally {
    setSubmitLoading(false);
  }
}

function setSubmitLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtnText.textContent = isLoading
    ? 'Saving...'
    : isEditMode
    ? 'Update Student'
    : 'Add Student';
}

// ===================== FETCH: POST (CREATE) =====================
async function createStudent(payload) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      handleApiError(response.status, result);
      return;
    }

    showToast('Student added successfully! 🎉', 'success');
    resetForm();
    fetchStudents();
  } catch (error) {
    console.error('createStudent error:', error);
    handleNetworkError(error);
  }
}

// ===================== FETCH: PUT (UPDATE) =====================
async function updateStudent(id, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      handleApiError(response.status, result);
      return;
    }

    showToast('Student updated successfully! ✅', 'success');
    resetForm();
    fetchStudents();
  } catch (error) {
    console.error('updateStudent error:', error);
    handleNetworkError(error);
  }
}

// ===================== FETCH: DELETE =====================
async function handleConfirmDelete() {
  if (!pendingDeleteId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Deleting...';

  try {
    const response = await fetch(`${API_BASE_URL}/${pendingDeleteId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      handleApiError(response.status, result);
      return;
    }

    showToast('Student deleted successfully 🗑️', 'success');
    fetchStudents();
  } catch (error) {
    console.error('deleteStudent error:', error);
    handleNetworkError(error);
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Yes, Delete';
    closeDeleteModal();
  }
}

// ===================== ERROR HANDLERS =====================
function handleApiError(status, result) {
  const baseMessage = result && result.message ? result.message : 'Something went wrong.';

  if (status === 404) {
    showToast(`Not Found: ${baseMessage}`, 'error');
  } else if (status === 400 && result.errors) {
    showToast(`Validation Error: ${result.errors.join(', ')}`, 'error');
  } else if (status >= 500) {
    showToast(`Server Error: ${baseMessage}`, 'error');
  } else {
    showToast(baseMessage, 'error');
  }
}

function handleNetworkError(error) {
  if (error instanceof TypeError) {
    showToast('Network error: Could not reach the server. Is the backend running?', 'error');
  } else {
    showToast('An unexpected error occurred. Please try again.', 'error');
  }
}

// ===================== EDIT FLOW =====================
async function startEditStudent(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result = await response.json();

    if (!response.ok) {
      handleApiError(response.status, result);
      return;
    }

    const student = result.data;

    studentIdInput.value = student._id;
    nameInput.value = student.name;
    emailInput.value = student.email;
    courseInput.value = student.course;
    ageInput.value = student.age;

    isEditMode = true;
    formTitle.textContent = 'Edit Student';
    submitBtnText.textContent = 'Update Student';
    cancelEditBtn.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('startEditStudent error:', error);
    handleNetworkError(error);
  }
}

function resetForm() {
  studentForm.reset();
  studentIdInput.value = '';
  isEditMode = false;
  formTitle.textContent = 'Add New Student';
  submitBtnText.textContent = 'Add Student';
  cancelEditBtn.classList.add('hidden');
  clearFieldErrors();
}

// ===================== DELETE MODAL =====================
function openDeleteModal(id, name) {
  pendingDeleteId = id;
  deleteStudentName.textContent = name;
  deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  pendingDeleteId = null;
  deleteModal.classList.add('hidden');
}
