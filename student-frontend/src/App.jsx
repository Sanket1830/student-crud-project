
import { useEffect, useState } from "react";
import axios from "axios";
import {
  GraduationCap, Users, UserPlus, Pencil,
  Trash2, Search, X, Check
} from "lucide-react";

const API = "/api/students";

const emptyForm = {
  name: "",
  education: "",
  contactNo: "",
  age: ""
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API);
      setStudents(response.data);
      setError("");
    } catch {
      setError("Unable to load students. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        age: Number(form.age)
      };

      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
      } else {
        await axios.post(API, payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      setError("");
      await fetchStudents();

    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      education: student.education,
      contactNo: student.contactNo,
      age: String(student.age)
    });

    setEditingId(student._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      setStudents(current =>
        current.filter(student => student._id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch {
      setError("Unable to delete student.");
    }
  };

  const filteredStudents = students.filter(student =>
    [student.name, student.education, student.contactNo]
      .some(value =>
        value.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <main className="container">

      <nav className="navbar">
        <h2>
          <GraduationCap /> StudentHub
        </h2>
        <span>STUDENT MANAGEMENT SYSTEM</span>
      </nav>

      <header className="hero">
        <div>
          <p className="tagline">SIMPLE. SMART. ORGANIZED.</p>
          <h1>Manage your students<span>.</span></h1>
          <p className="subtitle">
            Add, update and manage student information easily.
          </p>
        </div>
        <div className="hero-icon">
          <GraduationCap size={55} />
        </div>
      </header>

      <div className="stats">
        <div className="stat-card">
          <Users />
          <div>
            <h2>{students.length}</h2>
            <p>Total Students</p>
          </div>
        </div>
      </div>

      <section className="main-grid">

        <div className="card form-card">
          <h2>
            {editingId ? "Edit Student" : "Add New Student"}
          </h2>

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              maxLength="80"
            />

            <label>Education</label>
            <input
              name="education"
              value={form.education}
              onChange={handleChange}
              placeholder="Enter education"
              required
              maxLength="100"
            />

            <label>Contact Number</label>
            <input
              name="contactNo"
              type="tel"
              inputMode="numeric"
              pattern="[0-9+() -]{7,20}"
              value={form.contactNo}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
              maxLength="20"
            />

            <label>Age</label>
            <input
              name="age"
              type="number"
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter age"
              required
            />

            {error && <p className="error">{error}</p>}

            <button className="submit-btn" type="submit">
              {editingId ? <Check size={17} /> : <UserPlus size={17} />}
              {editingId ? "Save Changes" : "Submit Student"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                }}
              >
                <X size={16} /> Cancel
              </button>
            )}

          </form>
        </div>

        <div className="card records-card">
          <div className="records-heading">
            <h2>Student Records</h2>
            <span className="count">{students.length}</span>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Loading students...</p>
          ) : filteredStudents.length === 0 ? (
            <div className="empty">
              <Users size={35} />
              <h3>No students found</h3>
              <p>Add your first student using the form.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>EDUCATION</th>
                    <th>CONTACT</th>
                    <th>AGE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.education}</td>
                      <td>{student.contactNo}</td>
                      <td>{student.age}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="edit-btn"
                            title="Edit"
                            onClick={() => handleEdit(student)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="delete-btn"
                            title="Delete"
                            onClick={() => handleDelete(student._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="footer-count">
            Showing {filteredStudents.length} of {students.length} records
          </p>
        </div>
      </section>

      <footer>
        Built using React.js, Node.js, Express & MongoDB
      </footer>

    </main>
  );
}

