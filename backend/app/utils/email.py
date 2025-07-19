# app/utils/email.py

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_verification_email(to_email: str, otp_code: str):
    """Sends a verification OTP email using SendGrid."""
    
    api_key = os.environ.get('SENDGRID_API_KEY')
    sender_email = os.environ.get('SENDER_EMAIL')

    if not api_key or not sender_email:
        print("WARNING: SendGrid API Key or Sender Email not configured.")
        print(f"EMAIL-STUB (Not Sent) -> To: {to_email}, Code: {otp_code}")
        return True # Pretend success for development

    message = Mail(
        from_email=sender_email,
        to_emails=to_email,
        subject='Your Verification Code',
        html_content=f"""
            <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                <h2>Procurement Network Verification</h2>
                <p>Thank you for registering. Please use the code below to complete your registration.</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 10px; border-radius: 5px;">
                    {otp_code}
                </p>
                <p>This code will expire in 10 minutes.</p>
            </div>
        """
    )
    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        print(f"SendGrid response status code: {response.status_code}")
        return response.status_code in [200, 202]
    except Exception as e:
        print(f"Error sending email via SendGrid: {e}")
        return False