#define MyAppName "Chime Hotkey Server"
#define MyAppVersion "0.0.5"
#define MyAppPublisher "Handmade, Inc."
#define MyAppURL "http://middle-of-nowhere.info/"

[Setup]
AppId={{B17629E8-C0F1-4119-9BA5-A6D909B7C582}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
LicenseFile=..\..\LICENSE
OutputBaseFilename=chime-hotkey-server
OutputDir=..\..\dest\
Compression=lzma
SolidCompression=yes
SetupIconFile=icon.ico
MinVersion=0,5.01sp3
VersionInfoVersion=0.0.1
UninstallDisplayIcon={app}\icon.ico
DisableFinishedPage=True

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "com.chime.hotkeys.win32.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\..\build\chime-hs.exe"; DestDir: "{app}"
Source: "icon.ico"; DestDir: "{app}"

[Registry]
Root: "HKLM"; Subkey: "SOFTWARE"; ValueType: none
Root: "HKLM"; Subkey: "SOFTWARE\Google"; ValueType: none; Flags: uninsdeletekeyifempty
Root: "HKLM"; Subkey: "SOFTWARE\Google\Chrome"; ValueType: none; Flags: uninsdeletekeyifempty
Root: "HKLM"; Subkey: "SOFTWARE\Google\Chrome\NativeMessagingHosts"; ValueType: none; Flags: uninsdeletekeyifempty
Root: "HKLM"; Subkey: "SOFTWARE\Google\Chrome\NativeMessagingHosts\com.chime.hotkeys"; ValueType: string; ValueData: "{app}/com.chime.hotkeys.win32.json"; Flags: deletekey uninsdeletekey

[ThirdParty]
UseRelativePaths=True
