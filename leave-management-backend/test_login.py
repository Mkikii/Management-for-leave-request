from app import create_app, db
from app.models import User

def test_passwords():
    app = create_app()
    
    with app.app_context():
        # Check if admin user exists and test password
        admin = User.query.filter_by(email='admin@company.com').first()
        if admin:
            print(f"Admin user found: {admin.name}")
            print(f"Stored password hash: {admin.password}")
            
            # Test the password
            test_result = admin.check_password('admin123')
            print(f"Password 'admin123' check: {test_result}")
        else:
            print("Admin user not found!")

if __name__ == '__main__':
    test_passwords()
