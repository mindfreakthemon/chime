#include <windows.h>
#include <string.h>
#include <sstream>
#include <iostream>
#include <conio.h>

using namespace std;

struct HK {
	size_t key;
	size_t modifier;
	string command;
	string id;
};

inline void output_mess(const char *str, size_t len) {
	len += 2;

	fwrite(&len, 4, 1, stdout);
	printf("\"%s\"", str);
	fflush(stdout);
}

DWORD ThreadProc(LPVOID lpdwThreadParam ) {
	getchar();
	ExitProcess(0);

	return 0;
}

size_t main(int argc, char *argv[]) {
	fflush(stdin);

	HK hotkeys[] = {
		{ VK_MEDIA_STOP, 0, "click", "play-pause" },
		{ VK_MEDIA_PREV_TRACK, 0, "click", "rewind" },
		{ VK_MEDIA_NEXT_TRACK, 0, "click", "forward" },
		{ VK_MEDIA_PLAY_PAUSE, 0, "click", "play-pause" },
		{ VK_LAUNCH_MEDIA_SELECT, 0, "launch", "" }
	};
	HK *htptr = NULL;

	size_t hklen = 9;

	for (size_t i = 0; i < hklen; ++i) {
		RegisterHotKey(NULL, i + 1, hotkeys[i].modifier, hotkeys[i].key);
	}

	MSG msg;
	BOOL bRet;

	CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE) &ThreadProc, NULL, 0, NULL);

	output_mess("ehlo", 4);
	
	while((bRet = GetMessage(&msg, NULL, 0, 0)) != 0) { 
		if (bRet == -1) {
			return 1;
		}

		if (msg.message == WM_HOTKEY) {
			htptr = &hotkeys[msg.wParam - 1];

			ostringstream os;
			os << htptr->command << ":" << htptr->id;
			string str = os.str();

			output_mess(str.c_str(), str.length());
		} else {
			TranslateMessage(&msg);
			DispatchMessage(&msg);
		}
	}

    return 0;
}
