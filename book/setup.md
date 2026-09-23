# Course setup

Use **Python 3.9 or later** and [Visual Studio Code (VS Code)](https://code.visualstudio.com/). Do not use Python 2. The course uses only Python's standard library, so you do not need Anaconda, Jupyter, or any extra Python packages.

Keep your work in a folder you can find again, for example `Documents/LIFE733`. In VS Code, always open that folder using **File > Open Folder** rather than opening individual files from different locations.

## Set up and maintain your `LIFE733` folder

**Recommended: work on an MWS PC and keep your `LIFE733` folder on your M: drive.** Create it as `M:\LIFE733`, rather than on the PC's Desktop or Documents folder. Your M: drive is available when you sign in to other university PCs, so you can continue working anywhere that has VS Code and Python installed.

If you are working on your own computer, create the main `LIFE733` folder in Documents (or another location that is backed up). Open this main folder in VS Code. In the **Explorer** panel, use the **New Folder** button to create the folders shown below. Do this at the start of the module, even though many will be empty at first.

Use the exact folder names and keep all work for a teaching week in its matching `week-*` folder. There is no `week-7` folder. Do not store coursework only in Downloads, on the Desktop, or in a collection of unrelated folders.

By the end of the module, your folder should look like this:

```text
LIFE733/
├── week-1/
├── week-2/
├── week-3/
├── week-4/
├── week-5/
├── week-6/
├── week-8/
├── week-9/
├── week-10/
├── week-11/
├── week-12/
└── portfolio/
    ├── task-1/
    │   ├── output/
    │   └── GAI_documentation/
    ├── task-2/
    │   ├── output/
    │   └── GAI_documentation/
    └── task-3/
        ├── output/
        └── GAI_documentation/
```

Put each task's Python files, input data, notes, and other working files inside its own `task-*` folder. Put files produced by your code in that task's `output` folder. Put the required record of your use of generative AI in that task's `GAI_documentation` folder. Keep these folders with their task. Do not combine all outputs or all GAI records in one place.

At the end of each practical, save your work, check that it is in the right folder, and make a backup (for example, to university storage or another approved location). In Week 10 or 11 you will submit the whole `LIFE733` folder as a `.zip` file. **Following this structure throughout the module is essential:** it makes the submission complete, organised, and straightforward to mark.

## University-managed (MWS) PCs

Python and VS Code should already be available. Use your M: drive for all LIFE733 work: in VS Code choose **File > Open Folder** and open `M:\LIFE733`. You only need to configure VS Code once:

1. Open VS Code and select the **Extensions** icon in the left-hand bar.
2. Search for and install **Python** (published by Microsoft).
3. Search for and install **Pylance** (published by Microsoft). Pylance provides the error highlighting and code suggestions used in class.
4. Open your `LIFE733` folder. Press **Ctrl+Shift+P**, choose **Python: Select Interpreter**, and select a Python 3 interpreter.
5. Choose **Terminal > New Terminal**, then run:

   ```powershell
   python --version
   ```

   It should print `Python 3...`. If it does not, try `py --version`. Ask a demonstrator or IT support if neither command works. Do not attempt to install Python on an MWS PC.

## Your own Windows computer

### 1. Check Python first

Open **Windows Terminal** or **PowerShell** from the Start menu and run:

```powershell
python --version
py --version
```

If either command prints `Python 3.9` or a later version, Python is suitable. If it prints Python 2, an earlier Python 3 version, or neither command works, install a current Python 3 release in the next step.

### 2. Install or update Python

1. Download the **Windows installer (64-bit)** from [python.org/downloads](https://www.python.org/downloads/windows/).
2. Run the installer. On the first screen, tick **Add python.exe to PATH**, then choose **Install Now**. If the installer offers to remove the path-length limit at the end, allow it.
3. Close and reopen PowerShell, then run `python --version` again. It must show Python 3.9 or later.

If `python` opens the Microsoft Store instead, use `py --version` and `py` to run your files, or disable the Python App Installer aliases in **Settings > Apps > Advanced app settings > App execution aliases**.

### 3. Install and configure VS Code

1. Download and install VS Code from [code.visualstudio.com](https://code.visualstudio.com/Download).
2. Open VS Code, install the **Python** and **Pylance** extensions by Microsoft, then open your `LIFE733` folder.
3. Press **Ctrl+Shift+P**, run **Python: Select Interpreter**, and choose the Python 3 installation you checked above.

## Your own Mac

### 1. Check Python first

Open **Terminal** (in Applications > Utilities) and run:

```bash
python3 --version
```

If it prints Python 3.9 or later, Python is suitable. If the command is not found, or the version is older, install a current Python 3 release.

### 2. Install or update Python

1. Download the macOS installer from [python.org/downloads](https://www.python.org/downloads/macos/). Choose the **universal2** installer. It works on both Apple Silicon and Intel Macs.
2. Open the downloaded `.pkg` file and complete the installation.
3. Close and reopen Terminal, then run `python3 --version` again. It must show Python 3.9 or later.

### 3. Install and configure VS Code

1. Download VS Code for macOS from [code.visualstudio.com](https://code.visualstudio.com/Download), open the download, and drag VS Code into **Applications**.
2. Open VS Code, install the **Python** and **Pylance** extensions by Microsoft, then open your `LIFE733` folder.
3. Press **Cmd+Shift+P**, run **Python: Select Interpreter**, and choose the Python 3 installation you checked above.

## Chromebook

VS Code needs ChromeOS's Linux development environment. This is available on many personal Chromebooks, but may be disabled by a school or organisation. If you cannot enable it, use an MWS PC or ask the teaching team for an alternative. The browser version of VS Code alone cannot run Python locally.

### 1. Enable Linux and install Python

1. Open ChromeOS **Settings**, search for **Linux development environment**, and choose **Turn on**. Complete the setup with the default options.
2. Open the **Terminal** app and run:

   ```bash
   sudo apt update
   sudo apt install python3 python3-pip
   python3 --version
   ```

   The final command must print Python 3.9 or later. If your Chromebook's Linux environment supplies an older version, use an MWS PC or ask the teaching team before trying a manual upgrade.

### 2. Install and configure VS Code

1. In Chrome, download the **.deb** version of VS Code for Debian/Ubuntu from [code.visualstudio.com](https://code.visualstudio.com/Download). Choose the build that matches your Chromebook's Linux architecture. This is normally 64-bit x86, but some newer models use ARM64.
2. Open the downloaded `.deb` file and choose **Install**. Then open VS Code from the Launcher.
3. Install the **Python** and **Pylance** extensions by Microsoft. Open your `LIFE733` folder, press **Ctrl+Shift+P**, run **Python: Select Interpreter**, and choose `/usr/bin/python3`.

## Final check on any computer

In VS Code, create a file called `check_setup.py` in your `LIFE733` folder containing:

```python
print("Python is ready for LIFE733")
```

Save it, then select **Run Python File in Terminal** (the play button at the top right of the editor). The terminal should print:

```
Python is ready for LIFE733
```

If it does not, first repeat **Python: Select Interpreter** and choose the Python 3 installation that worked in your terminal. Bring the exact error message to a practical or office hour if you still cannot run the check.

These chapters use only Python's standard library. Some optional examples use files that you create yourself. The chapter examples need no private course account. For the Portfolio Projects, first test with the shared practice files, then generate individual datasets in the book using your nine-digit student ID and run your solutions on those files.
