# Deploying the AI Microservice (Linux VM)

This guide provides instructions on how to deploy the `prasikshan-ai-service` onto a Linux Virtual Machine (e.g., Ubuntu/Debian) alongside your primary Next.js application using PM2.

Because your frontend already utilizes **PM2** for process management, we can elegantly use it to supervise the FastAPI application as well. This guarantees 24/7 uptime and automatic restarts on server reboots.

## Prerequisites
- A Linux VM with SSH access.
- Python 3.10+ installed natively.
- `pm2` installed globally via npm.

---

### 1. Install PM2 (If not installed)
Since you are setting up PM2 to run persistent background services, install it globally using Node Package Manager (npm):
```bash
sudo apt update
sudo apt install npm
sudo npm install -g pm2
```

### 2. Pull Your Code
SSH into your Virtual Machine, navigate to your cloned repository, and pull the latest production code:

```bash
cd /path/to/Prasikshan/prasikshan-ai-service
git pull origin main
```

### 2. Setup the Python Virtual Environment
We must isolate the Python dependencies inside a local virtual environment to ensure stability.

```bash
# Install venv and pip if you haven't already
sudo apt update
sudo apt install python3-venv python3-pip

# Create the virtual environment
python3 -m venv venv

# Activate it and install your FastAPI requirements
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Setup Environment Variables Securely
Create your local `.env` file since this file is ignored by Git for security reasons. 

```bash
nano .env
```
Paste your Azure OpenAI credentials inside:
```env
AZURE_OPENAI_ENDPOINT=your_api_end_point
AZURE_OPENAI_API_KEY=your_azure_api_key_here
```
*(Press `Ctrl+X`, then type `Y`, then `Enter` to save the file).*

### Method A: Deploy with PM2 🚀
Instead of running it manually, configure PM2 to launch Uvicorn (FastAPI's engine) natively from *inside* the virtual environment.

Run this simple command:
```bash
pm2 start "venv/bin/uvicorn app:app --host 127.0.0.1 --port 5001" --name "prasikshan-ai"
```

Save your PM2 processes to lock them in permanently:
```bash
pm2 save
```

---

### Method B: Deploy using Native Linux `systemd` (Recommended if PM2 is not installed)
If you do not want to install `npm` and `pm2`, you can use Ubuntu's built-in background service manager called **systemd**.

**Step 1:** Create a new service file:
```bash
sudo nano /etc/systemd/system/prasikshan-ai.service
```

**Step 2:** Paste this exact content inside (modify `/path/to/Prasikshan` to your actual absolute path):
```ini
[Unit]
Description=Prasikshan FastAPI AI Service
After=network.target

[Service]
User=alok-aman
Group=www-data
WorkingDirectory=/home/alok-aman/a/P/prasikshan-ai-service
Environment="PATH=/home/alok-aman/a/P/prasikshan-ai-service/venv/bin"
ExecStart=/home/alok-aman/a/P/prasikshan-ai-service/venv/bin/uvicorn app:app --host 127.0.0.1 --port 5001
Restart=always

[Install]
WantedBy=multi-user.target
```
*(Press `Ctrl+X`, then `Y`, then `Enter` to save).*

**Step 3:** Enable and start it:
```bash
sudo systemctl daemon-reload
sudo systemctl enable prasikshan-ai
sudo systemctl start prasikshan-ai
```
*(To check if it is running, type: `sudo systemctl status prasikshan-ai`)*

### 5. Final Connection Verification
Your Next.js environment (`prasikshan/.env` on the VM) routing must match the running port.
Ensure your Next.js `.env` production file has this configured:
```env
# Since Next.js and FastAPI are on the same VM:
AI_SERVICE_URL=http://127.0.0.1:5001
```

Once updated, instantly restart your frontend app: 
```bash
pm2 restart prasikshan
```

🎉 **Success!** Your system is now securely utilizing the asynchronous FastAPI microservice to process PPDT reviews locally via Azure OpenAI.

---

## 🔄 Updating Code & Redeploying
Whenever you modify the Python code inside the `prasikshan-ai-service` repository locally and push it to GitHub, you will need to seamlessly redeploy those changes to this Virtual Machine.

Follow these simple steps to update your live backend:

**1. Pull the Latest Changes:**
Navigate to your directory and pull the newest commits:
```bash
cd /path/to/Prasikshan/prasikshan-ai-service
git pull origin main
```

**2. Install Any New Dependencies** *(Only required if you added new libraries to requirements.txt)*:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**3. Restart the Background Processing Engine:**
If you deployed using PM2 (Method A):
```bash
pm2 restart prasikshan-ai
```

If you deployed using Native Systemd (Method B):
```bash
sudo systemctl restart prasikshan-ai
```

Your new AI logic will immediately be live and accessible to the frontend!
