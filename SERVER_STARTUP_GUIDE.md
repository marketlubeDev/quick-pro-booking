# Server Startup Guide - Fix Connection Refused Error

## 🚨 **Problem**: `ERR_CONNECTION_REFUSED` Error

The error `GET http://localhost:5000/api/profile/all?limit=1000 net::ERR_CONNECTION_REFUSED` means the server is not running.

## ✅ **Solution Steps**

### **Step 1: Open Terminal/Command Prompt**
1. Open a new terminal/command prompt window
2. Navigate to the server directory:
   ```bash
   cd "C:\Users\marke\OneDrive\Desktop\skill-hand\quick-pro-booking\skillhands-server"
   ```

### **Step 2: Install Dependencies (if needed)**
```bash
npm install
```

### **Step 3: Start the Server**
Choose one of these methods:

#### **Method 1: Development Mode (Recommended)**
```bash
npm run dev
```

#### **Method 2: Production Mode**
```bash
npm start
```

#### **Method 3: Direct Node Command**
```bash
node server.js
```

### **Step 4: Verify Server is Running**
You should see output like:
```
Server running on port 5000
Environment: development
```

### **Step 5: Test the Connection**
Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see a response like:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## 🔧 **Troubleshooting**

### **If Server Still Won't Start:**

1. **Check Port 5000 is Available:**
   ```bash
   netstat -ano | findstr :5000
   ```
   If something is using port 5000, kill it or change the port in the `env` file.

2. **Check Database Connection:**
   - Make sure MongoDB is accessible
   - Check the `MONGODB_URI` in the `env` file

3. **Check Environment Variables:**
   - Make sure the `env` file exists in the server directory
   - Verify all required variables are set

4. **Check Node.js Version:**
   ```bash
   node --version
   ```
   Should be Node.js 16+ (you have v22.17.0 which is perfect)

### **Alternative Port (if 5000 is busy):**
1. Edit the `env` file:
   ```
   PORT=3001
   ```
2. Update the client API base URL in `skillhands-client/src/lib/api.ts`:
   ```javascript
   const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
   ```

## 🎯 **Expected Result**

After starting the server:
- ✅ Server runs on port 5000
- ✅ Database connects successfully
- ✅ API endpoints are accessible
- ✅ Employee applications page loads all 28 employees
- ✅ No more `ERR_CONNECTION_REFUSED` errors

## 📝 **Quick Commands Summary**

```bash
# Navigate to server directory
cd "C:\Users\marke\OneDrive\Desktop\skill-hand\quick-pro-booking\skillhands-server"

# Install dependencies
npm install

# Start server in development mode
npm run dev

# Or start in production mode
npm start
```

## 🚀 **After Server Starts**

1. **Refresh your browser** on the employee applications page
2. **Check the console** - you should see:
   ```
   Fetched 28 employee applications
   Total applications: 28, Visible (non-admin): 28
   ```
3. **All 28 employees** should now be visible on the page

**The server must be running for the client to work!** 🎉
