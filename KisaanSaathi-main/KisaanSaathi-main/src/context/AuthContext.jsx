import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllFarmers, registerNewFarmerLand } from '../data/farmerRepository';
import { submitSchemeApplication, submitLoanApplication, bookMachinery as apiBookMachinery } from '../services/apiService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [currentFarmer, setCurrentFarmer] = useState(null);
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('krishi_user_role');
      const savedFarmer = localStorage.getItem('krishi_current_farmer');
      const savedOfficer = localStorage.getItem('krishi_current_officer');
      const savedToken = localStorage.getItem('krishi_session_token');
      if (savedRole) setUserRole(savedRole);
      if (savedFarmer) setCurrentFarmer(JSON.parse(savedFarmer));
      if (savedOfficer) setCurrentOfficer(JSON.parse(savedOfficer));
      if (savedToken) setSessionToken(savedToken);
    } catch (e) {
      console.warn('Error restoring auth state:', e);
    }
  }, []);

  const persistFarmer = (farmer) => {
    try {
      localStorage.setItem('krishi_current_farmer', JSON.stringify(farmer));
    } catch (e) {}
  };

  const loginFarmer = (loginData) => {
    const allFarmers = getAllFarmers();
    const matched = allFarmers.find(f => {
      if (loginData.mobile && f.mobile === loginData.mobile) return true;
      if (loginData.name && f.name.toLowerCase() === loginData.name.toLowerCase()) return true;
      if (loginData.aadhaar && f.aadhaar && f.aadhaar.replace(/\s/g, '') === loginData.aadhaar.replace(/\s/g, '')) return true;
      return false;
    });
    const activeFarmer = matched || loginData;
    const token = 'token_ks_' + Math.random().toString(36).substring(2) + Date.now();
    setUserRole('farmer');
    setCurrentFarmer(activeFarmer);
    setCurrentOfficer(null);
    setSessionToken(token);
    try {
      localStorage.setItem('krishi_user_role', 'farmer');
      localStorage.setItem('krishi_current_farmer', JSON.stringify(activeFarmer));
      localStorage.removeItem('krishi_current_officer');
      localStorage.setItem('krishi_session_token', token);
    } catch (e) {}
  };

  const registerLand = (landData) => {
    const newFarmer = registerNewFarmerLand(landData);
    const token = 'token_ks_' + Math.random().toString(36).substring(2) + Date.now();
    setUserRole('farmer');
    setCurrentFarmer(newFarmer);
    setCurrentOfficer(null);
    setSessionToken(token);
    try {
      localStorage.setItem('krishi_user_role', 'farmer');
      localStorage.setItem('krishi_current_farmer', JSON.stringify(newFarmer));
      localStorage.removeItem('krishi_current_officer');
      localStorage.setItem('krishi_session_token', token);
    } catch (e) {}
    return newFarmer;
  };

  const loginOfficer = (officerData) => {
    const defaultOfficer = {
      officerId: officerData?.officerId || 'DAO-OD-7042',
      name: officerData?.name || 'Dr. S. K. Mohapatra',
      district: officerData?.district || 'Khurda District',
      designation: officerData?.designation || 'District Agriculture Officer (DAO)',
      department: 'Department of Agriculture & Farmers Empowerment (Govt of Odisha)'
    };

    const token = 'token_officer_' + Math.random().toString(36).substring(2) + Date.now();
    setUserRole('officer');
    setCurrentOfficer(defaultOfficer);
    setCurrentFarmer(null);
    setSessionToken(token);
    try {
      localStorage.setItem('krishi_user_role', 'officer');
      localStorage.setItem('krishi_current_officer', JSON.stringify(defaultOfficer));
      localStorage.removeItem('krishi_current_farmer');
      localStorage.setItem('krishi_session_token', token);
    } catch (e) {}
  };

  const logout = () => {
    setUserRole(null);
    setCurrentFarmer(null);
    setCurrentOfficer(null);
    setSessionToken(null);
    try {
      localStorage.removeItem('krishi_user_role');
      localStorage.removeItem('krishi_current_farmer');
      localStorage.removeItem('krishi_current_officer');
      localStorage.removeItem('krishi_session_token');
    } catch (e) {}
  };

  const applyToScheme = (scheme) => {
    const result = submitSchemeApplication(scheme.name, currentFarmer || {});
    const newRecord = {
      id: 'app-' + scheme.id + '-' + Date.now(),
      schemeId: scheme.id,
      schemeName: scheme.name,
      appliedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      applicationNo: result.refId,
      category: scheme.category,
      status: 'Application Submitted',
      statusStep: 1,
      statusMessage: result.trackingMsg,
      claimAmount: result.estBenefit,
      disbursedAmount: null,
      bankAccount: 'Bank Account (DBT Linked)',
      documentChecklist: scheme.documentsRequired || ['Aadhaar Copy', 'Land Record (RoR)', 'Bank Passbook']
    };
    setCurrentFarmer(prev => {
      const updated = {
        ...prev,
        appliedSchemes: [...(prev?.appliedSchemes || []), newRecord]
      };
      persistFarmer(updated);
      return updated;
    });
    return newRecord;
  };

  const bookMachinery = (selectedList) => {
    const bookings = selectedList.map(({ machine, durationDays }) => {
      const result = apiBookMachinery(machine.name, durationDays, currentFarmer || {});
      return {
        bookingId: result.bkgId,
        machineId: machine.id,
        name: machine.name,
        bookedOn: new Date().toLocaleDateString('en-IN'),
        scheduledDate: result.deliveryDate,
        durationDays,
        totalCost: result.totalAmount,
        provider: result.pickupLocation,
        phone: machine.phone || '9800000000',
        status: 'Confirmed & Driver Assigned',
        lossAnalysis: 'Saves manual labor cost vs traditional method'
      };
    });
    setCurrentFarmer(prev => {
      const updated = {
        ...prev,
        rentedMachines: [...(prev?.rentedMachines || []), ...bookings]
      };
      persistFarmer(updated);
      return updated;
    });
    return bookings;
  };

  return (
    <AuthContext.Provider value={{
      role: userRole,
      userRole,
      user: currentFarmer || currentOfficer,
      currentFarmer,
      currentOfficer,
      sessionToken,
      loginFarmer,
      registerLand,
      loginOfficer,
      logout,
      applyToScheme,
      bookMachinery,
      showLanguageModal,
      setShowLanguageModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
