# Nori webinterface
The purpose of this web app is to be a web interface for the nori renderer. The whole process is very interactive and self-explanatory and can be done with every state-of-the-art web browser.
# Get Started
The rest of this page explains how you can set up your local machine for development.
If you just want to run the server or the scripts then you can just go straight to the first step:
0. Bootstrapping

# Working with the code
The code base relies on the use of the [Git][git] versioning system for source code management.
You don't need to know anything about Git to follow the tutorial other than how to install and run
a few git commands.


### Install Git

You can download and install Git from http://git-scm.com/download. Once installed you should have
access to the `git` command line tool.  The main commands that you will need to use are:

- `git clone ...` : clone a remote repository onto your local machine
- `git checkout ...` : check out a particular branch or a tagged version of the code to hack on

### Download the repro

Clone the [repository][web-app] located at Bitbucket by running the following
command:

```
git clone https://Alexus@bitbucket.org/Alexus/noriwebinterface.git
```

This command creates after you entered your username and password the `noriwebinterface` directory in your current directory.

Change your current directory to `NoriV2Webinterface`.

```
cd NoriV2Webinterface
```

All instructions, from now on, assume you are running all commands from the
`noriwebinterface` directory.


### Install Node.js

You can download a Node.js installer for your operating system from http://nodejs.org/download/.

Check the version of Node.js that you have installed by running the following command:

```
node --version
```

In Debian based distributions, there is a name clash with another utility called `node`. The
suggested solution is to also install the `nodejs-legacy` apt package, which renames `node` to
`nodejs`.

```
apt-get install nodejs-legacy npm
nodejs --version
npm --version
```

Once you have Node.js installed on your machine you can download the tool dependencies by running:

```
npm install
```

This command reads webInterfaceNori `package.json` file and downloads the following tools
into the `node_modules` directory:

- [Bower][bower] - client-side code package manager

Running `npm install` will also automatically use bower to download the Angular framework and the required extensions into the
 `app/bower_components` directory. 

## 0. Bootstrapping
If you haven't already done so you need to install the dependencies by running:
```
npm install
```
To run the server you need install the server requirements. Since the server is written in python 
we use the Python Package Index (PIP) to install them.


### Install Pip
pip works with CPython versions 2.6, 2.7, 3.2, 3.3, 3.4 and also pypy.

pip works on Unix/Linux, OS X, and Windows.
To install pip, securely download [get-pip.py][pip]
Then run the following (which may require administrator access):

```python
python get-pip.py
```

Now you can use pip to install python packages. The main commands that you will need to 
use are:
- `pip install ...` : install a python package
- `pip freeze` : show a list of all installed packages with their version numbers

To install all required packages you need to run the following command

```
pip install -r requirements.txt
```
If you want to extent the framework please make sure that all included python packages are in the `requirements.txt`.


### Compile nori
#### Linux / Mac OS X
Begin by installing the [CMake][cmake] build system on your system. On Mac OS X, you will also need to install a reasonably up-to-date version of XCode along with the command line tools. On Linux, any reasonably recent version of GCC or Clang will work. Navigate to the Nori folder, create a build directory and start cmake-gui, like so:
```
cd NoriV2
mkdir build
cd build
cmake-gui ..
```
After the Makefiles are generated, simply run make to compile all dependencies and Nori itself.
```
make -j 4
```
This can take quite a while; the above command compiles with four processors at the same time. Note that you will probably see many warning messages while the dependencies are compiled—you can ignore them.

#### Windows
Begin by installing Visual Studio 2013 (older versions won't do) and a reasonably recent (≥ 3.x) version of [CMake][cmake]. Start CMake and navigate to the location where you cloned the Nori repository.
After setting up the project, click the Configure and Generate button. This will create a file called ***nori.sln*** —double-click it to open Visual Studio.

The Build->Build Solution menu item will automatically compile all dependency libraries and Nori itself; the resulting executable is written to the Release or Debug subfolder of your chosen build directory. Note that you will probably see many warning messages while the dependencies are compiled—you can ignore them.
## 1. Run the Application
Start the server locally by running.
```
python server.py --logging=error
```
If you want to see more detailed information just remove the logging option.
Now open the following link [http://localhost:7001][webapp] in your favorite 
web browser, preferable google chrome.



# Contact

For more information on the nori web interface please contact me.


[web-app]: https://github.com/mworchel/NoriV2Webinterface
[git]: http://git-scm.com/
[node]: http://nodejs.org/
[cmake]: http://www.cmake.org/download/
[protractor]: https://github.com/angular/protractor
[bower]: http://bower.io/
[http-server]: https://github.com/nodeapps/http-server
[karma]: https://github.com/karma-runner/karma
[pip]: https://bootstrap.pypa.io/get-pip.py
[webapp]: http://localhost:7001

[linuxCmake]: app/images/linux-cmake.png?raw=true "Set the build type to Unix Makefiles and then press the Configure and Generate buttons." 