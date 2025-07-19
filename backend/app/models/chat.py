# app/models/chat.py

import uuid
from datetime import datetime
from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID, JSONB

class ChatSession(db.Model):
    __tablename__ = 'chat_sessions'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = db.relationship('User')
    messages = db.relationship('ChatMessage', back_populates='session', lazy='joined', cascade='all, delete-orphan', order_by='ChatMessage.created_at')

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = db.Column(UUID(as_uuid=True), db.ForeignKey('chat_sessions.id', ondelete='CASCADE'), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    session = db.relationship('ChatSession', back_populates='messages')
    resources = db.relationship('MessageResource', back_populates='message', lazy='joined', cascade='all, delete-orphan')

class MessageResource(db.Model):
    __tablename__ = 'message_resources'

    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(UUID(as_uuid=True), db.ForeignKey('chat_messages.id', ondelete='CASCADE'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    resource_metadata = db.Column(JSONB, nullable=False)

    message = db.relationship('ChatMessage', back_populates='resources')

    def __repr__(self):
        return f'<MessageResource {self.id} for Message {self.message_id}>'