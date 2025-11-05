from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import LeaveRequest, User

# Define the blueprint FIRST
admin_bp = Blueprint('admin', __name__)

# THEN use the route decorators
@admin_bp.route('/leaves/<int:leave_id>/status', methods=['PATCH'])
@jwt_required()
def update_leave_status(leave_id):
    try:
        current_user = get_jwt_identity()
        
        if current_user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        if data['status'] not in ['approved', 'rejected']:
            return jsonify({'error': 'Invalid status. Must be "approved" or "rejected"'}), 400
        
        leave_request = LeaveRequest.query.get(leave_id)
        
        if not leave_request:
            return jsonify({'error': 'Leave request not found'}), 404
        
        leave_request.status = data['status']
        db.session.commit()
        
        return jsonify({'message': 'Leave request updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        current_user = get_jwt_identity()
        
        if current_user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        users = User.query.all()
        result = [user.to_dict() for user in users]
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    try:
        current_user = get_jwt_identity()
        
        if current_user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        total_requests = LeaveRequest.query.count()
        pending_requests = LeaveRequest.query.filter_by(status='pending').count()
        approved_requests = LeaveRequest.query.filter_by(status='approved').count()
        rejected_requests = LeaveRequest.query.filter_by(status='rejected').count()
        total_employees = User.query.filter_by(role='employee').count()
        
        return jsonify({
            'total_requests': total_requests,
            'pending_requests': pending_requests,
            'approved_requests': approved_requests,
            'rejected_requests': rejected_requests,
            'total_employees': total_employees
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500