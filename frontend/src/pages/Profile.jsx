
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import {
  User, Mail, Phone, MapPin, Linkedin, Github, Globe,
  Plus, Trash2, Save, GraduationCap, Briefcase, Award, BadgeCheck,
  LinkedinIcon
} from 'lucide-react'

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Initial State matches Backend Model
  const [profile, setProfile] = useState({
    user: { name: '', email: '' },
    profilePhoto: '',
    tagline: 'Student at CampusIQ',
    bio: '',
    phonenumber: '',
    location: '',
    cgpa: '',
    college: '',
    branch: '',
    batch: '',
    skills: [],
    education: [],
    projects: [],
    certifications: [],
    social: { linkedin: '', github: '', twitter: '', website: '' }
  })

  // Temporary states for inputs
  const [newSkill, setNewSkill] = useState('')
  const [newProject, setNewProject] = useState({ name: '', description: '', technologies: '', link: '' })
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })

  // Fetch Profile
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data) {
          // Merge defaults in case some fields are missing
          setProfile(prev => ({ ...prev, ...res.data }))
        }
      } catch (err) { console.error(err) }
    }
    fetchProfile()
  }, [isAuthenticated])

  // Handlers
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Use config headers for authorization
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/profile`, profile, config);
      alert('Profile Saved Successfully!');
      navigate('/dashboard'); // auto-redirect to see changes
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Server Error";
      alert(`Failed to save profile: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const addProject = () => {
    if (newProject.name.trim()) {
      const techArray = newProject.technologies.split(',').map(t => t.trim()).filter(Boolean)
      setProfile({
        ...profile,
        projects: [...profile.projects, { ...newProject, technologies: techArray }]
      })
      setNewProject({ name: '', description: '', technologies: '', link: '' })
    }
  }

  const addEducation = () => {
    if (newEdu.school.trim()) {
      setProfile({ ...profile, education: [...profile.education, newEdu] })
      setNewEdu({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page">
      {/* 1. Header Banner */}
      <div className="profile-header">
        <div className="profile-save-btn-container" style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate("/dashboard")} className="btn btn-primary" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            Analyze Schema & Dashboard
          </button>
          <button onClick={handleSave} disabled={loading}
            className="btn profile-save-btn">
            <Save size={20} /> {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      <div className="profile-grid">

        {/* 2. Left Column: Sidebar */}
        <div className="space-y-6">
          <div className="profile-section text-center">

            {/* Avatar Upload */}
            <div className="profile-avatar-container" style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
              <label htmlFor="file-input" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '3rem' }}>{profile.user.name.charAt(0) || <User />}</span>
                )}
                <div className="avatar-overlay" style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: '0.3s'
                }}>
                  <Plus color="white" />
                </div>
              </label>
              <input id="file-input" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>

            <h2 className="profile-name">{profile.user.name}</h2>
            <input type="text" value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="profile-tagline-input"
            />

            <div className="profile-social-links">
              <LinkedinIcon size={24} style={{ color: '#0077b5', cursor: 'pointer' }} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="profile-section">
            <h3 className="section-header">
              <User size={18} /> Personal Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="info-row">
                <Mail size={16} /> {profile.user.email}
              </div>
              <div className="info-row">
                <Phone size={16} />
                <input className="form-input info-input"
                  placeholder="Add Phone" value={profile.phonenumber} onChange={e => setProfile({ ...profile, phonenumber: e.target.value })} />
              </div>
              <div className="info-row">
                <MapPin size={16} />
                <input className="form-input info-input"
                  placeholder="Add Location" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="profile-section">
            <h3 className="section-header">
              <GraduationCap size={18} /> Academic Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* College */}
              <div className="info-row">
                <span style={{ width: '4rem', fontWeight: '500' }}>College:</span>
                <input
                  className="form-input info-input"
                  style={{ width: '100%' }}
                  list="college-options"
                  placeholder="Type to search college..."
                  value={profile.college}
                  onChange={e => setProfile({ ...profile, college: e.target.value })}
                />
                <datalist id="college-options">
                  <option value="IIT Bombay" />
                  <option value="IIT Delhi" />
                  <option value="IIT Madras" />
                  <option value="IIT Kanpur" />
                  <option value="IIT Kharagpur" />
                  <option value="IIT Roorkee" />
                  <option value="BITS Pilani" />
                  <option value="NIT Trichy" />
                  <option value="NIT Warangal" />
                  <option value="VIT Vellore" />
                  <option value="SRM University" />
                  <option value="Delhi University" />
                  <option value="Jadavpur University" />
                  <option value="Anna University" />
                  <option value="Manipal Institute of Technology" />
                  <option value="Thapar Institute" />
                  <option value="Amity University" />
                  <option value="Lovely Professional University" />
                  <option value="Chandigarh University" />
                  <option value="IIIT Hyderabad" />
                  <option value="IIIT Delhi" />
                  <option value="DTU (Delhi Technological University)" />
                  <option value="NSUT (Netaji Subhas University of Technology)" />
                </datalist>
              </div>

              {/* Branch */}
              <div className="info-row">
                <span style={{ width: '4rem', fontWeight: '500' }}>Branch:</span>
                <select className="form-input info-input" style={{ width: '100%', cursor: 'pointer' }}
                  value={profile.branch} onChange={e => setProfile({ ...profile, branch: e.target.value })}>
                  <option value="" disabled>Select Branch</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="ME">Mechanical (ME)</option>
                  <option value="CE">Civil (CE)</option>
                  <option value="EE">Electrical (EE)</option>
                </select>
              </div>

              {/* Batch */}
              <div className="info-row">
                <span style={{ width: '4rem', fontWeight: '500' }}>Batch:</span>
                <select className="form-input info-input" style={{ width: '100%', cursor: 'pointer' }}
                  value={profile.batch} onChange={e => setProfile({ ...profile, batch: e.target.value })}>
                  <option value="" disabled>Select Batch</option>
                  {[2023, 2024, 2025, 2026, 2027].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* CGPA */}
              <div className="info-row">
                <span style={{ width: '4rem', fontWeight: '500' }}>CGPA:</span>
                <input className="form-input info-input" style={{ width: '100%' }}
                  type="number" step="0.01" min="0" max="10"
                  placeholder="CGPA" value={profile.cgpa} onChange={e => setProfile({ ...profile, cgpa: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="profile-section">
            <h3 className="section-header">
              <BadgeCheck size={18} /> Skills
            </h3>
            <div className="tag-cloud" style={{ marginBottom: '1rem' }}>
              {profile.skills.map((skill, i) => (
                <span key={i} className="tag group">
                  {skill}
                  <Trash2 size={12} style={{ cursor: 'pointer', color: 'var(--danger)' }} onClick={() => setProfile({ ...profile, skills: profile.skills.filter((_, x) => x !== i) })} />
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-input skill-input"
                placeholder="Add Skill..."
                list="skill-options"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
              />
              <datalist id="skill-options">
                <option value="Java" />
                <option value="C++" />
                <option value="Python" />
                <option value="JavaScript" />
                <option value="React.js" />
                <option value="Node.js" />
                <option value="HTML/CSS" />
                <option value="SQL" />
                <option value="MongoDB" />
                <option value="Machine Learning" />
                <option value="Data Structures" />
                <option value="System Design" />
                <option value="Git" />
                <option value="Docker" />
                <option value="Kubernetes" />
                <option value="AWS" />
              </datalist>
              <button onClick={addSkill} className="btn btn-primary skill-add-btn"><Plus size={18} /></button>
            </div>
          </div>
        </div>

        {/* 3. Right Column: Main Content */}
        <div className="space-y-6">

          {/* Education Card */}
          <div className="profile-section">
            <div className="section-header-row">
              <h3 className="section-header-title">
                <GraduationCap style={{ color: 'var(--primary)' }} /> Education
              </h3>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {profile.education.map((edu, i) => (
                <div key={i} className="education-item">
                  <Trash2 size={16} style={{ position: 'absolute', right: 0, top: 0, color: 'var(--danger)', cursor: 'pointer' }} onClick={() => setProfile({ ...profile, education: profile.education.filter((_, x) => x !== i) })} />
                  <h4 className="edu-school">{edu.school}</h4>
                  <p className="edu-details">{edu.degree} · {edu.fieldOfStudy}</p>
                  <p className="edu-date">{edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}</p>
                </div>
              ))}
              {profile.education.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No education details added yet.</p>}
            </div>

            {/* Add Form */}
            <div className="add-form-container">
              <div className="add-form-grid">
                <input
                  className="form-input"
                  placeholder="School/College"
                  list="college-options"
                  value={newEdu.school}
                  onChange={e => setNewEdu({ ...newEdu, school: e.target.value })}
                />

                <input
                  className="form-input"
                  placeholder="Degree"
                  list="degree-options"
                  value={newEdu.degree}
                  onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
                />
                <datalist id="degree-options">
                  <option value="B.Tech" />
                  <option value="B.E." />
                  <option value="B.Sc" />
                  <option value="BCA" />
                  <option value="M.Tech" />
                  <option value="MCA" />
                  <option value="MBA" />
                  <option value="PhD" />
                  <option value="Diploma" />
                  <option value="Higher Secondary (12th)" />
                </datalist>

                <input
                  className="form-input"
                  style={{ gridColumn: 'span 2' }}
                  placeholder="Field of Study"
                  list="field-options"
                  value={newEdu.fieldOfStudy}
                  onChange={e => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                />
                <datalist id="field-options">
                  <option value="Computer Science" />
                  <option value="Information Technology" />
                  <option value="Electronics & Communication" />
                  <option value="Mechanical Engineering" />
                  <option value="Civil Engineering" />
                  <option value="Electrical Engineering" />
                  <option value="Commerce" />
                  <option value="Science (PCM)" />
                  <option value="Science (PCB)" />
                  <option value="Arts" />
                </datalist>

                <input type="date" className="form-input" value={newEdu.startDate} onChange={e => setNewEdu({ ...newEdu, startDate: e.target.value })} />
                <input type="date" className="form-input" value={newEdu.endDate} onChange={e => setNewEdu({ ...newEdu, endDate: e.target.value })} />
              </div>
              <button onClick={addEducation} className="btn add-btn">
                + Add Education
              </button>
            </div>
          </div>

          {/* Projects Card */}
          <div className="profile-section">
            <div className="section-header-row">
              <h3 className="section-header-title">
                <Briefcase style={{ color: 'var(--primary)' }} /> Projects
              </h3>
            </div>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              {profile.projects.map((proj, i) => (
                <div key={i} className="project-card group">
                  <Trash2 size={16} style={{ position: 'absolute', right: '1rem', top: '1rem', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }} onClick={() => setProfile({ ...profile, projects: profile.projects.filter((_, x) => x !== i) })} />
                  <h4 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'var(--text-primary)' }}>{proj.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>{proj.description}</p>
                  <div className="tag-cloud">
                    {proj.technologies && proj.technologies.map((t, ti) => (
                      <span key={ti} className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
              {profile.projects.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No projects added yet.</p>}
            </div>

            {/* Add Form */}
            <div className="add-form-container">
              <input className="form-input" style={{ marginBottom: '0.5rem' }} placeholder="Project Name" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} />
              <textarea className="form-input" style={{ marginBottom: '0.5rem', height: '5rem', resize: 'none' }} placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
              <input className="form-input" style={{ marginBottom: '1rem' }} placeholder="Technologies (comma separated)" value={newProject.technologies} onChange={e => setNewProject({ ...newProject, technologies: e.target.value })} />
              <button onClick={addProject} className="btn add-btn">
                + Add Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile