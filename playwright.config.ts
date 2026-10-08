import { defineConfig } from '@playwright/test'
export default defineConfig({
 testDir:'./tests/e2e',workers:1,fullyParallel:false,timeout:60000,
 use:{baseURL:'http://localhost:3100',trace:'retain-on-failure'},
 webServer:{command:'node scripts/test-server.mjs',url:'http://localhost:3100',reuseExistingServer:false,timeout:120000},
})
