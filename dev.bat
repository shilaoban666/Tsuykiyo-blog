@echo off
chcp 65001 >nul
title Tsukiyo Blog - Development
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start.ps1" -Dev
if errorlevel 1 pause