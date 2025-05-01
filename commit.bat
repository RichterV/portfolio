@echo off
:: Define o código de página UTF-8
chcp 65001 > nul

:: Inicializa o repositório Git
git init

:: Adiciona todos os arquivos
git add .

:: Pega a data atual no formato yyyy-MM-dd
for /f %%i in ('powershell -command "Get-Date -Format yyyy-MM-dd"') do set CURRENT_DATE=%%i

:: Faz o commit com mensagem contendo acentuação
git commit -m "atualizações %CURRENT_DATE%"

:: Faz push para o repositório remoto
git push -u origin main
pause