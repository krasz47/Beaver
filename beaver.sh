chmod +x beaver-frontend/setup-start.sh
chmod +x beaver-backend/setup-start.sh

cd beaver-frontend
./setup-start.sh &
cd ..
cd beaver-backend
./setup-start.sh &
