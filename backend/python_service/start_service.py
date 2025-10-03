#!/usr/bin/env python3
"""
Start script for the Medical Analyzer Service
"""

import subprocess
import sys
import os

def main():
    # Change to the directory containing medical_analyzer.py
    service_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(service_dir)
    
    # Start the medical analyzer service
    try:
        print("Starting Medical Analyzer Service...")
        subprocess.run([sys.executable, "medical_analyzer.py"])
    except KeyboardInterrupt:
        print("\nMedical Analyzer Service stopped.")
    except Exception as e:
        print(f"Error starting Medical Analyzer Service: {e}")

if __name__ == "__main__":
    main()