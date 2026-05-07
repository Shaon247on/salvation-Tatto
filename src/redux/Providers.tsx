"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { Loader2 } from "lucide-react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {/* PersistGate delays rendering until state is rehydrated */}
      <PersistGate
        loading={
          <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
