"use client";

import { IntegrationAppProvider } from "@integration-app/react";

export const ProviderIntegrationApp = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <IntegrationAppProvider
      token={process.env.NEXT_PUBLIC_INTEGRATION_APP_TOKEN}
    >
      {children}
    </IntegrationAppProvider>
  );
};
