# Nori Webinterface

[![Join the chat at https://gitter.im/alexus37/NoriV2Webinterface](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/alexus37/NoriV2Webinterface?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The purpose of this web app is to be a web interface for the nori renderer. The whole process is very interactive and self-explanatory and can be done with every state-of-the-art web browser.

# Requirements

- pip (which python version?)
- npm(/node)
- imagemagick (with exr support)
- cmake

# Bootstrapping

Run `npm install` and `pip install -r requirements.txt` to install the requirements for the webapp

## Compile Nori

### Linux / Mac OS X

```
cd nori
mkdir build
cd build
cmake-gui ..
```
(You can use `cmake` instead of `cmake-gui`)

After the Makefiles are generated, simply run make to compile all dependencies and Nori itself.

```
make -j 4
```

This can take quite a while; the above command compiles with four processors at the same time. Note that you will probably see many warning messages while the dependencies are compiled you can ignore them.

### Windows

Begin by installing Visual Studio 2013 (older versions won't do) and a reasonably recent (≥ 3.x) version of [CMake][cmake]. Start CMake and navigate to the location where you cloned the Nori repository.
After setting up the project, click the Configure and Generate button. This will create a file called ***nori.sln*** —double-click it to open Visual Studio.

The Build->Build Solution menu item will automatically compile all dependency libraries and Nori itself; the resulting executable is written to the Release or Debug subfolder of your chosen build directory. Note that you will probably see many warning messages while the dependencies are compiled—you can ignore them.

# Run

Start the server locally by running.

```
python server.py --logging=error
```

If you want to see more detailed information just remove the logging option.
Now open the following link [http://127.0.0.1:7001][webapp] in your favorite
web browser, preferable google chrome or chromium.

The default Username/Password is: testUser/alex123

# Data

Note that there is no data included for the default scene.

# Structure

- "server" contains the django server handling user and scene API as well as the connection to the renderer
- "app" contains the angularjs client frontend
- "NoriV2" contains the renderer

# Contact

For more information on the nori web interface please contact me.


[web-app]: https://bitbucket.org/Alexus/noriwebinterface
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
