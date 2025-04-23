import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [
      react({
          babel: {
              plugins: [
                  [
                      "@babel/plugin-proposal-decorators",
                      {
                          version: "2023-05"
                      }
                  ]
              ]
          }
      })
  ],
  server:{
    host: true,
    allowedHosts: ['frontend.vm1.test']
  }
});