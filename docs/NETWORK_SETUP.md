# Network Access Guide - Running on Local Network

This guide explains how to set up the application so other computers on your network can access it.

## Quick Start

### Option 1: Using Local Backend (Recommended for Development)

1. **Start the Backend Server**
   ```powershell
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - `--host 0.0.0.0` allows connections from any computer on the network
   - Note your computer's IP address (e.g., `192.168.1.100`)

2. **Start the Frontend Server**
   ```powershell
   cd frontend
   set HOST=0.0.0.0
   npm start
   ```
   - The Create React App dev server will accept external connections
   - Uses proxy (configured in package.json) to route API calls to the backend

3. **Access from Other Computers**
   - Find your computer's IP address:
     ```powershell
     ipconfig
     ```
     Look for "IPv4 Address" (e.g., `192.168.1.100`)
   
   - On other computers, open browser and go to:
     ```
     http://192.168.1.100:3000
     ```
     (Replace `192.168.1.100` with your actual IP)

### Option 2: Using Deployed Backend (Vercel)

If you want to use the deployed Vercel backend instead of running it locally:

1. **Update .env file**
   ```bash
   # frontend/.env
   REACT_APP_API_URL=https://mahindraservicesapi.vercel.app
   ```

2. **Start Frontend Only**
   ```powershell
   cd frontend
   set HOST=0.0.0.0
   npm start
   ```

3. **Access from Other Computers**
   - Same as above: `http://YOUR_IP:3000`

## Troubleshooting

### Buttons Not Working from Other Computers

**Symptom**: Generate Report, Download CSV, or View Roadmap buttons don't work when accessed remotely.

**Solutions**:

1. **Check Backend is Running with Network Access**
   ```powershell
   # Make sure backend is started with --host 0.0.0.0
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Verify Firewall Settings**
   - Windows Firewall might block incoming connections
   - Allow Python and Node.js through firewall:
     - Open "Windows Defender Firewall"
     - Click "Allow an app through firewall"
     - Find Python and Node.js, enable both Private and Public networks

3. **Check Browser Console**
   - On the remote computer, press F12 to open Developer Tools
   - Look for errors in the Console tab
   - Check Network tab for failed API requests

4. **Verify Network Connectivity**
   - From the other computer, try to access backend directly:
     ```
     http://YOUR_IP:8000/docs
     ```
   - If this doesn't work, it's a network/firewall issue

### Common Issues

#### Issue: "Connection Refused" or "Network Error"
**Solution**: Backend isn't accessible. Check:
- Backend is running with `--host 0.0.0.0`
- Firewall allows port 8000
- Both computers are on same network

#### Issue: "CORS Error"
**Solution**: Already handled in backend configuration, but verify:
- Backend main.py has `allow_origins=["*"]`
- No additional proxy/VPN blocking requests

#### Issue: Buttons Click But Nothing Happens
**Solution**: Open browser console (F12) to see error messages
- Usually means API call is failing silently
- Check Network tab for failed requests
- Verify API_BASE_URL in console logs

## Network Security Notes

⚠️ **Important**: Running with `--host 0.0.0.0` and `allow_origins=["*"]` is fine for local development but NOT for production.

For production deployment:
- Use HTTPS
- Restrict CORS origins to specific domains
- Use proper authentication
- Deploy to proper hosting (Vercel, AWS, etc.)

## Getting Your IP Address

### Windows
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually WiFi or Ethernet)

### Quick Test
Test if your backend is accessible from another computer:
```bash
# From another computer
curl http://YOUR_IP:8000/health
```

Should return: `{"status":"healthy","timestamp":"..."}`

## Summary

✅ **Backend**: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`  
✅ **Frontend**: `set HOST=0.0.0.0 && npm start` (configured for network access)  
✅ **Access**: `http://YOUR_IP:3000` from any computer on the network  
✅ **Verify**: Check browser console for API connection logs
