# api_tester.py

import requests
import random
import os

# Base URL of your running Flask application
BASE_URL = "http://127.0.0.1:8080/api/auth"

def print_response(response):
    """Helper function to print API response details."""
    print(f"\n--- Status Code: {response.status_code} ---")
    try:
        print("--- Response JSON ---")
        print(response.json())
    except requests.exceptions.JSONDecodeError:
        print("--- Response Text ---")
        print(response.text)
    print("---------------------\n")

def test_registration():
    """Tests the user registration flow."""
    print("--- Testing User Registration ---")
    
    # Generate a random phone number to avoid conflicts
    phone_number = f"+249966842494"
    password = "password123"
    full_name = "Test User"

    print(f"Attempting to register with:")
    print(f"  Full Name: {full_name}")
    print(f"  Phone: {phone_number}")
    print(f"  Password: {password}")

    payload = {
        "fullName": full_name,
        "phoneNumber": phone_number,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/register", json=payload)
    print_response(response)

    if response.status_code == 201:
        print("Registration successful! Now let's verify the phone number.")
        # In a real scenario, you'd get this from the SMS.
        # Since our backend prints the code, we'll ask the user to provide it.
        verification_code = input("Enter the 6-digit verification code from your terminal's Flask logs: ")
        
        verify_payload = {
            "phoneNumber": phone_number,
            "code": verification_code.strip()
        }
        
        verify_response = requests.post(f"{BASE_URL}/verify-phone", json=verify_payload)
        print("--- Verifying Phone ---")
        print_response(verify_response)
        if verify_response.status_code == 200:
            print("Phone verification successful! User is now logged in.")
        else:
            print("Phone verification failed.")
    
    return phone_number, password


def test_login(phone_number, password):
    """Tests the user login flow."""
    print("\n--- Testing User Login ---")
    print(f"Attempting to log in with Phone: {phone_number} and Password: {password}")
    
    payload = {
        "phoneNumber": phone_number,
        "password": password
    }

    # Use a session object to store cookies automatically
    session = requests.Session()
    
    response = session.post(f"{BASE_URL}/login", json=payload)
    print_response(response)

    if response.status_code == 200:
        print("Login successful!")
        # Test a protected endpoint
        print("\n--- Testing Protected Endpoint with Login Session ---")
        test_perm_response = session.get(f"{BASE_URL}/test-permission")
        print("Trying to access /test-permission (should fail for regular user)")
        print_response(test_perm_response)

        # Test logout
        print("\n--- Testing Logout ---")
        logout_response = session.post(f"{BASE_URL}/logout")
        print_response(logout_response)

        # Test protected endpoint again (should fail)
        print("\n--- Testing Protected Endpoint After Logout ---")
        test_perm_response_after_logout = session.get(f"{BASE_URL}/test-permission")
        print("Trying to access /test-permission again (should fail)")
        print_response(test_perm_response_after_logout)


def test_password_reset(phone_number):
    """Tests the password reset flow."""
    print("\n--- Testing Password Reset ---")
    print(f"Requesting password reset for: {phone_number}")

    # Step 1: Request reset code
    forgot_payload = {"phoneNumber": phone_number}
    response_forgot = requests.post(f"{BASE_URL}/password/forgot", json=forgot_payload)
    print_response(response_forgot)
    
    if response_forgot.status_code != 200:
        print("Failed to request password reset code.")
        return

    # Step 2: Verify the code
    reset_code = input("Enter the 6-digit password reset code from your terminal's Flask logs: ")
    verify_payload = {"phoneNumber": phone_number, "code": reset_code.strip()}
    response_verify = requests.post(f"{BASE_URL}/password/verify-code", json=verify_payload)
    print_response(response_verify)

    if response_verify.status_code != 200:
        print("Code verification failed.")
        return
    
    # Step 3: Set a new password
    print("Code verified! Now setting a new password.")
    new_password = "new_password456"
    reset_payload = {"phoneNumber": phone_number, "newPassword": new_password}
    response_reset = requests.post(f"{BASE_URL}/password/reset", json=reset_payload)
    print_response(response_reset)
    
    if response_reset.status_code == 200:
        print("Password reset successful!")
        print("\n--- Testing Login with NEW Password ---")
        test_login(phone_number, new_password)


if __name__ == "__main__":
    print("Starting API tests...")
    
    # Make sure the server is running before executing this script.
    
    # Test registration and verification
    phone, pw = test_registration()
    
    # Test login with the newly created user
    test_login(phone, pw)
    
    # Test the password reset flow for that same user
    test_password_reset(phone)
    
    print("\nAll tests completed.")