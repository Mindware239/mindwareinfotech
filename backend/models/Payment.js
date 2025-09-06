const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  razorpay_order_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  razorpay_payment_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  razorpay_signature: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.ENUM('razorpay', 'card', 'netbanking', 'upi', 'wallet'),
    defaultValue: 'razorpay'
  },
  items: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  payment_details: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  refund: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'payments',
  hooks: {
    beforeCreate: async (payment) => {
      if (!payment.order_id) {
        const count = await Payment.count();
        payment.order_id = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
      }
    }
  }
});

// Instance methods
Payment.prototype.markCompleted = async function(paymentData) {
  this.status = 'completed';
  this.razorpay_payment_id = paymentData.paymentId;
  this.razorpay_signature = paymentData.signature;
  this.payment_details = {
    transaction_id: paymentData.paymentId,
    gateway: 'razorpay',
    gateway_transaction_id: paymentData.paymentId,
    gateway_response: paymentData
  };
  return await this.save();
};

Payment.prototype.markFailed = async function(reason) {
  this.status = 'failed';
  this.notes = reason;
  return await this.save();
};

Payment.prototype.processRefund = async function(amount, reason) {
  this.status = 'refunded';
  this.refund = {
    amount: amount || this.amount,
    reason: reason,
    processed_at: new Date(),
    refund_id: `REF${Date.now()}`
  };
  return await this.save();
};

module.exports = Payment;