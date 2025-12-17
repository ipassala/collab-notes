#!/bin/bash
clear
npx concurrently -n "backend,frontend" -c "blue,green" "npm run dev --prefix backend" "npm run dev --prefix frontend"