$shell = New-Object -ComObject Shell.Application
$batchPath = 'C:\Users\RhysC\Downloads\RQBBOX MODE\windows\scripts\Install-GamingSettings.bat'
$command = "/c `"$batchPath`""
$shell.ShellExecute('cmd.exe', $command, '', 'runas', 1)
