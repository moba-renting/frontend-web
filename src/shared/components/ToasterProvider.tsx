import React from "react";
import { Toaster } from "react-hot-toast";

const ToasterProvider: React.FC = () => {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          fontSize: '14px',
          padding: '12px 16px',
          borderRadius: '8px',
          maxWidth: '90vw',
          minWidth: '280px',
        },
        success: {
          style: {
            background: '#10b981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
      }}
      containerStyle={{
        top: '20px',
        left: '20px',
        right: '20px',
      }}
    />
  );
};

export default ToasterProvider;
