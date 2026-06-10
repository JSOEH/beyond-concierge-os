import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { Shell } from "@/components/Shell";
import "@/index.css";

const ExecutiveSnapshot = lazy(() => import("@/modules/ExecutiveSnapshot"));
const ProfitEngine = lazy(() => import("@/modules/ProfitEngine"));
const IvCalculator = lazy(() => import("@/modules/IvCalculator"));
const Glp1Center = lazy(() => import("@/modules/Glp1Center"));
const InventoryCenter = lazy(() => import("@/modules/InventoryCenter"));
const SeoCenter = lazy(() => import("@/modules/SeoCenter"));
const SocialCenter = lazy(() => import("@/modules/SocialCenter"));
const AdvertisingCenter = lazy(() => import("@/modules/AdvertisingCenter"));
const CrmPartnerships = lazy(() => import("@/modules/CrmPartnerships"));
const GrowthPlanner = lazy(() => import("@/modules/GrowthPlanner"));
const AiAdvisor = lazy(() => import("@/modules/AiAdvisor"));

const router = createHashRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <ExecutiveSnapshot /> },
      { path: "advisor", element: <AiAdvisor /> },
      { path: "profit", element: <ProfitEngine /> },
      { path: "iv", element: <IvCalculator /> },
      { path: "glp1", element: <Glp1Center /> },
      { path: "inventory", element: <InventoryCenter /> },
      { path: "seo", element: <SeoCenter /> },
      { path: "social", element: <SocialCenter /> },
      { path: "ads", element: <AdvertisingCenter /> },
      { path: "crm", element: <CrmPartnerships /> },
      { path: "growth", element: <GrowthPlanner /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
