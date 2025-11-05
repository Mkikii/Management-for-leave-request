import requests
import json

BASE_URL = "http://localhost:5000"

def test_backend():
    print("Testing Leave Management System Backend...\\n")
    
    # 1. Test Admin Login
    print("1. Testing Admin Login...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login", 
                               json={"email": "admin@company.com", "password": "admin123"})
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✓ Admin login successful")
            admin_token = response.json()['access_token']
            print(f"Token: {admin_token[:20]}...")
        else:
            print("✗ Admin login failed")
            print(f"Error: {response.json()}")
            return
    except Exception as e:
        print(f"✗ Admin login error: {e}")
        return
    
    # 2. Test Employee Login
    print("\\n2. Testing Employee Login...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login", 
                               json={"email": "john@company.com", "password": "password123"})
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✓ Employee login successful")
            employee_token = response.json()['access_token']
        else:
            print("✗ Employee login failed")
            print(f"Error: {response.json()}")
    except Exception as e:
        print(f"✗ Employee login error: {e}")
    
    # 3. Test Registration
    print("\\n3. Testing Registration...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={"name": "Test User", "email": "test2@company.com", "password": "test123"})
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            print("✓ Registration successful")
        else:
            print("✗ Registration failed")
            print(f"Error: {response.json()}")
    except Exception as e:
        print(f"✗ Registration error: {e}")
    
    print("\\n✅ Backend testing completed!")

if __name__ == '__main__':
    test_backend()
