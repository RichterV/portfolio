@echo off
:: Inicializa o repositório Git
git init

:: Adiciona todos os arquivos
git add .

:: Formata a data atual no formato yyyy-mm-dd
for /f %%i in ('powershell -command "Get-Date -Format yyyy-MM-dd"') do set CURRENT_DATE=%%i

:: Realiza o commit com a data
git commit -m "atualizações %CURRENT_DATE%"

:: Faz o push para o branch main
git push -u origin main
