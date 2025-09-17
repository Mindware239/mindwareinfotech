import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/design-system.css';

const AdminLayout = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <Outlet />
    </motion.div>
  );
};

export default AdminLayout;
