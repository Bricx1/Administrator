import {useState} from "react";

const [credentials, setCredentials] = useState({
  username: "",
  password: "",
  agencyId: "",
  clientId: "",
  clientSecret: "",
  environment: "sandbox", // or whatever default you want
});

const [referralMetrics, setReferralMetrics] = useState({
  acceptMedicare: false,
  acceptMedicaid: false,
  acceptCommercial: false,
  acceptPrivatePay: false,
  maxReimbursementRate: 0,
  maxTravelDistance: 0,
  successRate: 0,
  requiredServices: [],
  excludedDiagnoses: [],
});

const [syncSettings, setSyncSettings] = useState({
  autoEligibilityCheck: false,
  autoPriorAuth: false,
  realTimeUpdates: false,
  batchProcessing: false,
  notifyErrors: false,
  syncInterval: 60,
});



export interface ExtendedCareConfigureRequest {
  credentials: {
    username: string;
    password: string;
    clientId: string;
    clientSecret: string;
    environment: string;
    agencyId: string; // ✅ this was missing
  };
  referralMetrics: {
    acceptMedicare: boolean;
    acceptMedicaid: boolean;
    acceptCommercial: boolean;
    acceptManagedCare: boolean;
    acceptPrivatePay: boolean; // ✅ this was missing
    minReimbursementRate: number;
    maxTravelDistance: number;
    successRate: number; // ✅ this was missing
    requiredServices: string;
    excludedDiagnoses: string[];
  };
  syncSettings: {
    autoEligibilityCheck: boolean;
    autoPriorAuth: boolean;
    realTimeUpdates: boolean;
    batchProcessing: boolean;
    notifyErrors: boolean; // ✅ this was missing
    syncInterval: number;
  };
}