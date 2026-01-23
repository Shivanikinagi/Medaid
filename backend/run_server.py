#!/usr/bin/env python
"""
Start the MedAid backend server
"""
import os
import sys
import subprocess

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    os.chdir('medaid')
    
    print("Starting MedAid Backend Server...")
    print("=" * 50)
    
    subprocess.run([sys.executable, "manage.py", "runserver", "0.0.0.0:8000"])
