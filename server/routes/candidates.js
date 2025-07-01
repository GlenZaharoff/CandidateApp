const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Register
router.post('/register', upload.single('cv'), async (req, res) => {
  const {
    firstName, lastName, iqamaNumber, address, jobTitle, email, phone, password
  } = req.body;
  const cvPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO candidates 
       (first_name, last_name, iqama_number, address, job_title, email, phone, password, cv)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [firstName, lastName, iqamaNumber, address, jobTitle, email, phone, hashedPassword, cvPath]
    );
    res.status(201).json({ message: 'Candidate registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM candidates WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Candidate not found' });

    const candidate = result.rows[0];
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user: candidate });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/update', async (req, res) => {
  const { email, first_name, last_name, phone, address, job_title } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const result = await pool.query(
      `UPDATE candidates SET
       first_name = $1, last_name = $2, phone = $3, address = $4, job_title = $5
       WHERE email = $6 RETURNING *`,
      [first_name, last_name, phone, address, job_title, email]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Candidate not found' });

    res.json({ message: 'Profile updated successfully', candidate: result.rows[0] });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT id FROM candidates WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });

    const candidateId = result.rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query(
      `INSERT INTO password_reset_tokens (candidate_id, token, expires_at) VALUES ($1, $2, $3)`,
      [candidateId, token, expiresAt]
    );

const resetLink = `https://a397-62-128-207-107.ngrok-free.app/candidates/redirect-reset?token=${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Hello,</p>
        <p>You requested a password reset. Click the button below:</p>
        <p>
          <a href="${resetLink}" style="
            background-color: #007BFF;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
          ">Reset Password</a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;"><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'glen@workforcesa.com', pass: 'ydbavdzqtdowosro' },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: 'WorkForce App <glen@workforcesa.com>',
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent,
    });

    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and password required' });

  try {
    const result = await pool.query('SELECT * FROM password_reset_tokens WHERE token = $1', [token]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

    const record = result.rows[0];
    if (new Date(record.expires_at) < new Date()) return res.status(400).json({ message: 'Token has expired' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE candidates SET password = $1 WHERE id = $2', [hashedPassword, record.candidate_id]);
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redirect route for deep linking
router.get('/redirect-reset', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing token');

  const deepLink = `workforceapp://reset/password?token=${token}`;
  res.redirect(deepLink);
});

module.exports = router;
