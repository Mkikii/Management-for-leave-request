from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash

def seed_database():
    app = create_app()
    
    with app.app_context():
        # Drop and recreate all tables
        db.drop_all()
        db.create_all()
        
        # Create admin user with proper password hashing
        admin_user = User(
            name='Admin User',
            email='admin@company.com',
            role='admin'
        )
        admin_user.password = generate_password_hash('admin123')
        
        # Create employee users
        employee1 = User(
            name='John Doe',
            email='john@company.com',
            role='employee'
        )
        employee1.password = generate_password_hash('password123')
        
        employee2 = User(
            name='Jane Smith',
            email='jane@company.com',
            role='employee'
        )
        employee2.password = generate_password_hash('password123')
        
        # Add to database
        db.session.add(admin_user)
        db.session.add(employee1)
        db.session.add(employee2)
        db.session.commit()
        
        print("Database seeded successfully!")
        print("Admin credentials: admin@company.com / admin123")
        print("Employee credentials: john@company.com / password123")
        print("Employee credentials: jane@company.com / password123")
        
        # Verify passwords work
        print("\nVerifying passwords...")
        admin = User.query.filter_by(email='admin@company.com').first()
        if admin and admin.check_password('admin123'):
            print("✓ Admin password verified")
        else:
            print("✗ Admin password failed")
        
        john = User.query.filter_by(email='john@company.com').first()
        if john and john.check_password('password123'):
            print("✓ John password verified")
        else:
            print("✗ John password failed")

if __name__ == '__main__':
    seed_database()