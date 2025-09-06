import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import paymentService from '../../services/paymentService';
import './PaymentTracking.css';

const PaymentTracking = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };
      
      const response = await paymentService.getPayments(params);
      setPayments(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('Failed to load payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await paymentService.updatePayment(paymentId, { status: newStatus });
      fetchPayments();
    } catch (err) {
      console.error('Error updating payment status:', err);
      alert('Failed to update payment status');
    }
  };

  const handleRefund = async (paymentId) => {
    if (window.confirm('Are you sure you want to process a refund for this payment?')) {
      try {
        await paymentService.processRefund(paymentId);
        fetchPayments();
      } catch (err) {
        console.error('Error processing refund:', err);
        alert('Failed to process refund');
      }
    }
  };

  const columns = [
    {
      key: 'order_id',
      label: 'Order ID',
      render: (payment) => (
        <span className="order-id">{payment.order_id}</span>
      )
    },
    {
      key: 'user',
      label: 'Customer',
      render: (payment) => (
        <div className="customer-cell">
          <h4>{payment.user?.name || 'N/A'}</h4>
          <p>{payment.user?.email || 'N/A'}</p>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (payment) => (
        <span className="amount">
          ₹{payment.amount.toLocaleString()}
        </span>
      )
    },
    {
      key: 'payment_method',
      label: 'Method',
      render: (payment) => {
        const method = payment.payment_method || '';
        return (
          <span className={`method-badge method-${method}`}>
            {method ? method.toUpperCase() : 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (payment) => (
        <select 
          value={payment.status}
          onChange={(e) => handleStatusChange(payment.id, e.target.value)}
          className={`status-select status-${payment.status}`}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (payment) => new Date(payment.created_at).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (payment) => (
        <div className="action-buttons">
          {payment.status === 'completed' && (
            <button 
              className="btn btn-sm btn-warning"
              onClick={() => handleRefund(payment.id)}
              title="Process Refund"
            >
              <i className="fas fa-undo"></i>
            </button>
          )}
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => window.open(`/admin/payments/${payment.id}`, '_blank')}
            title="View Details"
          >
            <i className="fas fa-eye"></i>
          </button>
        </div>
      )
    }
  ];

  if (loading && payments.length === 0) {
    return (
      <div className="payment-tracking loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-tracking">
      <div className="page-header">
        <div className="page-title">
          <h1>Payment Tracking</h1>
          <p>Monitor and manage payment transactions</p>
        </div>
      </div>

      <div className="page-content">
        <div className="content-card">
          <div className="card-header">
            <div className="filters">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input 
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button onClick={fetchPayments} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={payments}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracking;
