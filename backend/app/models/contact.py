# app/models/contact.py

from datetime import datetime
from app.extensions import db

class ContactSubmission(db.Model):
    __tablename__ = 'contact_submissions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='new') # e.g., 'new', 'read', 'archived'
    submitted_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<ContactSubmission from {self.name}>'